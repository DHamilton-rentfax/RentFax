'use server';
import { whoAmI as whoAmIFlow } from '@/ai/flows/who-am-i';
import { setUserClaims as setUserClaimsFlow } from '@/ai/flows/set-user-claims';

type SetUserClaimsParams = {
    uid: string;
    role: string;
    companyId: string;
}

export async function whoAmI() {
    return await whoAmIFlow();
}

export async function setUserClaims({ uid, role, companyId }: SetUserClaimsParams) {
    return await setUserClaimsFlow({ uid, role, companyId });
}
