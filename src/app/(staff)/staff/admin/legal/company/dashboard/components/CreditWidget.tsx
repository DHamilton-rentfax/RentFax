'use client'
import { useEffect, useState } from 'react'

export default function CreditWidget() {
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/credits')
      .then((r) => r.json())
      .then((d) => setCredits(d.creditsRemaining))
  }, [])

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
      <p className="text-blue-900 font-medium">
        Remaining Verification Credits: {credits ?? '...'}
      </p>
      <a href="/pricing" className="text-blue-700 hover:underline text-sm font-semibold">
        Add Credits
      </a>
    </div>
  )
}
