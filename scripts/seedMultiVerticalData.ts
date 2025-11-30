import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}
const db = admin.firestore();

async function seed() {
  console.log("🌱 Seeding multi-vertical RentFAX demo data...");

  const verticals = ["property", "vehicle", "equipment"] as const;

  for (const type of verticals) {
    // renters
    for (let i = 0; i < 4; i++) {
      const renterRef = await db.collection("renters").add({
        name: `${type}-renter-${i}`,
        rentalType: type,
        status: ["Good", "Flagged", "Pending"][i % 3],
        demo: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // reports
      for (let j = 0; j < 3; j++) {
        await db.collection("reports").add({
          renterId: renterRef.id,
          rentalType: type,
          score: 60 + Math.floor(Math.random() * 40),
          summary: `Demo ${type} report ${j}`,
          demo: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    // fraud signals
    await db.collection("fraudSignals").add({
      rentalType: type,
      issue: `Example ${type} anomaly`,
      severity: "Medium",
      demo: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // template
    await db.collection("reportTemplates").doc(type).set({
      rentalType: type,
      sections: [
        {
          title: "Condition",
          questions:
            type === "property"
              ? ["Was the property clean?", "Any damages?"]
              : type === "vehicle"
              ? ["Vehicle condition?", "Fuel level?", "Mileage noted?"]
              : ["Equipment operational?", "Missing components?"],
        },
        {
          title: "Behavior",
          questions: [
            "Was the renter on time?",
            "Were payments consistent?",
            "Any issues reported?",
          ],
        },
      ],
      demo: true,
    });
  }

  console.log("✅ Demo vertical data seeded.");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
