export async function enrichIdentity({ fullName, email, phone, address }: any) {
  // Simulated external enrichment service
  return {
    city: address?.split(",")?.[1]?.trim() ?? null,
    ageRange: "25-34",
    emailValid: !!email,
    phoneValid: !!phone,
    fraudSignals: {
      email_disposable: email?.includes("mailinator") ?? false,
      phone_voip: phone?.startsWith("555") ?? false,
    }
  };
}