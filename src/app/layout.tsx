"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { VendorProvider } from "@/context/VendorContext";
import { Manrope } from "next/font/google";
import GoogleMapsWrapper from "../components/GoogleMapsWrapper";
import { ApplicationProfileProvider } from "../context/CreateEventProfileContext";
import { HostProvider } from "../context/HostContext";
import { UserProvider } from "../context/UserContext";
import GlobalBackground from "@/components/GlobalBackground";
import { SessionProvider } from "next-auth/react";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.className}>
      <head>
        <title>MarkitIt - Pop Up. Stand Out. Sell More.</title>
        <meta
          name="description"
          content="A one-stop platform for finding top-tier events, managing applications, and connecting with a thriving vendor community."
        />
      </head>
      <body>
        <SessionProvider>
          <ThemeProvider>
            <GoogleMapsWrapper>
              <UserProvider>
                <HostProvider>
                  <ApplicationProfileProvider>
                    <Header />
                    <VendorProvider>
                      <GlobalBackground>{children}</GlobalBackground>
                    </VendorProvider>
                    <Footer />
                  </ApplicationProfileProvider>
                </HostProvider>
              </UserProvider>
            </GoogleMapsWrapper>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
