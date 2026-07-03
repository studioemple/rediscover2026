"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { useContent } from "@/components/i18n/LanguageProvider";

export function FAQSection() {
  const { faqs, faqHeading } = useContent();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative px-4 pt-20 pb-20 lg:pt-44 lg:pb-44">
      <Container className="flex flex-col items-center">
        <WordReveal
          as="h2"
          text={faqHeading}
          className="section-headline text-center text-ink 2xl:whitespace-nowrap"
        />

        <div className="mt-12 w-full max-w-[900px] lg:mt-16">
          {faqs.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="border-b border-ink/10 transition-colors duration-300"
      style={{
        borderBottomColor: isOpen ? "rgba(10,10,15,0.2)" : undefined,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors duration-300 hover:opacity-70 lg:gap-6 lg:py-8"
        style={{ cursor: "pointer" }}
      >
        <span
          className="headline text-[17px] leading-[1.25] text-ink lg:text-[26px] lg:leading-[1.3]"
          style={{ fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          {q}
        </span>
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-500 lg:size-12"
          style={{
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            background: isOpen ? "#1C9DD9" : "transparent",
            color: isOpen ? "#FFFFFF" : "#0A0A0F",
            borderColor: isOpen ? "transparent" : undefined,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      {/* Animated panel — height transitions via max-height */}
      <div
        ref={panelRef}
        className="grid overflow-hidden transition-[grid-template-rows] duration-500"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className="pb-7 pr-4 text-[15px] leading-[1.5] text-ink-soft lg:pb-9 lg:pr-12 lg:text-[19px] lg:leading-[1.55]"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 0.5s, transform 0.5s",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: isOpen ? "0.1s" : "0s",
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
