"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { valueProp } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

export function ValuePropSection() {
  const statsRef = useRef<HTMLDivElement>(null);

  /* Count-up — all three numbers tick from 0 to their target together,
     starting and finishing at the same time (same trigger + duration),
     fast and decelerating. Fires once when the row scrolls into view. */
  useEffect(() => {
    ensureGsap();
    if (!statsRef.current) return;

    const nums = statsRef.current.querySelectorAll<HTMLElement>(".vp-stat-num");
    if (!nums.length) return;

    const write = (el: HTMLElement, val: number) => {
      const suffix = el.dataset.suffix ?? "";
      el.textContent = `${Math.round(val)}${suffix}`;
    };

    if (prefersReducedMotion()) {
      nums.forEach((el) => write(el, Number(el.dataset.target ?? 0)));
      return;
    }

    nums.forEach((el) => write(el, 0));

    const ctx = gsap.context(() => {
      const counters = Array.from(nums).map((el) => ({ el, value: 0 }));
      gsap.to(counters, {
        value: (i: number) => Number(counters[i].el.dataset.target ?? 0),
        duration: 1.5,
        ease: "power2.out",
        onUpdate() {
          counters.forEach((c) => write(c.el, c.value));
        },
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pt-44 pb-32 lg:pt-72 lg:pb-44">
      <Container className="flex flex-col items-center text-center">
        {/* Mission statement — replaces the years row */}
        <p
          className="text-sm uppercase tracking-[0.12em] lg:text-base"
          style={{
            color: "#1C9DD9",
            fontFamily: "var(--font-sora), sans-serif",
            fontWeight: 600,
          }}
        >
          {valueProp.eyebrow}
        </p>

        {/* Headline — single line on desktop, allowed to wrap on tablet
            and mobile so it never overflows the viewport. */}
        <WordReveal
          as="h2"
          text={valueProp.bigHeadline}
          className="section-headline mt-4 text-center text-ink lg:mt-6"
          style={{ width: "min(1340px, 94vw)" }}
        />

        {/* Body */}
        <div className="mt-7 max-w-[680px] lg:mt-10">
          <WordReveal
            as="p"
            text={valueProp.body}
            className="text-[18px] leading-[1.5] text-ink-soft lg:text-[20px]"
          />
        </div>

        {/* Stats — animated count-up */}
        <div
          ref={statsRef}
          className="mt-12 grid w-full max-w-[760px] grid-cols-3 gap-x-4 gap-y-8 lg:mt-16 lg:gap-x-10"
        >
          {valueProp.stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span
                className="vp-stat-num headline text-ink"
                data-target={s.value}
                data-suffix={s.suffix}
                style={{
                  fontSize: "clamp(2rem, 4vw, 56px)",
                  fontWeight: 600,
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                0{s.suffix}
              </span>
              <span className="mt-2 whitespace-pre-line text-sm leading-[1.3] text-ink-soft lg:mt-3 lg:text-base">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </Container>

      {/* Tilted marquees — black bg + white text on top, paper bg + ink text on bottom */}
      <div className="relative mt-20 lg:mt-28" aria-hidden>
        <div
          className="relative -mx-[10vw]"
          style={{ transform: "rotate(-2.2deg)" }}
        >
          <div className="bg-ink py-6 lg:py-9">
            <TopicsRow
              direction="left"
              speed={75}
              topics={valueProp.topics}
              textColor="#F3F3F3"
            />
          </div>
        </div>

        <div
          className="relative -mx-[10vw] -mt-2 lg:-mt-3"
          style={{ transform: "rotate(2.2deg)" }}
        >
          <div className="border-y border-hairline bg-paper-pure py-6 lg:py-9">
            <TopicsRow
              direction="right"
              speed={95}
              topics={valueProp.topics}
              textColor="#0A0A0F"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TopicsRow({
  direction,
  speed,
  topics,
  textColor,
}: {
  direction: "left" | "right";
  speed: number;
  topics: readonly string[];
  textColor: string;
}) {
  const repeated = [...topics, ...topics, ...topics];
  return (
    <div className="overflow-hidden">
      <div
        className="flex shrink-0 whitespace-nowrap"
        style={{
          animation: `${
            direction === "left" ? "marquee-left" : "marquee-right"
          } ${speed}s linear infinite`,
          color: textColor,
        }}
      >
        {repeated.map((topic, i) => (
          <span
            key={`${topic}-${i}`}
            className="headline text-[36px] leading-[1.1] tracking-[-0.8px] lg:text-[68px] lg:tracking-[-2px]"
            style={{ fontWeight: 400 }}
          >
            {topic}
            <span className="mx-6 opacity-40 lg:mx-10">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
