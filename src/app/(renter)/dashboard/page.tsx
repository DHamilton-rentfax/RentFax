'use client'

import { useEffect, useState } from 'react'
import { getRenterDisputes } from '@/lib/getRenterDisputes'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function RenterDashboard() {
  const [loading, setLoading] = useState(true)
  const [disputes, setDisputes] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await getRenterDisputes()
      setDisputes(res || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4 text-gray-500" />
      case 'reviewing':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Renter Dashboard</h1>
          <Link href="/renter/disputes/new">
            <Button className="bg-primary hover:bg-primary/90">+ New Dispute</Button>
          </Link>
        </div>

        {/* Score Card */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle>Rental Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">720</p>
            <p className="text-sm text-gray-500">Excellent standing</p>
          </CardContent>
        </Card>

        {/* Disputes */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle>Your Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            {disputes.length === 0 ? (
              <p className="text-gray-500 text-sm">No disputes found.</p>
            ) : (
              <div className="divide-y">
                {disputes.map((d) => (
                  <div key={d.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{d.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(d.createdAt?.toDate?.() || d.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStatusIcon(d.status)}
                      <span className="text-sm capitalize text-gray-600">{d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
