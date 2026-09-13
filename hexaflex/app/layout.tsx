import type { Metadata } from "next";
import localFont from "next/font/local";
import { copy } from "../lib/content";
import "./globals.css";
const lora = localFont({
  src: "./fonts/Lora.ttf",
  variable: "--font-heading",
  display: "swap",
  weight: "400 700",
});
const inter = localFont({
  src: "./fonts/Inter.ttf",
  variable: "--font-body",
  display: "swap",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: copy.title,
  description: copy.subtitle,
  robots: { index: false, follow: false },
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${lora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
