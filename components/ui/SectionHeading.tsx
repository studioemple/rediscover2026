import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-soft">
          {eyebrow}
        </p>
      )}
      <h2 className="headline text-4xl font-semibold leading-[1.05] text-ink md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
          {subtitle}
        </p>
      )}
    </header>
  );
}
