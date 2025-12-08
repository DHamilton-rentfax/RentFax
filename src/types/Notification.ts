import { Timestamp } from 'firebase/firestore';

export interface Notification {
  id: string;
  type: 'incident' | 'dispute' | 'identity' | 'system' | 'billing';
  title: string;
  message: string;
  createdAt: Timestamp | Date | string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
}
