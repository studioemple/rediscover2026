"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

export function ScrollReveal({
  children,
  delay = 0,
  stagger = 0.08,
  y = 24,
  blur = 8,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  y?: number;
  blur?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureGsap();
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      gsap.set(ref.current.children, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      const items = ref.current!.children;
      gsap.set(items, { opacity: 0, y, filter: `blur(${blur}px)` });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "expo.out",
        delay,
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, stagger, y, blur]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
