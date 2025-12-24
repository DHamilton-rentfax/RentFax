import { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
  role: "customer" | "support_staff" | "fraud_team" | "admin";
}
