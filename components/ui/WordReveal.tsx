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

  // A literal "\n" in the text forces a hard line break (each line becomes
  // its own block). Within each line, words wrap + animate as usual. Spaces
  // between words are real text nodes so they never collapse, while each word
  // stays an inline-block so the blur/opacity reveal applies cleanly.
  const lines = text.split("\n");
  let wordIndex = 0;

  return (
    <Tag ref={ref as never} className={cn(className)} style={style}>
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={li} className="block">
            {words.map((w, i) => {
              const k = wordIndex++;
              return (
                <span key={k}>
                  <span className="word-reveal-item inline-block">{w}</span>
                  {i < words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
