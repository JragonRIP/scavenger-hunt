import { TOTAL_ITEMS } from "@/lib/items";

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="animate-[float_3s_ease-in-out_infinite] text-7xl">🔍</div>
      <h1 className="mt-4 text-4xl font-black text-white drop-shadow-lg sm:text-5xl">
        Scavenger Hunt!
      </h1>
      <p className="mt-3 max-w-sm text-lg font-semibold text-white/90 drop-shadow">
        Explore your home and yard, snap photos, and let our robot friend check
        your finds!
      </p>

      <div className="mt-6 w-full max-w-sm space-y-3 rounded-3xl bg-white/90 p-5 text-left shadow-xl">
        <Rule emoji="📸" text="Tap Scan Item and take a photo of what you find." />
        <Rule emoji="🚦" text="Green or yellow means it counts. Red? Try again!" />
        <Rule emoji="⭐" text="Look for BONUS items for extra points." />
        <Rule emoji="⏭️" text="Skip tricky ones and come back later." />
        <Rule emoji="🏁" text="Finish any time - but you can't undo it!" />
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 w-full max-w-sm rounded-full bg-gradient-to-b from-amber-300 to-orange-500 px-8 py-5 text-2xl font-black text-white shadow-xl ring-4 ring-white/60 transition active:scale-95"
      >
        Start the Hunt! 🚀
      </button>
      <p className="mt-3 text-sm font-bold text-white/80 drop-shadow">
        {TOTAL_ITEMS} things to find - good luck!
      </p>
    </div>
  );
}

function Rule({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{emoji}</span>
      <span className="text-sm font-semibold text-gray-700">{text}</span>
    </div>
  );
}
