"use client";

import Image from "next/image";

const ALL = [
  "/event/01.png", "/event/02.png", "/event/03.png", "/event/04.png",
  "/event/05.png", "/event/06.png", "/event/07.png", "/event/08.png",
  "/event/09.png", "/event/10.png", "/event/11.png", "/event/12.png",
  "/event/13.png", "/event/14.png", "/event/15.png",
];

/* Two infinite marquee rows of event photos with slight tilts.
   Bottom row scrolls the opposite direction at a different speed
   for organic parallax. */
const ROW_A = ALL.slice(0, 8).map((src, i) => ({
  src,
  rot: i % 2 === 0 ? -2.5 : 2,
}));
const ROW_B = ALL.slice(7, 15).reverse().map((src, i) => ({
  src,
  rot: i % 2 === 0 ? 2.5 : -2,
}));

export function EventGallerySection() {
  return (
    <section
      className="relative py-28 lg:py-40"
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      {/* Subtle blue glow underneath */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[1400px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(28,157,217,0.08), transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative">
        <MarqueeRow items={ROW_A} direction="left"  speed={95} />
        <div className="-mt-2 lg:-mt-4" />
        <MarqueeRow items={ROW_B} direction="right" speed={115} />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
  speed,
}: {
  items: { src: string; rot: number }[];
  direction: "left" | "right";
  speed: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      aria-hidden
      // overflow-x: clip lets us hide the horizontal marquee overflow while
      // letting the rotated card corners breathe vertically (otherwise the
      // tilted cards get their top/bottom edges chopped off).
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      <div
        className="flex shrink-0 gap-6 py-6 lg:gap-8 lg:py-10"
        style={{
          width: "max-content",
          animation: `${
            direction === "left" ? "marquee-left" : "marquee-right"
          } ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            className="relative shrink-0"
            style={{
              width: 440,
              height: 440,
              transform: `rotate(${item.rot}deg)`,
            }}
          >
            <div
              className="absolute inset-0 overflow-hidden bg-surface"
              style={{
                borderRadius: 28,
                boxShadow:
                  "0 40px 80px -30px rgba(10,10,15,0.3), 0 12px 26px -10px rgba(10,10,15,0.15)",
              }}
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="440px"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
