"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { partners, partnerTierMeta, type PartnerTier } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

/* Split the 12 partners into two rows — first 6 in row A (scrolls left),
   last 6 in row B (scrolls right). */
const ROW_A = partners.list.slice(0, 6);
const ROW_B = partners.list.slice(6);

export function PartnersSection() {
  return (
    <section className="relative pt-30 pb-30 lg:pt-44 lg:pb-44" style={{ overflowX: "clip", overflowY: "visible" }}>
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
            width: 820,
            height: 820,
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
            width: 820,
            height: 820,
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
            className="headline leading-[1.05] text-ink"
            style={{
              fontSize: "clamp(2.25rem, 5.2vw, 80px)",
              fontWeight: 600,
              letterSpacing: "-2.4px",
            }}
          />
          <p className="mt-6 max-w-[640px] text-[16px] leading-[1.5] text-ink-soft lg:mt-8 lg:text-[18px]">
            {partners.body}
          </p>
        </div>
      </Container>

      {/* Two-row partner marquee — full-width, no horizontal padding */}
      <div className="mt-16 lg:mt-24">
        <PartnerMarquee items={ROW_A} direction="left" speed={70} />
        <div className="mt-10 lg:mt-14" />
        <PartnerMarquee items={ROW_B} direction="right" speed={85} />
      </div>
    </section>
  );
}

function PartnerMarquee({
  items,
  direction,
  speed,
}: {
  items: typeof partners.list;
  direction: "left" | "right";
  speed: number;
}) {
  // Triple the array to keep the marquee seamless on wide viewports.
  const repeated = [...items, ...items, ...items];
  const ref = useRef<HTMLDivElement>(null);

  /* Entrance animation — logos fade in with stagger from END (DOM-rightmost
     first), so visually the row reveals from RIGHT → LEFT before the
     marquee scroll takes over. */
  useEffect(() => {
    ensureGsap();
    if (!ref.current) return;
    const tiles = ref.current.querySelectorAll<HTMLElement>(".partner-tile");
    if (!tiles.length) return;

    if (prefersReducedMotion()) {
      gsap.set(tiles, { autoAlpha: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(tiles, { autoAlpha: 0, x: 40 });
      gsap.to(tiles, {
        autoAlpha: 1,
        x: 0,
        duration: 0.85,
        ease: "expo.out",
        stagger: { each: 0.04, from: "end" },
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

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
