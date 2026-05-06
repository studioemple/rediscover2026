"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";
import { cn } from "@/lib/cn";

export function ColorCard({
  bg,
  className,
  children,
  height = "h-[420px] lg:h-[540px]",
  rounded = "rounded-2xl lg:rounded-[28px]",
}: {
  bg: string;
  className?: string;
  children?: React.ReactNode;
  height?: string;
  rounded?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureGsap();
    if (!ref.current) return;
    if (prefersReducedMotion()) {
      gsap.set(ref.current, { opacity: 1, scale: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden",
        height,
        rounded,
        className,
      )}
      style={{ backgroundColor: bg }}
    >
      {children}
    </div>
  );
}

export function FloatingItem({
  className,
  fromY = "150%",
  fromX = "0%",
  children,
}: {
  className?: string;
  fromY?: string;
  fromX?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureGsap();
    if (!ref.current) return;
    if (prefersReducedMotion()) {
      gsap.set(ref.current, { opacity: 1, x: 0, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: fromY, x: fromX, opacity: 0 },
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [fromY, fromX]);

  return (
    <div ref={ref} className={cn("absolute", className)}>
      {children}
    </div>
  );
}
