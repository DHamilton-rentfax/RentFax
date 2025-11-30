import { adminDb } from "@/firebase/server";

// Define the structure of an audit log entry
interface AuditEvent {
  timestamp: FirebaseFirestore.FieldValue; // Use server timestamp for accuracy
  actor: {
    uid: string; // The user who performed the action
    email?: string;
    ip?: string; // The IP address of the actor
  };
  action: string; // e.g., 'USER_LOGIN', 'ROLE_UPDATE', 'PASSWORD_CHANGE'
  target?: {
    uid: string; // The user who was affected by the action
    email?: string;
  };
  details?: any; // Any additional JSON data
}

/**
 * Writes a structured event to the 'audit-logs' collection in Firestore.
 *
 * @param event - The audit event object.
 */
export const logAuditEvent = async (event: Omit<AuditEvent, 'timestamp'>) => {
  try {
    const logEntry: AuditEvent = {
      ...event,
      timestamp: adminDb.FieldValue.serverTimestamp(),
    };
    await adminDb.collection("audit-logs").add(logEntry);
  } catch (error) {
    console.error("Failed to write to audit log:", error);
    // In a production scenario, you might want to add more robust error handling,
    // like sending an alert to a monitoring service.
  }
};
