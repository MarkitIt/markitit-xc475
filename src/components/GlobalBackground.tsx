"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface GlobalBackgroundProps {
  children: React.ReactNode;
}

export const GlobalBackground: React.FC<GlobalBackgroundProps> = ({
  children,
}) => {
  const pathname = usePathname();

  // Don't apply the background to the landing page (root route)
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return <div className="landing-background">{children}</div>;
  }

  return <div className="global-background">{children}</div>;
};

export default GlobalBackground;
