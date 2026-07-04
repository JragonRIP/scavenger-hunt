import Image from "next/image";
import type { HuntState } from "@/lib/types";
import {
  CATEGORY_EMOJI,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  ITEMS,
} from "@/lib/items";

interface HuntBoardProps {
  state: HuntState;
  currentIndex: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

const TIER_STAR: Record<string, string> = {
  green: "text-emerald-500",
  yellow: "text-amber-500",
};

export default function HuntBoard({ state, currentIndex, onSelect, disabled }: HuntBoardProps) {
  const indexById = new Map(state.order.map((id, i) => [id, i]));
  const currentId = state.order[currentIndex];

  return (
    <div className="space-y-6">
      {CATEGORY_ORDER.map((category) => {
        const items = ITEMS.filter((it) => it.category === category);
        const foundInCat = items.filter(
          (it) => state.progress[it.id]?.status === "found",
        ).length;

        return (
          <section key={category}>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-white drop-shadow">
              <span>
                {CATEGORY_EMOJI[category]} {CATEGORY_LABELS[category]}
              </span>
              <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs">
                {foundInCat}/{items.length}
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {items.map((it) => {
                const p = state.progress[it.id];
                const index = indexById.get(it.id) ?? 0;
                const found = p?.status === "found";
                const skipped = p?.status === "skipped";
                const isCurrent = it.id === currentId;

                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => onSelect(index)}
                    disabled={disabled}
                    className={`relative flex items-center gap-2 rounded-2xl p-2 text-left shadow transition active:scale-95 ${
                      found ? "bg-emerald-50 ring-2 ring-emerald-300" : "bg-white/90"
                    } ${isCurrent ? "ring-4 ring-sky-400" : ""} ${disabled ? "pointer-events-none opacity-50" : ""}`}
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5">
                      {found && p?.photo ? (
                        <Image
                          src={p.photo}
                          alt={it.item}
                          fill
                          sizes="44px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-lg">
                          {found ? "✅" : skipped ? "⏭️" : "❔"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-gray-700">{it.item}</p>
                      <p className="text-[10px] font-medium text-gray-400">
                        {found ? (
                          <span className={TIER_STAR[p?.tier ?? "yellow"] ?? "text-amber-500"}>
                            ★ {p?.score}/10
                          </span>
                        ) : skipped ? (
                          "Skipped"
                        ) : (
                          "Not yet"
                        )}
                      </p>
                    </div>
                    {it.bonus && (
                      <span className="absolute right-1 top-1 text-[10px]">⭐</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
