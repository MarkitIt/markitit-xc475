"use client";

import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { RoleCard } from "./components/RoleCard";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";

const ROLES = [
  {
    title: "Become a Host",
    description:
      "Create and manage events, connect with vendors, and grow your community",
    icon: "/icons/host.svg",
    role: "host",
  },
  {
    title: "Become a Vendor",
    description: "Find events, showcase your products, and grow your business",
    icon: "/icons/vendor.svg",
    role: "vendor",
  },
];

export default function CreateProfilePage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [error, setError] = useState("");

  const handleRoleSelect = async (selectedRole: "host" | "vendor") => {
    try {
      if (!user) {
        setError("You must be logged in to create a profile");
        return;
      }

      // Just redirect based on selected role
      if (selectedRole === "host") {
        router.push("/create-profile/host");
      } else {
        router.push("/create-profile/vendor");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <main
      style={{
        minHeight: "calc(100vh - 80px)",
        padding: theme.spacing.xl,
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: theme.typography.fontSize.title,
            marginBottom: theme.spacing.xl,
          }}
        >
          Choose Your Role
        </h1>

        {error && (
          <div
            style={{
              color: theme.colors.primary.coral,
              marginBottom: theme.spacing.xl,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: theme.spacing.xl,
          }}
        >
          {ROLES.map((role) => (
            <RoleCard
              key={role.role}
              {...role}
              onClick={() => handleRoleSelect(role.role as "host" | "vendor")}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
