"use server";

import { headers } from "next/headers";
import { adminAuth } from "@/firebase/server";

/* =========================
   AI FLOWS
========================= */

import { whoAmI as whoAmIFlow, type WhoAmIOutput } from "@/ai/flows/who-am-i";

import {
  setUserClaims as setUserClaimsFlow,
  type SetUserClaimsInput,
  type SetUserClaimsOutput,
} from "@/ai/flows/set-user-claims";

import {
  createCompany as createCompanyFlow,
  type CreateCompanyInput,
  type CreateCompanyOutput,
} from "@/ai/flows/create-company";

import {
  createInvite as createInviteFlow,
  acceptInvite as acceptInviteFlow,
  type CreateInviteInput,
  type CreateInviteOutput,
  type AcceptInviteInput,
  type AcceptInviteOutput,
} from "@/ai/flows/invites";

import {
  upsertRental as upsertRentalFlow,
  deleteRental as deleteRentalFlow,
  type UpsertRentalInput,
  type UpsertRentalOutput,
  type DeleteRentalInput,
  type DeleteRentalOutput,
} from "@/ai/flows/rentals";

import {
  upsertRenter as upsertRenterFlow,
  importRenters as importRentersFlow,
  type Renter as RenterType,
  type UpsertRenterOutput,
  type ImportRentersInput,
  type ImportRentersOutput,
} from "@/ai/flows/renters";

import {
  createIncident as createIncidentFlow,
  type CreateIncidentInput,
  type CreateIncidentOutput,
} from "@/ai/flows/incidents";

import {
  recomputeRenterScore as recomputeRenterScoreFlow,
  type RecomputeScoreInput,
  type RecomputeScoreOutput,
} from "@/ai/flows/risk-scorer";

import {
  startDispute as startDisputeFlow,
  postDisputeMessage as postDisputeMessageFlow,
  updateDisputeStatus as updateDisputeStatusFlow,
  type StartDisputeInput,
  type StartDisputeOutput,
  type PostDisputeMessageInput,
  type PostDisputeMessageOutput,
  type UpdateDisputeStatusInput,
  type UpdateDisputeStatusOutput,
} from "@/ai/flows/disputes";

import {
  seedStaging as seedStagingFlow,
  type SeedStagingInput,
  type SeedStagingOutput,
} from "@/ai/flows/seed";

import { health as healthFlow, type HealthOutput } from "@/ai/flows/health";
import { startAIAssistantFlow } from "@/ai/flows/ai-assistant";

/* ✅ CORRECT FRAUD FLOW IMPORT */
import { fraudDetector as detectFraudSignalsFlow } from "@/ai/flows/fraud-detector";

import {
  getCompanySettings as getCompanySettingsFlow,
  updateCompanySettings as updateCompanySettingsFlow,
  type CompanySettings,
  type UpdateCompanySettingsInput,
} from "@/ai/flows/settings";

/* =========================
   AUTH HELPER
========================= */

async function getAuth(): Promise<any | undefined> {
  const authorization = headers().get("Authorization");

  if (!authorization?.startsWith("Bearer ")) return;

  const idToken = authorization.substring(7);
  const decoded = await adminAuth.verifyIdToken(idToken);

  return {
    uid: decoded.uid,
    claims: decoded,
    scopes: [],
  };
}

/* =========================
   STANDARD ACTIONS
========================= */

export async function whoAmI(): Promise<WhoAmIOutput> {
  const auth = await getAuth();
  return whoAmIFlow(auth);
}

export async function setUserClaims(
  params: SetUserClaimsInput,
): Promise<SetUserClaimsOutput> {
  const auth = await getAuth();
  return setUserClaimsFlow(params, auth);
}

export async function createCompany(
  params: CreateCompanyInput,
): Promise<CreateCompanyOutput> {
  const auth = await getAuth();
  return createCompanyFlow(params, auth);
}

export async function createInvite(
  params: CreateInviteInput,
): Promise<CreateInviteOutput> {
  const auth = await getAuth();
  return createInviteFlow(params, auth);
}

export async function acceptInvite(
  params: AcceptInviteInput,
): Promise<AcceptInviteOutput> {
  const auth = await getAuth();
  return acceptInviteFlow(params, auth);
}

export async function upsertRenter(
  params: RenterType,
): Promise<UpsertRenterOutput> {
  const auth = await getAuth();
  return upsertRenterFlow(params, auth);
}

export async function importRenters(
  params: ImportRentersInput,
): Promise<ImportRentersOutput> {
  const auth = await getAuth();
  return importRentersFlow(params, auth);
}

export async function upsertRental(
  params: UpsertRentalInput,
): Promise<UpsertRentalOutput> {
  const auth = await getAuth();
  return upsertRentalFlow(params, auth);
}

export async function deleteRental(
  params: DeleteRentalInput,
): Promise<DeleteRentalOutput> {
  const auth = await getAuth();
  return deleteRentalFlow(params, auth);
}

export async function createIncident(
  params: CreateIncidentInput,
): Promise<CreateIncidentOutput> {
  const auth = await getAuth();
  return createIncidentFlow(params, auth);
}

export async function recomputeRenterScore(
  params: RecomputeScoreInput,
): Promise<RecomputeScoreOutput> {
  const auth = await getAuth();
  return recomputeRenterScoreFlow(params, auth);
}

export async function startDispute(
  params: StartDisputeInput,
): Promise<StartDisputeOutput> {
  const auth = await getAuth();
  return startDisputeFlow(params, auth);
}

export async function postDisputeMessage(
  params: PostDisputeMessageInput,
): Promise<PostDisputeMessageOutput> {
  const auth = await getAuth();
  return postDisputeMessageFlow(params, auth);
}

export async function updateDisputeStatus(
  params: UpdateDisputeStatusInput,
): Promise<UpdateDisputeStatusOutput> {
  const auth = await getAuth();
  return updateDisputeStatusFlow(params, auth);
}

export async function seedStaging(
  params: SeedStagingInput,
): Promise<SeedStagingOutput> {
  const auth = await getAuth();
  return seedStagingFlow(params, auth);
}

export async function health(): Promise<HealthOutput> {
  return healthFlow();
}

export async function startAIAssistant(input: string): Promise<any> {
  const auth = await getAuth();
  return startAIAssistantFlow(auth, input);
}

/* =========================
   ✅ FRAUD DETECTION (FIXED)
========================= */

export type DetectFraudSignalsInput = {
  renterId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  [key: string]: any;
};

export type DetectFraudSignalsOutput = {
  score: number;
  flags: string[];
};

export async function detectFraudSignals(
  params: DetectFraudSignalsInput,
): Promise<DetectFraudSignalsOutput> {
  const flags = await detectFraudSignalsFlow(params);

  return {
    score: flags.length > 0 ? 50 : 0,
    flags,
  };
}

/* =========================
   SETTINGS
========================= */

export async function getCompanySettings(): Promise<CompanySettings | null> {
  const auth = await getAuth();
  return getCompanySettingsFlow(auth);
}

export async function updateCompanySettings(
  params: UpdateCompanySettingsInput,
): Promise<void> {
  const auth = await getAuth();
  return updateCompanySettingsFlow(params, auth);
}
