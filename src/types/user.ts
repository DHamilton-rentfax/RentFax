export type AppUser = {
  uid: string;
  email?: string | null;

  // 🔑 REQUIRED for billing + audit
  companyId?: string | null;

  // Optional future-safe fields
  role?: "user" | "admin" | "super_admin";
};
