'use server';
import { auth } from '@/lib/firebase';
import {
  whoAmI as whoAmIFlow,
  type WhoAmIOutput,
} from '@/ai/flows/who-am-i';
import {
  setUserClaims as setUserClaimsFlow,
  type SetUserClaimsInput,
  type SetUserClaimsOutput,
} from '@/ai/flows/set-user-claims';
import {
  createCompany as createCompanyFlow,
  type CreateCompanyInput,
  type CreateCompanyOutput,
} from '@/ai/flows/create-company';
import {
  createInvite as createInviteFlow,
  acceptInvite as acceptInviteFlow,
  type CreateInviteInput,
  type CreateInviteOutput,
  type AcceptInviteInput,
  type AcceptInviteOutput,
} from '@/ai/flows/invites';
import {
  upsertRental as upsertRentalFlow,
  deleteRental as deleteRentalFlow,
  type UpsertRentalInput,
  type UpsertRentalOutput,
  type DeleteRentalInput,
  type DeleteRentalOutput,
} from '@/ai/flows/rentals';
import {
  upsertRenter as upsertRenterFlow,
  importRenters as importRentersFlow,
  type Renter as RenterType,
  type UpsertRenterOutput,
  type ImportRentersInput,
  type ImportRentersOutput,
} from '@/ai/flows/renters';
import {
  createIncident as createIncidentFlow,
  type CreateIncidentInput,
  type CreateIncidentOutput,
} from '@/ai/flows/incidents';
import {
  recomputeRenterScore as recomputeRenterScoreFlow,
  type RecomputeScoreInput,
  type RecomputeScoreOutput,
} from '@/ai/flows/risk-scorer';
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
} from '@/ai/flows/disputes';
import {
    seedStaging as seedStagingFlow,
    type SeedStagingInput,
    type SeedStagingOutput,
} from '@/ai/flows/seed';
import {
    health as healthFlow,
    type HealthOutput,
} from '@/ai/flows/health';
import {
  riskExplain as riskExplainFlow,
  type RiskExplainInput,
  type RiskExplainOutput,
  incidentAssist as incidentAssistFlow,
  type IncidentAssistInput,
  type IncidentAssistOutput,
} from '@/ai/flows/ai-assistant';
import {
    detectFraudSignals as detectFraudSignalsFlow,
    type DetectFraudSignalsInput,
    type DetectFraudSignalsOutput,
} from '@/ai/flows/fraud-detector';
import {headers} from 'next/headers';
import {FlowAuth} from 'genkit/flow';
import { authAdmin } from '@/lib/firebase-admin';

async function getAuth(): Promise<FlowAuth | undefined> {
  const authorization = headers().get('Authorization');
  if (authorization) {
    const idToken = authorization.substring(7);
    const decodedIdToken = await authAdmin.verifyIdToken(idToken);
    return {
      uid: decodedIdToken.uid,
      claims: decodedIdToken,
      scopes: [],
    };
  }
}

export async function whoAmI(): Promise<WhoAmIOutput> {
  const auth = await getAuth();
  return await whoAmIFlow(auth);
}

export async function setUserClaims(params: SetUserClaimsInput): Promise<SetUserClaimsOutput> {
  const auth = await getAuth();
  return await setUserClaimsFlow(params, auth);
}

export async function createCompany(params: CreateCompanyInput): Promise<CreateCompanyOutput> {
  const auth = await getAuth();
  return await createCompanyFlow(params, auth);
}

export async function createInvite(params: CreateInviteInput): Promise<CreateInviteOutput> {
  const auth = await getAuth();
  return await createInviteFlow(params, auth);
}

export async function acceptInvite(params: AcceptInviteInput): Promise<AcceptInviteOutput> {
  const auth = await getAuth();
  return await acceptInviteFlow(params, auth);
}

export async function upsertRenter(params: RenterType): Promise<UpsertRenterOutput> {
    const auth = await getAuth();
    return await upsertRenterFlow(params, auth);
}

export async function importRenters(params: ImportRentersInput): Promise<ImportRentersOutput> {
    const auth = await getAuth();
    return await importRentersFlow(params, auth);
}

export async function upsertRental(params: UpsertRentalInput): Promise<UpsertRentalOutput> {
  const auth = await getAuth();
  return await upsertRentalFlow(params, auth);
}

export async function deleteRental(params: DeleteRentalInput): Promise<DeleteRentalOutput> {
  const auth = await getAuth();
  return await deleteRentalFlow(params, auth);
}

export async function createIncident(params: CreateIncidentInput): Promise<CreateIncidentOutput> {
  const auth = await getAuth();
  return await createIncidentFlow(params, auth);
}

export async function recomputeRenterScore(params: RecomputeScoreInput): Promise<RecomputeScoreOutput> {
  const auth = await getAuth();
  return await recomputeRenterScoreFlow(params, auth);
}

export async function startDispute(params: StartDisputeInput): Promise<StartDisputeOutput> {
  const auth = await getAuth();
  return await startDisputeFlow(params, auth);
}

export async function postDisputeMessage(params: PostDisputeMessageInput): Promise<PostDisputeMessageOutput> {
  const auth = await getAuth();
  return await postDisputeMessageFlow(params, auth);
}

export async function updateDisputeStatus(params: UpdateDisputeStatusInput): Promise<UpdateDisputeStatusOutput> {
  const auth = await getAuth();
  return await updateDisputeStatusFlow(params, auth);
}

export async function seedStaging(params: SeedStagingInput): Promise<SeedStagingOutput> {
    const auth = await getAuth();
    return await seedStagingFlow(params, auth);
}

export async function health(): Promise<HealthOutput> {
    return await healthFlow();
}

export async function riskExplain(params: RiskExplainInput): Promise<RiskExplainOutput> {
    const auth = await getAuth();
    return await riskExplainFlow(params, auth);
}

export async function incidentAssist(params: IncidentAssistInput): Promise<IncidentAssistOutput> {
    const auth = await getAuth();
    return await incidentAssistFlow(params, auth);
}

export async function detectFraudSignals(params: DetectFraudSignalsInput): Promise<DetectFraudSignalsOutput> {
    const auth = await getAuth();
    return await detectFraudSignalsFlow(params, auth);
}
