
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function VerifyPage() {
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading')
  const [message, setMessage] = useState('')
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided in the URL.');
        return;
      }
      try {
        const res = await fetch('/api/renter/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        const data = await res.json()
        if (data.success) {
          setStatus('success')
          setTimeout(() => router.push('/renter/disputes/new'), 2000)
        } else {
          setStatus('error')
          setMessage(data.message)
        }
      } catch (e) {
          setStatus('error');
          setMessage('An unexpected error occurred.')
      }
    }
    verify()
  }, [token, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {status === 'loading' && (
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p>Verifying your link...</p>
        </div>
      )}
      {status === 'success' && (
        <div className="text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="font-semibold">Verification successful!</p>
          <p>Redirecting to your dispute form...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="font-semibold mb-1">Verification failed</p>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      )}
    </div>
  )
}
