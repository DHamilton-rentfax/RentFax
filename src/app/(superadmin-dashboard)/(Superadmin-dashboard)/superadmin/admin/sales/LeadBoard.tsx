export default function LeadBoard({ leads }: { leads: any[] }) {
  const stages = ["NEW", "CONTACTED", "QUALIFIED", "DEMO", "NEGOTIATING", "CLOSED"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {stages.map((stage) => (
        <div key={stage} className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">{stage}</h2>

          <div className="space-y-3">
            {leads
              .filter((l) => l.stage === stage)
              .map((l) => (
                <div key={l.id} className="p-3 border rounded-lg bg-gray-50">
                  <p className="font-medium">{l.companyName}</p>
                  <p className="text-sm text-gray-600">{l.contactName}</p>
                  <p className="text-xs text-gray-400">{l.email}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
