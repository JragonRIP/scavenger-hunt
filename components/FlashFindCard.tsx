import { FLASH_FIND_POINTS, formatDuration } from "@/lib/game";
import ScanButton from "./ScanButton";

interface FlashFindCardProps {
  item: string;
  remainingMs: number;
  scanning: boolean;
  onImage: (dataUrl: string) => void;
}

export default function FlashFindCard({
  item,
  remainingMs,
  scanning,
  onImage,
}: FlashFindCardProps) {
  const urgent = remainingMs > 0 && remainingMs <= 10_000;

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-amber-50 to-yellow-100 p-6 shadow-xl ring-4 ring-amber-300">
      {scanning && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white/85 backdrop-blur-sm">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
          <p className="mt-4 text-lg font-extrabold text-amber-700">Scanning... 🔍</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-extrabold text-amber-800">
          ⚡ FLASH FIND
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-black tabular-nums ${
            urgent
              ? "animate-pulse bg-rose-500 text-white"
              : "bg-amber-400 text-amber-950"
          }`}
        >
          ⏱️ {formatDuration(remainingMs)}
        </span>
      </div>

      <div className="mt-4 flex items-start gap-2">
        <span className="mt-1 shrink-0 rounded-full bg-orange-200 px-2 py-1 text-xs font-extrabold text-orange-800">
          +{FLASH_FIND_POINTS} pts
        </span>
        <h1 className="text-2xl font-extrabold leading-tight text-gray-800 sm:text-3xl">{item}</h1>
      </div>

      <p className="mt-3 text-sm font-semibold text-amber-800">
        Snap a photo before the timer runs out!
      </p>

      <div className="mt-6">
        <ScanButton onImage={onImage} disabled={scanning} label="📸 Scan item" />
      </div>
    </div>
  );
}
