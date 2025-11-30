import similarity from "string-similarity";

export function computeIdentityScore({
  rentalInput,
  verifiedData,
  selfieMatch,
}: any) {
  let score = 0;

  // Name match (40 points)
  const nameSim = similarity.compareTwoStrings(
    rentalInput.fullName.toLowerCase(),
    verifiedData.fullName.toLowerCase()
  );
  score += Math.min(nameSim * 40, 40);

  // Address match (25 points)
  const addrSim = similarity.compareTwoStrings(
    rentalInput.address.toLowerCase(),
    verifiedData.address.toLowerCase()
  );
  score += Math.min(addrSim * 25, 25);

  // Email match (10 points)
  const emailSim = similarity.compareTwoStrings(
    rentalInput.email.toLowerCase(),
    verifiedData.email.toLowerCase()
  );
  score += Math.min(emailSim * 10, 10);

  // Phone match (10 points)
  const phoneMatch =
    rentalInput.phone.replace(/\D/g, "") ===
    verifiedData.phone.replace(/\D/g, "");
  score += phoneMatch ? 10 : 0;

  // License hash match (10 points)
  score += rentalInput.licenseHash === verifiedData.licenseHash ? 10 : 0;

  // Optional selfie match (5 points)
  if (selfieMatch === true) score += 5;

  return Math.round(score);
}