import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { CheckResponse } from "@/lib/types";
import { toTier } from "@/lib/game";

// The Gemini SDK needs Node APIs, so force the Node.js runtime.
export const runtime = "nodejs";

// Gemini can take a few seconds to analyze an image.
export const maxDuration = 30;

// Kept in one place so it's a one-line swap if this model is ever retired.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";

interface CheckRequestBody {
  /** Data URL ("data:image/jpeg;base64,....") or raw base64 string. */
  image?: string;
  /** The target item description the photo should match. */
  item?: string;
}

/** Splits a data URL into its mime type and base64 payload. */
function parseImage(image: string): { data: string; mimeType: string } {
  const match = /^data:(.+?);base64,([\s\S]*)$/.exec(image);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  // Assume a raw base64 JPEG if no data-URL header is present.
  return { mimeType: "image/jpeg", data: image };
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Server is missing GEMINI_API_KEY. Add it to .env.local." },
      { status: 500 },
    );
  }

  let body: CheckRequestBody;
  try {
    body = (await request.json()) as CheckRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { image, item } = body;
  if (!image || !item) {
    return Response.json(
      { error: "Both 'image' and 'item' are required." },
      { status: 400 },
    );
  }

  const { data, mimeType } = parseImage(image);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            match: {
              type: SchemaType.BOOLEAN,
              description: "True only if the target item is clearly in the photo.",
            },
            score: {
              type: SchemaType.INTEGER,
              description:
                "0-10. 0 means the item is not present. 1-10 rates how good/clear the match is.",
            },
            reason: {
              type: SchemaType.STRING,
              description:
                "One short, friendly, kid-appropriate sentence about what you see.",
            },
          },
          required: ["match", "score", "reason"],
        },
      },
    });

    const prompt = [
      "You are a cheerful judge for a kids' scavenger hunt.",
      `The player is trying to find this item: "${item}".`,
      "Look at the photo and decide if it clearly contains that item.",
      "Set match=true only if the item is genuinely present.",
      "Give a score from 0 to 10: 0 if the item is not there at all,",
      "1-7 if it is present but the photo is so-so or the item is partial/unclear,",
      "and 8-10 if it is a clear, great example of the item.",
      "Write one short, encouraging sentence for a young child in 'reason'.",
      "If it is wrong, gently say what you actually see instead.",
    ].join(" ");

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data, mimeType } },
    ]);

    const text = result.response.text();
    const parsed = safeParse(text);

    const match = Boolean(parsed.match);
    let score = Number(parsed.score);
    if (!Number.isFinite(score)) score = match ? 6 : 0;
    score = Math.max(0, Math.min(10, Math.round(score)));

    const reason =
      typeof parsed.reason === "string" && parsed.reason.trim().length > 0
        ? parsed.reason.trim()
        : match
          ? "Nice work, that looks right!"
          : "I couldn't spot that one - give it another try!";

    const payload: CheckResponse = {
      match,
      score,
      tier: toTier(match, score),
      reason,
    };
    return Response.json(payload);
  } catch (err) {
    console.error("Gemini check failed:", err);
    return Response.json(
      { error: "The photo checker had a hiccup. Please try again." },
      { status: 502 },
    );
  }
}

/** Parses model JSON, tolerating stray text around the object. */
function safeParse(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        // fall through
      }
    }
    return {};
  }
}
