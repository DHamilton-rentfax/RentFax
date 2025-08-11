'use server';
import { whoAmI as whoAmIFlow } from '@/ai/flows/who-am-i';
import { setUserClaims as setUserClaimsFlow } from '@/ai/flows/set-user-claims';
import { createCompany as createCompanyFlow } from '@/ai/flows/create-company';
import { createInvite as createInviteFlow, acceptInvite as acceptInviteFlow } from '@/ai/flows/invites';
import { upsertRental as upsertRentalFlow, deleteRental as deleteRentalFlow } from '@/ai/flows/rentals';
import { createIncident as createIncidentFlow } from '@/ai/flows/incidents';
import { recomputeRenterScore as recomputeRenterScoreFlow } from '@/ai/flows/risk-scorer';
import { startDispute as startDisputeFlow, postDisputeMessage as postDisputeMessageFlow, updateDisputeStatus as updateDisputeStatusFlow } from '@/ai/flows/disputes';


export async function whoAmI() {
    return await whoAmIFlow();
}

type SetUserClaimsParams = {
    uid: string;
    role: string;
    companyId?: string;
}
export async function setUserClaims({ uid, role, companyId }: SetUserClaimsParams) {
    return await setUserClaimsFlow({ uid, role, companyId });
}


type CreateCompanyParams = {
    name: string;
}
export async function createCompany({ name }: CreateCompanyParams) {
    return await createCompanyFlow({ name });
}

type CreateInviteParams = {
    email: string;
    role: 'manager' | 'agent' | 'collections' | 'renter';
}
export async function createInvite({ email, role }: CreateInviteParams) {
    return await createInviteFlow({ email, role });
}

type AcceptInviteParams = {
    token: string;
}
export async function acceptInvite({ token }: AcceptInviteParams) {
    return await acceptInviteFlow({ token });
}

type UpsertRentalParams = {
    id?: string;
    renterId: string;
    vehicleId: string;
    startAt: string;
    endAt: string;
    status: 'active' | 'completed' | 'cancelled' | 'overdue';
    depositAmount?: number;
    dailyRate?: number;
    notes?: string;
    contractUrl?: string;
}

export async function upsertRental(params: UpsertRentalParams) {
    return await upsertRentalFlow(params);
}

type DeleteRentalParams = {
    id: string;
}

export async function deleteRental({id}: DeleteRentalParams) {
    return await deleteRentalFlow({id});
}

type CreateIncidentParams = {
    renterId: string;
    rentalId?: string | null;
    type: string;
    severity: 'minor' | 'major' | 'severe';
    amount?: number;
    notes?: string;
    attachments?: Array<{ name: string; path: string; thumbPath?: string }>;
}

export async function createIncident(params: CreateIncidentParams) {
    return await createIncidentFlow(params);
}

type RecomputeScoreParams = {
    renterId: string;
}
export async function recomputeRenterScore(params: RecomputeScoreParams) {
    return await recomputeRenterScoreFlow(params);
}


type StartDisputeParams = {
    renterId: string;
    incidentId: string;
    reason: string;
    message?: string;
    attachments?: Array<{ name: string; path: string; }>;
}
export async function startDispute(params: StartDisputeParams) {
    return await startDisputeFlow(params);
}

type PostDisputeMessageParams = {
    disputeId: string;
    text: string;
}
export async function postDisputeMessage(params: PostDisputeMessageParams) {
    return await postDisputeMessageFlow(params);
}

type UpdateDisputeStatusParams = {
    disputeId: string;
    status: 'open' | 'needs_info' | 'resolved' | 'rejected';
}
export async function updateDisputeStatus(params: UpdateDisputeStatusParams) {
    return await updateDisputeStatusFlow(params);
}
