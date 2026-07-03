"use client";

import { useRef } from "react";
import { fileToDataUrl } from "@/lib/image";

interface ScanButtonProps {
  onImage: (dataUrl: string) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export default function ScanButton({
  onImage,
  disabled = false,
  label = "📸 Scan Item",
  className = "",
}: ScanButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so choosing the same photo again still fires onChange.
    e.target.value = "";
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onImage(dataUrl);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={
          "w-full rounded-2xl bg-gradient-to-b from-sky-400 to-blue-500 px-6 py-5 text-xl font-extrabold text-white shadow-lg ring-2 ring-white/50 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 " +
          className
        }
      >
        {label}
      </button>
    </>
  );
}
