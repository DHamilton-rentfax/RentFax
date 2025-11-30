export interface Property {
  propertyId: string;
  tenantId: string;     // organization that owns it
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  createdAt: number;
  updatedAt: number;
  unitCount?: number;
}