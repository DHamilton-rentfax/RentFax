/**
 * IMPORTANT:
 * This firebase-admin mock MUST support:
 * - admin.firestore() instance calls
 * - firestore.FieldValue static access
 * - admin.auth(), admin.storage()
 *
 * Do not simplify or partially mock.
 */

// Set environment variables for the test environment
process.env.MEMBER_ID_APPROVAL_SECRET = 'test-secret-value';

jest.mock("firebase-admin", () => {
  // --- Firestore Service Mock ---
  const firestoreService = jest.fn(() => ({
    collection: jest.fn(),
    runTransaction: jest.fn(),
    settings: jest.fn(),
  }));

  // Attach static properties to the service mock, just like the real SDK
  firestoreService.FieldValue = {
    increment: jest.fn((val) => `increment(${val})`),
  };

  // --- Auth instance ---
  const authInstance = {
    verifySessionCookie: jest.fn(),
    getUser: jest.fn(),
    createCustomToken: jest.fn(),
  };

  // --- Storage instance ---
  const storageInstance = {
    bucket: jest.fn(() => ({
      file: jest.fn(() => ({
        save: jest.fn(),
        getSignedUrl: jest.fn(),
      })),
    })),
  };

  return {
    // App lifecycle
    initializeApp: jest.fn(),
    apps: [],

    // Credentials
    credential: {
      applicationDefault: jest.fn(() => ({})),
      cert: jest.fn(() => ({})),
    },

    // Services
    firestore: firestoreService,
    auth: jest.fn(() => authInstance),
    storage: jest.fn(() => storageInstance),
  };
});
