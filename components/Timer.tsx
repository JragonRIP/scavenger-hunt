"use client";

import { useSyncExternalStore } from "react";
import { formatDuration } from "@/lib/game";

// A single shared 1-second clock backed by useSyncExternalStore. This avoids
// calling setState inside an effect body or reading Date.now() during render.
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

interface TimerProps {
  startedAt: number;
  finishedAt: number | null;
  className?: string;
}

export default function Timer({ startedAt, finishedAt, className }: TimerProps) {
  const now = useSyncExternalStore(clockSubscribe, clockSnapshot, clockServerSnapshot);
  const end = finishedAt ?? (now || startedAt);
  const elapsed = end - startedAt;

  return (
    <span className={className} suppressHydrationWarning>
      ⏱️ {formatDuration(elapsed)}
    </span>
  );
}
