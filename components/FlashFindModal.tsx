import { FLASH_FIND_POINTS } from "@/lib/game";

interface FlashFindModalProps {
  onAccept: () => void;
  onCancel: () => void;
}

export default function FlashFindModal({ onAccept, onCancel }: FlashFindModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="w-full max-w-sm animate-[pop_0.25s_ease-out] rounded-3xl bg-gradient-to-b from-amber-50 to-yellow-100 p-6 text-center shadow-2xl ring-4 ring-amber-300">
        <div className="text-6xl">⚡</div>
        <h2 className="mt-2 text-2xl font-black text-amber-800">FLASH FIND!</h2>
        <p className="mt-3 text-base font-bold text-amber-700">
          Worth {FLASH_FIND_POINTS} points!
        </p>
        <p className="mt-3 text-sm font-semibold text-gray-600">
          Tap start to see what to find — then you&apos;ll have 1 minute!
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-white/80 px-4 py-3 font-bold text-gray-600 ring-2 ring-amber-200 transition active:scale-95"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 px-4 py-3 font-extrabold text-white shadow-lg ring-2 ring-white/50 transition active:scale-95"
          >
            Start! ⚡
          </button>
        </div>
      </div>
    </div>
  );
}
