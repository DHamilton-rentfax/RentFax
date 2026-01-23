"use server";
/**
 * @fileOverview A Genkit flow for seeding staging data.
 * Restricted to users with 'superadmin' role.
 */
import { z } from "genkit";
import { FlowAuth } from "genkit/flow";

import { ai } from "@/ai/genkit";
import { admin, adminDb as db, adminAuth } from "@/firebase/server";

type Role =
  | "owner"
  | "manager"
  | "agent"
  | "collections"
  | "renter"
  | "superadmin";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

const SeedStagingInputSchema = z.object({
  companyName: z.string().optional().default("RentFAX Demo Co"),
  ownerEmail: z.string().email().optional(),
  managerEmail: z.string().email().optional(),
  overwrite: z.boolean().optional().default(false),
});
export type SeedStagingInput = z.infer<typeof SeedStagingInputSchema>;

const SeedStagingOutputSchema = z.object({
  ok: z.boolean(),
  companyId: z.string(),
  ownerEmail: z.string(),
  managerEmail: z.string(),
  renters: z.number(),
  rentals: z.number(),
  incidents: z.number(),
});
export type SeedStagingOutput = z.infer<typeof SeedStagingOutputSchema>;

function assertNotProd() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("This function cannot run in production.");
  }
}

export async function seedStaging(
  input: SeedStagingInput,
  auth?: FlowAuth,
): Promise<SeedStagingOutput> {
  return seedStagingFlow(input, auth);
}

const seedStagingFlow = ai.defineFlow(
  {
    name: "seedStagingFlow",
    inputSchema: SeedStagingInputSchema,
    outputSchema: SeedStagingOutputSchema,
    authPolicy: async (auth, input) => {
      assertNotProd(); // Seeder Lock
      if (!auth) {
        throw new Error("Authentication is required.");
      }
      const caller = await adminAuth.getUser(auth.uid);
      const callerClaims = caller.customClaims || {};
      if (callerClaims.role !== "superadmin") {
        throw new Error("Permission denied: Superadmin only.");
      }
    },
  },
  async (data) => {
    const { companyName = "RentFAX Demo Co", overwrite = false } = data;
    const ownerEmail =
      data.ownerEmail || `owner.demo+${Date.now()}@example.com`;
    const managerEmail =
      data.managerEmail || `manager.demo+${Date.now()}@example.com`;

    const slug = slugify(companyName);
    let companyId: string | undefined;

    // 1) Company: create or reuse
    const existing = await db
      .collection("companies")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!existing.empty && !overwrite) {
      companyId = existing.docs[0].id;
    } else if (!existing.empty && overwrite) {
      companyId = existing.docs[0].id;
      await db.doc(`companies/${companyId}`).set(
        {
          name: companyName,
          slug,
          plan: "pro",
          status: "active",
          brand: { primary: "#3F51B5" },
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    } else {
      const newCompanyRef = db.collection("companies").doc();
      companyId = newCompanyRef.id;
      await newCompanyRef.set({
        name: companyName,
        slug,
        plan: "pro",
        status: "active",
        seats: 5,
        timezone: "America/New_York",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 2) Users & Claims (owner + manager)
    const ensureUser = async (email: string, role: Role) => {
      let user: admin.auth.UserRecord;
      try {
        user = await admin.auth().getUserByEmail(email);
      } catch {
        user = await admin
          .auth()
          .createUser({ email, emailVerified: true, password: "Password123!" });
      }
      await admin.auth().setCustomUserClaims(user.uid, { role, companyId });
      await admin.auth().revokeRefreshTokens(user.uid);
      return user.uid;
    };

    const ownerUid = await ensureUser(ownerEmail, "owner");
    const managerUid = await ensureUser(managerEmail, "manager");

    // 3) Renters
    const renters = [
      {
        name: "Ava Lopez",
        licenseState: "CA",
        licenseNumber: "X1234567",
        dob: "1994-02-14",
        email: `ava-${slug}@example.com`,
      },
      {
        name: "Ben Tran",
        licenseState: "NV",
        licenseNumber: "NV998877",
        dob: "1990-06-09",
        email: `ben-${slug}@example.com`,
      },
      {
        name: "Casey Kim",
        licenseState: "AZ",
        licenseNumber: "AZ443322",
        dob: "1988-11-23",
        email: `casey-${slug}@example.com`,
      },
      {
        name: "Drew Singh",
        licenseState: "OR",
        licenseNumber: "OR246810",
        dob: "1997-04-30",
        email: `drew-${slug}@example.com`,
      },
      {
        name: "Elle Garcia",
        licenseState: "UT",
        licenseNumber: "UT135791",
        dob: "1992-01-05",
        email: `elle-${slug}@example.com`,
      },
      {
        name: "Finn Patel",
        licenseState: "CA",
        licenseNumber: "CA7654321",
        dob: "1995-08-17",
        email: `finn-${slug}@example.com`,
      },
    ];

    const renterIds: string[] = [];
    for (const r of renters) {
      const ref = await db.collection("renters").add({
        companyId,
        ...r,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        riskScore: 100,
        status: "Good Standing",
      });
      renterIds.push(ref.id);
    }

    // 4) Rentals
    const now = Date.now();
    const rentals = [
      {
        renterId: renterIds[0],
        vehicleId: "VEH-SEDAN-001",
        startAt: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
        endAt: new Date(now + 2 * 24 * 3600 * 1000).toISOString(),
        status: "active",
        dailyRate: 69,
        depositAmount: 200,
      },
      {
        renterId: renterIds[1],
        vehicleId: "VEH-SUV-002",
        startAt: new Date(now - 14 * 24 * 3600 * 1000).toISOString(),
        endAt: new Date(now - 7 * 24 * 3600 * 1000).toISOString(),
        status: "completed",
        dailyRate: 89,
        depositAmount: 250,
      },
      {
        renterId: renterIds[2],
        vehicleId: "VEH-TRUCK-003",
        startAt: new Date(now - 5 * 24 * 3600 * 1000).toISOString(),
        endAt: new Date(now - 1 * 24 * 3600 * 1000).toISOString(),
        status: "overdue",
        dailyRate: 99,
        depositAmount: 300,
      },
      {
        renterId: renterIds[3],
        vehicleId: "VEH-SEDAN-004",
        startAt: new Date(now + 1 * 24 * 3600 * 1000).toISOString(),
        endAt: new Date(now + 4 * 24 * 3600 * 1000).toISOString(),
        status: "active",
        dailyRate: 75,
        depositAmount: 200,
      },
    ];

    const rentalIds: string[] = [];
    for (const x of rentals) {
      const ref = await db.collection("rentals").add({
        companyId,
        ...x,
        notes: "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      rentalIds.push(ref.id);
    }

    // 5) Incidents
    const incidents = [
      {
        renterId: renterIds[0],
        rentalId: rentalIds[0],
        type: "smoking",
        severity: "major",
        amount: 150,
        notes: "Cigarette smell, ash",
      },
      {
        renterId: renterIds[1],
        rentalId: rentalIds[1],
        type: "late_return",
        severity: "minor",
        amount: 50,
        notes: "Returned 2 hours late",
      },
      {
        renterId: renterIds[2],
        rentalId: rentalIds[2],
        type: "damage",
        severity: "severe",
        amount: 850,
        notes: "Front bumper damage",
      },
      {
        renterId: renterIds[4],
        rentalId: null,
        type: "unauthorized_driver",
        severity: "major",
        amount: 0,
        notes: "Secondary driver not on contract",
      },
      {
        renterId: renterIds[5],
        rentalId: null,
        type: "other",
        severity: "minor",
        amount: 25,
        notes: "Cleaning fee",
      },
    ];
    const incidentIds: string[] = [];
    const recomputePromises = [];
    for (const i of incidents) {
      const ref = await db.collection("incidents").add({
        companyId,
        attachments: [],
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ...i,
      });
      incidentIds.push(ref.id);
      recomputePromises.push(
        db.doc(`renters/${i.renterId}`).update({
          riskScore: Math.max(0, 100 - (i.amount || 0) / 10), // simplified logic
          scoreUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }),
      );
    }
    await Promise.all(recomputePromises);

    // 6) Disputes
    const disputes = [
      {
        renterId: renterIds[0],
        incidentId: incidentIds[0],
        status: "open",
        reason: "smoking_fee",
        messages: [
          {
            by: "renter",
            uid: "demo-renter-uid",
            text: "I do not smoke; this is wrong.",
            at: new Date().toISOString(),
          },
        ],
      },
      {
        renterId: renterIds[1],
        incidentId: incidentIds[1],
        status: "resolved",
        reason: "late_return",
        messages: [
          {
            by: "company",
            uid: managerUid,
            text: "Waived 50% as courtesy.",
            at: new Date().toISOString(),
          },
        ],
      },
    ];
    for (const d of disputes) {
      await db.collection("disputes").add({
        companyId,
        renterUid: null,
        attachments: [],
        slaDueAt: admin.firestore.Timestamp.fromMillis(
          Date.now() + 7 * 24 * 3600 * 1000,
        ),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...d,
      });
    }

    // 7) Public rules
    await db.doc(`companyRules/${companyId}`).set(
      {
        driverEligibility:
          "Valid license, 25+, no major violations in last 3 years.",
        fees: "Deposit $200–$300; late return $25/hr.",
        smoking: "Strictly no smoking. $150 fee for violations.",
        other: "Additional terms may apply.",
      },
      { merge: true },
    );

    return {
      ok: true,
      companyId,
      ownerEmail,
      managerEmail,
      renters: renterIds.length,
      rentals: rentalIds.length,
      incidents: incidentIds.length,
    };
  },
);
