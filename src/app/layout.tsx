import type { Metadata } from "next";
import Header from "@/components/Header";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BusinessProfileProvider } from '../context/BusinessProfileContext';
import { BusinessAdjectiveProvider } from '../context/BusinessAdjectiveContext';
import { BusinessPastPopupProvider } from '../context/BusinessPastPopupContext';
import { BusinessLogoProvider } from '../context/BusinessLogoContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          <BusinessProfileProvider><BusinessAdjectiveProvider><BusinessLogoProvider><BusinessPastPopupProvider>
                {children}
          </BusinessPastPopupProvider></BusinessLogoProvider></BusinessAdjectiveProvider></BusinessProfileProvider>
        </main>
      </body>
    </html>
  );
}
