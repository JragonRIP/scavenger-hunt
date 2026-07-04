"use client";

import { useState } from "react";
import Image from "next/image";
import type { CheckResponse } from "@/lib/types";
import { BONUS_POINTS, isOverridePassword, TIER_STYLES } from "@/lib/game";

interface ResultToastProps {
  result: CheckResponse;
  itemLabel: string;
  isBonus: boolean;
  photo?: string | null;
  onNext: () => void;
  onRetry: () => void;
  onOverride: () => void;
}

export default function ResultToast({
  result,
  itemLabel,
  isBonus,
  photo,
  onNext,
  onRetry,
  onOverride,
}: ResultToastProps) {
  const style = TIER_STYLES[result.tier];
  const found = result.match;

  const [showOverride, setShowOverride] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);

  function submitOverride() {
    if (isOverridePassword(password)) {
      onOverride();
    } else {
      setPwError(true);
    }
  }

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
            <div className="mt-5 w-full space-y-3">
              <button
                type="button"
                onClick={onRetry}
                className="w-full rounded-2xl bg-gradient-to-b from-rose-400 to-rose-600 px-6 py-4 text-lg font-extrabold text-white shadow-lg ring-2 ring-white/50 transition active:scale-95"
              >
                Try again 🔄
              </button>

              {!showOverride ? (
                <button
                  type="button"
                  onClick={() => setShowOverride(true)}
                  className="w-full rounded-2xl bg-white/70 px-6 py-3 text-sm font-bold text-gray-600 ring-2 ring-gray-200 transition active:scale-95"
                >
                  Show image 🔍
                </button>
              ) : (
                <div className="rounded-2xl bg-white/80 p-4 ring-2 ring-gray-200">
                  {photo ? (
                    <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-2xl ring-4 ring-white shadow">
                      <Image
                        src={photo}
                        alt={itemLabel}
                        fill
                        sizes="160px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-500">No photo available.</p>
                  )}

                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Hunt master override
                  </p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPwError(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitOverride();
                    }}
                    placeholder="Secret password"
                    autoComplete="off"
                    className="mt-1 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-center text-base font-semibold text-gray-800 outline-none focus:border-emerald-400"
                  />
                  {pwError && (
                    <p className="mt-1 text-xs font-bold text-rose-600">
                      Wrong password — try again.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={submitOverride}
                    className="mt-3 w-full rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-6 py-3 text-base font-extrabold text-white shadow-lg ring-2 ring-white/50 transition active:scale-95"
                  >
                    Count it &amp; give points ✅
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
