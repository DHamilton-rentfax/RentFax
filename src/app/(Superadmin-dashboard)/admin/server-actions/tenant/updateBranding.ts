'use server';

import { adminDB } from "@/firebase/server";

export async function updateTenantBranding(payload: {
  tenantId: string;
  name: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}) {
  await adminDB.collection("companies").doc(payload.tenantId).update({
    name: payload.name,
    theme: payload.theme,
    updatedAt: new Date(),
  });

  return { success: true };
}
