"use client";

import Image from "next/image";
import { FLASH_FIND_POINTS } from "@/lib/game";

interface FlashFindToastProps {
  kind: "win" | "miss";
  photo?: string | null;
  reason?: string;
  onDismiss: () => void;
}

export default function FlashFindToast({ kind, photo, reason, onDismiss }: FlashFindToastProps) {
  const win = kind === "win";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        className={`w-full max-w-md animate-[pop_0.25s_ease-out] rounded-3xl p-6 shadow-2xl ring-4 ${
          win ? "bg-emerald-50 ring-emerald-400" : "bg-rose-50 ring-rose-400"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="text-6xl">{win ? "🦋" : "🔎"}</div>
          <h2
            className={`mt-2 text-2xl font-extrabold ${win ? "text-emerald-700" : "text-rose-700"}`}
          >
            {win ? "Flash find!" : "Not quite!"}
          </h2>
          {win && (
            <p className="mt-2 text-lg font-black text-amber-600">+{FLASH_FIND_POINTS} points! ⚡</p>
          )}
          {photo && win && (
            <div className="relative mt-4 h-28 w-28 overflow-hidden rounded-2xl ring-4 ring-white shadow">
              <Image src={photo} alt="Butterfly" fill sizes="112px" className="object-cover" unoptimized />
            </div>
          )}
          <p className="mt-4 text-base font-medium text-gray-700">
            {reason ?? (win ? "Amazing catch!" : "Keep looking — the clock is ticking!")}
          </p>
          <button
            type="button"
            onClick={onDismiss}
            className={`mt-5 w-full rounded-2xl px-6 py-4 text-lg font-extrabold text-white shadow-lg ring-2 ring-white/50 transition active:scale-95 ${
              win
                ? "bg-gradient-to-b from-emerald-400 to-emerald-600"
                : "bg-gradient-to-b from-rose-400 to-rose-600"
            }`}
          >
            {win ? "Back to the hunt →" : "Try again 🔄"}
          </button>
        </div>
      </div>
    </div>
  );
}
