"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";
import { cn } from "@/lib/cn";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

export function WordReveal({
  text,
  as: Tag = "h2",
  className,
  style,
  stagger = 0.06,
  duration = 0.9,
  delay = 0,
  start = "top 85%",
}: {
  text: string;
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ensureGsap();
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>(".word-reveal-item");
    if (!items.length) return;

    if (prefersReducedMotion()) {
      items.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(items, {
        opacity: 1,
        filter: "blur(0px)",
        duration,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start,
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [text, stagger, duration, delay, start]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={cn(className)} style={style}>
      {words.map((w, i) => (
        <span key={i} className="inline-flex">
          <span className="word-reveal-item">
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
