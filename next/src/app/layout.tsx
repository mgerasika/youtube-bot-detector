/* eslint-disable react/react-in-jsx-scope */
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GlobalStyles from "@/styles/GlobalStyles";
import { i18n } from '../../next-i18next.config';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Youtube Bot Detector",
  description: "Chrome extension for detect bots",
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        params={JSON.stringify(params)}
         <GlobalStyles />
        {children}
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

