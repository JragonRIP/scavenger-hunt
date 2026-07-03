import Image from "next/image";
import type { CheckResponse } from "@/lib/types";
import { BONUS_POINTS, TIER_STYLES } from "@/lib/game";

interface ResultToastProps {
  result: CheckResponse;
  itemLabel: string;
  isBonus: boolean;
  photo?: string | null;
  onNext: () => void;
  onRetry: () => void;
}

export default function ResultToast({
  result,
  itemLabel,
  isBonus,
  photo,
  onNext,
  onRetry,
}: ResultToastProps) {
  const style = TIER_STYLES[result.tier];
  const found = result.match;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        className={`w-full max-w-md rounded-3xl ${style.bg} p-6 shadow-2xl ring-4 ${style.ring} animate-[pop_0.25s_ease-out]`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="text-6xl">{style.emoji}</div>
          <h2 className={`mt-2 text-2xl font-extrabold ${style.text}`}>{style.label}</h2>

          {found && (
            <div className="mt-3 flex items-center gap-1" aria-label={`Score ${result.score} out of 10`}>
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className={i < result.score ? "text-yellow-400" : "text-black/15"}>
                  ★
                </span>
              ))}
            </div>
          )}
          {found && (
            <p className={`mt-1 text-sm font-bold ${style.text}`}>
              Score: {result.score}/10
              {isBonus && <span className="ml-1">+ {BONUS_POINTS} bonus! 🎁</span>}
            </p>
          )}

          {photo && found && (
            <div className="relative mt-4 h-28 w-28 overflow-hidden rounded-2xl ring-4 ring-white shadow">
              <Image src={photo} alt={itemLabel} fill sizes="112px" className="object-cover" unoptimized />
            </div>
          )}

          <p className="mt-4 text-base font-medium text-gray-700">{result.reason}</p>

          {found ? (
            <button
              type="button"
              onClick={onNext}
              className="mt-5 w-full rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-6 py-4 text-lg font-extrabold text-white shadow-lg ring-2 ring-white/50 transition active:scale-95"
            >
              Next item →
            </button>
          ) : (
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 w-full rounded-2xl bg-gradient-to-b from-rose-400 to-rose-600 px-6 py-4 text-lg font-extrabold text-white shadow-lg ring-2 ring-white/50 transition active:scale-95"
            >
              Try again 🔄
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
