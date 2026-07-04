"use client";

import { useSyncExternalStore } from "react";

let clockValue = 0;
const clockListeners = new Set<() => void>();
let clockInterval: ReturnType<typeof setInterval> | null = null;

function clockSubscribe(cb: () => void): () => void {
  clockValue = Date.now();
  clockListeners.add(cb);
  if (!clockInterval) {
    clockInterval = setInterval(() => {
      clockValue = Date.now();
      for (const l of clockListeners) l();
    }, 1000);
  }
  return () => {
    clockListeners.delete(cb);
    if (clockListeners.size === 0 && clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  };
}

function clockSnapshot(): number {
  return clockValue;
}

function clockServerSnapshot(): number {
  return 0;
}

/** Shared 1-second clock for timers (avoids setState-in-effect). */
export function useNow(): number {
  return useSyncExternalStore(clockSubscribe, clockSnapshot, clockServerSnapshot);
}
