
export function scoreIdentityMatch({ internal, publicRecords, input }) {
  const reasons = [];
  let score = 0;

  // Name match
  if (publicRecords?.fullName) {
    const prName = publicRecords.fullName.toLowerCase();
    const inputName = `${input.firstName} ${input.lastName}`.toLowerCase();

    if (prName.includes(input.firstName.toLowerCase())) score += 15;
    if (prName.includes(input.lastName.toLowerCase())) score += 15;

    if (prName === inputName) {
      score += 10;
      reasons.push("Full name match");
    }
  }

  // Email match
  if (input.email && publicRecords?.emails?.length) {
    const emailMatch = publicRecords.emails.some((e) =>
      e.toLowerCase() === input.email.toLowerCase()
    );
    if (emailMatch) {
      score += 20;
      reasons.push("Email matches PDL identity");
    }
  }

  // Phone match
  if (input.phone && publicRecords?.phones?.length) {
    const phoneMatch = publicRecords.phones.some((p) =>
      p.replace(/\D/g, "").includes(input.phone.replace(/\D/g, ""))
    );
    if (phoneMatch) {
      score += 20;
      reasons.push("Phone matches PDL identity");
    }
  }

  // Address match
  if (input.address && publicRecords?.addresses?.length) {
    const addrMatch = publicRecords.addresses.some((a) =>
      a.toLowerCase().includes(input.address.toLowerCase())
    );
    if (addrMatch) {
      score += 15;
      reasons.push("Address matches public identity");
    }
  }

  return {
    type: "identity",
    score: Math.min(60, score),
    reasons,
  };
}
