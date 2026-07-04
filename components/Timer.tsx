"use client";

import { formatDuration } from "@/lib/game";
import { useNow } from "@/lib/clock";

interface TimerProps {
  startedAt: number;
  finishedAt: number | null;
  className?: string;
}

export default function Timer({ startedAt, finishedAt, className }: TimerProps) {
  const now = useNow();
  const end = finishedAt ?? (now || startedAt);
  const elapsed = end - startedAt;

  return (
    <span className={className} suppressHydrationWarning>
      ⏱️ {formatDuration(elapsed)}
    </span>
  );
}
