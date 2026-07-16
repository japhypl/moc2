import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const headingFont = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading-family",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Moc Płomienia",
    template: "%s | Moc Płomienia",
  },
  description:
    "Moc Płomienia — wydarzenia, nagrania VOD i warsztaty dla kobiet.",
  metadataBase: new URL("https://mocplomienia.pl"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
