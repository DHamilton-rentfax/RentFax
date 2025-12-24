'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth' // your existing client auth hook

export default function UnlockReportButtons(props: {
  renterId: string
  reportId: string
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [busy, setBusy] = useState<'BASIC' | 'FULL' | null>(null)

  const nextUrl = useMemo(() => {
    return `/r/${encodeURIComponent(props.renterId)}?report=${encodeURIComponent(props.reportId)}`
  }, [props.renterId, props.reportId])

  const startCheckout = async (level: 'BASIC' | 'FULL') => {
    if (loading) return
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(nextUrl)}`)
      return
    }

    try {
      setBusy(level)
      const res = await fetch('/api/checkout/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          renterId: props.renterId,
          reportId: props.reportId,
          level,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Checkout failed')
      window.location.href = data.url
    } catch (e: any) {
      alert(e.message || 'Could not start checkout')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <Button onClick={() => startCheckout('BASIC')} disabled={busy !== null}>
        {busy === 'BASIC' ? 'Redirecting…' : 'Unlock Basic ($4.99)'}
      </Button>
      <Button onClick={() => startCheckout('FULL')} disabled={busy !== null} variant="secondary">
        {busy === 'FULL' ? 'Redirecting…' : 'Unlock Full ($20)'}
      </Button>
    </div>
  )
}
