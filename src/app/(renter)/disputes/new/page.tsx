'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDispute } from '@/lib/createDispute'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Loader2 } from 'lucide-react'

export default function NewDisputePage() {
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => setFiles(e.target.files)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await createDispute({ description, files })
    setLoading(false)

    if (result.success) {
      setMessage('Dispute submitted successfully!')
      setTimeout(() => router.push('/renter/dashboard'), 1500)
    } else {
      setMessage(result.message || 'Something went wrong.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Submit a Dispute
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Explain the issue or reason for this dispute..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
            />
            <div>
              <label className="block text-sm font-medium mb-1">Upload Evidence</label>
              <Input type="file" multiple onChange={handleFileChange} />
              <p className="text-xs text-gray-500 mt-1">
                You can upload images (JPG, PNG) or PDFs (max 10 MB each).
              </p>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> Submit Dispute
                </>
              )}
            </Button>

            {message && (
              <p className="text-center text-sm mt-3 text-gray-700">{message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
