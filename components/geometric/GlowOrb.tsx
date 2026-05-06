"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

type Variant = "light" | "dark";

export function GlowOrb({
  variant = "light",
  size = 720,
  className = "",
  intensity,
}: {
  variant?: Variant;
  size?: number;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const baseOpacity = intensity ?? (variant === "dark" ? 0.5 : 0.35);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion()) return;
    if (!ref.current) return;
    const tween = gsap.to(ref.current, {
      xPercent: 6,
      yPercent: -4,
      scale: 1.08,
      duration: 24,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        opacity: baseOpacity,
        background:
          variant === "dark"
            ? "radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(30,58,138,0.18) 45%, rgba(0,0,0,0) 70%)"
            : "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.08) 45%, rgba(255,255,255,0) 70%)",
        filter: "blur(80px)",
      }}
    />
  );
}
