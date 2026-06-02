import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Rediscover 2026 The Biggest Hotel-Tech Event in the Region",
  description:
    "Where leaders meet technology. The 5th edition of Rediscover takes place in November 2026 at Falkensteiner Punta Skala Resort, Zadar.",
  metadataBase: new URL("https://rediscover.rentl.io"),
  openGraph: {
    title: "Rediscover 2026 What now?",
    description:
      "The biggest hotel-tech event in the region. November 2026 · Falkensteiner Punta Skala Resort, Zadar.",
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
      <body className="bg-paper text-ink antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
