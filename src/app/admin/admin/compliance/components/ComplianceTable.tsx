export default function ComplianceTable({ banners }: { banners: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-[#1A2540]">Acknowledgment Logs</h2>

      <div className="overflow-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 border-b text-[#1A2540]">
            <tr>
              <th className="p-2 text-left">Policy</th>
              <th className="p-2">Audience</th>
              <th className="p-2">Acknowledged Users</th>
              <th className="p-2">Roles</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{b.title}</td>
                <td className="p-2 text-center">{b.audience}</td>
                <td className="p-2 text-center font-semibold text-green-700">
                  {b.acknowledgments?.length || 0}
                </td>
                <td className="p-2 text-center text-gray-600">
                  {b.acknowledgments
                    ?.map((a: any) => a.role)
                    .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i)
                    .join(', ') || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
