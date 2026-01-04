export type PhoneCountry = {
  code: string;
  name: string;
  dial: string;
};

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "US", name: "United States", dial: "+1" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "JP", name: "Japan", dial: "+81" },
];
