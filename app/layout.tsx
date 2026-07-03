import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Default (English) metadata for first paint / crawlers. The language switcher
// updates document.title + meta description client-side for HR / SLO.
export const metadata: Metadata = {
  title: "Rentlio Rediscover 2026 | Regional Hotel-Tech Event",
  description:
    "The 5th Rediscover, the region's biggest hotel-tech event. November 2026, Falkensteiner Punta Skala.",
  metadataBase: new URL("https://rediscover.rentl.io"),
  openGraph: {
    title: "Rentlio Rediscover 2026 | Regional Hotel-Tech Event",
    description:
      "The 5th Rediscover, the region's biggest hotel-tech event. November 2026, Falkensteiner Punta Skala.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink antialiased" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
