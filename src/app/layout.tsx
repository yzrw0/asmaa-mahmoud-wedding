import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { wedding } from "@/config/wedding";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${wedding.couple.bride.split(" ")[0]} & ${wedding.couple.groom.split(" ")[0]} — ${wedding.event.dateLabel}`,
  description: `An invitation to celebrate the wedding of ${wedding.couple.bride} and ${wedding.couple.groom} at ${wedding.venue.landmark}, ${wedding.venue.city}.`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
