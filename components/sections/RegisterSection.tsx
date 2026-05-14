"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { register } from "@/lib/content";

/* 4 floating event photos around the form — adds "real event" vibe */
const FLOATERS = [
  { src: "/event/03.png", className: "left-[3%] top-[12%] size-[130px] -rotate-6 lg:size-[180px]", dur: 8 },
  { src: "/event/08.png", className: "right-[4%] top-[8%] size-[120px] rotate-5 lg:size-[170px]",  dur: 9 },
  { src: "/event/11.png", className: "left-[6%] bottom-[10%] size-[140px] rotate-3 lg:size-[200px]", dur: 7 },
  { src: "/event/14.png", className: "right-[5%] bottom-[8%] size-[125px] -rotate-4 lg:size-[180px]", dur: 8.5 },
] as const;

export function RegisterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      id="register"
      className="relative overflow-hidden px-4 pt-30 pb-30 lg:pt-44 lg:pb-44"
    >
      {/* Layered soft blue glows reminiscent of rediscover's blurred form */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/2 h-[500px] w-[700px] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(28,157,217,0.22), transparent 65%)",
          filter: "blur(120px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-1/2 h-[500px] w-[700px] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(28,157,217,0.18), transparent 65%)",
          filter: "blur(120px)",
        }}
      />

      {/* Floating event photos at the corners */}
      {FLOATERS.map((f, i) => (
        <div
          key={f.src}
          aria-hidden
          className={`pointer-events-none absolute hidden overflow-hidden lg:block ${f.className}`}
          style={{
            borderRadius: 22,
            boxShadow:
              "0 30px 60px -25px rgba(10,10,15,0.3), 0 10px 22px -10px rgba(10,10,15,0.18)",
            animation: `registerFloat${i % 2} ${f.dur}s ease-in-out ${i * 0.5}s infinite`,
            opacity: 0.85,
          }}
        >
          <Image
            src={f.src}
            alt=""
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
      ))}

      <Container className="relative flex flex-col items-center text-center">
        <WordReveal
          as="h2"
          text={register.bigHeadline}
          className="headline max-w-[1200px] leading-[1.02] text-ink"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 112px)",
            fontWeight: 600,
            letterSpacing: "-3.4px",
          }}
        />

        {/* Big CTA pill */}
        {!submitted ? (
          <form
            onSubmit={submit}
            className="mt-12 flex w-full max-w-[640px] flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:mt-16"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={register.emailPlaceholder}
              required
              aria-label="Email"
              className="flex-1 rounded-full border border-ink/15 bg-paper-pure px-7 py-5 text-base text-ink placeholder:text-ink-muted focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-[#1C9DD9]/30 lg:text-lg"
            />
            <button
              type="submit"
              className="register-cta inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-5 text-base font-medium text-paper transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_-20px_rgba(28,157,217,0.6)] lg:text-lg"
              style={{ cursor: "pointer" }}
            >
              {register.cta}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="mt-12 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-base text-paper lg:mt-16 lg:text-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
            {register.success}
          </div>
        )}

        {/* Alt CTA */}
        <a
          href="#aftermovie"
          className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-ink-soft transition-colors duration-300 hover:text-ink lg:mt-10"
        >
          {register.altCta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z" />
          </svg>
        </a>
      </Container>

      <style>{`
        @keyframes registerFloat0 {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%      { transform: translate3d(0, -12px, 0) rotate(1deg); }
        }
        @keyframes registerFloat1 {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%      { transform: translate3d(0, 10px, 0) rotate(-1deg); }
        }
      `}</style>
    </section>
  );
}
