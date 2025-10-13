'use client'

import { useEffect, useState } from 'react'
import DisputeTable from './components/DisputeTable'
import { Loader2 } from 'lucide-react'

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/disputes')
        const data = await res.json()
        setDisputes(data.disputes || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Renter Disputes</h1>
      {loading ? (
        <div className="flex items-center text-gray-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading disputes...
        </div>
      ) : (
        <DisputeTable data={disputes} />
      )}
    </div>
  )
}
