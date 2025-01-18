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
  users
}: Readonly<{
  children: React.ReactNode;
  users: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <GlobalStyles />
        {children}
        {users}
      </body>
    </html>
  );
}


