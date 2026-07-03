import { useSyncExternalStore } from "react";
import type { HuntState } from "./types";
import { clearHuntState, loadHuntState, saveHuntState } from "./storage";

// Module-level store so React's useSyncExternalStore can read/persist the hunt
// without setState-in-effect hydration hacks. getServerSnapshot returns null so
// SSR is stable; the client loads from localStorage on first read.
let current: HuntState | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (!loaded) {
    current = loadHuntState();
    loaded = true;
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): HuntState | null {
  ensureLoaded();
  return current;
}

function getServerSnapshot(): HuntState | null {
  return null;
}

export function setHuntState(next: HuntState | null): void {
  current = next;
  loaded = true;
  if (next) saveHuntState(next);
  else clearHuntState();
  emit();
}

export function updateHuntState(
  updater: (prev: HuntState | null) => HuntState | null,
): void {
  ensureLoaded();
  setHuntState(updater(current));
}

export function useHuntState(): HuntState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
