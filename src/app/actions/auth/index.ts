"use server";

// IMPORTANT: This file is now stubbed to remove all Genkit dependencies.
// The original logic is preserved in src/_legacy_ai
// All AI logic should be re-implemented through the new /src/lib/ai service layer.

/* =========================
   TYPE DEFINITIONS (STUBBED)
========================= */

// These types are simplified to ensure API contracts are met without Genkit.
export type WhoAmIOutput = { role: string | null; companyId: string | null; };
export type SetUserClaimsOutput = { success: boolean; };
export type CreateCompanyOutput = { companyId: string; };
export type CreateInviteOutput = { inviteId: string; };
export type AcceptInviteOutput = { success: boolean; };
export type UpsertRenterOutput = { renterId: string; };
export type ImportRentersOutput = { success: boolean; errors: any[]; };
export type UpsertRentalOutput = { rentalId: string; };
export type DeleteRentalOutput = { success: boolean; };
export type CreateIncidentOutput = { incidentId: string; };
export type RecomputeScoreOutput = { score: number; };
export type StartDisputeOutput = { disputeId: string; };
export type PostDisputeMessageOutput = { messageId: string; };
export type UpdateDisputeStatusOutput = { success: boolean; };
export type SeedStagingOutput = { success: boolean; };
export type HealthOutput = { status: string; };
export type DetectFraudSignalsInput = { [key: string]: any; };
export type DetectFraudSignalsOutput = { score: number; flags: string[]; };
export type CompanySettings = { [key: string]: any; };
export type UpdateCompanySettingsInput = { [key: string]: any; };
export type RenterType = { [key: string]: any; };
export type UpsertRentalInput = { [key: string]: any; };
export type DeleteRentalInput = { [key: string]: any; };
export type CreateIncidentInput = { [key: string]: any; };
export type RecomputeScoreInput = { [key: string]: any; };
export type StartDisputeInput = { [key: string]: any; };
export type PostDisputeMessageInput = { [key: string]: any; };
export type UpdateDisputeStatusInput = { [key: string]: any; };
export type SeedStagingInput = { [key: string]: any; };
export type CreateInviteInput = { [key: string]: any; };
export type AcceptInviteInput = { [key: string]: any; };
export type CreateCompanyInput = { [key: string]: any; };
export type SetUserClaimsInput = { [key: string]: any; };
export type ImportRentersInput = { [key: string]: any; };


/* =========================
   STUBBED ACTIONS
========================= */

export async function whoAmI(): Promise<WhoAmIOutput> {
  console.log("STUB: whoAmI called");
  return { role: null, companyId: null };
}

export async function setUserClaims(params: SetUserClaimsInput): Promise<SetUserClaimsOutput> {
  console.log("STUB: setUserClaims called with:", params);
  return { success: true };
}

export async function createCompany(params: CreateCompanyInput): Promise<CreateCompanyOutput> {
  console.log("STUB: createCompany called with:", params);
  return { companyId: "stub_company_id" };
}

export async function createInvite(params: CreateInviteInput): Promise<CreateInviteOutput> {
  console.log("STUB: createInvite called with:", params);
  return { inviteId: "stub_invite_id" };
}

export async function acceptInvite(params: AcceptInviteInput): Promise<AcceptInviteOutput> {
  console.log("STUB: acceptInvite called with:", params);
  return { success: true };
}

export async function upsertRenter(params: RenterType): Promise<UpsertRenterOutput> {
  console.log("STUB: upsertRenter called with:", params);
  return { renterId: "stub_renter_id" };
}

export async function importRenters(params: ImportRentersInput): Promise<ImportRentersOutput> {
  console.log("STUB: importRenters called with:", params);
  return { success: true, errors: [] };
}

export async function upsertRental(params: UpsertRentalInput): Promise<UpsertRentalOutput> {
  console.log("STUB: upsertRental called with:", params);
  return { rentalId: "stub_rental_id" };
}

export async function deleteRental(params: DeleteRentalInput): Promise<DeleteRentalOutput> {
  console.log("STUB: deleteRental called with:", params);
  return { success: true };
}

export async function createIncident(params: CreateIncidentInput): Promise<CreateIncidentOutput> {
  console.log("STUB: createIncident called with:", params);
  return { incidentId: "stub_incident_id" };
}

export async function recomputeRenterScore(params: RecomputeScoreInput): Promise<RecomputeScoreOutput> {
  console.log("STUB: recomputeRenterScore called with:", params);
  return { score: 0 };
}

export async function startDispute(params: StartDisputeInput): Promise<StartDisputeOutput> {
  console.log("STUB: startDispute called with:", params);
  return { disputeId: "stub_dispute_id" };
}

export async function postDisputeMessage(params: PostDisputeMessageInput): Promise<PostDisputeMessageOutput> {
  console.log("STUB: postDisputeMessage called with:", params);
  return { messageId: "stub_message_id" };
}

export async function updateDisputeStatus(params: UpdateDisputeStatusInput): Promise<UpdateDisputeStatusOutput> {
  console.log("STUB: updateDisputeStatus called with:", params);
  return { success: true };
}

export async function seedStaging(params: SeedStagingInput): Promise<SeedStagingOutput> {
  console.log("STUB: seedStaging called with:", params);
  return { success: true };
}

export async function health(): Promise<HealthOutput> {
  console.log("STUB: health called");
  return { status: "ok" };
}

export async function startAIAssistant(input: string): Promise<any> {
  console.log("STUB: startAIAssistant called with:", input);
  return {
    message: "AI assistant temporarily unavailable",
  };
}

export async function detectFraudSignals(params: DetectFraudSignalsInput): Promise<DetectFraudSignalsOutput> {
  console.log("STUB: detectFraudSignals called with:", params);
  return {
    score: 0,
    flags: [],
  };
}

export async function getCompanySettings(): Promise<CompanySettings | null> {
  console.log("STUB: getCompanySettings called");
  return {};
}

export async function updateCompanySettings(params: UpdateCompanySettingsInput): Promise<void> {
  console.log("STUB: updateCompanySettings called with:", params);
  return;
}
