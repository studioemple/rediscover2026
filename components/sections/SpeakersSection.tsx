"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { speakers } from "@/lib/content";

const YEARS = ["2022", "2023", "2024", "2025"] as const;
type Year = (typeof YEARS)[number];

export function SpeakersSection() {
  const [year, setYear] = useState<Year>("2025");
  const [idx, setIdx] = useState(0);

  const list = speakers.byYear[year];
  const featured = list[idx];

  useEffect(() => {
    setIdx(0);
  }, [year]);

  const prev = () => setIdx((i) => (i - 1 + list.length) % list.length);
  const next = () => setIdx((i) => (i + 1) % list.length);

  return (
    <section className="relative bg-paper px-4 pt-30 pb-30 lg:pt-44 lg:pb-44">
      <Container>
        {/* Header — centered eyebrow + title */}
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
            className="headline mt-4 max-w-[820px] text-[36px] leading-[1.1] tracking-[-1.44px] text-ink lg:text-[54px] lg:tracking-[-2.16px]"
          />
        </div>

        {/* Two columns: LEFT = year tabs + thumbnails | RIGHT = featured speaker.
            Right column is offset so the featured image aligns with the
            thumbnail grid (year tabs sit above only the left column). */}
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          {/* LEFT — year tabs + thumbnail grid */}
          <div className="lg:col-span-5">
            <div
              role="tablist"
              aria-label="Speaker years"
              className="flex justify-center gap-7 lg:justify-start lg:gap-9"
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

            {/* Thumbnail grid */}
            <div className="mt-7 grid grid-cols-3 gap-2 lg:mt-9 lg:gap-2">
              {list.map((s, i) => {
                const isActive = i === idx;
                return (
                  <button
                    key={`${year}-${s.slug}-${i}`}
                    onClick={() => setIdx(i)}
                    aria-label={s.name}
                    aria-pressed={isActive}
                    className="speakers-thumb relative aspect-square overflow-hidden rounded-lg bg-surface focus:outline-none"
                    data-active={isActive}
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={`/speakers/${year}/${s.slug}.png`}
                      alt={s.name}
                      fill
                      sizes="(min-width: 1024px) 16vw, 30vw"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — featured speaker (image aligned with thumbnail grid) */}
          <div className="lg:col-span-7 lg:pt-[76px]">
            <div
              key={`${year}-${idx}-img`}
              className="speakers-image-in relative aspect-square w-full overflow-hidden rounded-[24px] bg-surface lg:rounded-[32px]"
            >
              <Image
                src={`/speakers/${year}/${featured.slug}.png`}
                alt={featured.name}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Data below image */}
            <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <h3
                  key={`${year}-${idx}-name`}
                  className="speakers-text-in headline text-[34px] leading-[1.05] tracking-[-1.36px] text-ink lg:text-[56px] lg:tracking-[-2.24px]"
                >
                  {featured.name}
                </h3>
                {featured.role && (
                  <p
                    key={`${year}-${idx}-role`}
                    className="speakers-text-in mt-2 text-base lg:text-xl"
                    style={{
                      color: "#1C9DD9",
                      fontWeight: 300,
                      animationDelay: "0.08s",
                    }}
                  >
                    {featured.role}
                  </p>
                )}

                {featured.video && (
                  <a
                    key={`${year}-${idx}-watch`}
                    href={featured.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="speakers-text-in mt-7 inline-flex items-center gap-2 text-base font-medium text-ink underline underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ animationDelay: "0.16s" }}
                  >
                    WATCH HERE
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z" />
                    </svg>
                  </a>
                )}
              </div>

              <div className="lg:col-span-5">
                {featured.session && (
                  <p
                    key={`${year}-${idx}-session`}
                    className="speakers-text-in text-sm font-medium uppercase tracking-[0.14em]"
                    style={{ color: "#7BA32A", animationDelay: "0.2s" }}
                  >
                    {featured.session}
                  </p>
                )}
                {featured.sessionTitle && (
                  <p
                    key={`${year}-${idx}-st`}
                    className="speakers-text-in mt-2 text-lg leading-[1.45] text-ink lg:text-xl"
                    style={{ animationDelay: "0.24s" }}
                  >
                    {featured.sessionTitle}
                  </p>
                )}

                {/* Prev/Next */}
                <div
                  className="speakers-text-in mt-8 flex items-center gap-3"
                  style={{ animationDelay: "0.32s" }}
                >
                  <button
                    onClick={prev}
                    aria-label="Previous speaker"
                    className="flex size-12 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper focus:outline-none lg:size-14"
                    style={{ cursor: "pointer" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next speaker"
                    className="flex size-12 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper focus:outline-none lg:size-14"
                    style={{ cursor: "pointer" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        /* Premium ease */
        :root {
          --premium-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Image transition — fade + blur + subtle scale */
        @keyframes speakersImageIn {
          0% {
            opacity: 0;
            transform: scale(1.03);
            filter: blur(14px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }
        .speakers-image-in {
          animation: speakersImageIn 0.85s var(--premium-ease) both;
          will-change: transform, filter, opacity;
        }

        /* Text transition — fade + y */
        @keyframes speakersTextIn {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .speakers-text-in {
          animation: speakersTextIn 0.75s var(--premium-ease) both;
          will-change: transform, opacity;
        }

        /* Thumbnails — smooth grayscale + opacity transition */
        .speakers-thumb {
          filter: grayscale(1);
          opacity: 0.5;
          transform: scale(1);
          transition:
            filter 0.5s var(--premium-ease),
            opacity 0.5s var(--premium-ease),
            transform 0.5s var(--premium-ease),
            box-shadow 0.5s var(--premium-ease);
        }
        .speakers-thumb:hover {
          filter: grayscale(0.4);
          opacity: 0.85;
          transform: scale(1.02);
        }
        .speakers-thumb[data-active="true"] {
          filter: grayscale(0);
          opacity: 1;
          transform: scale(1.02);
          box-shadow: 0 18px 40px -16px rgba(28, 157, 217, 0.45);
        }
      `}</style>
    </section>
  );
}
