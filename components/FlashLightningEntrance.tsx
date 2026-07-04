"use client";

import { useEffect, useRef, useState } from "react";

interface FlashLightningEntranceProps {
  targetRef: React.RefObject<HTMLButtonElement | null>;
  onComplete: () => void;
}

export default function FlashLightningEntrance({
  targetRef,
  onComplete,
}: FlashLightningEntranceProps) {
  const boltRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"pop" | "fly">("pop");
  const finishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onCompleteRef.current();
  }

  useEffect(() => {
    const flyTimer = setTimeout(() => setPhase("fly"), 900);
    return () => clearTimeout(flyTimer);
  }, []);

  useEffect(() => {
    if (phase !== "fly") return;

    // Safety net: always reveal the header button even if the fly animation fails.
    const fallbackTimer = setTimeout(finish, 2000);

    const runFly = () => {
      if (finishedRef.current) return;
      if (!boltRef.current || !targetRef.current) {
        requestAnimationFrame(runFly);
        return;
      }

      const bolt = boltRef.current;
      const target = targetRef.current;
      const targetRect = target.getBoundingClientRect();

      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      const endX = targetRect.left + targetRect.width / 2;
      const endY = targetRect.top + targetRect.height / 2;

      bolt.style.left = `${startX}px`;
      bolt.style.top = `${startY}px`;
      bolt.style.transform = "translate(-50%, -50%) scale(1)";

      const animation = bolt.animate(
        [
          {
            left: `${startX}px`,
            top: `${startY}px`,
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 1,
          },
          {
            left: `${endX}px`,
            top: `${endY}px`,
            transform: "translate(-50%, -50%) scale(0.32)",
            opacity: 1,
          },
        ],
        { duration: 750, easing: "cubic-bezier(0.34, 1.2, 0.64, 1)", fill: "forwards" },
      );

      animation.onfinish = finish;
    };

    requestAnimationFrame(runFly);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [phase, targetRef]);

  if (phase === "pop") {
    return (
      <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-amber-300/20 animate-[flash-flash_0.9s_ease-out]" />
        <div
          className="relative animate-[flash-bolt-pop_0.9s_ease-out] text-[7rem] leading-none drop-shadow-[0_8px_24px_rgba(251,191,36,0.8)] sm:text-[9rem]"
          aria-hidden
        >
          ⚡
        </div>
      </div>
    );
  }

  return (
    <div
      ref={boltRef}
      className="pointer-events-none fixed z-40 text-[7rem] leading-none drop-shadow-[0_8px_24px_rgba(251,191,36,0.8)] sm:text-[9rem]"
      aria-hidden
    >
      ⚡
    </div>
  );
}
