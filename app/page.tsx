"use client";

import { useEffect, useState } from "react";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { FinalHero } from "@/components/intro/FinalHero";
import { PageGeometry } from "@/components/geometric/PageGeometry";
import { AftermovieSection } from "@/components/sections/AftermovieSection";
import { ValuePropSection } from "@/components/sections/ValuePropSection";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { SpeakersSection } from "@/components/sections/SpeakersSection";
import { ProgramSection } from "@/components/sections/ProgramSection";
import { EventGallerySection } from "@/components/sections/EventGallerySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { RegisterSection } from "@/components/sections/RegisterSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";
import { ensureGsap, ScrollTrigger } from "@/lib/animations";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (!introDone) return;
    ensureGsap();
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [introDone]);

  return (
    <main
      className={`relative bg-paper ${introDone ? "" : "overflow-hidden"}`}
      style={introDone ? {} : { height: "100vh" }}
    >
      <IntroSequence onComplete={() => setIntroDone(true)} />
      {/* Page-wide geometric backdrop — only after intro completes */}
      {introDone && <PageGeometry />}
      <FinalHero shouldAnimate={introDone} />
      <AftermovieSection />
      <ValuePropSection />
      <AudienceSection />
      <ProgramSection />
      <SpeakersSection />
      <EventGallerySection />
      <TestimonialsSection />
      <PartnersSection />
      <RegisterSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
