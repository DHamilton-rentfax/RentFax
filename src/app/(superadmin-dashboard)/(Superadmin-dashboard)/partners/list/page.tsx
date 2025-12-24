'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Partner = {
  id: string
  name: string
  status: 'free' | 'trial' | 'paid'
}

export default function PartnerListPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/partners/billing')
      .then(r => r.json())
      .then(d => {
        setPartners(d.partners || [])
        setLoading(false)
      })
  }, [])

  const convertToPaid = async (partnerId: string) => {
    if (!confirm('Convert this partner to PAID?')) return
    await fetch('/api/admin/partners/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId }),
    })
    setPartners(p =>
      p.map(x => x.id === partnerId ? { ...x, status: 'paid' } : x)
    )
  }

  if (loading) return <p>Loading partners…</p>

  return (
    <div className="space-y-4">
      {partners.map(p => (
        <Card key={p.id} className="p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-muted">Status: {p.status}</p>
          </div>
          {p.status !== 'paid' && (
            <Button onClick={() => convertToPaid(p.id)}>
              Convert to Paid
            </Button>
          )}
        </Card>
      ))}
    </div>
  )
}
