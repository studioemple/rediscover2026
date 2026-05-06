"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

type Variant = "light" | "dark";

export function GeometricGrid({
  variant = "light",
  density = 12,
  opacity,
}: {
  variant?: Variant;
  density?: number;
  opacity?: number;
}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const stroke = variant === "dark" ? "#1E293B" : "#E2E8F0";
  const baseOpacity = opacity ?? (variant === "dark" ? 0.35 : 0.6);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion()) return;
    if (!ref.current) return;
    const tween = gsap.to(ref.current, {
      x: 8,
      duration: 18,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, []);

  const cols = Array.from({ length: density - 1 }, (_, i) => ((i + 1) * 100) / density);
  const rows = Array.from({ length: density - 1 }, (_, i) => ((i + 1) * 100) / density);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity: baseOpacity }}
    >
      {cols.map((x, i) => (
        <line
          key={`c-${i}`}
          x1={x}
          x2={x}
          y1={0}
          y2={100}
          stroke={stroke}
          strokeWidth={0.05}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {rows.map((y, i) => (
        <line
          key={`r-${i}`}
          x1={0}
          x2={100}
          y1={y}
          y2={y}
          stroke={stroke}
          strokeWidth={0.05}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
