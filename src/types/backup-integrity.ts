
import { Timestamp } from "firebase/firestore";

export interface BackupIntegrity {
  date: string;
  collections: {
    [key: string]: { count: number, sampleHash: string }
  };
  createdAt: Timestamp;
}
