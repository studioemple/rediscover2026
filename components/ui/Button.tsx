import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline";

// Single source of truth for CTA sizing — every <Button> matches the hero
// "Join the waiting list" pill. Tweak here to keep all CTAs uniform.
const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-9 py-4 text-base font-medium transition-all duration-200 ease-premium cursor-pointer focus-ring lg:px-11 lg:py-5 lg:text-lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-accent hover:shadow-[0_8px_30px_rgba(30,58,138,0.25)]",
  ghost:
    "bg-transparent text-ink hover:bg-surface",
  outline:
    "border border-hairline bg-paper/60 text-ink hover:border-ink hover:bg-paper",
};

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  variant = "primary",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      {children}
    </a>
  );
}
