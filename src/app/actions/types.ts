export interface CourtRecord {
  id: string;
  caseNumber: string;
  courtName: string;
  type: string;
  filingDate: string | null;
  status: string | null;
  amountClaimed: number | null;
  url: string | undefined;
}

export interface AddressEntry {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  fromDate: string;
  toDate: string;
}

export interface PhoneValidation {
  phone: string;
  valid: boolean;
  lineType: string;
  carrier: string;
  risk: string;
}

export interface EmailValidation {
  email: string;
  valid: boolean;
  disposable: boolean;
  risk: string;
}

export interface FraudSignals {
  score: number;
  warnings: string[];
}
