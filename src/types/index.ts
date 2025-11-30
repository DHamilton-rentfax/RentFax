// ─────────────────────────────────────────────
//  Common app-wide types for RentFAX platform
// ─────────────────────────────────────────────

// ---------- User Roles ----------
export enum UserRole {
  RENTER = 'RENTER',
  AGENCY = 'AGENCY',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  EDITOR = 'EDITOR',
  MARKETER = 'MARKETER',
  ANALYST = 'ANALYST',
  SUPPORT = 'SUPPORT',
  DEVELOPER = 'DEVELOPER',
  SALES = 'SALES',
  LANDLORD = 'LANDLORD',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  LEGAL_ADMIN = 'LEGAL_ADMIN',
  AGENCY_ADMIN = 'AGENCY_ADMIN'
}

// ---------- Permissions Model ----------
export interface Permission {
  /** e.g. "blogs:publish", "reports:view" */
  key: string;
  description?: string;
}

export interface RoleDefinition {
  name: string;
  permissions: Permission[];
}

/** Optional static role map you can seed to Firestore later */
export const DefaultRoleMap: Record<UserRole, RoleDefinition> = {
  [UserRole.RENTER]: {
    name: 'Renter',
    permissions: [{ key: 'reports:view' }],
  },
  [UserRole.AGENCY]: {
    name: 'Agency',
    permissions: [
      { key: 'renters:create' },
      { key: 'reports:create' },
      { key: 'reports:view' },
    ],
  },
  [UserRole.ADMIN]: {
    name: 'Admin',
    permissions: [
      { key: 'users:manage' },
      { key: 'reports:view' },
      { key: 'analytics:view' },
    ],
  },
  [UserRole.SUPER_ADMIN]: {
    name: 'Super Admin',
    permissions: [{ key: '*' }], // full access
  },
  [UserRole.EDITOR]: {
    name: 'Editor',
    permissions: [
      { key: 'blogs:write' },
      { key: 'blogs:publish' },
      { key: 'blogs:edit' },
    ],
  },
  [UserRole.MARKETER]: {
    name: 'Marketer',
    permissions: [
      { key: 'campaigns:view' },
      { key: 'leads:export' },
      { key: 'analytics:view' },
    ],
  },
  [UserRole.ANALYST]: {
    name: 'Analyst',
    permissions: [{ key: 'analytics:view' }, { key: 'fraud:analyze' }],
  },
  [UserRole.SUPPORT]: {
    name: 'Support',
    permissions: [
      { key: 'renters:view' },
      { key: 'disputes:respond' },
      { key: 'notifications:send' },
    ],
  },
  [UserRole.DEVELOPER]: {
    name: 'Developer',
    permissions: [{ key: 'system:deploy' }, { key: 'system:debug' }],
  },
  // Roles without default permissions, to be handled by claims or specific logic
  [UserRole.SALES]: {
    name: 'Sales',
    permissions: [],
  },
  [UserRole.LANDLORD]: {
    name: 'Landlord',
    permissions: [],
  },
  [UserRole.COMPANY_ADMIN]: {
    name: 'Company Admin',
    permissions: [],
  },
  [UserRole.LEGAL_ADMIN]: {
      name: 'Legal Admin',
      permissions: [],
  },
  [UserRole.AGENCY_ADMIN]: {
      name: 'Agency Admin',
      permissions: [],
  }
};

// ---------- Core Entities ----------
export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  createdBy: string;
}
export interface User {
  id: string;
  email: string;
  role: UserRole;
  departmentId?: string; // optional department link
  name?: string;
  companyId?: string;
  plan?: string;
  createdAt?: number;
  permissions?: string[]; // explicit permissions for overrides
  active?: boolean; // for deactivation
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  industry?: string;
  plan?: string;
  createdAt?: number;
}

export interface Renter {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  riskScore?: number;
  verified?: boolean;
  createdAt?: number;
}

export interface Incident {
  id: string;
  renterId: string;
  companyId: string;
  type: string;
  amount?: number;
  status: 'OPEN' | 'RESOLVED' | 'DISPUTED';
  createdAt: number;
}

export interface Dispute {
  id: string;
  incidentId: string;
  renterId: string;
  status: 'PENDING' | 'IN_REVIEW' | 'CLOSED';
  evidenceUrls?: string[];
  adminNotes?: string;
  createdAt: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

export interface AnalyticsSnapshot {
  activeUsers: number;
  paidUsers: number;
  freeUsers: number;
  newUsersThisWeek: number;
  webhookStatus?: string;
}

// ---------- Generic Utility ----------
export type AnyObject = Record<string, unknown>;
