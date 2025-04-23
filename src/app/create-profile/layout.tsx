"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

export default function CreateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserContext();

  useEffect(() => {
    const checkAccess = async () => {
      // If not logged in, redirect to login
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // If user already has a role other than 'none', redirect to home
      if (user.role && user.role !== "none") {
        router.push("/");
        return;
      }

      // If on main create-profile page, allow access
      if (pathname === "/create-profile") {
        return;
      }

      // For /vendor or /host paths, ensure user came from create-profile
      if (
        pathname === "/create-profile/vendor" ||
        pathname === "/create-profile/host"
      ) {
        // Could add additional checks here if needed
        return;
      }
    };

    checkAccess();
  }, [pathname, user]);

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #f6e2dd 0%, #fde9e9 3%, #FFFFFF 8%)",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {children}
    </div>
  );
}
