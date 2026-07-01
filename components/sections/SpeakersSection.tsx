"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { speakers, type Speaker } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

const YEARS = ["2022", "2023", "2024", "2025"] as const;
type Year = (typeof YEARS)[number];

type FeaturedSpeaker = Speaker & { year: Year };

export function SpeakersSection() {
  const stripRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const featured = speakers.featured as FeaturedSpeaker[];

  // Mobile turns the fanned desktop strip into a big swipeable slider.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Entrance animation — cards enter from the right, staggered right → left. */
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
          once: true,
        },
      });
    }, stripRef);

    return () => ctx.revert();
  }, []);

  /* Lock body scroll while the modal is open + close on ESC. */
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  return (
    <section
      className="relative z-30 pt-20 pb-20 lg:pt-28 lg:pb-12"
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      {/* Rentlio circle backdrops — section-local */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        <div
          className="absolute"
          style={{
            left: "-260px",
            top: "8%",
            width: 448,
            height: 448,
            animation: "speakersLeftDrift 36s ease-in-out infinite",
            willChange: "transform",
          }}
        >
          <div
            className="size-full"
            style={{
              ["--base-rot" as never]: "0deg",
              animation: "pageRentlioBreatheCcw 320s linear infinite",
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
        <div
          className="absolute"
          style={{
            right: "-260px",
            top: "22%",
            width: 448,
            height: 448,
            animation: "speakersRightDrift 42s ease-in-out infinite",
            willChange: "transform",
          }}
        >
          <div
            className="size-full"
            style={{
              ["--base-rot" as never]: "210deg",
              animation: "pageRentlioBreatheCw 380s linear infinite",
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

      <Container className="px-4">
        {/* Header — centered */}
        <div className="flex flex-col items-center text-center">
          <p
            className="text-sm uppercase tracking-[0.12em] lg:text-base"
            style={{ color: "#1C9DD9", fontWeight: 600 }}
          >
            {speakers.eyebrow}
          </p>
          <WordReveal
            as="h2"
            text={speakers.bigHeadline}
            className="section-headline mt-4 text-center text-ink lg:mt-6"
            /* Smaller on mobile so each line ("Voices That Shape the" /
               "Hospitality Industry") fits without wrapping or clipping. */
            style={{ width: "min(1340px, 94vw)", fontSize: "clamp(1.7rem, 6vw, 72px)" }}
          />
        </div>

        {/* CTA — replaces the year tabs */}
        <div className="mt-12 flex justify-center lg:mt-16">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-ink/15 bg-paper px-6 py-3 text-xs uppercase tracking-[0.18em] text-ink transition-all duration-300 hover:bg-ink hover:text-paper hover:border-ink focus-ring sm:px-7 sm:py-3.5 sm:text-sm sm:tracking-[0.22em] lg:px-9 lg:py-4 lg:text-base"
            style={{
              fontFamily: "var(--font-sora), sans-serif",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Check all speakers
            <svg
              width="14"
              height="14"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M2 1L7 5L2 9" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </Container>

      {/* Horizontal cards strip — vertical padding tuned so the hover
          scale + drop shadow envelope still fits within the (overflow-x:
          auto -> implicitly clips Y) strip, without leaving a giant
          empty band when no card is being hovered. */}
      <div
        ref={stripRef}
        className="speakers-strip-scroll relative z-10 mt-8 snap-x snap-mandatory scroll-pl-[5vw] overflow-x-auto pb-12 pt-4 sm:mt-10 sm:pb-24 sm:pt-14 lg:mt-12 lg:snap-none lg:scroll-pl-0 lg:pb-32 lg:pt-16"
      >
        <div className="speakers-strip-inner mx-auto flex w-max items-start gap-[3vw] pl-[5vw] pr-[42vw] lg:gap-0 lg:px-4">
          {featured.map((s, i) => (
            <SpeakerCard
              key={`${s.year}-${s.slug}-${i}`}
              speaker={s}
              year={s.year}
              index={i}
              total={featured.length}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      {/* All-speakers modal */}
      {modalOpen && <AllSpeakersModal onClose={() => setModalOpen(false)} />}

      <style>{`
        /* Hide scrollbar on horizontal strip */
        .speakers-strip-scroll {
          scrollbar-width: none;
        }
        .speakers-strip-scroll::-webkit-scrollbar {
          display: none;
        }
        @keyframes speakersLeftDrift {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(10px, -6px); }
        }
        @keyframes speakersRightDrift {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(-12px, 8px); }
        }
      `}</style>
    </section>
  );
}

/* ──────────────────── Featured speaker card ──────────────────── */

function SpeakerCard({
  speaker,
  year,
  index,
  total,
  isMobile,
}: {
  speaker: Speaker;
  year: Year;
  index: number;
  total: number;
  isMobile: boolean;
}) {
  // Gentle fan-like rotation around the middle of the row.
  const middle = (total - 1) / 2;
  const baseRot = (index - middle) * 0.7;

  // Cards overlap with -36px negative left margin (after the first).
  const overlap = index === 0 ? 0 : -36;

  const inner = (
    <div
      className="speaker-card-inner relative aspect-[3/4] h-full w-full overflow-hidden rounded-[20px] bg-ink shadow-[0_18px_40px_-16px_rgba(10,10,15,0.35)]"
      style={{
        /* Mobile: a soft all-round shadow — cards are separate now, so this
           just lifts each standalone card off the page. */
        boxShadow: isMobile
          ? "0 20px 44px -14px rgba(10,10,15,0.5)"
          : undefined,
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

      {/* Year badge — top-right (mobile only; there's room on the big card) */}
      {isMobile && (
        <span
          className="absolute right-4 top-4 tabular-nums leading-none"
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "0.85rem",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          {year}
        </span>
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 text-left lg:px-6 lg:pb-6">
        {/* Play button — always shown on touch; hover-reveal on desktop.
            Only for cards with a video. */}
        {speaker.video && (
          <div className="speaker-play mb-3 flex">
            <span className="flex size-11 items-center justify-center rounded-full border border-white text-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}

        <h3
          className="headline text-[16px] leading-[1.2] text-white lg:text-[19px]"
          style={{ fontWeight: 600, letterSpacing: "-0.4px" }}
        >
          {speaker.name}
        </h3>
        {speaker.role && (
          <p
            className="mt-1 text-[12px] leading-[1.35] lg:text-sm"
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
      className="speaker-card-anim group relative shrink-0 snap-start"
      style={{
        /* Mobile: upright cards side by side (gap handles spacing) in a
           left-aligned swipe slider — no tilt, no overlap, so all content
           stays readable. Desktop: narrow fanned cards that overlap and
           scale on hover. */
        width: isMobile ? "56vw" : "clamp(120px, 12vw, 220px)",
        marginLeft: isMobile ? 0 : overlap,
        zIndex: 10 + index,
        transform: isMobile ? "none" : `rotate(${baseRot}deg)`,
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
        /* Hover interactions only on devices that truly hover (desktop).
           On touch: cards stay flat, the play button is always visible. */
        @media (hover: hover) {
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
        }
      `}</style>
    </div>
  );
}

/* ──────────────────── All-speakers modal ──────────────────── */

function AllSpeakersModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="All speakers across editions"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10"
      style={{
        background: "rgba(10, 10, 15, 0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "speakerModalFade 0.3s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1280px] overflow-hidden rounded-[28px] bg-paper shadow-[0_50px_120px_-20px_rgba(10,10,15,0.45),0_0_0_1px_rgba(10,10,15,0.05)]"
        style={{
          maxHeight: "calc(100vh - 4rem)",
          animation: "speakerModalRise 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/8 bg-paper/95 px-6 py-5 backdrop-blur lg:px-10 lg:py-7">
          <div>
            <p
              className="text-xs uppercase tracking-[0.12em] lg:text-sm"
              style={{ color: "#1C9DD9", fontFamily: "var(--font-sora), sans-serif", fontWeight: 600 }}
            >
              Every Rediscover speaker
            </p>
            <h3
              className="headline mt-1 text-[22px] leading-[1.1] text-ink lg:text-[32px]"
              style={{ fontWeight: 600, letterSpacing: "-0.8px" }}
            >
              All speakers, all editions
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-paper text-ink transition-all hover:bg-ink hover:text-paper hover:border-ink focus-ring lg:size-12"
            style={{ cursor: "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable. overscroll-contain stops the scroll from
            "chaining" to the page behind once you hit the top/bottom. */}
        <div
          className="overflow-y-auto px-6 pb-10 pt-8 lg:px-10 lg:pb-14 lg:pt-10"
          style={{
            maxHeight: "calc(100vh - 4rem - 100px)",
            overscrollBehavior: "contain",
          }}
        >
          {[...YEARS].reverse().map((y) => {
            const list = speakers.byYear[y];
            if (!list || list.length === 0) return null;
            return (
              <section key={y} className="mb-10 lg:mb-14">
                <div className="mb-5 flex items-baseline gap-3 lg:mb-7">
                  <h4
                    className="text-[26px] leading-none text-ink lg:text-[40px]"
                    style={{
                      fontFamily: "var(--font-sora), sans-serif",
                      fontWeight: 500,
                      letterSpacing: "-1.2px",
                    }}
                  >
                    {y}
                  </h4>
                  <span className="text-xs text-ink/50 lg:text-sm">
                    {list.length} {list.length === 1 ? "speaker" : "speakers"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5 lg:gap-x-6 lg:gap-y-9 xl:grid-cols-6 2xl:grid-cols-8">
                  {list.map((s) => (
                    <ModalSpeakerTile key={`${y}-${s.slug}`} speaker={s} year={y} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes speakerModalFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes speakerModalRise {
          from { opacity: 0; transform: translateY(20px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function ModalSpeakerTile({ speaker, year }: { speaker: Speaker; year: Year }) {
  const tile = (
    <>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink/90">
        <Image
          src={`/speakers/${year}/${speaker.slug}.png`}
          alt={speaker.name}
          fill
          sizes="(min-width: 1536px) 140px, (min-width: 1024px) 180px, 30vw"
          quality={90}
          className="object-cover transition-transform duration-500 group-hover/tile:scale-[1.06]"
        />
        {/* Play overlay — only for speakers with a video, on hover */}
        {speaker.video && (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
            style={{ background: "rgba(10,10,15,0.28)" }}
          >
            <span
              className="flex size-11 items-center justify-center rounded-full border transition-transform duration-300 group-hover/tile:scale-100"
              style={{
                borderColor: "rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.18)",
                transform: "scale(0.85)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff" style={{ marginLeft: 2 }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}
      </div>
      <p
        className="mt-2.5 text-center text-[13px] leading-[1.2] text-ink lg:text-sm"
        style={{
          fontFamily: "var(--font-sora), sans-serif",
          fontWeight: 500,
          letterSpacing: "-0.2px",
        }}
      >
        {speaker.name}
      </p>
      {speaker.role && (
        <p className="mt-0.5 text-center text-[11px] leading-[1.25] text-ink/50 lg:text-xs">
          {speaker.role}
        </p>
      )}
    </>
  );

  if (speaker.video) {
    return (
      <a
        href={speaker.video}
        target="_blank"
        rel="noopener noreferrer"
        className="group/tile block focus-ring"
      >
        {tile}
      </a>
    );
  }
  return <div className="group/tile">{tile}</div>;
}
