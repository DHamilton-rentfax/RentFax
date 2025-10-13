'use client'
import { useState } from 'react'
import DisputeDetails from './DisputeDetails'
import StatusBadge from './StatusBadge'

export default function DisputeTable({ data }: { data: any[] }) {
  const [selected, setSelected] = useState<any | null>(null)

  return (
    <div className="overflow-x-auto border rounded-lg bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 text-left font-medium">Report ID</th>
            <th className="p-3 text-left font-medium">Message</th>
            <th className="p-3 text-left font-medium">Status</th>
            <th className="p-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{d.reportId}</td>
              <td className="p-3 truncate max-w-xs">{d.message}</td>
              <td className="p-3"><StatusBadge status={d.status} /></td>
              <td className="p-3 text-right">
                <button
                  onClick={() => setSelected(d)}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && <DisputeDetails dispute={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
