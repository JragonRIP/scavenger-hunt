"use client";

import { useState } from "react";
import type { CheckResponse } from "@/lib/types";
import { ITEMS_BY_ID } from "@/lib/items";
import {
  createHuntState,
  foundCount,
  nextUnfoundIndex,
  toTier,
} from "@/lib/game";
import { setHuntState, updateHuntState, useHuntState } from "@/lib/store";
import { downscaleDataUrl } from "@/lib/image";
import { celebrate } from "@/lib/confetti";
import StartScreen from "@/components/StartScreen";
import FinishScreen from "@/components/FinishScreen";
import ItemCard from "@/components/ItemCard";
import HuntBoard from "@/components/HuntBoard";
import ProgressBar from "@/components/ProgressBar";
import ResultToast from "@/components/ResultToast";
import Timer from "@/components/Timer";

type ScanResult = CheckResponse & { itemId: string };

export default function Home() {
  const state = useHuntState();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | "finish" | "new">(null);

  function startHunt() {
    setHuntState(createHuntState());
  }

  function newHunt() {
    setHuntState(null);
    setResult(null);
    setBanner(null);
    setConfirm(null);
  }

  function selectItem(index: number) {
    updateHuntState((prev) => (prev ? { ...prev, currentIndex: index } : prev));
  }

  function skipCurrent() {
    updateHuntState((prev) => {
      if (!prev) return prev;
      const id = prev.order[prev.currentIndex];
      const cur = prev.progress[id];
      const progress = { ...prev.progress };
      if (cur.status !== "found") {
        progress[id] = { ...cur, status: "skipped" };
      }
      return {
        ...prev,
        progress,
        currentIndex: nextUnfoundIndex(prev, prev.currentIndex),
      };
    });
  }

  async function handleImage(dataUrl: string) {
    if (!state) return;
    const id = state.order[state.currentIndex];
    const item = ITEMS_BY_ID[id];
    if (!item) return;

    setScanning(true);
    setBanner(null);
    try {
      const sendImage = await downscaleDataUrl(dataUrl, 1024, 0.8);
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: sendImage, item: item.item }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBanner(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      const check = data as CheckResponse;

      if (check.match) {
        const thumb = await downscaleDataUrl(dataUrl, 220, 0.7);
        updateHuntState((prev) => {
          if (!prev) return prev;
          const prevP = prev.progress[id];
          const bestScore = Math.max(prevP?.score ?? 0, check.score);
          return {
            ...prev,
            progress: {
              ...prev.progress,
              [id]: {
                status: "found",
                score: bestScore,
                tier: toTier(true, bestScore),
                photo: thumb,
                reason: check.reason,
              },
            },
          };
        });
        celebrate(check.tier === "green" || Boolean(item.bonus));
      }

      setResult({ ...check, itemId: id });
    } catch {
      setBanner("Could not reach the checker. Check your connection and try again.");
    } finally {
      setScanning(false);
    }
  }

  function handleNext() {
    setResult(null);
    updateHuntState((prev) => {
      if (!prev) return prev;
      if (foundCount(prev) >= prev.order.length) {
        return { ...prev, phase: "finished", finishedAt: Date.now() };
      }
      return { ...prev, currentIndex: nextUnfoundIndex(prev, prev.currentIndex) };
    });
  }

  function finishHunt() {
    setConfirm(null);
    setResult(null);
    updateHuntState((prev) =>
      prev ? { ...prev, phase: "finished", finishedAt: Date.now() } : prev,
    );
  }

  if (!state) {
    return (
      <main>
        <StartScreen onStart={startHunt} />
      </main>
    );
  }

  if (state.phase === "finished") {
    return (
      <main>
        <FinishScreen state={state} onNewHunt={newHunt} />
      </main>
    );
  }

  const currentId = state.order[state.currentIndex];
  const currentItem = ITEMS_BY_ID[currentId];
  const currentProgress = state.progress[currentId];
  const resultItem = result ? ITEMS_BY_ID[result.itemId] : null;

  return (
    <main className="min-h-[100dvh]">
      <header className="sticky top-0 z-30 bg-black/10 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md">
        <div className="mx-auto max-w-lg">
          <ProgressBar found={foundCount(state)} total={state.order.length} />
          <div className="mt-2 flex items-center justify-between">
            <Timer
              startedAt={state.startedAt ?? 0}
              finishedAt={null}
              className="rounded-full bg-white/25 px-3 py-1 text-sm font-extrabold text-white"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirm("new")}
                className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold text-white transition active:scale-95"
              >
                🔄 New
              </button>
              <button
                type="button"
                onClick={() => setConfirm("finish")}
                className="rounded-full bg-white/90 px-3 py-1 text-sm font-extrabold text-orange-600 shadow transition active:scale-95"
              >
                🏁 Finish
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-6 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {currentItem && currentProgress && (
          <ItemCard
            item={currentItem}
            index={state.currentIndex}
            total={state.order.length}
            progress={currentProgress}
            scanning={scanning}
            onImage={handleImage}
            onSkip={skipCurrent}
          />
        )}

        {banner && (
          <div className="rounded-2xl bg-rose-50 p-4 text-center text-sm font-bold text-rose-700 ring-2 ring-rose-200">
            {banner}
          </div>
        )}

        <HuntBoard state={state} currentIndex={state.currentIndex} onSelect={selectItem} />
      </div>

      {result && resultItem && (
        <ResultToast
          result={result}
          itemLabel={resultItem.item}
          isBonus={Boolean(resultItem.bonus)}
          photo={state.progress[result.itemId]?.photo}
          onNext={handleNext}
          onRetry={() => setResult(null)}
        />
      )}

      {confirm && (
        <ConfirmModal
          kind={confirm}
          onCancel={() => setConfirm(null)}
          onConfirm={confirm === "finish" ? finishHunt : newHunt}
        />
      )}
    </main>
  );
}

function ConfirmModal({
  kind,
  onCancel,
  onConfirm,
}: {
  kind: "finish" | "new";
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isFinish = kind === "finish";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
        <div className="text-5xl">{isFinish ? "🏁" : "🔄"}</div>
        <h2 className="mt-2 text-xl font-black text-gray-800">
          {isFinish ? "Finish the hunt?" : "Start a new hunt?"}
        </h2>
        <p className="mt-1 text-sm font-medium text-gray-500">
          {isFinish
            ? "You'll see your final score, and you can't go back to keep hunting."
            : "This clears your current progress and shuffles a fresh hunt."}
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-gray-100 px-4 py-3 font-bold text-gray-600 transition active:scale-95"
          >
            Keep going
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-2xl px-4 py-3 font-extrabold text-white shadow transition active:scale-95 ${
              isFinish
                ? "bg-gradient-to-b from-orange-400 to-orange-600"
                : "bg-gradient-to-b from-violet-400 to-fuchsia-600"
            }`}
          >
            {isFinish ? "Finish!" : "New hunt"}
          </button>
        </div>
      </div>
    </div>
  );
}
