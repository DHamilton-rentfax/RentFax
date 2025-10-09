
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyRenter } from '@/lib/verifyRenter'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RenterVerifyPage() {
  const [form, setForm] = useState({ name: '', email: '', code: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await verifyRenter({ ...form, id })
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => router.push('/renter/disputes/new'), 1500)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Renter Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                name="code"
                placeholder="Verification Code"
                value={form.code}
                onChange={handleChange}
                required
              />
              {error && (
                <p className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" /> {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-semibold">Verification successful!</p>
              <p className="text-sm text-gray-500">
                Redirecting to your dispute form...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
