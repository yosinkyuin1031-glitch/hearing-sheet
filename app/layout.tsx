import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "アプリ開発ヒアリングシート | 株式会社ROLE OWL",
  description: "治療院・サロン向けアプリ開発のお問い合わせフォーム。お困りごとをヒアリングし、最適なアプリをご提案します",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "アプリ開発ヒアリングシート | 株式会社ROLE OWL",
    description: "治療院・サロン向けアプリ開発のお問い合わせフォーム。お困りごとをヒアリングし、最適なアプリをご提案します",
    type: "website",
    locale: "ja_JP",
    siteName: "株式会社ROLE OWL",
  },
  twitter: {
    card: "summary",
    title: "アプリ開発ヒアリングシート | 株式会社ROLE OWL",
    description: "治療院・サロン向けアプリ開発のお問い合わせフォーム。お困りごとをヒアリングし、最適なアプリをご提案します",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
