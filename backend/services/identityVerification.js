// backend/services/identityVerification.js

/**
 * Stubbed identity-verification service (e.g. Veriff).
 * Returns a deterministic “approved” response for testing.
 */
export async function verifyIdentity({ name, dob, licenseNum }) {
  // Simulate a small delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    vendor:       'veriff',
    status:       'approved',  // other values could be 'pending' or 'declined'
    confidence:   0.95,
    nameMatch:    true,
    dobMatch:     true,
    licenseMatch: true,
  };
}
