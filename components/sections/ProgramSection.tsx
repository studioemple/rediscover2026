"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { program } from "@/lib/content";

export function ProgramSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative pt-30 pb-30 lg:pt-44 lg:pb-44">
      {/* Header — centered eyebrow, big headline (one line), body in 2 lines */}
      <Container className="flex flex-col items-center px-4 text-center">
        <p
          className="text-sm uppercase tracking-[0.2em] lg:text-base"
          style={{ color: "#1C9DD9" }}
        >
          {program.eyebrow}
        </p>

        <WordReveal
          as="h2"
          text={program.bigHeadline}
          className="headline mt-4 leading-[1.0] text-ink lg:mt-6"
          style={{
            fontSize: "clamp(2.25rem, 5.8vw, 104px)",
            fontWeight: 600,
            letterSpacing: "-3px",
            whiteSpace: "nowrap",
          }}
        />

        <WordReveal
          as="p"
          text={program.body}
          className="mt-8 max-w-[920px] text-[18px] leading-[1.5] text-ink-soft lg:mt-10 lg:text-[20px]"
        />
      </Container>

      {/* Expanding cards — full-bleed (no Container) so they fill the screen */}
      <div
        className="mt-16 flex w-full flex-col gap-3 px-3 lg:mt-24 lg:h-[82vh] lg:flex-row lg:gap-2 lg:px-3"
        onMouseLeave={() => setHovered(null)}
      >
        {program.cards.map((card, i) => (
          <ProgramCard
            key={card.author}
            card={card}
            isHovered={hovered === i}
            isOtherHovered={hovered !== null && hovered !== i}
            onEnter={() => setHovered(i)}
          />
        ))}
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
              className="group inline-flex items-center gap-3 rounded-full border border-ink/15 bg-paper-pure px-7 py-4 text-sm uppercase tracking-[0.18em] text-ink transition-all duration-500 hover:border-ink/40 hover:bg-ink hover:text-paper lg:text-base"
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
  isHovered,
  isOtherHovered,
  onEnter,
}: {
  card: typeof program.cards[number];
  isHovered: boolean;
  isOtherHovered: boolean;
  onEnter: () => void;
}) {
  // Flex grow controls width: hovered → 1.7, others → 0.7, rest → 1.
  const flexValue = isHovered ? 1.7 : isOtherHovered ? 0.72 : 1;

  return (
    <a
      href={card.video}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onEnter}
      className="relative block aspect-[3/4] min-h-[480px] w-full overflow-hidden rounded-[24px] bg-ink lg:aspect-auto lg:min-h-0 lg:h-full"
      style={{
        flex: flexValue,
        transition: "flex 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Background image */}
      <Image
        src={card.image}
        alt={card.author}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="program-card-image object-cover"
        priority
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

      {/* Content — play button + title + name + role */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col px-7 pb-9 lg:px-10 lg:pb-12">
        {/* Big play button */}
        <span
          className="program-card-play mb-7 flex size-[68px] items-center justify-center rounded-full border-2 border-white lg:size-[76px]"
          aria-hidden
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ color: "white", marginLeft: 3 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>

        <h3
          className="headline text-[26px] leading-[1.15] text-white lg:text-[36px] lg:leading-[1.1]"
          style={{ fontWeight: 600, letterSpacing: "-1.2px" }}
        >
          {card.title}
        </h3>

        <p className="mt-5 text-lg text-white lg:text-xl">{card.author}</p>
        <p
          className="mt-1 text-sm lg:text-base"
          style={{ color: "#56C3E5", fontWeight: 300 }}
        >
          {card.role}
        </p>
      </div>

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
