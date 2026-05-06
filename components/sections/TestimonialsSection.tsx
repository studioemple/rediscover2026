"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { testimonials } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/animations";

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const total = testimonials.quotes.length;

  /* Auto-advance every 6s, pause on hover */
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion() || paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % total), 6000);
    return () => clearInterval(id);
  }, [paused, total]);

  const prev = () => setActive((i) => (i - 1 + total) % total);
  const next = () => setActive((i) => (i + 1) % total);

  return (
    <section className="relative bg-paper px-4 pt-30 pb-30 lg:pt-44 lg:pb-44">
      <Container className="flex flex-col items-center text-center">
        <p
          className="text-sm uppercase tracking-[0.2em] lg:text-base"
          style={{ color: "#1C9DD9" }}
        >
          {testimonials.eyebrow}
        </p>
        <WordReveal
          as="h2"
          text={testimonials.bigHeadline}
          className="headline mt-4 max-w-[800px] text-[36px] leading-[1.1] tracking-[-1.44px] text-ink lg:mt-6 lg:text-[54px] lg:tracking-[-2.16px]"
        />

        {/* Quote stage — fixed-height container, layered fading quotes */}
        <div
          className="relative mt-14 w-full max-w-[1100px] lg:mt-20"
          style={{ minHeight: 280 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Soft blue glow behind */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mx-auto"
            style={{
              width: "70%",
              left: "15%",
              filter: "blur(120px)",
              background:
                "radial-gradient(ellipse at center, rgba(28,157,217,0.18), transparent 60%)",
            }}
          />

          {testimonials.quotes.map((q, i) => (
            <div
              key={i}
              aria-hidden={i !== active}
              className="testimonial-slide absolute inset-0 flex flex-col items-center justify-center px-6"
              data-active={i === active}
            >
              {/* Big quotation mark */}
              <svg
                width="44"
                height="44"
                viewBox="0 0 32 32"
                aria-hidden
                style={{ color: "#1C9DD9", opacity: 0.5 }}
              >
                <path
                  d="M10 8H4v8h4v8H0V8a4 4 0 0 1 4-4h6v4zm18 0h-6v8h4v8h-8V8a4 4 0 0 1 4-4h6v4z"
                  fill="currentColor"
                />
              </svg>

              <blockquote
                className="headline mt-6 max-w-[860px] text-[24px] leading-[1.35] text-ink lg:text-[34px] lg:leading-[1.3]"
                style={{ fontWeight: 350, letterSpacing: "-0.02em" }}
              >
                {q.text}
              </blockquote>

              <div className="mt-8 flex items-center gap-3">
                <span className="text-base font-medium text-ink">{q.author}</span>
                <span aria-hidden className="size-1 rounded-full bg-ink-soft" />
                <span className="text-sm text-ink-soft">{q.role}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center gap-5 lg:mt-16">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper lg:size-14"
            style={{ cursor: "pointer" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {testimonials.quotes.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className="testimonial-dot"
                data-active={i === active}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper lg:size-14"
            style={{ cursor: "pointer" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </Container>

      <style>{`
        .testimonial-slide {
          opacity: 0;
          transform: translateY(20px);
          filter: blur(8px);
          transition:
            opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .testimonial-slide[data-active="true"] {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
          pointer-events: auto;
        }
        .testimonial-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(10, 10, 15, 0.18);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
        }
        .testimonial-dot:hover {
          background: rgba(10, 10, 15, 0.4);
        }
        .testimonial-dot[data-active="true"] {
          width: 28px;
          background: #1c9dd9;
        }
      `}</style>
    </section>
  );
}
