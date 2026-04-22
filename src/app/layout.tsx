import type { Metadata } from "next";
import { Noto_Sans_JP, Outfit } from "next/font/google";
import { ReducedMotion } from "@/components/reduced-motion";
import "./globals.css";
import "./profile.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "べいちゃん | パーソナルトレーナー",
  description: "あなたの体と向き合う、一番の味方になります。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJp.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <ReducedMotion />
        {children}
      </body>
    </html>
  );
}
