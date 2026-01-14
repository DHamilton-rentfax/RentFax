import { IdentityProvider } from "./identityProvider";
import { pdplProvider } from "./providers/pdpl";

// Future imports for other providers:
// import { personaProvider } from "./providers/persona";
// import { truliooProvider } from "./providers/trulioo";
// import { mockProvider } from "./providers/mock";

/**
 * Resolves and returns the currently active identity provider based on configuration.
 * This acts as a factory and is the single entry point for accessing identity verification services.
 * 
 * @returns {IdentityProvider} The active identity provider instance.
 * @throws {Error} If no valid identity provider is configured.
 */
export function getIdentityProvider(): IdentityProvider {
  const providerKey = process.env.IDENTITY_PROVIDER || 'PDPL'; // Default to PDPL during beta

  switch (providerKey) {
    case "PDPL":
      return pdplProvider;

    // Example of how future providers would be added
    // case "PERSONA":
    //   return personaProvider;
    
    // case "MOCK":
    //   return mockProvider;

    default:
      // This ensures that if the env variable is misconfigured, we don't silently fail.
      throw new Error(`No valid identity provider configured for key: ${providerKey}`);
  }
}
