export default function SupportStaffHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support Staff Dashboard</h1>
        <p className="text-gray-600">
          Handle live chats, tickets, knowledge base content, and user lookups.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs font-semibold text-gray-500">Open Chats</div>
          <div className="text-3xl font-bold mt-2">0</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs font-semibold text-gray-500">Open Tickets</div>
          <div className="text-3xl font-bold mt-2">0</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs font-semibold text-gray-500">Articles Drafted</div>
          <div className="text-3xl font-bold mt-2">0</div>
        </div>
      </div>
    </div>
  );
}