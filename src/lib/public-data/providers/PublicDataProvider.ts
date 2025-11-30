
export interface PublicDataProvider {
  search(input: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
  }): Promise<PublicDataResult>;
}

export interface PublicDataResult {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  aliases?: string[];
  dob?: string;
  age?: number;
  associatedPeople?: string[];
  addresses?: string[];
  matchScore: number; // 0–100
  raw: any;
}
