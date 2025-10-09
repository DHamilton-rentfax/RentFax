'use client'
import { useState } from 'react'
import { Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DisputeAISummary({ dispute }: { dispute:any }) {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [pdf, setPdf] = useState<string | null>(null)

  const generate = async () => {
    setLoading(true)
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ dispute }),
    })
    const data = await res.json()
    setSummary(data.text)
    setPdf(data.file)
    setLoading(false)
  }

  return (
    <div className="border-t pt-4 mt-6">
      <h2 className="font-semibold text-lg mb-2 flex items-center"><FileText className="w-4 h-4 mr-2"/>AI Summary</h2>
      {!summary ? (
        <Button onClick={generate} disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Generating...</> : 'Generate AI Summary'}
        </Button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm whitespace-pre-wrap">{summary}</p>
          {pdf && (
            <a href={pdf} target="_blank" className="text-blue-600 underline text-sm">
              Download PDF Summary
            </a>
          )}
        </div>
      )}
    </div>
  )
}
