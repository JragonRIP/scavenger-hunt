import type { HuntState, ItemProgress, Tier } from "./types";
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
