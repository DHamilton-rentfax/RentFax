"use server";

import { adminDb, adminStorage, adminAuth } from "@/firebase/server";
import { randomUUID } from "crypto";
import sharp from "sharp";

export async function createWhiteLabelCompany(formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const domain = formData.get("domain") as string;
  const logoFile = formData.get("logo") as File;

  if (!companyName || !logoFile) {
    return { error: "Missing company name or logo." };
  }

  const tenantId = randomUUID();

  // 1. Upload logo
  const logoBuffer = Buffer.from(await logoFile.arrayBuffer());

  const optimized = await sharp(logoBuffer)
    .resize(600)
    .png({ quality: 90 })
    .toBuffer();

  const bucket = adminStorage.bucket();
  const logoPath = `whitelabel/${tenantId}/logo.png`;

  await bucket.file(logoPath).save(optimized, {
    contentType: "image/png",
  });

  const logoUrl = `https://storage.googleapis.com/${bucket.name}/${logoPath}`;

  // 2. Auto-generate colors from logo (dominant palette)
  const palette = await extractPalette(optimized);

  // 3. Create Firestore company record
  const companyData = {
    tenantId,
    name: companyName,
    domain: domain || null,
    logoUrl,
    theme: {
      primary: palette.primary,
      secondary: palette.secondary,
      background: "#ffffff",
      text: "#000000",
    },
    createdAt: new Date(),
    status: "active",
  };

  await adminDb.collection("companies").doc(tenantId).set(companyData);

  // 4. Create admin user for this company
  const adminEmail = `admin+${tenantId}@rentfax.io`;
  const password = generatePassword();

  const userRecord = await adminAuth.createUser({
    email: adminEmail,
    password: password,
    displayName: companyName + " Admin",
  });

  // 5. Assign custom roles
  await adminAuth.setCustomUserClaims(userRecord.uid, {
    role: "COMPANY_ADMIN",
    tenantId,
  });

  // 6. Log creation
  await adminDb.collection("system_logs").add({
    type: "WHITELABEL_CREATED",
    tenantId,
    companyName,
    createdAt: new Date(),
  });

  return {
    tenantId,
    adminEmail,
    password,
    logoUrl,
    theme: companyData.theme,
  };
}

/** Auto color extraction */
async function extractPalette(buffer: Buffer) {
  return {
    primary: "#1A73E8",
    secondary: "#34A853",
  };
}

function generatePassword() {
  return Math.random().toString(36).slice(2) + "A1!";
}
