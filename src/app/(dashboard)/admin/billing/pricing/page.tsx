import { FieldValue } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { adminDB } from "@/firebase/server";

/**
 * Shape of the pricing config stored at:
 *   billing_config/pricing
 */
type SmallLandlordConfig = {
  monthly?: number;
  includedReports?: number;
};

type CompanyPlanConfig = {
  monthly?: number;
  includedReports?: number;
  overage?: number;
};

type PricingConfig = {
  identityCheck?: number;
  fullReport?: number;
  smallLandlord?: SmallLandlordConfig;
  companyBasic?: CompanyPlanConfig;
  companyPro?: CompanyPlanConfig;
  renterVerifiedBadge?: number;
  renterSmsAlerts?: number;
};

/**
 * SERVER ACTION: save pricing config
 */
async function savePricing(formData: FormData) {
  "use server";

  // TODO: wire this to your actual auth (e.g. decoded Firebase token / session cookie)
  const updatedBy = "SUPER_ADMIN_DASHBOARD";

  // Parse numbers safely
  const num = (value: FormDataEntryValue | null) =>
    value ? Number.parseFloat(String(value)) || 0 : 0;

  const payload: PricingConfig = {
    identityCheck: num(formData.get("identityCheck")),
    fullReport: num(formData.get("fullReport")),
    smallLandlord: {
      monthly: num(formData.get("smallLandlord_monthly")),
      includedReports: num(formData.get("smallLandlord_includedReports")),
    },
    companyBasic: {
      monthly: num(formData.get("companyBasic_monthly")),
      includedReports: num(formData.get("companyBasic_includedReports")),
      overage: num(formData.get("companyBasic_overage")),
    },
    companyPro: {
      monthly: num(formData.get("companyPro_monthly")),
      includedReports: num(formData.get("companyPro_includedReports")),
      overage: num(formData.get("companyPro_overage")),
    },
    renterVerifiedBadge: num(formData.get("renterVerifiedBadge")),
    renterSmsAlerts: num(formData.get("renterSmsAlerts")),
  };

  const docRef = adminDB.collection("billing_config").doc("pricing");
  const currentSnap = await docRef.get();
  const beforeData = currentSnap.exists ? currentSnap.data() : null;

  // Write new config
  await docRef.set(payload, { merge: true });

  // Audit log
  await adminDB.collection("billing_config_audit").add({
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy,
    before: beforeData,
    after: payload,
  });

  // Back to the same page (forces a fresh fetch)
  redirect("/admin/billing/pricing");
}

export default async function SuperAdminPricingPage() {
  // Load existing pricing (or defaults)
  const snap = await adminDB.collection("billing_config").doc("pricing").get();
  const data = (snap.exists ? (snap.data() as PricingConfig) : {}) || {};

  const identityCheck = data.identityCheck ?? 4.99;
  const fullReport = data.fullReport ?? 20;

  const smallLandlord = data.smallLandlord || {};
  const companyBasic = data.companyBasic || {};
  const companyPro = data.companyPro || {};

  const renterVerifiedBadge = data.renterVerifiedBadge ?? 14.99;
  const renterSmsAlerts = data.renterSmsAlerts ?? 1.99;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Billing & Pricing Configuration
        </h1>
        <p className="text-gray-500 text-sm">
          Super Admin only. Changes here affect identity checks, full reports,
          and all subscription plans globally.
        </p>
      </header>

      <form action={savePricing} className="space-y-8">
        {/* SECTION: Core Prices */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Core Transaction Prices
          </h2>
          <p className="text-sm text-gray-500">
            These are the default prices used whenever a user runs an identity
            check or full RentFAX report outside of a subscription.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <Field
              label="Identity Check Price (USD)"
              name="identityCheck"
              defaultValue={identityCheck}
              help="$4.99 per identity check (recommended)"
            />
            <Field
              label="Full Report Price (USD)"
              name="fullReport"
              defaultValue={fullReport}
              help="$20.00 per full RentFAX report (recommended)"
            />
          </div>
        </section>

        {/* SECTION: Small Landlord Plan */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Small Landlord Plan
          </h2>
          <p className="text-sm text-gray-500">
            This is the optional $29/mo plan for individual landlords with a few properties.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <Field
              label="Monthly Price (USD)"
              name="smallLandlord_monthly"
              defaultValue={smallLandlord.monthly ?? 29}
              help="Default: 29.00"
            />
            <Field
              label="Included Reports / Month"
              name="smallLandlord_includedReports"
              defaultValue={smallLandlord.includedReports ?? 10}
              help="Default: 10 full reports"
            />
          </div>
        </section>

        {/* SECTION: Company Basic */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Company Basic Plan
          </h2>
          <p className="text-sm text-gray-500">
            For property managers and companies at the $149/mo tier.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <Field
              label="Monthly Price (USD)"
              name="companyBasic_monthly"
              defaultValue={companyBasic.monthly ?? 149}
              help="Default: 149.00"
            />
            <Field
              label="Included Reports / Month"
              name="companyBasic_includedReports"
              defaultValue={companyBasic.includedReports ?? 50}
              help="Default: 50 reports"
            />
            <Field
              label="Overage Price per Report (USD)"
              name="companyBasic_overage"
              defaultValue={companyBasic.overage ?? 10}
              help="Default: 10.00"
            />
          </div>
        </section>

        {/* SECTION: Company Pro */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Company Pro Plan
          </h2>
          <p className="text-sm text-gray-500">
            Higher-volume tier (e.g., $299/mo with 200 reports, $8 overage).
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <Field
              label="Monthly Price (USD)"
              name="companyPro_monthly"
              defaultValue={companyPro.monthly ?? 299}
              help="Default: 299.00"
            />
            <Field
              label="Included Reports / Month"
              name="companyPro_includedReports"
              defaultValue={companyPro.includedReports ?? 200}
              help="Default: 200 reports"
            />
            <Field
              label="Overage Price per Report (USD)"
              name="companyPro_overage"
              defaultValue={companyPro.overage ?? 8}
              help="Default: 8.00"
            />
          </div>
        </section>

        {/* SECTION: Renter Add-Ons */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Renter Add-On Pricing
          </h2>
          <p className="text-sm text-gray-500">
            These affect the upsell options presented inside the renter portal.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <Field
              label="Verified Profile Badge / Year (USD)"
              name="renterVerifiedBadge"
              defaultValue={renterVerifiedBadge}
              help="Default: 14.99/year"
            />
            <Field
              label="SMS Alert Add-on / Month (USD)"
              name="renterSmsAlerts"
              defaultValue={renterSmsAlerts}
              help="Default: 1.99/month"
            />
          </div>
        </section>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition"
          >
            Save Pricing
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Small helper for labeled numeric inputs
 */
function Field({
  label,
  name,
  defaultValue,
  help,
}: {
  label: string;
  name: string;
  defaultValue?: number;
  help?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-800" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        step="0.01"
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
      />
      {help && <p className="text-xs text-gray-400">{help}</p>}
    </div>
  );
}
