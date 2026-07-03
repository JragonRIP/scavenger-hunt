interface ProgressBarProps {
  found: number;
  total: number;
}

export default function ProgressBar({ found, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((found / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-sm font-bold text-white drop-shadow">
        <span>
          {found} / {total} found
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="relative h-4 w-full overflow-hidden rounded-full bg-white/40 shadow-inner ring-2 ring-white/60"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Hunt progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
