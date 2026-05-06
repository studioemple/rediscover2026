"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

type Variant = "light" | "dark";

export function ArcLines({
  variant = "light",
  className = "",
  count = 4,
}: {
  variant?: Variant;
  className?: string;
  count?: number;
}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const stroke = variant === "dark" ? "#1E293B" : "#E2E8F0";

  useEffect(() => {
    ensureGsap();
    if (!ref.current) return;
    const paths = ref.current.querySelectorAll<SVGPathElement>("path");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    if (prefersReducedMotion()) {
      paths.forEach((p) => {
        p.style.strokeDashoffset = "0";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const arcs = Array.from({ length: count }, (_, i) => {
    const r = 40 + i * 30;
    return (
      <path
        key={i}
        d={`M ${-r} 100 A ${r} ${r} 0 0 1 ${r} 100`}
        fill="none"
        stroke={stroke}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    );
  });

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid meet"
    >
      {arcs}
    </svg>
  );
}
