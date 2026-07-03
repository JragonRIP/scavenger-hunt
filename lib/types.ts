export type Category = "nature" | "outside" | "windows" | "inside";

export interface HuntItem {
  id: string;
  /** Shown to the player as the clue, and sent to Gemini as the target item. */
  item: string;
  category: Category;
  /** Special items worth extra points when found. */
  bonus?: boolean;
}

export type Tier = "red" | "yellow" | "green";

export type ItemStatus = "todo" | "skipped" | "found";

export interface ItemProgress {
  status: ItemStatus;
  /** Best AI score achieved for this item, 0-10 (0 = not found yet). */
  score: number;
  tier: Tier | null;
  /** Small data-URL thumbnail of the winning photo. */
  photo: string | null;
  reason?: string;
}

export interface HuntState {
  version: number;
  phase: "start" | "playing" | "finished";
  /** Randomized item ids for this hunt. */
  order: string[];
  currentIndex: number;
  startedAt: number | null;
  finishedAt: number | null;
  progress: Record<string, ItemProgress>;
}

export interface CheckResponse {
  match: boolean;
  /** 0-10, where 0 means "not the item at all". */
  score: number;
  tier: Tier;
  reason: string;
}
