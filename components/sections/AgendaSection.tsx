"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import { WordReveal } from "@/components/ui/WordReveal";
import { useLang } from "@/components/i18n/LanguageProvider";
import { agenda, type AgendaSpeaker } from "@/lib/agenda";
import {
  ensureGsap,
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/lib/animations";

const BLUE = "#1C9DD9";
const LINE = "#D9D9D9";
const PAPER = "#F3F3F3";

/* Viewport height at which the progress line's tip sits — each dot lights up
   as it crosses this "playhead". */
const PLAYHEAD = "62%";

/**
 * Agenda — event-day programme.
 *
 * Desktop: 10% | 30% intro (sticky) | 10% times | 50% sessions. The timeline
 * runs on a full-height background hairline at exactly 50% of the page width
 * (midway between the page's 36.67% / 63.33% background lines).
 * Mobile: intro on top, sessions below with the time above each title; the
 * dots sit on the page's 10% background line (PageGeometry), so no extra line
 * is drawn there.
 *
 * Motion (all subtle): the line fills blue with scroll, dots light up when the
 * fill reaches them, rows fade up once as they enter.
 */
export function AgendaSection() {
  const { lang } = useLang();
  const t = agenda[lang];

  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!track || !fill) return;

    const rows = Array.from(track.querySelectorAll<HTMLElement>(".agenda-row"));
    const dots = Array.from(track.querySelectorAll<HTMLElement>(".agenda-dot"));
    const dash = track.querySelector<HTMLElement>(".agenda-dash-fill");
    const dashRowIndex = rows.findIndex((r) => r.dataset.dash === "true");
    const solidEndDot = dots[dashRowIndex >= 0 ? dashRowIndex : dots.length - 1];
    const lastDot = dots[dots.length - 1];
    if (!dots.length) return;

    dots.forEach((d) => (d.dataset.on = "false"));

    if (prefersReducedMotion()) {
      dots.forEach((d) => (d.dataset.on = "true"));
      fill.style.transform = "scaleY(1)";
      if (dash) dash.style.clipPath = "none";
      // Geometry still needed for the static fill.
      const top = track.getBoundingClientRect().top;
      const c = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2 - top;
      };
      fill.style.top = `${c(dots[0])}px`;
      fill.style.height = `${c(solidEndDot) - c(dots[0])}px`;
      return;
    }

    /* Measured geometry (dot centres, relative to the track). Re-measured on
       every ScrollTrigger refresh (resize, fonts, language switch). */
    let c0 = 0; // first dot
    let cSolid = 0; // dot where the dashed segment starts
    let cLast = 0; // last dot
    const layout = () => {
      const top = track.getBoundingClientRect().top;
      const c = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2 - top;
      };
      c0 = c(dots[0]);
      cSolid = c(solidEndDot);
      cLast = c(lastDot);
      fill.style.top = `${c0}px`;
      fill.style.height = `${Math.max(0, cSolid - c0)}px`;
    };
    layout();
    ScrollTrigger.addEventListener("refreshInit", layout);

    const ctx = gsap.context(() => {
      /* Progress line — solid part, then the dashed evening part. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: () => `top+=${c0} ${PLAYHEAD}`,
          end: () => `top+=${cLast} ${PLAYHEAD}`,
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(
        fill,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", duration: Math.max(1, cSolid - c0) },
      );
      if (dash) {
        tl.fromTo(
          dash,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", ease: "none", duration: Math.max(1, cLast - cSolid) },
        );
      }

      /* Dots light up as the playhead crosses them. */
      dots.forEach((dot) => {
        ScrollTrigger.create({
          trigger: dot,
          start: `center ${PLAYHEAD}`,
          onEnter: () => (dot.dataset.on = "true"),
          onLeaveBack: () => (dot.dataset.on = "false"),
        });
      });

      /* Rows — fade up once, parts lightly staggered. */
      rows.forEach((row) => {
        const parts = row.querySelectorAll<HTMLElement>(".agenda-reveal");
        gsap.fromTo(
          parts,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          },
        );
      });

      /* Intro eyebrow + body (the title has its own WordReveal). */
      if (introRef.current) {
        gsap.fromTo(
          introRef.current.querySelectorAll(".agenda-intro"),
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: introRef.current, start: "top 85%", once: true },
          },
        );
      }
    }, track.parentElement ?? track);

    // Content height changes (fonts, language, resize) → recompute positions.
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(track);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      ScrollTrigger.removeEventListener("refreshInit", layout);
      ctx.revert();
    };
  }, [lang]);

  return (
    <section
      id="agenda"
      /* Page backdrop keeps its horizontals/diagonals out of this section and
         shifts the ones below it down (see PageGeometry "clear zones"). */
      data-geometry-clear
      className="relative pt-20 pb-20 lg:pt-44 lg:pb-44"
      style={{ overflowX: "clip" }}
    >
      {/* Desktop: full-height background hairline the dots sit on (50%). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px lg:block"
        style={{ background: LINE }}
      />

      {/* Desktop: two section-local circle outlines, as in the design.
          Same 1440px cap as the layout so they stay put relative to it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-[1440px] -translate-x-1/2 lg:block"
      >
        <span className="agenda-circle agenda-circle--a" />
        <span className="agenda-circle agenda-circle--b" />
      </div>

      {/* Layout capped at 1440px (the design width) and centred, so on big
          monitors the intro stays close to the timeline. The 50% line stays
          on the page centre either way. */}
      <div className="relative mx-auto max-w-[1440px] lg:grid lg:grid-cols-[10%_30%_60%]">
        {/* Intro — sticky on desktop while the timeline scrolls past. */}
        <div className="pl-[calc(10%+22px)] pr-6 lg:col-start-2 lg:pl-3 lg:pr-12">
          <div ref={introRef} className="lg:sticky lg:top-32">
            <p
              className="agenda-intro text-base lg:text-lg"
              style={{ color: BLUE, fontWeight: 500 }}
            >
              {t.eyebrow}
            </p>
            <WordReveal
              as="h2"
              text={t.title}
              className="mt-2 text-[#303030] lg:mt-3"
              style={{
                fontFamily: "var(--font-sora), sans-serif",
                fontWeight: 400,
                fontSize: "clamp(2.5rem, 4.2vw, 60px)",
                lineHeight: 1.18,
                letterSpacing: "-0.02em",
              }}
            />
            <p className="agenda-intro mt-5 max-w-[380px] text-[16px] leading-[1.6] text-ink-soft lg:mt-7 lg:text-[18px]">
              {t.body}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div ref={trackRef} className="relative mt-14 lg:col-start-3 lg:mt-0">
          {/* Blue progress fill — geometry set in JS (first dot → evening). */}
          <div
            ref={fillRef}
            aria-hidden
            className="agenda-x pointer-events-none absolute w-px"
            style={{ background: BLUE, transformOrigin: "top", transform: "scaleY(0)" }}
          />

          <ol>
            {t.items.map((item, i) => {
              const isLast = i === t.items.length - 1;
              const grid = (item.speakers?.length ?? 0) > 1;
              return (
                <li
                  key={i}
                  data-dash={item.note ? "true" : undefined}
                  className={`agenda-row relative lg:grid lg:grid-cols-[1fr_5fr] ${
                    isLast ? "" : item.note ? "pb-9 lg:pb-[56px]" : "pb-9 lg:min-h-[114px] lg:pb-10"
                  }`}
                >
                  <span aria-hidden className="agenda-dot agenda-x" />

                  {/* Evening: dashed segment from this dot to the next one. */}
                  {item.note && (
                    <span aria-hidden className="agenda-dash agenda-x">
                      <span className="agenda-dash-line" />
                      <span className="agenda-dash-fill" />
                    </span>
                  )}

                  {/* Time — desktop column */}
                  <div className="agenda-reveal hidden justify-end whitespace-nowrap pr-[21px] text-[16px] leading-6 text-[#303030] lg:flex">
                    {item.time}
                  </div>

                  <div className="relative pl-[calc(10%+22px)] pr-6 lg:pl-[22px] lg:pr-10">
                    {/* Time — mobile, above the title */}
                    <p className="agenda-reveal text-[13px] font-medium leading-5 text-[#303030] lg:hidden">
                      {item.time}
                    </p>

                    {item.tag && (
                      <p
                        className="agenda-reveal mt-1 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] lg:absolute lg:bottom-full lg:left-[22px] lg:mb-[3px] lg:mt-0"
                        style={{ color: BLUE }}
                      >
                        {t.tags[item.tag]}
                      </p>
                    )}

                    <p className="agenda-reveal mt-0.5 max-w-[470px] text-[15px] leading-6 text-[#303030] lg:mt-0 lg:text-[16px]">
                      <MultiLine text={item.title} />
                    </p>

                    {item.speakers && (
                      <div
                        className={`agenda-reveal mt-3.5 ${
                          grid
                            ? "flex flex-col gap-3 lg:grid lg:grid-cols-[max-content_max-content] lg:gap-x-[22px] lg:gap-y-[22px]"
                            : "flex flex-col gap-3"
                        }`}
                      >
                        {item.speakers.map((s, j) => (
                          <SpeakerChip key={j} speaker={s} />
                        ))}
                      </div>
                    )}

                    {item.note && (
                      <p
                        className="agenda-reveal mt-6 text-[15px] leading-6 lg:mt-[58px] lg:text-[16px]"
                        style={{ color: BLUE }}
                      >
                        {item.note}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <style>{`
        /* Horizontal position of the timeline (centre of the hairline).
           Mobile: the page's 10% background line. Desktop: 50% of the page =
           1/6 of the 60% timeline column. */
        .agenda-x { left: 10%; }
        @media (min-width: 1024px) { .agenda-x { left: calc(100% / 6); } }

        .agenda-dot {
          position: absolute;
          top: 10px;
          z-index: 2;
          width: 9px;
          height: 9px;
          margin-left: 0.5px;
          border-radius: 9999px;
          background: #CDCDCD;
          transform: translate(-50%, -50%) scale(0.72);
          transition: background-color 0.45s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @media (min-width: 1024px) { .agenda-dot { top: 12px; } }
        .agenda-dot[data-on="true"] {
          background: ${BLUE};
          transform: translate(-50%, -50%) scale(1);
        }
        .agenda-dot::after {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          border: 1px solid ${BLUE};
          opacity: 0;
        }
        .agenda-dot[data-on="true"]::after { animation: agendaPing 1s ease-out; }
        @keyframes agendaPing {
          0%   { opacity: 0.55; transform: scale(1); }
          100% { opacity: 0;    transform: scale(2.6); }
        }

        /* Dashed evening segment: a paper-coloured mask hides the solid
           background line, a grey dashed line sits on it, and the blue dashed
           fill is revealed by the scroll progress (clip-path). */
        .agenda-dash {
          position: absolute;
          top: 10px;
          bottom: -10px;
          z-index: 1;
          width: 7px;
          margin-left: -3px;
          background: ${PAPER};
        }
        @media (min-width: 1024px) { .agenda-dash { top: 12px; bottom: -12px; } }
        .agenda-dash-line, .agenda-dash-fill {
          position: absolute;
          inset: 0 auto 0 3px;
          width: 1px;
        }
        .agenda-dash-line {
          background-image: repeating-linear-gradient(to bottom, ${LINE} 0 3px, transparent 3px 7px);
        }
        .agenda-dash-fill {
          background-image: repeating-linear-gradient(to bottom, ${BLUE} 0 3px, transparent 3px 7px);
          clip-path: inset(0 0 100% 0);
        }

        .agenda-circle {
          position: absolute;
          width: min(456px, 31.7vw);
          aspect-ratio: 1;
          border: 1px solid ${LINE};
          border-radius: 9999px;
          transform: translate(-50%, -50%);
        }
        .agenda-circle--a { left: 89.6%; top: 30%; animation: agendaDriftA 36s ease-in-out infinite; }
        .agenda-circle--b { left: 24.3%; top: 76%; animation: agendaDriftB 42s ease-in-out infinite; }
        @keyframes agendaDriftA {
          0%, 100% { transform: translate(-50%, -50%); }
          50%      { transform: translate(calc(-50% + 12px), calc(-50% - 10px)); }
        }
        @keyframes agendaDriftB {
          0%, 100% { transform: translate(-50%, -50%); }
          50%      { transform: translate(calc(-50% - 10px), calc(-50% + 12px)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .agenda-dot { transition: none; }
          .agenda-dot::after, .agenda-circle { animation: none; }
        }
      `}</style>
    </section>
  );
}

/** "\n" → line break on desktop only; on mobile the text just wraps. */
function MultiLine({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              <br className="hidden lg:inline" />
              <span className="lg:hidden"> </span>
            </>
          )}
          {p}
        </Fragment>
      ))}
    </>
  );
}

function SpeakerChip({ speaker }: { speaker: AgendaSpeaker }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative block size-8 shrink-0 overflow-hidden rounded-full bg-[#E4E4E4]">
        {speaker.img ? (
          <Image src={speaker.img} alt="" fill sizes="32px" className="object-cover" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7D7D7D"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          >
            <circle cx="12" cy="8" r="3.6" />
            <path d="M5 20c.9-3.6 3.7-5.6 7-5.6s6.1 2 7 5.6" />
          </svg>
        )}
      </span>
      <span className="text-[14px] font-medium leading-5 text-[#303030] lg:text-[15px]">
        {speaker.name}
      </span>
    </div>
  );
}
