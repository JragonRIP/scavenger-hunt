import Image from "next/image";
import type { HuntItem, ItemProgress } from "@/lib/types";
import { CATEGORY_EMOJI, CATEGORY_LABELS } from "@/lib/items";
import { TIER_STYLES } from "@/lib/game";
import ScanButton from "./ScanButton";

interface ItemCardProps {
  item: HuntItem;
  index: number;
  total: number;
  progress: ItemProgress;
  scanning: boolean;
  onImage: (dataUrl: string) => void;
  onSkip: () => void;
}

export default function ItemCard({
  item,
  index,
  total,
  progress,
  scanning,
  onImage,
  onSkip,
}: ItemCardProps) {
  const found = progress.status === "found";

  return (
    <div className="relative w-full rounded-3xl bg-white/95 p-6 shadow-xl ring-4 ring-white/70">
      {scanning && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white/85 backdrop-blur-sm">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />
          <p className="mt-4 text-lg font-extrabold text-sky-600">Scanning... 🔍</p>
          <p className="text-sm font-medium text-gray-500">Asking our robot friend!</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
          {CATEGORY_EMOJI[item.category]} {CATEGORY_LABELS[item.category]}
        </span>
        <span className="text-xs font-bold text-gray-400">
          #{index + 1} of {total}
        </span>
      </div>

      <div className="mt-4 flex items-start gap-2">
        {item.bonus && (
          <span className="mt-1 shrink-0 rounded-full bg-amber-100 px-2 py-1 text-xs font-extrabold text-amber-600">
            ⭐ BONUS
          </span>
        )}
        <h1 className="text-2xl font-extrabold leading-tight text-gray-800 sm:text-3xl">
          {item.item}
        </h1>
      </div>

      {found && (
        <div className={`mt-4 flex items-center gap-3 rounded-2xl ${TIER_STYLES[progress.tier ?? "yellow"].bg} p-3`}>
          {progress.photo && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-white">
              <Image src={progress.photo} alt={item.item} fill sizes="64px" className="object-cover" unoptimized />
            </div>
          )}
          <div className="text-sm">
            <p className="font-extrabold text-emerald-700">Already found! {progress.score}/10 ★</p>
            <p className="text-gray-500">Scan again to beat your score, or pick another.</p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <ScanButton
          onImage={onImage}
          disabled={scanning}
          label={found ? "📸 Scan again" : "📸 Scan Item"}
        />
        <button
          type="button"
          onClick={onSkip}
          disabled={scanning}
          className="w-full rounded-2xl bg-gray-100 px-6 py-3 text-base font-bold text-gray-600 ring-1 ring-gray-200 transition active:scale-95 disabled:opacity-50"
        >
          Skip for now ⏭️
        </button>
      </div>
    </div>
  );
}
