"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { register } from "@/lib/content";

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
      className="relative overflow-hidden bg-paper px-4 pt-30 pb-30 lg:pt-44 lg:pb-44"
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

      <Container className="relative flex flex-col items-center text-center">
        <WordReveal
          as="h2"
          text={register.bigHeadline}
          className="headline max-w-[1000px] text-[36px] leading-[1.15] tracking-[-1.44px] text-ink lg:text-[60px] lg:leading-[1.1] lg:tracking-[-2.4px]"
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
    </section>
  );
}
