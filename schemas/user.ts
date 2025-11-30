export interface User {
  id: string;
  email: string;
  notificationPrefs: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  pushTokens: string[];
}
