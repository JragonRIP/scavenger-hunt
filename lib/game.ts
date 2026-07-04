import type { FlashFindState, HuntState, ItemProgress, Tier } from "./types";
import { ITEMS, ITEMS_BY_ID, shuffle } from "./items";

/** Score at or above this is a "green" (great) find. */
export const GREEN_THRESHOLD = 8;

/** Extra points awarded for finding a bonus (special) item. */
export const BONUS_POINTS = 5;

/** Secret password the hunt master types to manually approve a rejected photo. */
export const OVERRIDE_PASSWORD = "HUNT";

/** Score given to an item that a human manually approves after the AI rejected it. */
export const MANUAL_OVERRIDE_SCORE = GREEN_THRESHOLD;

/** True if the typed password matches the override secret (case-insensitive, trimmed). */
export function isOverridePassword(input: string): boolean {
  return input.trim().toUpperCase() === OVERRIDE_PASSWORD;
}

/** Random items for recurring lightning flash finds. */
export const FLASH_FIND_POOL = [
  "A single sock",
  "A spoon",
  "A piece of fruit",
  "Something soft",
  "A pen",
  "Something round",
  "A toothbrush",
  "Something shiny",
  "A box of cereal",
  "A pillow",
  "Something blue",
  "A toy with wheels",
  "A book with a red cover",
  "A shoe with laces",
  "A coin",
  "A remote control",
  "A piece of paper",
  "A stuffed animal",
  "A hairbrush or comb",
  "Something that makes noise",
] as const;

/** Points awarded for a successful flash find. */
export const FLASH_FIND_POINTS = 20;

/** How long players have to complete a flash find. */
export const FLASH_FIND_DURATION_MS = 60_000;

/** How often a new flash find is offered during a hunt. */
export const FLASH_ROUND_INTERVAL_MS = 150_000; // 2.5 minutes

export function scheduleNextFlash(now = Date.now()): number {
  return now + FLASH_ROUND_INTERVAL_MS;
}

export function defaultFlashFind(now = Date.now()): FlashFindState {
  return {
    status: "idle",
    item: null,
    expiresAt: null,
    nextOfferAt: now,
    wins: [],
  };
}

export function pickRandomFlashItem(exclude?: string): string {
  const pool = exclude
    ? FLASH_FIND_POOL.filter((item) => item !== exclude)
    : FLASH_FIND_POOL;
  const choices = pool.length > 0 ? pool : FLASH_FIND_POOL;
  return choices[Math.floor(Math.random() * choices.length)];
}

/** Build the next offered flash-find round (item stays secret until the player starts). */
export function offerFlashFind(ff: FlashFindState, now = Date.now()): FlashFindState {
  return {
    ...ff,
    status: "available",
    item: null,
    expiresAt: null,
    nextOfferAt: now,
  };
}

/** Migrates older saved flash-find shapes into the current format. */
function migrateFlashFind(
  ff: Partial<FlashFindState> & { photo?: string | null; status?: string },
): FlashFindState {
  const now = Date.now();
  if (!ff || typeof ff !== "object") return defaultFlashFind(now);

  const wins = (ff.wins ?? []).filter((w) => w.item !== "A butterfly");
  const legacyStatus = ff.status as string | undefined;

  // Old one-time butterfly / won / expired shapes — reset the recurring schedule.
  if (
    legacyStatus === "won" ||
    legacyStatus === "expired" ||
    (legacyStatus === "available" && !ff.item)
  ) {
    return {
      status: "idle",
      item: null,
      expiresAt: null,
      nextOfferAt: now,
      wins,
    };
  }

  const status =
    legacyStatus === "available" || legacyStatus === "active" || legacyStatus === "idle"
      ? legacyStatus
      : "idle";

  return {
    status,
    item: ff.item ?? null,
    expiresAt: ff.expiresAt ?? null,
    nextOfferAt: typeof ff.nextOfferAt === "number" ? ff.nextOfferAt : now,
    wins,
  };
}

/** Ensures flash-find state exists and expires stale active challenges. */
export function normalizeFlashFind(ff?: FlashFindState): FlashFindState {
  const base = migrateFlashFind(ff ?? defaultFlashFind());
  if (base.status === "active" && base.expiresAt !== null && base.expiresAt <= Date.now()) {
    return {
      ...base,
      status: "idle",
      item: null,
      expiresAt: null,
      nextOfferAt: scheduleNextFlash(),
    };
  }
  return base;
}

export function showFlashLightning(state: HuntState): boolean {
  return normalizeFlashFind(state.flashFind).status === "available";
}

export function isFlashFindActive(state: HuntState, now = Date.now()): boolean {
  const ff = normalizeFlashFind(state.flashFind);
  return ff.status === "active" && ff.expiresAt !== null && ff.expiresAt > now;
}

export function shouldOfferFlashFind(state: HuntState, now: number): boolean {
  const ff = normalizeFlashFind(state.flashFind);
  return ff.status === "idle" && now >= ff.nextOfferAt;
}

export function flashFindRemainingMs(state: HuntState, now: number): number {
  const ff = normalizeFlashFind(state.flashFind);
  if (ff.status !== "active" || ff.expiresAt === null) return 0;
  return Math.max(0, ff.expiresAt - now);
}

export function currentFlashItem(state: HuntState): string | null {
  return normalizeFlashFind(state.flashFind).item;
}

/**
 * Maps the AI's match flag and 0-10 score to a color tier.
 * - red: not the item -> does not count, try again
 * - yellow: a match scoring 1-7 -> counts as a find
 * - green: a match scoring 8-10 -> counts as a find
 */
export function toTier(match: boolean, score: number): Tier {
  if (!match || score < 1) return "red";
  return score >= GREEN_THRESHOLD ? "green" : "yellow";
}

export const TIER_STYLES: Record<
  Tier,
  { label: string; emoji: string; badge: string; ring: string; text: string; bg: string }
> = {
  green: {
    label: "Great find!",
    emoji: "🌟",
    badge: "bg-emerald-500",
    ring: "ring-emerald-400",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  yellow: {
    label: "Nice, it counts!",
    emoji: "⭐",
    badge: "bg-amber-400",
    ring: "ring-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  red: {
    label: "Not quite - try again!",
    emoji: "🔎",
    badge: "bg-rose-500",
    ring: "ring-rose-400",
    text: "text-rose-700",
    bg: "bg-rose-50",
  },
};

export function emptyProgress(): ItemProgress {
  return { status: "todo", score: 0, tier: null, photo: null };
}

export function createHuntState(): HuntState {
  const order = shuffle(ITEMS).map((it) => it.id);
  const progress: Record<string, ItemProgress> = {};
  for (const id of order) progress[id] = emptyProgress();
  return {
    version: 1,
    phase: "playing",
    order,
    currentIndex: 0,
    startedAt: Date.now(),
    finishedAt: null,
    progress,
    flashFind: defaultFlashFind(),
  };
}

export function foundCount(state: HuntState): number {
  return Object.values(state.progress).filter((p) => p.status === "found").length;
}

/** Sum of best score per found item plus bonus points for special finds. */
export function totalScore(state: HuntState): number {
  let total = 0;
  for (const [id, p] of Object.entries(state.progress)) {
    if (p.status !== "found") continue;
    total += p.score;
    if (ITEMS_BY_ID[id]?.bonus) total += BONUS_POINTS;
  }
  for (const win of normalizeFlashFind(state.flashFind).wins) {
    total += win.points;
  }
  return total;
}

/** Max achievable score (every item green + every bonus). */
export function maxScore(): number {
  return ITEMS.reduce((sum, it) => sum + 10 + (it.bonus ? BONUS_POINTS : 0), 0);
}

export function progressPercent(state: HuntState): number {
  const total = state.order.length || 1;
  return Math.round((foundCount(state) / total) * 100);
}

/** Formats milliseconds as mm:ss (or h:mm:ss for long hunts). */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

/** Index of the next item that still needs finding, starting after `from`. */
export function nextUnfoundIndex(state: HuntState, from: number): number {
  const n = state.order.length;
  for (let step = 1; step <= n; step++) {
    const idx = (from + step) % n;
    if (state.progress[state.order[idx]]?.status !== "found") return idx;
  }
  return from;
}
