"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { program } from "@/lib/content";

export function ProgramSection() {
  return (
    <section className="relative bg-paper px-4 pt-30 pb-30 lg:pt-44 lg:pb-44">
      <Container>
        {/* Header — eyebrow blue + headline + body on the right */}
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-[640px]">
            <p
              className="text-sm uppercase tracking-[0.2em] lg:text-base"
              style={{ color: "#1C9DD9" }}
            >
              {program.eyebrow}
            </p>
            <WordReveal
              as="h2"
              text={program.bigHeadline}
              className="headline mt-4 text-[36px] leading-[1.1] tracking-[-1.44px] text-ink lg:mt-6 lg:text-[54px] lg:tracking-[-2.16px]"
            />
          </div>
          <div className="lg:max-w-[480px] lg:pb-2">
            <WordReveal
              as="p"
              text={program.body}
              className="text-[18px] leading-[1.5] text-ink-soft lg:text-right"
            />
          </div>
        </div>

        {/* 3 speaker cards */}
        <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {program.cards.map((card) => (
            <a
              key={card.author}
              href={card.video}
              target="_blank"
              rel="noopener noreferrer"
              className="program-card group flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-surface lg:rounded-[22px]">
                <Image
                  src={card.image}
                  alt={card.author}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="program-card-img object-cover"
                />
                {/* Play button overlay (appears on hover) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/30">
                  <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 transition-all duration-500 group-hover:opacity-100 lg:size-20">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>

              <h3
                className="headline mt-7 whitespace-pre-line text-[22px] leading-[1.25] text-ink lg:text-[26px]"
                style={{ fontWeight: 500 }}
              >
                {card.title}
              </h3>
              <p className="mt-4 text-base text-ink lg:text-lg">{card.author}</p>
              <p
                className="mt-1 text-sm"
                style={{ color: "#1C9DD9", fontWeight: 300 }}
              >
                {card.role}
              </p>
            </a>
          ))}
        </div>

        {/* Watch playlists CTAs */}
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

      <style>{`
        .program-card-img {
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .program-card:hover .program-card-img {
          transform: scale(1.04);
        }
      `}</style>
    </section>
  );
}
