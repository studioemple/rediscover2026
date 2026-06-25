"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { testimonials } from "@/lib/content";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────
   STAGGER TESTIMONIALS — adapted from 21st.dev (vaib215) for our
   light cream palette. Side cards are white with ink text; the
   centered hero card flips to ink-on-paper for contrast.
   No avatar images — we render 5 gold stars instead, since the
   testimonials are anonymous attendee quotes.
   ───────────────────────────────────────────────────────────────── */

type Quote = (typeof testimonials.quotes)[number] & { tempId: number };

const INITIAL: Quote[] = testimonials.quotes.map((q, i) => ({
  ...q,
  tempId: i,
}));

export function TestimonialsSection() {
  return (
    <section className="relative pt-30 pb-30 lg:pt-44 lg:pb-44">
      <Container className="relative px-4">
        {/* Header — eyebrow + centered headline */}
        <div className="flex flex-col items-center text-center">
          <p
            className="text-sm uppercase tracking-[0.12em] lg:text-base"
            style={{ color: "#1C9DD9", fontWeight: 600 }}
          >
            {testimonials.eyebrow}
          </p>
          <WordReveal
            as="h2"
            text={testimonials.bigHeadline}
            className="section-headline mt-4 text-ink lg:mt-6 2xl:whitespace-nowrap"
          />
        </div>
      </Container>

      {/* Stagger slider */}
      <div className="mt-16 lg:mt-24">
        <StaggerTestimonials />
      </div>
    </section>
  );
}

/* ──────────────────── Stagger slider ──────────────────── */

function StaggerTestimonials() {
  const [cardSize, setCardSize] = useState(365);
  const [list, setList] = useState<Quote[]>(INITIAL);

  useEffect(() => {
    const updateSize = () => {
      // Three breakpoints — mobile shrinks the cards enough that 3 always
      // fit in the visible stagger (center + one on each side).
      if (window.matchMedia("(min-width: 1024px)").matches) setCardSize(365);
      else if (window.matchMedia("(min-width: 640px)").matches) setCardSize(300);
      else setCardSize(230);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMove = (steps: number) => {
    setList((curr) => {
      const next = [...curr];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = next.shift();
          if (!item) return curr;
          next.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = next.pop();
          if (!item) return curr;
          next.unshift({ ...item, tempId: Math.random() });
        }
      }
      return next;
    });
  };

  /* Height scales with card size so the stage hugs the cards on mobile
     instead of leaving a giant empty band. */
  const stageHeight = cardSize + 220;

  return (
    <div
      className="relative w-full"
      style={{ height: stageHeight, overflowX: "clip", overflowY: "visible" }}
    >
      {list.map((q, index) => {
        const position =
          list.length % 2
            ? index - (list.length + 1) / 2
            : index - list.length / 2;
        return (
          <StaggerCard
            key={q.tempId}
            quote={q}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      {/* Nav arrows */}
      <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        <ArrowBtn dir="left" onClick={() => handleMove(-1)} />
        <ArrowBtn dir="right" onClick={() => handleMove(1)} />
      </div>
    </div>
  );
}

/* ──────────────────── Single card ──────────────────── */

const SQRT_5000 = Math.sqrt(5000);

function StaggerCard({
  position,
  quote,
  handleMove,
  cardSize,
}: {
  position: number;
  quote: Quote;
  handleMove: (steps: number) => void;
  cardSize: number;
}) {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      role="button"
      aria-label={isCenter ? "Centered testimonial" : "Bring testimonial to center"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleMove(position);
        }
      }}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer p-7 transition-all duration-500 ease-out sm:p-9",
        isCenter ? "z-10" : "z-0",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        background: isCenter ? "#0A0A0F" : "#FFFFFF",
        color: isCenter ? "#F3F3F3" : "#0A0A0F",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: isCenter ? "#0A0A0F" : "#E2E2E2",
        clipPath:
          "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -55 : position % 2 ? 18 : -18}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.6 : -2.6}deg)
        `,
        boxShadow: isCenter
          ? "0px 10px 0px 4px #D9D9D9, 0 40px 80px -30px rgba(10,10,15,0.35)"
          : "0 18px 40px -22px rgba(10,10,15,0.18)",
      }}
    >
      {/* Notch diagonal hairline (top-right corner cut) */}
      <span
        aria-hidden
        className="absolute block origin-top-right rotate-45"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
          background: isCenter ? "#1F1F26" : "#E2E2E2",
        }}
      />

      {/* 5 stars (replaces avatar image from original) */}
      <div className="mb-5 flex items-center gap-[2px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isCenter ? "#F5D26B" : "#E8B948"}
            aria-hidden
          >
            <path d="M12 2L14.618 9.172H22.5L16.122 13.914L18.74 21.086L12 16.343L5.26 21.086L7.878 13.914L1.5 9.172H9.382L12 2Z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <h3
        className="headline text-[17px] leading-[1.35] sm:text-[20px]"
        style={{
          fontWeight: 500,
          letterSpacing: "-0.4px",
        }}
      >
        “{quote.text}”
      </h3>
    </div>
  );
}

/* ──────────────────── Nav button ──────────────────── */

function ArrowBtn({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Previous testimonial" : "Next testimonial"}
      className="group flex size-12 items-center justify-center border-2 transition-colors focus-ring sm:size-14"
      style={{
        background: "#FFFFFF",
        borderColor: "#E2E2E2",
        color: "#0A0A0F",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#0A0A0F";
        e.currentTarget.style.borderColor = "#0A0A0F";
        e.currentTarget.style.color = "#F3F3F3";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#FFFFFF";
        e.currentTarget.style.borderColor = "#E2E2E2";
        e.currentTarget.style.color = "#0A0A0F";
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {dir === "left" ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}
