import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { validateVendorEmail } from "@/utils/validateVendorEmail";

interface ValidationResult {
  isValid: boolean;
  emailsMatch: boolean;
  authEmail: string | null;
  profileEmail: string | null;
  errorMessage: string | null;
  vendorProfileId: string | null;
  isLoading: boolean;
}

/**
 * Custom hook to validate if a user's auth email matches their vendor profile email
 * @returns ValidationResult object containing validation status and related information
 */
export function useVendorEmailValidator(): ValidationResult {
  const { user } = useUserContext();
  const [validationResult, setValidationResult] = useState<Omit<
    ValidationResult,
    "isLoading"
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function validateEmail() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await validateVendorEmail(user);
        setValidationResult(result);
      } catch (error) {
        console.error("Error validating vendor email:", error);
        setValidationResult({
          isValid: false,
          emailsMatch: false,
          authEmail: user.email,
          profileEmail: null,
          errorMessage: "Failed to validate email. Please try again later.",
          vendorProfileId: null,
        });
      } finally {
        setIsLoading(false);
      }
    }

    validateEmail();
  }, [user]);

  // Return a default object if validation hasn't completed
  if (isLoading || !validationResult) {
    return {
      isValid: false,
      emailsMatch: false,
      authEmail: user?.email || null,
      profileEmail: null,
      errorMessage: isLoading ? null : "Email validation failed",
      vendorProfileId: null,
      isLoading,
    };
  }

  // Return the validation result with loading state
  return {
    ...validationResult,
    isLoading,
  };
}
