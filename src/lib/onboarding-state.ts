import { Company } from "@/types/company";

export const ONBOARDING_STEPS = [
  {
    path: "/onboarding/step2",
    isCompleted: (company: Company) => company.companyType && company.address && company.phone,
  },
  {
    path: "/onboarding/step2-5",
    isCompleted: (company: Company) => company.hasAuthority && company.acceptTerms,
  },
  {
    path: "/onboarding/step3",
    isCompleted: (company: Company) => !!company.logoUrl, // For simplicity, we'll just check for the logoUrl
  },
  {
    path: "/onboarding/step4",
    isCompleted: (company: Company) => true, // This step is optional
  },
  {
    path: "/onboarding/step5",
    isCompleted: (company: Company) => true, // This step is optional
  },
  {
    path: "/onboarding/complete",
    isCompleted: (company: Company) => false,
  },
];

export function getNextOnboardingStep(company: Company | null): string {
  if (!company) {
    return ONBOARDING_STEPS[0].path;
  }

  for (const step of ONBOARDING_STEPS) {
    if (!step.isCompleted(company)) {
      return step.path;
    }
  }

  return "/dashboard";
}
