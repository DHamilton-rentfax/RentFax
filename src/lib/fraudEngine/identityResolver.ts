// src/lib/fraudEngine/identityResolver.ts
import { getPublicAddressMatch } from "@/lib/public-data/addressMatch";
import { getPhoneMatch } from "@/lib/public-data/phoneMatch";

export async function identityResolver(renter: any) {
  const addressMatch = await getPublicAddressMatch(renter.address);
  const phoneMatch = await getPhoneMatch(renter.phone);

  return {
    addressMatch,
    phoneMatch,
    identityScore:
      Math.round(
        ((addressMatch.confidence + phoneMatch.confidence) / 2) * 100
      ) || 0,
  };
}
