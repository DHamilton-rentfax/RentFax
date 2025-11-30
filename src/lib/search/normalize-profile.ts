interface PublicProfile {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  [key: string]: any; 
}

interface NormalizedProfile {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

/**
 * Normalizes a public profile object to ensure all key fields are present,
 * defaulting to null if missing. This prevents downstream errors from
 * accessing undefined properties.
 *
 * @param profile - The raw profile object from an AI or data provider.
 * @returns A normalized profile object with guaranteed fields.
 */
export function normalizeProfile(profile: PublicProfile | null | undefined): NormalizedProfile {
  if (!profile) {
    return {
      name: null,
      email: null,
      phone: null,
      address: null,
    };
  }

  return {
    name: profile.name ?? null,
    email: profile.email ?? null,
    phone: profile.phone ?? null,
    address: profile.address ?? null,
  };
}
