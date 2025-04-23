import { User } from "firebase/auth";

/**
 * Gets the vendor ID from a user's vendor profile
 * This utility function is meant to be used with the auth user and vendor profile data
 *
 * @param user - The authenticated Firebase user
 * @param vendorProfile - The vendor profile data from Firestore
 * @returns The vendor ID or a message indicating it's not available
 */
export function getVendorId(
  user: User | null,
  vendorProfile: any | null,
): string {
  // Case 1: User is not logged in
  if (!user) {
    return "No vendor ID: User not logged in";
  }

  // Case 2: User is logged in but has no vendor profile
  if (!vendorProfile) {
    return "No vendor ID: User has no vendor profile";
  }

  // Case 3: User is logged in and has a vendor profile
  return vendorProfile.uid || "No vendor ID: Vendor profile has no UID";
}

/**
 * Checks if a given string is a valid vendor ID (not an error message)
 *
 * @param vendorId - The vendor ID string to check
 * @returns True if it's a valid vendor ID, false if it's an error message
 */
export function isValidVendorId(vendorId: string): boolean {
  return !vendorId.startsWith("No vendor ID");
}
