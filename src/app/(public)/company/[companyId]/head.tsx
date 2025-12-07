import { adminDb } from "@/firebase/server";

export default async function Head({ params }) {
  const doc = await adminDb.collection("companies").doc(params.companyId).get();
  const company = doc.data() || {};

  return (
    <>
      <title>{company.name || "Company"} — RentFAX</title>
      <meta
        name="description"
        content={
          company.description ||
          "Verified rental company profile on RentFAX. Transparency and accountability in the rental industry."
        }
      />
      <meta property="og:title" content={company.name} />
      <meta property="og:type" content="business" />
      <meta
        property="og:description"
        content={company.description || "View verified rental company profile on RentFAX."}
      />
    </>
  );
}
