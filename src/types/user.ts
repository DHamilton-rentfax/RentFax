export interface AppUser {
  uid: string;
  email: string;
  role?: string;
  displayName?: string;
  photoURL?: string;
  companyName?: string | null;
  createdAt?: string;
  provider?: string;
  claims?: Record<string, any>;
}
