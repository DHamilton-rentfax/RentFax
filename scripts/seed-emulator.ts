// ---------------------------
// ALERTS
// ---------------------------
const alerts = [
  { id: "a1", type: "CRITICAL", message: "High fraud activity detected", status: "open" },
  { id: "a2", type: "INFO", message: "System maintenance scheduled", status: "acknowledged" },
];
for (const a of alerts) {
  await setDoc(doc(db, "alerts", a.id), a);
  console.log(`Seeded alert: ${a.type} - ${a.message}`);
}

// ---------------------------
// AUDIT LOGS
// ---------------------------
const logs = [
  { id: "l1", action: "INVITE_SENT", by: "admin@test.com", invitee: "editor@test.com", createdAt: new Date().toISOString() },
  { id: "l2", action: "DISPUTE_UPDATED", by: "support@test.com", disputeId: "d1", createdAt: new Date().toISOString() },
];
for (const l of logs) {
  await setDoc(doc(db, "auditLogs", l.id), l);
  console.log(`Seeded audit log: ${l.action}`);
}
