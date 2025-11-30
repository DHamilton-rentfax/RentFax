'use client';
import BillingSummary from "@/components/billing/BillingSummary";
import InvoiceList from "@/components/billing/InvoiceList";
import BillingInsights from "@/components/billing/BillingInsights";
import { useAuth } from "@/hooks/use-auth";

export default function BillingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Billing & Invoices</h1>

        {user ? (
          <>
            <BillingSummary userEmail={user.email!} />
            <InvoiceList userEmail={user.email!} />
            <BillingInsights userEmail={user.email!} />
          </>
        ) : (
          <div className="text-gray-600 bg-white p-6 rounded-xl border">
            Please log in to view your billing details.
          </div>
        )}
      </div>
    </div>
  );
}
