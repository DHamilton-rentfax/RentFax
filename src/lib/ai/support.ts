async function someLLM(prompt: string): Promise<string> {
  console.log("LLM prompt:", prompt);
  // In a real application, this would call a large language model.
  // For demonstration purposes, we'll return a canned response.
  if (prompt.includes("User role: RENTER")) {
    return "As a renter, you can dispute an incident by going to your dashboard and clicking on the 'Disputes' tab. From there, you can create a new dispute and provide all the necessary details.";
  }
  if (prompt.includes("User role: LANDLORD")) {
    return "As a landlord, you can submit evidence for an incident by navigating to the incident's page and using the 'Upload Evidence' feature. Make sure to follow the guidelines for evidence submission.";
  }
  if (prompt.includes("User role: COMPANY_ADMIN")) {
      return "As a company administrator, you can export all disputes for your company from the 'Exports' section in your dashboard. You can choose the format and date range for the export.";
  }
  if (prompt.includes("User role: SUPPORT_ADMIN")) {
      return "To troubleshoot why a renter was not notified, please check the notification logs for the incident ID. You can access the logs from the internal admin panel under 'System Logs'.";
  }
  return "I'm sorry, I can't answer that question. Please contact support for more information.";
}


export async function aiGenerateSupportReply({
  message,
  role,
  context
}: {
  message: string;
  role: string;
  context: string;
}) {
  const persona = {
    RENTER: "Answer with renter-friendly tone. Avoid internal or landlord-specific instructions.",
    LANDLORD: "Speak as business support. Provide operational guidance, legal-safe wording.",
    COMPANY_ADMIN: "Provide enterprise-level instructions. Include staff management steps.",
    SUPPORT_ADMIN: "Provide internal troubleshooting guidance + escalation rules.",
    SUPER_ADMIN: "Answer with full system knowledge and architecture-level context.",
    UNKNOWN: "General support tone. Safe, helpful, compliant.",
  }[role] || "General helpful support persona.";

  const prompt = `
You are RentFAX Support.
User role: ${role}
Page context: ${context}

Persona behavior: ${persona}

User asked:
"${message}"

Respond clearly and concisely.
Do NOT reveal internal admin systems unless user is SUPPORT_ADMIN or SUPER_ADMIN.
`;

  const aiReply = await someLLM(prompt); // your chosen LLM function

  return aiReply;
}
