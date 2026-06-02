"use client";

import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { valueProp } from "@/lib/content";

export function ValuePropSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-44 pb-32 lg:pt-72 lg:pb-44">
      <Container className="flex flex-col items-center text-center">
        {/* Mission statement — replaces the years row */}
        <p
          className="text-sm uppercase tracking-[0.22em] lg:text-base"
          style={{
            color: "#1C9DD9",
            fontFamily: "var(--font-sora), sans-serif",
            fontWeight: 500,
          }}
        >
          ON A MISSION TO UPGRADE HOSPITALITY SINCE 2022.
        </p>

        {/* Headline — single line on most viewports */}
        <WordReveal
          as="h2"
          text={valueProp.bigHeadline}
          className="headline mt-8 leading-[1.0] text-ink lg:mt-12"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 96px)",
            whiteSpace: "nowrap",
            fontWeight: 600,
            letterSpacing: "-3px",
          }}
        />

        {/* Body */}
        <div className="mt-7 max-w-[680px] lg:mt-10">
          <WordReveal
            as="p"
            text={valueProp.body}
            className="text-[18px] leading-[1.5] text-ink-soft lg:text-[20px]"
          />
        </div>
      </Container>

      {/* Tilted marquees — black bg + white text on top, paper bg + ink text on bottom */}
      <div className="relative mt-20 lg:mt-28" aria-hidden>
        <div
          className="relative -mx-[10vw]"
          style={{ transform: "rotate(-2.2deg)" }}
        >
          <div className="bg-ink py-6 lg:py-9">
            <TopicsRow
              direction="left"
              speed={75}
              topics={valueProp.topics}
              textColor="#F3F3F3"
            />
          </div>
        </div>

        <div
          className="relative -mx-[10vw] -mt-2 lg:-mt-3"
          style={{ transform: "rotate(2.2deg)" }}
        >
          <div className="border-y border-hairline bg-paper-pure py-6 lg:py-9">
            <TopicsRow
              direction="right"
              speed={95}
              topics={valueProp.topics}
              textColor="#0A0A0F"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TopicsRow({
  direction,
  speed,
  topics,
  textColor,
}: {
  direction: "left" | "right";
  speed: number;
  topics: readonly string[];
  textColor: string;
}) {
  const repeated = [...topics, ...topics, ...topics];
  return (
    <div className="overflow-hidden">
      <div
        className="flex shrink-0 whitespace-nowrap"
        style={{
          animation: `${
            direction === "left" ? "marquee-left" : "marquee-right"
          } ${speed}s linear infinite`,
          color: textColor,
        }}
      >
        {repeated.map((topic, i) => (
          <span
            key={`${topic}-${i}`}
            className="headline text-[36px] leading-[1.1] tracking-[-0.8px] lg:text-[68px] lg:tracking-[-2px]"
            style={{ fontWeight: 400 }}
          >
            {topic}
            <span className="mx-6 opacity-40 lg:mx-10">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
