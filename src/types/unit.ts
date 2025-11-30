export interface Unit {
  unitId: string;
  number: string;
  renterId?: string;
  status: "occupied" | "vacant" | "unknown";
  createdAt: number;
}