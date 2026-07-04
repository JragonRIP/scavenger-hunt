"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CheckResponse } from "@/lib/types";
import { ITEMS_BY_ID } from "@/lib/items";
import {
  createHuntState,
  currentFlashItem,
  FLASH_FIND_DURATION_MS,
  FLASH_FIND_POINTS,
  foundCount,
  flashFindRemainingMs,
  isFlashFindActive,
  MANUAL_OVERRIDE_SCORE,
  nextUnfoundIndex,
  normalizeFlashFind,
  offerFlashFind,
  pickRandomFlashItem,
  scheduleNextFlash,
  shouldOfferFlashFind,
  showFlashLightning,
  toTier,
} from "@/lib/game";
import { useNow } from "@/lib/clock";
import { setHuntState, getHuntState, updateHuntState, useHuntState } from "@/lib/store";
import { downscaleDataUrl } from "@/lib/image";
import { celebrate } from "@/lib/confetti";
import StartScreen from "@/components/StartScreen";
import FinishScreen from "@/components/FinishScreen";
import ItemCard from "@/components/ItemCard";
import FlashFindCard from "@/components/FlashFindCard";
import FlashFindModal from "@/components/FlashFindModal";
import FlashLightningEntrance from "@/components/FlashLightningEntrance";
import FlashFindToast from "@/components/FlashFindToast";
import FlashTimeUpModal from "@/components/FlashTimeUpModal";
import HuntBoard from "@/components/HuntBoard";
import ProgressBar from "@/components/ProgressBar";
import ResultToast from "@/components/ResultToast";
import Timer from "@/components/Timer";

type ScanResult = CheckResponse & { itemId: string; photo: string };
type FlashScanResult = CheckResponse & { photo: string; item: string };

export default function Home() {
  const state = useHuntState();
  const now = useNow();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [flashResult, setFlashResult] = useState<FlashScanResult | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | "finish" | "new">(null);
  const [showFlashIntro, setShowFlashIntro] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [animatedOfferToken, setAnimatedOfferToken] = useState<number | null>(null);
  const flashLightningRef = useRef<HTMLButtonElement>(null);

  const flashActive = state ? isFlashFindActive(state, now) : false;
  const flashRemaining = state ? flashFindRemainingMs(state, now) : 0;
  const flashExpiresAt = state?.flashFind?.expiresAt ?? null;
  const flashItem = state ? currentFlashItem(state) : null;
  const flashAvailable = state ? showFlashLightning(state) : false;
  const flashOfferToken = flashAvailable ? (state?.flashFind?.nextOfferAt ?? 0) : null;
  const playFlashEntrance =
    flashOfferToken !== null && animatedOfferToken !== flashOfferToken;
  const showHeaderLightning =
    flashOfferToken !== null && animatedOfferToken === flashOfferToken;

  const handleFlashEntranceComplete = useCallback(() => {
    if (flashOfferToken !== null) setAnimatedOfferToken(flashOfferToken);
  }, [flashOfferToken]);

  // Offer a new flash find every 2.5 minutes (re-check each second via `now`).
  useEffect(() => {
    if (!state || state.phase !== "playing") return;
    if (!shouldOfferFlashFind(state, now)) return;

    updateHuntState((prev) => {
      if (!prev) return prev;
      const ff = normalizeFlashFind(prev.flashFind);
      if (ff.status !== "idle" || now < ff.nextOfferAt) return prev;
      return {
        ...prev,
        flashFind: offerFlashFind(ff, now),
      };
    });
  }, [state, now]);

  // Expire the flash find when the countdown hits zero (no points awarded).
  useEffect(() => {
    if (!flashActive || flashExpiresAt === null) return;

    const expire = () => {
      if (Date.now() < flashExpiresAt) return;
      updateHuntState((prev) => {
        if (!prev) return prev;
        const ff = normalizeFlashFind(prev.flashFind);
        if (ff.status !== "active") return prev;
        return {
          ...prev,
          flashFind: {
            ...ff,
            status: "idle",
            item: null,
            expiresAt: null,
            nextOfferAt: scheduleNextFlash(),
          },
        };
      });
      setShowTimeUp(true);
      setFlashResult(null);
    };

    expire();
    const id = setInterval(expire, 500);
    return () => clearInterval(id);
  }, [flashActive, flashExpiresAt]);

  function startHunt() {
    setHuntState(createHuntState());
  }

  function newHunt() {
    setHuntState(null);
    setResult(null);
    setFlashResult(null);
    setBanner(null);
    setConfirm(null);
    setShowFlashIntro(false);
    setShowTimeUp(false);
  }

  function selectItem(index: number) {
    if (flashActive) return;
    updateHuntState((prev) => (prev ? { ...prev, currentIndex: index } : prev));
  }

  function skipCurrent() {
    if (flashActive) return;
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

  function startFlashFind() {
    setShowFlashIntro(false);
    updateHuntState((prev) => {
      if (!prev) return prev;
      const ff = normalizeFlashFind(prev.flashFind);
      if (ff.status !== "available") return prev;
      const lastItem = ff.wins.at(-1)?.item;
      const startedAt = Date.now();
      return {
        ...prev,
        flashFind: {
          ...ff,
          status: "active",
          item: pickRandomFlashItem(lastItem),
          expiresAt: startedAt + FLASH_FIND_DURATION_MS,
        },
      };
    });
  }

  function declineFlashFind() {
    setShowFlashIntro(false);
    updateHuntState((prev) => {
      if (!prev) return prev;
      const ff = normalizeFlashFind(prev.flashFind);
      return {
        ...prev,
        flashFind: {
          ...ff,
          status: "idle",
          item: null,
          expiresAt: null,
          nextOfferAt: scheduleNextFlash(),
        },
      };
    });
  }

  async function handleFlashImage(dataUrl: string) {
    if (!state || !flashActive || !flashItem) return;

    setScanning(true);
    setBanner(null);
    try {
      const sendImage = await downscaleDataUrl(dataUrl, 1024, 0.8);
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: sendImage, item: flashItem }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBanner(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      const check = data as CheckResponse;
      const thumb = await downscaleDataUrl(dataUrl, 220, 0.7);

      // Re-check the timer after the API round-trip — no points if time ran out.
      const latest = getHuntState();
      if (!latest || !isFlashFindActive(latest, Date.now())) {
        setBanner("Too slow — time's up! No points for this one.");
        return;
      }

      if (check.match) {
        updateHuntState((prev) => {
          if (!prev) return prev;
          const ff = normalizeFlashFind(prev.flashFind);
          if (!isFlashFindActive(prev, Date.now()) || !ff.item) return prev;
          const wonItem = ff.item;
          return {
            ...prev,
            flashFind: {
              ...ff,
              status: "idle",
              item: null,
              expiresAt: null,
              nextOfferAt: scheduleNextFlash(),
              wins: [
                ...ff.wins,
                { item: wonItem, photo: thumb, points: FLASH_FIND_POINTS },
              ],
            },
          };
        });
        celebrate(true);
        setFlashResult({ ...check, photo: thumb, item: flashItem });
      } else {
        setFlashResult({ ...check, photo: thumb, item: flashItem });
      }
    } catch {
      setBanner("Could not reach the checker. Check your connection and try again.");
    } finally {
      setScanning(false);
    }
  }

  async function handleImage(dataUrl: string) {
    if (!state || flashActive) return;
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
      const thumb = await downscaleDataUrl(dataUrl, 220, 0.7);

      if (check.match) {
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

      setResult({ ...check, itemId: id, photo: thumb });
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

  // Hunt-master override: after the AI rejects a photo, an adult can enter the
  // secret password, view the photo, and manually count it as a find.
  function handleOverride() {
    if (!result) return;
    const id = result.itemId;
    const score = MANUAL_OVERRIDE_SCORE;
    updateHuntState((prev) => {
      if (!prev) return prev;
      const prevP = prev.progress[id];
      const bestScore = Math.max(prevP?.score ?? 0, score);
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [id]: {
            status: "found",
            score: bestScore,
            tier: toTier(true, bestScore),
            photo: result.photo,
            reason: "Approved by the hunt master! ✅",
          },
        },
      };
    });
    celebrate(true);
    handleNext();
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
              {flashAvailable && (
                <button
                  ref={flashLightningRef}
                  type="button"
                  onClick={() => setShowFlashIntro(true)}
                  className={`rounded-full bg-amber-400 px-3 py-1 text-sm font-extrabold text-amber-950 shadow ring-2 ring-white/50 transition active:scale-95 ${
                    showHeaderLightning ? "" : "pointer-events-none opacity-0"
                  }`}
                  aria-label="Flash find"
                  tabIndex={showHeaderLightning ? 0 : -1}
                >
                  ⚡
                </button>
              )}
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

      {playFlashEntrance && flashOfferToken !== null && (
        <FlashLightningEntrance
          key={flashOfferToken}
          targetRef={flashLightningRef}
          onComplete={handleFlashEntranceComplete}
        />
      )}

      <div className="mx-auto max-w-lg space-y-6 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {flashActive && flashItem ? (
          <FlashFindCard
            item={flashItem}
            remainingMs={flashRemaining}
            scanning={scanning}
            onImage={handleFlashImage}
          />
        ) : (
          currentItem &&
          currentProgress && (
            <ItemCard
              item={currentItem}
              index={state.currentIndex}
              total={state.order.length}
              progress={currentProgress}
              scanning={scanning}
              onImage={handleImage}
              onSkip={skipCurrent}
            />
          )
        )}

        {banner && (
          <div className="rounded-2xl bg-rose-50 p-4 text-center text-sm font-bold text-rose-700 ring-2 ring-rose-200">
            {banner}
          </div>
        )}

        <HuntBoard
          state={state}
          currentIndex={state.currentIndex}
          onSelect={selectItem}
          disabled={flashActive}
        />
      </div>

      {showFlashIntro && flashAvailable && showHeaderLightning && (
        <FlashFindModal onAccept={startFlashFind} onCancel={declineFlashFind} />
      )}

      {flashResult && (
        <FlashFindToast
          kind={flashResult.match ? "win" : "miss"}
          itemLabel={flashResult.item}
          photo={flashResult.photo}
          reason={flashResult.reason}
          onDismiss={() => setFlashResult(null)}
        />
      )}

      {showTimeUp && <FlashTimeUpModal onDismiss={() => setShowTimeUp(false)} />}

      {result && resultItem && !flashActive && (
        <ResultToast
          result={result}
          itemLabel={resultItem.item}
          isBonus={Boolean(resultItem.bonus)}
          photo={result.photo}
          onNext={handleNext}
          onRetry={() => setResult(null)}
          onOverride={handleOverride}
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
