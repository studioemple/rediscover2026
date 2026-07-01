"use client";

import { useEffect, useRef } from "react";
import {
  ensureGsap,
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/lib/animations";

export function AftermovieSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureGsap();
    if (!sectionRef.current || !cardRef.current || !videoRef.current) return;
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(sectionRef.current);

    const startWidth = () => Math.min(1240, window.innerWidth * 0.86);
    const startHeight = () => startWidth() * (9 / 16);

    if (prefersReducedMotion()) {
      gsap.set(cardRef.current, {
        width: startWidth(),
        height: startHeight(),
        borderRadius: 28,
      });
      return () => observer.disconnect();
    }

    const card = cardRef.current;
    const section = sectionRef.current;
    const label = labelRef.current;

    gsap.set(card, {
      width: startWidth(),
      height: startHeight(),
      borderRadius: 28,
    });

    const zoomTween = gsap.to(card, {
      width: () => window.innerWidth,
      height: () => window.innerHeight,
      borderRadius: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top top",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    const labelTween = label
      ? gsap.to(label, {
          opacity: 0,
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top center",
            scrub: 0.5,
          },
        })
      : null;

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 50);

    return () => {
      clearTimeout(refreshTimer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      zoomTween.scrollTrigger?.kill();
      zoomTween.kill();
      labelTween?.scrollTrigger?.kill();
      labelTween?.kill();
    };
  }, []);

  return (
    <section
      id="aftermovie"
      ref={sectionRef}
      aria-label="Rediscover 2025 aftermovie"
      className="relative flex w-full items-center justify-center overflow-hidden"
      style={{ height: "100vh" }}
    >
      <div
        ref={labelRef}
        className="pointer-events-none absolute top-10 left-1/2 z-20 max-w-[calc(100vw-2rem)] -translate-x-1/2 whitespace-nowrap rounded-full border border-hairline bg-paper/80 px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft backdrop-blur-md lg:top-16 lg:text-xs lg:tracking-[0.28em]"
      >
        Rediscover 2025 Aftermovie
      </div>

      <div
        ref={cardRef}
        className="relative overflow-hidden bg-black shadow-[0_40px_120px_-40px_rgba(10,10,15,0.4)]"
        style={{ borderRadius: "28px" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/aftermovie.mp4"
          muted
          playsInline
          loop
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
      </div>
    </section>
  );
}
