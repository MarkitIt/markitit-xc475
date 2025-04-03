'use client';

import { BusinessBudgetProvider } from "@/context/BusinessBudgetContext";
import { BusinessCustomerProvider } from "@/context/BusinessCustomerContext";
import { BusinessLocationProvider } from "@/context/BusinessLocationContext";
import { BusinessScheduleProvider } from "@/context/BusinessScheduleContext";
import { Manrope } from "next/font/google";
import { BusinessAdjectiveProvider } from '../context/BusinessAdjectiveContext';
import { BusinessLogoProvider } from '../context/BusinessLogoContext';
import { BusinessPastPopupProvider } from '../context/BusinessPastPopupContext';
import { BusinessProfileProvider } from '../context/BusinessProfileContext';
import { ApplicationProfileProvider } from '../context/CreateEventProfileContext';
import { UserProvider } from '../context/UserContext';
import Header from '@/components/Header';
import { ThemeProvider } from '@/context/ThemeContext';
import GoogleMapsLoader from '../components/GoogleMapsLoader';

import "./globals.css";

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.className}>
      <head>
        <title>MarkitIt - Pop Up. Stand Out. Sell More.</title>
        <meta name="description" content="A one-stop platform for finding top-tier events, managing applications, and connecting with a thriving vendor community." />
      </head>
      <body>
        <ThemeProvider>
          <GoogleMapsLoader>
            <UserProvider>
              <ApplicationProfileProvider>
                <BusinessProfileProvider>
                  <BusinessAdjectiveProvider>
                    <BusinessLogoProvider>
                      <BusinessPastPopupProvider>
                        <BusinessBudgetProvider>
                          <BusinessCustomerProvider>
                            <BusinessScheduleProvider>
                              <BusinessLocationProvider>
                                <Header />
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
            </UserProvider>
          </GoogleMapsLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}