export function Ledger() {
  // Placeholder data - in a real implementation, you would fetch this from your database
  const ledgerEntries = [
    {
      date: new Date().toISOString(),
      action: "CREDIT_CONSUMED",
      reason: "SEARCH",
      reportId: "N/A",
      amount: "-1",
      balance: "99",
      actor: "system",
    },
    {
      date: new Date().toISOString(),
      action: "CREDIT_GRANTED",
      reason: "INITIAL_PLAN",
      reportId: "N/A",
      amount: "+100",
      balance: "100",
      actor: "system",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Billing Ledger</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Action</th>
              <th className="py-2 px-4 border-b">Reason</th>
              <th className="py-2 px-4 border-b">Report ID</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Balance After</th>
              <th className="py-2 px-4 border-b">Actor</th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((entry, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{new Date(entry.date).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{entry.action}</td>
                <td className="py-2 px-4 border-b">{entry.reason}</td>
                <td className="py-2 px-4 border-b">{entry.reportId}</td>
                <td className="py-2 px-4 border-b">{entry.amount}</td>
                <td className="py-2 px-4 border-b">{entry.balance}</td>
                <td className="py-2 px-4 border-b">{entry.actor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
