"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { type PartnerTier } from "@/lib/content";
import { useContent } from "@/components/i18n/LanguageProvider";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

type PartnerItem = { name: string; logo: string; tier: PartnerTier };

export function PartnersSection() {
  const { partners } = useContent();

  // Two rows on desktop; three shorter rows on mobile (more logos visible).
  const ROW_A = partners.list.slice(0, 6);
  const ROW_B = partners.list.slice(6);
  const M_THIRD = Math.ceil(partners.list.length / 3);
  const ROW_M1 = partners.list.slice(0, M_THIRD);
  const ROW_M2 = partners.list.slice(M_THIRD, M_THIRD * 2);
  const ROW_M3 = partners.list.slice(M_THIRD * 2);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section className="relative pt-20 pb-20 lg:pt-44 lg:pb-44" style={{ overflowX: "clip", overflowY: "visible" }}>
      {/* Rentlio circle backdrops — section-local pair.
          • LEFT main : 820px, ~65% visible (~287px off-screen), rot 270°
          • RIGHT mirror : 820px, ~65% visible from the right, rot 200° so
            the pair feels layered, not perfectly mirrored. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        {/* Left */}
        <div
          className="absolute"
          style={{
            left: "-287px",
            top: "-180px",
            width: 574,
            height: 574,
            animation: "partnersLeftDrift 38s ease-in-out infinite",
            willChange: "transform",
          }}
        >
          <div
            className="size-full"
            style={{
              ["--base-rot" as never]: "270deg",
              animation: "pageRentlioBreatheCcw 380s linear infinite",
            }}
          >
            <img
              src="/rentlio-circle.svg"
              alt=""
              className="block size-full"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Right */}
        <div
          className="absolute"
          style={{
            right: "-287px",
            top: "-100px",
            width: 574,
            height: 574,
            animation: "partnersRightDrift 44s ease-in-out infinite",
            willChange: "transform",
          }}
        >
          <div
            className="size-full"
            style={{
              ["--base-rot" as never]: "200deg",
              animation: "pageRentlioBreatheCw 420s linear infinite",
            }}
          >
            <img
              src="/rentlio-circle.svg"
              alt=""
              className="block size-full"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes partnersLeftDrift {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(10px, -8px); }
        }
        @keyframes partnersRightDrift {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(-12px, 10px); }
        }
      `}</style>

      <Container className="relative px-4">
        {/* Header — title + body STACKED and CENTERED */}
        <div className="flex flex-col items-center text-center">
          <WordReveal
            as="h2"
            text={partners.eyebrow}
            className="section-headline text-ink 2xl:whitespace-nowrap"
          />
          <p className="mt-6 max-w-[640px] text-[16px] leading-[1.5] text-ink-soft lg:mt-8 lg:text-[18px]">
            {partners.body}
          </p>
        </div>
      </Container>

      {/* Partner marquee — 2 rows on desktop; 3 shorter rows on mobile so
          more logos are visible at once. */}
      <div className="mt-16 lg:mt-24">
        {isMobile ? (
          <>
            <PartnerMarquee items={ROW_M1} direction="left" speed={52} delay={0} />
            <div className="mt-8" />
            <PartnerMarquee items={ROW_M2} direction="right" speed={58} delay={0.18} />
            <div className="mt-8" />
            <PartnerMarquee items={ROW_M3} direction="left" speed={46} delay={0.36} />
          </>
        ) : (
          <>
            <PartnerMarquee items={ROW_A} direction="left" speed={70} delay={0} />
            <div className="mt-10 lg:mt-14" />
            <PartnerMarquee items={ROW_B} direction="right" speed={85} delay={0.15} />
          </>
        )}
      </div>
    </section>
  );
}

function PartnerMarquee({
  items,
  direction,
  speed,
  delay = 0,
}: {
  items: readonly PartnerItem[];
  direction: "left" | "right";
  speed: number;
  delay?: number;
}) {
  // Triple the array to keep the marquee seamless on wide viewports.
  const repeated = [...items, ...items, ...items];
  const ref = useRef<HTMLDivElement>(null);

  /* Entrance — the WHOLE row fades up as one unit (not per-tile, which
     flickered against the marquee scroll). `delay` staggers the rows so they
     appear one after another (first, then second, then third). */
  useEffect(() => {
    ensureGsap();
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      gsap.set(ref.current, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          delay,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      <div
        className="flex shrink-0 items-center gap-x-8 sm:gap-x-12 lg:gap-x-24"
        style={{
          width: "max-content",
          animation: `${
            direction === "left" ? "marquee-left" : "marquee-right"
          } ${speed}s linear infinite`,
        }}
      >
        {repeated.map((p, i) => {
          // The General partner (Mastercard) keeps its brand colour so it
          // stands out as the lead; the rest stay uniform monochrome grey.
          const isGeneral = p.tier === "general";
          return (
          <div
            key={`${p.name}-${i}`}
            className={`partner-tile flex shrink-0 flex-col items-center gap-3${
              isGeneral ? " partner-tile--general" : ""
            }`}
          >
            <div className="relative h-[44px] w-[130px] sm:h-[56px] sm:w-[170px] lg:h-[68px] lg:w-[200px]">
              <Image
                src={p.logo}
                alt={p.name}
                fill
                sizes="(min-width: 1024px) 200px, (min-width: 640px) 170px, 130px"
                className="object-contain"
                style={
                  isGeneral
                    ? undefined
                    : { filter: "brightness(0) saturate(100%) opacity(0.8)" }
                }
              />
            </div>
            <TierBadge tier={p.tier} />
          </div>
          );
        })}
      </div>

      <style>{`
        .partner-tile {
          transition:
            opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .partner-tile:hover img {
          filter: brightness(0) saturate(100%) opacity(1) !important;
          transform: translateY(-2px);
        }
        /* General partner keeps full colour even on hover. */
        .partner-tile--general:hover img {
          filter: none !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

function TierBadge({ tier }: { tier: PartnerTier }) {
  const { partnerTierMeta } = useContent();
  const meta = partnerTierMeta[tier];
  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink lg:text-sm">
      <span
        aria-hidden
        className="block size-[10px] rounded-full lg:size-[12px]"
        style={{ background: meta.dot }}
      />
      <span style={{ fontWeight: 500 }}>{meta.label}</span>
    </div>
  );
}
