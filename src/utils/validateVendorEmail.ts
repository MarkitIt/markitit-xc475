import { User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Validates that a user's auth email matches their vendor profile email
 * @param user The Firebase authenticated user
 * @returns Object containing validation status, matching status, and any error messages
 */
export async function validateVendorEmail(user: User | null): Promise<{
  isValid: boolean;
  emailsMatch: boolean;
  authEmail: string | null;
  profileEmail: string | null;
  errorMessage: string | null;
  vendorProfileId: string | null;
}> {
  // Default response object
  const response = {
    isValid: false,
    emailsMatch: false,
    authEmail: null as string | null,
    profileEmail: null as string | null,
    errorMessage: null as string | null,
    vendorProfileId: null as string | null
  };

  try {
    // Check if user is authenticated
    if (!user) {
      response.errorMessage = 'User is not authenticated';
      return response;
    }

    // Get the user's auth email
    response.authEmail = user.email;
    
    if (!response.authEmail) {
      response.errorMessage = 'User has no email in authentication';
      return response;
    }
    
    // First, check if there's a vendor profile with the user's UID
    const uidQuery = query(
      collection(db, 'vendorProfile'),
      where('uid', '==', user.uid)
    );
    
    const uidSnapshot = await getDocs(uidQuery);
    
    // If no profile found with this UID
    if (uidSnapshot.empty) {
      response.errorMessage = 'No vendor profile found for this user';
      return response;
    }
    
    // Get the vendor profile data
    const vendorProfile = uidSnapshot.docs[0].data();
    response.vendorProfileId = uidSnapshot.docs[0].id;
    response.profileEmail = vendorProfile.email || null;
    
    // Compare the emails
    if (response.profileEmail && response.authEmail) {
      response.emailsMatch = response.authEmail.toLowerCase() === response.profileEmail.toLowerCase();
      response.isValid = response.emailsMatch;
    }
    
    if (!response.emailsMatch) {
      // If they don't match, check if there are other profiles with this auth email
      const emailQuery = query(
        collection(db, 'vendorProfile'),
        where('email', '==', response.authEmail)
      );
      
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        response.errorMessage = 'This email is associated with a different vendor profile';
      } else {
        response.errorMessage = 'Vendor profile email does not match your account email';
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error validating vendor email:', error);
    response.errorMessage = `Error validating vendor email: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return response;
  }
}

/**
 * Checks if an email is already associated with any vendor profile
 * @param email The email to check
 * @returns Boolean indicating if the email is already in use
 */
export async function isEmailAlreadyInUse(email: string): Promise<boolean> {
  try {
    const emailQuery = query(
      collection(db, 'vendorProfile'),
      where('email', '==', email)
    );
    
    const emailSnapshot = await getDocs(emailQuery);
    return !emailSnapshot.empty;
  } catch (error) {
    console.error('Error checking if email is in use:', error);
    throw error;
  }
} 