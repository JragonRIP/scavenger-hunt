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

export type FlashFindStatus = "idle" | "available" | "active";

export interface FlashFindWin {
  item: string;
  photo: string | null;
  points: number;
}

export interface FlashFindState {
  status: FlashFindStatus;
  /** Current challenge item (set when available/active). */
  item: string | null;
  /** Unix ms when the 1-minute window ends (only while status === "active"). */
  expiresAt: number | null;
  /** Unix ms when the next lightning flash find is offered. */
  nextOfferAt: number;
  /** Completed flash finds that earned points. */
  wins: FlashFindWin[];
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
  /** Recurring lightning flash finds during the hunt. */
  flashFind?: FlashFindState;
}

export interface CheckResponse {
  match: boolean;
  /** 0-10, where 0 means "not the item at all". */
  score: number;
  tier: Tier;
  reason: string;
}
