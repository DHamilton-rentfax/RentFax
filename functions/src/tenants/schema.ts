export interface Tenant {
  tenantId: string;
  name: string;
  type: "PROPERTY_MANAGER" | "LANDLORD" | "ENTERPRISE" | "WHITE_LABEL_PARTNER";
  createdAt: number;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    legalName?: string;
  };
  plan: "free" | "pro" | "enterprise";
  apiEnabled?: boolean;
  apiKey?: string;
  ownerId: string;
}
