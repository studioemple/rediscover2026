"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { partners, partnerTierMeta } from "@/lib/content";

export function PartnersSection() {
  return (
    <section className="relative overflow-hidden bg-paper px-4 pt-30 pb-30 lg:pt-44 lg:pb-44">
      {/* Soft blue glow behind the Mastercard hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(28,157,217,0.18), transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <Container className="relative">
        {/* Header — eyebrow title + side text */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <WordReveal
            as="h2"
            text={partners.eyebrow}
            className="headline text-[34px] leading-[1.1] tracking-[-1.36px] text-ink lg:text-[48px] lg:tracking-[-1.92px]"
          />
          <p className="max-w-[520px] text-[16px] leading-[1.5] text-ink-soft lg:text-right lg:text-[18px]">
            {partners.body}
          </p>
        </div>

        {/* General partner — featured large logo */}
        <div className="mt-20 flex flex-col items-center lg:mt-28">
          <div className="relative h-[140px] w-[260px] lg:h-[180px] lg:w-[340px]">
            <Image
              src={partners.general.logo}
              alt={partners.general.name}
              fill
              sizes="340px"
              className="object-contain"
            />
          </div>
          <TierBadge tier="general" />
        </div>

        {/* Partner grid */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-12 lg:mt-24 lg:gap-x-16 lg:gap-y-16">
          {partners.list.map((p) => (
            <div
              key={p.name}
              className="partner-item flex flex-col items-center gap-4"
            >
              <div className="relative h-[48px] w-[150px] lg:h-[60px] lg:w-[180px]">
                <Image
                  src={p.logo}
                  alt={p.name}
                  fill
                  sizes="180px"
                  className="object-contain"
                  style={{
                    filter: "brightness(0) saturate(100%) opacity(0.8)",
                  }}
                />
              </div>
              <TierBadge tier={p.tier} />
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        .partner-item {
          opacity: 0.85;
          transition:
            opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .partner-item:hover {
          opacity: 1;
          transform: translateY(-3px);
        }
        .partner-item:hover img {
          filter: brightness(0) saturate(100%) opacity(1) !important;
        }
      `}</style>
    </section>
  );
}

function TierBadge({ tier }: { tier: keyof typeof partnerTierMeta }) {
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
