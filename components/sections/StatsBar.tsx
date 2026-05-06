import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { stats } from "@/lib/content";

export function StatsBar() {
  return (
    <section className="relative border-y border-hairline bg-paper py-16">
      <Container>
        <ScrollReveal className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="headline text-5xl font-semibold text-ink md:text-6xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-soft">
                {s.label}
              </p>
            </div>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
