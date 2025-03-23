'use client';

import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import { BusinessBudgetProvider } from "@/context/BusinessBudgetContext";
import { BusinessCustomerProvider } from "@/context/BusinessCustomerContext";
import { BusinessLocationProvider } from "@/context/BusinessLocationContext";
import { BusinessScheduleProvider } from "@/context/BusinessScheduleContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BusinessAdjectiveProvider } from '../context/BusinessAdjectiveContext';
import { BusinessLogoProvider } from '../context/BusinessLogoContext';
import { BusinessPastPopupProvider } from '../context/BusinessPastPopupContext';
import { BusinessProfileProvider } from '../context/BusinessProfileContext';
import { ApplicationProfileProvider } from '../context/CreateEventProfileContext';
import { HostProvider } from '../context/HostContext';
import { UserProvider } from '../context/UserContext';

import "./globals.css";

// Dynamically import LoadScript to disable SSR
const LoadScript = dynamic(() => import('@react-google-maps/api').then(mod => mod.LoadScript), { ssr: false });

const libraries = "places";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LoadScript id="google-maps-script" googleMapsApiKey={`${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`} libraries={[libraries]}>
          <UserProvider>
            <HostProvider>
              <Header />
              <main>
                <ApplicationProfileProvider>
                  <BusinessProfileProvider>
                    <BusinessAdjectiveProvider>
                      <BusinessLogoProvider>
                        <BusinessPastPopupProvider>
                          <BusinessBudgetProvider>
                            <BusinessCustomerProvider>
                              <BusinessScheduleProvider>
                                <BusinessLocationProvider>
                                  {children}
                                </BusinessLocationProvider>
                              </BusinessScheduleProvider>
                            </BusinessCustomerProvider>
                          </BusinessBudgetProvider>
                        </BusinessPastPopupProvider>
                      </BusinessLogoProvider>
                    </BusinessAdjectiveProvider>
                  </BusinessProfileProvider>
                </ApplicationProfileProvider>
              </main>
            </HostProvider>
          </UserProvider>
        </LoadScript>
      </body>
    </html>
  );
}