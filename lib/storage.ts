import type { HuntState } from "./types";

const STORAGE_KEY = "scavenger-hunt-v1";

export function loadHuntState(): HuntState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HuntState;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.order)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveHuntState(state: HuntState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / serialization errors (e.g. photos too large).
  }
}

export function clearHuntState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
