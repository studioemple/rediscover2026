"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { useContent } from "@/components/i18n/LanguageProvider";

export function ProgramSection() {
  const { program } = useContent();
  // Desktop uses hover to expand; mobile uses tap (tracked in `active`).
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section className="relative pt-20 pb-20 lg:pt-44 lg:pb-44">
      {/* Header — centered eyebrow, big headline (one line), body in 2 lines */}
      <Container className="flex flex-col items-center px-4 text-center">
        <p
          className="text-sm uppercase tracking-[0.12em] lg:text-base"
          style={{ color: "#1C9DD9", fontWeight: 600 }}
        >
          {program.eyebrow}
        </p>

        <WordReveal
          as="h2"
          text={program.bigHeadline}
          className="section-headline mt-4 text-center text-ink lg:mt-6 2xl:whitespace-nowrap"
        />

        <WordReveal
          as="p"
          text={program.body}
          className="mt-8 max-w-[920px] text-[18px] leading-[1.5] text-ink-soft lg:mt-10 lg:text-[20px]"
        />
      </Container>

      {/* Expanding cards — horizontal accordion on BOTH mobile and desktop.
          On mobile this keeps the row compact (one expanded, the rest as thin
          strips) instead of four tall stacked cards that eat the scroll. */}
      <div
        className="mt-14 flex h-[62vh] max-h-[560px] w-full flex-row gap-2 px-3 lg:mt-24 lg:h-[82vh] lg:max-h-none lg:gap-2"
        onMouseLeave={() => setHovered(null)}
      >
        {program.cards.map((card, i) => {
          const isActive = isMobile ? active === i : hovered === i;
          const isOther = isMobile ? active !== i : hovered !== null && hovered !== i;
          return (
            <ProgramCard
              key={card.author}
              card={card}
              isMobile={isMobile}
              isActive={isActive}
              isOther={isOther}
              onEnter={() => setHovered(i)}
              onTap={(e) => {
                // Mobile: first tap expands the card; a second tap on the
                // already-expanded card follows the link to YouTube.
                if (isMobile && active !== i) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
            />
          );
        })}
      </div>

      {/* Watch playlists CTAs */}
      <Container className="px-4">
        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mt-20">
          {program.watchPlaylists.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/15 bg-paper-pure px-6 py-3.5 text-[11px] uppercase tracking-[0.08em] text-ink transition-all duration-500 hover:border-ink/40 hover:bg-ink hover:text-paper sm:gap-3 sm:px-7 sm:py-4 sm:text-sm sm:tracking-[0.18em] lg:text-base"
            >
              {p.label}
              <span className="flex size-6 items-center justify-center transition-transform duration-500 group-hover:translate-x-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProgramCard({
  card,
  isMobile,
  isActive,
  isOther,
  onEnter,
  onTap,
}: {
  card: { image: string; title: string; author: string; role: string; year: string; video: string; imgFocus?: string };
  isMobile: boolean;
  isActive: boolean;
  isOther: boolean;
  onEnter: () => void;
  onTap: (e: React.MouseEvent) => void;
}) {
  // Width via flex-grow. Mobile is a more dramatic ratio (active wide, the
  // others as thin strips); desktop keeps the gentle 1.7 / 0.72 spread.
  const flexValue = isMobile
    ? isActive
      ? 5
      : 1
    : isActive
      ? 1.7
      : isOther
        ? 0.72
        : 1;

  // On mobile the full text block only shows on the expanded card.
  const collapsed = isMobile && !isActive;

  return (
    <a
      href={card.video}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onEnter}
      onClick={onTap}
      className="relative block h-full min-w-0 overflow-hidden rounded-[18px] bg-ink lg:rounded-[24px]"
      style={{
        flex: flexValue,
        transition: "flex 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Background image */}
      <Image
        src={card.image}
        alt={card.author}
        fill
        sizes="(min-width: 1024px) 34vw, 60vw"
        className="program-card-image object-cover"
        style={card.imgFocus ? { objectPosition: card.imgFocus } : undefined}
      />

      {/* Bottom gradient overlay for text readability */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Dim collapsed strips so the expanded card pops */}
      {collapsed && (
        <div aria-hidden className="absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }} />
      )}

      {/* Full content — text block (bottom-left). Fades out when collapsed. */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col px-4 pb-6 lg:px-6 lg:pb-10"
        style={{
          opacity: collapsed ? 0 : 1,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }}
      >
        {/* Big play button */}
        <span
          className="program-card-play mb-4 flex size-[44px] items-center justify-center rounded-full border-2 border-white lg:mb-6 lg:size-[64px]"
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "white", marginLeft: 3 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>

        <h3
          className="headline text-[15px] leading-[1.16] text-white lg:text-[19px] lg:leading-[1.18]"
          style={{ fontWeight: 600, letterSpacing: "-0.4px" }}
        >
          {card.title}
        </h3>

        <p className="mt-3 text-sm text-white lg:mt-3 lg:text-base">{card.author}</p>

        {/* Role + year on one baseline-aligned row so the (long) role text
            can never run underneath the year — the year reserves its space. */}
        <div className="mt-1 flex items-end justify-between gap-3">
          <p
            className="min-w-0 text-xs lg:text-[15px]"
            style={{ color: "#56C3E5", fontWeight: 300 }}
          >
            {card.role}
          </p>

          {/* Year — desktop only */}
          <span
            className="hidden shrink-0 translate-y-[1px] tabular-nums leading-none lg:block"
            style={{
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: "clamp(1.05rem, 1.2vw, 1.35rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {card.year}
          </span>
        </div>
      </div>

      {/* Year — mobile, top-right corner of the expanded card. */}
      {isMobile && isActive && (
        <span
          className="absolute right-4 top-4 tabular-nums leading-none lg:hidden"
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "1.05rem",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {card.year}
        </span>
      )}

      {/* Collapsed strip indicator (mobile) — small play + vertical year. */}
      {collapsed && (
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          style={{ pointerEvents: "none" }}
        >
          <span className="flex size-8 items-center justify-center rounded-full border border-white/70">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {card.year}
          </span>
        </div>
      )}

      <style>{`
        .program-card-image {
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        a:hover .program-card-image {
          transform: scale(1.04);
        }
        a:hover .program-card-play {
          background: white;
        }
        a:hover .program-card-play svg {
          color: #0A0A0F !important;
        }
      `}</style>
    </a>
  );
}
