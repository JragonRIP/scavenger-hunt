interface FlashTimeUpModalProps {
  onDismiss: () => void;
}

export default function FlashTimeUpModal({ onDismiss }: FlashTimeUpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="w-full max-w-sm animate-[pop_0.25s_ease-out] rounded-3xl bg-white p-6 text-center shadow-2xl">
        <div className="text-6xl">⏰</div>
        <h2 className="mt-2 text-2xl font-black text-gray-800">Time&apos;s up!</h2>
        <p className="mt-2 text-sm font-medium text-gray-500">
          The flash find is over. Back to your regular hunt!
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-5 w-full rounded-2xl bg-gradient-to-b from-violet-400 to-fuchsia-600 px-6 py-4 text-lg font-extrabold text-white shadow-lg transition active:scale-95"
        >
          Keep hunting →
        </button>
      </div>
    </div>
  );
}
