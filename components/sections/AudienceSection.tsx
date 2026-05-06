"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { Button } from "@/components/ui/Button";
import { audience, event } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

const SECONDS_PER_TITLE = 1.6; // how long the spotlight takes to slide one position

export function AudienceSection() {
  const titlesRef = useRef<HTMLDivElement>(null);
  const titleEls = useRef<(HTMLDivElement | null)[]>([]);

  /* Rising reveal — words rise up from below on scroll-in */
  useEffect(() => {
    ensureGsap();
    if (!titlesRef.current) return;

    const inner = titlesRef.current.querySelectorAll<HTMLElement>(
      ".rising-word",
    );
    const masks = titlesRef.current.querySelectorAll<HTMLElement>(
      ".rising-mask",
    );

    const releaseMasks = () => {
      masks.forEach((m) => {
        m.style.overflow = "visible";
      });
    };

    if (prefersReducedMotion()) {
      gsap.set(inner, { yPercent: 0, autoAlpha: 1 });
      releaseMasks();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(inner, { yPercent: 110, autoAlpha: 0 });
      gsap.to(inner, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger: { each: 0.07 },
        onComplete: releaseMasks,
        scrollTrigger: {
          trigger: titlesRef.current,
          start: "top 78%",
          once: true,
        },
      });
    }, titlesRef);

    return () => ctx.revert();
  }, []);

  /* Smooth continuous barrel — RAF-driven, no React re-renders.
     A floating "position" advances continuously. Each title's style is
     interpolated from its cyclic distance to that position, so the
     spotlight glides between titles instead of jumping. */
  useEffect(() => {
    if (prefersReducedMotion()) {
      titleEls.current.forEach((el) => {
        if (!el) return;
        el.style.opacity = "1";
        el.style.filter = "grayscale(0)";
      });
      return;
    }

    const total = audience.titles.length;
    const cycleSpeed = 1 / SECONDS_PER_TITLE;
    let rafId = 0;
    let last = performance.now();
    let position = 0;
    let hovered = -1;

    const apply = (activePos: number) => {
      titleEls.current.forEach((el, i) => {
        if (!el) return;
        const rawDist = Math.abs(i - activePos);
        const dist = Math.min(rawDist, total - rawDist);
        // Gentler falloff — all titles stay readable, the active one just shines.
        const intensity = Math.max(0, 1 - dist * 0.55);
        // Hovered title gets an extra scale boost for tactile feedback.
        const isHovered = hovered === i;
        const opacity = 0.45 + intensity * 0.55;
        const grayscaleAmt = 0.6 - intensity * 0.6;
        const scale = 1 + intensity * 0.06 + (isHovered ? 0.05 : 0);
        el.style.opacity = String(opacity);
        el.style.filter = `grayscale(${grayscaleAmt})`;
        el.style.transform = `scale(${scale})`;
        el.style.transition = "transform 0.35s var(--ease-premium)";
      });
    };

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (hovered === -1) {
        position = (position + dt * cycleSpeed) % total;
      }
      apply(hovered === -1 ? position : hovered);
      rafId = requestAnimationFrame(tick);
    };

    /* Hover handlers — focus on hovered title, freeze auto-cycle. */
    const enterHandlers: Array<() => void> = [];
    const leaveHandler = () => {
      hovered = -1;
    };

    titleEls.current.forEach((el, i) => {
      if (!el) return;
      const onEnter = () => {
        hovered = i;
      };
      enterHandlers[i] = onEnter;
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", leaveHandler);
    });

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      titleEls.current.forEach((el, i) => {
        if (!el) return;
        if (enterHandlers[i])
          el.removeEventListener("mouseenter", enterHandlers[i]);
        el.removeEventListener("mouseleave", leaveHandler);
      });
    };
  }, []);

  return (
    <section className="relative bg-paper px-4 pt-30 pb-30 lg:pt-50 lg:pb-50">
      <Container className="flex flex-col items-center text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-ink-soft lg:text-sm">
          {audience.eyebrow}
        </p>

        <WordReveal
          as="h2"
          text={audience.bigHeadline}
          className="headline mt-6 max-w-[1100px] text-[40px] leading-[1.05] tracking-[-1.6px] text-ink lg:mt-8 lg:text-[72px] lg:tracking-[-2.88px]"
        />

        {/* Continuously cycling barrel of titles */}
        <div
          ref={titlesRef}
          className="mt-16 flex flex-col items-center gap-2 lg:mt-24 lg:gap-3"
        >
          {audience.titles.map((title, i) => {
            const words = title.split(" ");
            return (
              <div
                key={title}
                ref={(el) => {
                  titleEls.current[i] = el;
                }}
                className="audience-title-row cursor-pointer will-change-transform"
                style={{
                  opacity: 0.45,
                  filter: "grayscale(0.6)",
                }}
              >
                <div className="flex flex-wrap justify-center gap-x-3 lg:gap-x-4">
                  {words.map((word, j) => (
                    <span
                      key={j}
                      className="rising-mask inline-flex overflow-hidden pb-4 leading-[1.15] lg:pb-6"
                    >
                      <span
                        className="rising-word audience-title-word headline text-[34px] leading-[1.15] tracking-[-1.36px] lg:text-[60px] lg:tracking-[-2.4px]"
                        style={{ display: "inline-block", fontWeight: 350 }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <a href="#register" className="mt-16 lg:mt-24">
          <Button variant="primary">{event.registerCta}</Button>
        </a>
      </Container>
    </section>
  );
}
