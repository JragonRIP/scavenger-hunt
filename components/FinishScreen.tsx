import Image from "next/image";
import type { HuntState } from "@/lib/types";
import { ITEMS_BY_ID } from "@/lib/items";
import {
  BONUS_POINTS,
  foundCount,
  formatDuration,
  totalScore,
} from "@/lib/game";

interface FinishScreenProps {
  state: HuntState;
  onNewHunt: () => void;
}

function rating(found: number, total: number): { emoji: string; title: string } {
  const ratio = total > 0 ? found / total : 0;
  if (ratio >= 1) return { emoji: "🏆", title: "Hunt Champion!" };
  if (ratio >= 0.75) return { emoji: "🥇", title: "Super Explorer!" };
  if (ratio >= 0.5) return { emoji: "🥈", title: "Great Hunter!" };
  if (ratio >= 0.25) return { emoji: "🥉", title: "Nice Finds!" };
  return { emoji: "🌱", title: "Good Start!" };
}

export default function FinishScreen({ state, onNewHunt }: FinishScreenProps) {
  const found = foundCount(state);
  const total = state.order.length;
  const score = totalScore(state);
  const time =
    state.finishedAt && state.startedAt ? state.finishedAt - state.startedAt : 0;
  const { emoji, title } = rating(found, total);

  const foundItems = state.order
    .map((id) => ({ item: ITEMS_BY_ID[id], progress: state.progress[id] }))
    .filter((x) => x.progress?.status === "found");

  return (
    <div className="flex min-h-[100dvh] flex-col items-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <div className="text-7xl">{emoji}</div>
        <h1 className="mt-2 text-4xl font-black text-white drop-shadow-lg">{title}</h1>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Score" value={String(score)} accent="from-amber-300 to-orange-500" />
          <Stat label="Found" value={`${found}/${total}`} accent="from-emerald-300 to-teal-500" />
          <Stat label="Time" value={formatDuration(time)} accent="from-sky-300 to-blue-500" />
        </div>

        {foundItems.length > 0 ? (
          <>
            <h2 className="mt-8 text-left text-lg font-extrabold text-white drop-shadow">
              Your finds 📚
            </h2>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {foundItems.map(({ item, progress }) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white/90 shadow ring-2 ring-white/70"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {progress.photo ? (
                      <Image
                        src={progress.photo}
                        alt={item.item}
                        fill
                        sizes="120px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-2xl">
                        ✅
                      </span>
                    )}
                    {item.bonus && (
                      <span className="absolute right-1 top-1 rounded-full bg-amber-400 px-1.5 text-[10px] font-black text-white">
                        +{BONUS_POINTS}
                      </span>
                    )}
                  </div>
                  <p className="px-1.5 py-1 text-center text-[10px] font-bold text-gray-600">
                    {progress.score}/10 ★
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-8 font-semibold text-white/90 drop-shadow">
            No finds this time - the hunt is always here for another try!
          </p>
        )}

        <button
          type="button"
          onClick={onNewHunt}
          className="mt-8 w-full rounded-full bg-gradient-to-b from-violet-400 to-fuchsia-600 px-8 py-5 text-xl font-black text-white shadow-xl ring-4 ring-white/60 transition active:scale-95"
        >
          Play a New Hunt 🔄
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-b ${accent} p-3 shadow-lg ring-2 ring-white/50`}>
      <div className="text-2xl font-black text-white drop-shadow">{value}</div>
      <div className="text-xs font-bold uppercase tracking-wide text-white/90">{label}</div>
    </div>
  );
}
