import Image from "next/image";

/**
 * Minimal clean footer — just leaves breathing room and a hairline.
 * Three subtle links: email · Rentlio logo · website.
 */
export function Footer() {
  return (
    <footer className="relative w-full px-4 pt-4 pb-10 lg:pt-28 lg:pb-12">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-8 border-t border-ink/8 pt-8 sm:flex-row sm:justify-between sm:gap-6 lg:pt-20">
        <a
          href="mailto:rediscover@rentl.io"
          className="text-sm text-ink-soft transition-colors duration-300 hover:text-ink lg:text-base"
        >
          rediscover@rentl.io
        </a>

        <a
          href="https://www.rentl.io"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rentlio"
          className="opacity-70 transition-opacity duration-300 hover:opacity-100"
        >
          <Image
            src="/rentlio-logo.svg"
            alt="Rentlio"
            width={120}
            height={28}
            className="h-7 w-auto lg:h-8"
          />
        </a>

        <a
          href="https://www.rentl.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink-soft transition-colors duration-300 hover:text-ink lg:text-base"
        >
          www.rentl.io
        </a>
      </div>

      {/* Sub-footer — privacy policy + copyright */}
      <div className="mx-auto mt-8 flex max-w-[1180px] flex-col items-center gap-3 text-xs text-ink-soft sm:flex-row sm:justify-between lg:mt-10 lg:text-sm">
        <p>© {new Date().getFullYear()} Rentlio. All rights reserved.</p>
        <a
          href="https://rediscover.rentl.io/en/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-300 hover:text-ink"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
