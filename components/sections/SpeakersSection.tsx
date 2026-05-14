"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { speakers, type Speaker } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

const YEARS = ["2022", "2023", "2024", "2025"] as const;
type Year = (typeof YEARS)[number];

export function SpeakersSection() {
  const [year, setYear] = useState<Year>("2025");
  const stripRef = useRef<HTMLDivElement>(null);

  const list = speakers.byYear[year];

  /* Entrance animation — re-runs whenever year changes.
     All cards enter from the right, staggered right → left. */
  useEffect(() => {
    ensureGsap();
    if (!stripRef.current) return;

    const cards = stripRef.current.querySelectorAll<HTMLElement>(
      ".speaker-card-anim",
    );
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      gsap.set(cards, { autoAlpha: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        autoAlpha: 0,
        x: 90,
        filter: "blur(10px)",
      });
      gsap.to(cards, {
        autoAlpha: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 0.95,
        ease: "expo.out",
        stagger: { each: 0.08, from: "end" },
        scrollTrigger: {
          trigger: stripRef.current,
          start: "top 82%",
          once: false,
        },
      });
    }, stripRef);

    return () => ctx.revert();
  }, [year]);

  return (
    <section className="relative pt-30 pb-30 lg:pt-44 lg:pb-44">
      <Container className="px-4">
        {/* Header — centered */}
        <div className="flex flex-col items-center text-center">
          <p
            className="text-sm uppercase tracking-[0.18em] lg:text-base"
            style={{ color: "#1C9DD9" }}
          >
            {speakers.eyebrow}
          </p>
          <WordReveal
            as="h2"
            text={speakers.bigHeadline}
            className="headline mt-4 max-w-[1100px] leading-[1.02] text-ink"
            style={{
              fontSize: "clamp(2.5rem, 5.8vw, 92px)",
              fontWeight: 600,
              letterSpacing: "-2.6px",
            }}
          />
        </div>

        {/* Year tabs CENTERED */}
        <div
          role="tablist"
          aria-label="Speaker years"
          className="mt-12 flex justify-center gap-7 lg:mt-16 lg:gap-12"
        >
          {YEARS.map((y) => {
            const isActive = y === year;
            return (
              <button
                key={y}
                role="tab"
                aria-selected={isActive}
                onClick={() => setYear(y)}
                className="relative pb-1.5 text-2xl text-ink transition-opacity duration-300 focus:outline-none lg:text-[34px]"
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  opacity: isActive ? 1 : 0.4,
                  fontWeight: isActive ? 500 : 400,
                  cursor: "pointer",
                  letterSpacing: "-0.5px",
                }}
              >
                {y}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px] origin-center transition-transform duration-500"
                  style={{
                    background: "#4D7EF5",
                    transform: isActive ? "scaleX(1)" : "scaleX(0)",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </button>
            );
          })}
        </div>
      </Container>

      {/* Horizontal cards strip — generous vertical padding gives hover
          scale + drop shadow plenty of room to render without being clipped. */}
      <div
        ref={stripRef}
        key={year}
        className="speakers-strip-scroll mt-14 overflow-x-auto pb-24 pt-20 lg:mt-20 lg:pb-32 lg:pt-28"
      >
        <div className="speakers-strip-inner mx-auto flex w-max items-start px-6 lg:px-16">
          {list.map((s, i) => (
            <SpeakerCard
              key={`${year}-${s.slug}-${i}`}
              speaker={s}
              year={year}
              index={i}
              total={list.length}
            />
          ))}
        </div>
      </div>

      <style>{`
        /* Hide scrollbar on horizontal strip */
        .speakers-strip-scroll {
          scrollbar-width: none;
        }
        .speakers-strip-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function SpeakerCard({
  speaker,
  year,
  index,
  total,
}: {
  speaker: Speaker;
  year: Year;
  index: number;
  total: number;
}) {
  // Gentle fan-like rotation around the middle of the row.
  const middle = (total - 1) / 2;
  const baseRot = (index - middle) * 0.7;

  // Cards overlap with -32px negative left margin (after the first).
  const overlap = index === 0 ? 0 : -36;

  const inner = (
    <div
      className="speaker-card-inner relative aspect-[3/4] h-full w-full overflow-hidden rounded-[20px] bg-ink shadow-[0_18px_40px_-16px_rgba(10,10,15,0.35)]"
      style={{
        transition:
          "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <Image
        src={`/speakers/${year}/${speaker.slug}.png`}
        alt={speaker.name}
        fill
        sizes="(min-width: 1024px) 280px, 220px"
        className="speaker-card-img object-cover"
      />

      {/* Bottom gradient for text legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-5 text-left lg:px-6 lg:pb-6">
        {/* Play button — visible on hover, only for cards with a video */}
        {speaker.video && (
          <div className="speaker-play mb-3 flex">
            <span className="flex size-11 items-center justify-center rounded-full border border-white text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}

        <h3
          className="headline text-[17px] leading-[1.2] text-white lg:text-[19px]"
          style={{ fontWeight: 600, letterSpacing: "-0.6px" }}
        >
          {speaker.name}
        </h3>
        {speaker.role && (
          <p
            className="mt-1 text-xs leading-[1.3] lg:text-sm"
            style={{ color: "#56C3E5", fontWeight: 300 }}
          >
            {speaker.role}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="speaker-card-anim group relative shrink-0"
      style={{
        width: "clamp(200px, 18vw, 260px)",
        marginLeft: overlap,
        zIndex: 10 + index,
        transform: `rotate(${baseRot}deg)`,
        transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {speaker.video ? (
        <a
          href={speaker.video}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {inner}
        </a>
      ) : (
        inner
      )}

      <style>{`
        .speakers-strip-inner .speaker-card-anim:hover {
          z-index: 60 !important;
        }
        .speakers-strip-inner .speaker-card-anim:hover .speaker-card-inner {
          transform: scale(1.22) translateY(-24px);
          box-shadow:
            0 50px 90px -25px rgba(10, 10, 15, 0.55),
            0 22px 45px -20px rgba(28, 157, 217, 0.25);
        }
        .speakers-strip-inner .speaker-card-anim:hover .speaker-card-img {
          transform: scale(1.08);
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .speakers-strip-inner .speaker-card-anim .speaker-play {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .speakers-strip-inner .speaker-card-anim:hover .speaker-play {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
