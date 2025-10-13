interface FraudClusterAlertData {
  reason: string;
  clusterMembers: { id: string; trustScore: number; name: string }[];
  primaryRenterId: string;
}

/**
 * Sends an email alert to the admin about a detected fraud cluster.
 * In a real application, this would use an email service like SendGrid, AWS SES, etc.
 */
export async function sendFraudClusterAlert(data: FraudClusterAlertData) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@rentfax.co";

  console.log(`
        ---= FRAUD CLUSTER ALERT =---
        To: ${adminEmail}
        Subject: High-Risk Fraud Cluster Detected

        A potential fraud cluster has been automatically detected.

        Reason: ${data.reason}
        Primary Renter ID: ${data.primaryRenterId}

        Cluster Members:
        ${data.clusterMembers.map((m) => `- ID: ${m.id}, Name: ${m.name}, Trust Score: ${m.trustScore}`).join("\n")}

        Please investigate this cluster immediately.
        ---= END OF ALERT =---
    `);

  // Mock sending email
  return Promise.resolve();
}
