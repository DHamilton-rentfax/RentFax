import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "fake-api-key",
  authDomain: "demo.rentfax.io",
  projectId: "rentfax-demo"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDemo() {
  await setDoc(doc(db, "demo_renters", "r1"), {
    email: "demo.renter@rentfax.io",
    alert: true,
    signals: ["duplicate_email", "id_mismatch"]
  });

  await setDoc(doc(db, "demo_companies", "c1"), {
    name: "Demo Property Management",
    uploadedRenters: ["r1"]
  });

  await setDoc(doc(db, "demo_disputes", "d1"), {
    status: "open",
    renterId: "r1",
    companyId: "c1",
    amount: 500
  });

  console.log("✅ Demo data seeded");
}

seedDemo().then(() => process.exit(0));
