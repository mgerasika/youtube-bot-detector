/* eslint-disable react/react-in-jsx-scope */
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GlobalStyles from "@/styles/GlobalStyles";
import { I18N } from "@/i18n";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18N />
         <GlobalStyles />
        {children}
      </body>
    </html>
  );
}
