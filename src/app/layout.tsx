"use client";

import { Manrope } from "next/font/google";
import { ApplicationProfileProvider } from "../context/CreateEventProfileContext";
import { UserProvider } from "../context/UserContext";
import { HostProvider } from "../context/HostContext";
import Header from "@/components/Header";
import { ThemeProvider } from "@/context/ThemeContext";
import GoogleMapsLoader from "../components/GoogleMapsLoader";
import { VendorProvider } from "@/context/VendorContext";

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
        <ThemeProvider>
          <GoogleMapsLoader>
            <UserProvider>
              <HostProvider>
                <ApplicationProfileProvider>
                  <Header />
                  <VendorProvider>{children}</VendorProvider>
                </ApplicationProfileProvider>
              </HostProvider>
            </UserProvider>
          </GoogleMapsLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
