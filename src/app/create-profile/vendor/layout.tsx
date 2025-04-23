"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { useVendor } from "@/context/VendorContext";

const ROUTE_ORDER = [
  "/create-profile/vendor",
  "/create-profile/vendor/type",
  "/create-profile/vendor/category",
  "/create-profile/vendor/product",
  "/create-profile/vendor/budget",
  "/create-profile/vendor/preferences",
  "/create-profile/vendor/media",
  "/create-profile/vendor/optional",
  "/create-profile/vendor/review",
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserContext();
  const { vendor } = useVendor();

  useEffect(() => {
    const checkAccess = async () => {
      // If not logged in, redirect to login
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // If user already has a role, redirect to home
      if (user.role && user.role !== "none") {
        router.push("/");
        return;
      }

      // Get current route index
      const currentRouteIndex = ROUTE_ORDER.indexOf(pathname);

      // If invalid route, redirect to first step
      if (currentRouteIndex === -1) {
        router.push(ROUTE_ORDER[0]);
        return;
      }

      // For routes after the first step, check if we have vendor data
      if (currentRouteIndex > 0) {
        // If no vendor data at all, start from beginning
        if (!vendor) {
          router.push(ROUTE_ORDER[0]);
          return;
        }

        // Check if previous step was completed based on required data
        const canAccess = checkStepCompletion(currentRouteIndex);
        if (!canAccess) {
          // Find the last completed step or the first step
          const lastCompletedIndex = findLastCompletedStep();
          router.push(ROUTE_ORDER[lastCompletedIndex]);
        }
      }
    };

    checkAccess();
  }, [pathname, user, vendor]);

  const checkStepCompletion = (currentIndex: number) => {
    if (!vendor) return false;

    // Define required fields for each step
    switch (ROUTE_ORDER[currentIndex - 1]) {
      case "/create-profile/vendor":
        return true; // First page, always accessible if logged in
      case "/create-profile/vendor/type":
        return !!vendor.type;
      case "/create-profile/vendor/category":
        return !!vendor.categories?.length && !!vendor.description;
      case "/create-profile/vendor/product":
        return !!vendor.priceRange?.min && !!vendor.priceRange?.max;
      case "/create-profile/vendor/budget":
        return !!vendor.budget;
      case "/create-profile/vendor/preferences":
        return !!vendor.eventPreference?.length && !!vendor.cities?.length;
      case "/create-profile/vendor/media":
        return true; // Media is optional
      case "/create-profile/vendor/optional":
        return true; // Optional step
      default:
        return false;
    }
  };

  const findLastCompletedStep = () => {
    if (!vendor) return 0;

    for (let i = ROUTE_ORDER.length - 1; i >= 0; i--) {
      if (checkStepCompletion(i)) {
        return i;
      }
    }
    return 0;
  };

  return <>{children}</>;
}
