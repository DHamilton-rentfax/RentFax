import { adminDB } from "@/firebase/server";

// This is a placeholder for the actual tenant branding logic.
// In a real application, this would fetch the tenant's branding information
// from a database or a configuration file.

export async function getTenantBranding(tenantId: string) {
    if (!tenantId) {
        return {
            companyName: "RentFAX",
            logoUrl: null, // or a default logo
        };
    }

    const tenantDoc = await adminDB.collection("companies").doc(tenantId).get();

    if (!tenantDoc.exists) {
        return {
            companyName: "RentFAX",
            logoUrl: null,
        };
    }

    const tenantData = tenantDoc.data();

    return {
        companyName: tenantData?.name || "RentFAX",
        logoUrl: tenantData?.logoUrl || null,
    };
}
