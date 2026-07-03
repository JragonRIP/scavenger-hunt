import confetti from "canvas-confetti";

/** Fires a celebratory confetti burst. Bigger + gold for great/bonus finds. */
export function celebrate(big = false): void {
  if (typeof window === "undefined") return;

  const colors = big
    ? ["#fbbf24", "#f59e0b", "#34d399", "#22d3ee", "#f472b6"]
    : ["#34d399", "#22d3ee", "#a78bfa", "#f472b6"];

  confetti({
    particleCount: big ? 160 : 90,
    spread: big ? 100 : 70,
    startVelocity: big ? 55 : 45,
    origin: { y: 0.7 },
    colors,
    scalar: big ? 1.1 : 0.9,
  });

  if (big) {
    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.8 }, colors });
      confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.8 }, colors });
    }, 180);
  }
}
