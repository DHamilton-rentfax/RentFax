import StrictVerificationToggle from "@/components/settings/StrictVerificationToggle";

export default function CompanySettingsPage() {
  // In a real app, you would fetch the company's data
  const company = {
    id: "test-company-id",
    settings: {
      strictVerification: false,
    },
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Company Settings</h1>
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Incident Management</h2>
        <StrictVerificationToggle
          companyId={company.id}
          initialValue={company.settings.strictVerification}
        />
      </div>
    </div>
  );
}
