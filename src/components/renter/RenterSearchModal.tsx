'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import countryList from 'react-select-country-list'
import Select from 'react-select'
import { Loader2 } from 'lucide-react'

export default function RenterSearchModal({ open, setOpen }: any) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: 'US',
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[] | null>(null)

  const countries = countryList().getData()

  const handleSubmit = async () => {
    setLoading(true)
    setResults(null)
    try {
      const res = await fetch('/api/renter/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setResults(data.matches)
      } else {
        alert('An error occurred during the search.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while searching.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleClose = () => {
    setOpen(false);
    setResults(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      country: 'US',
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Search Renter Records</DialogTitle>
          <DialogDescription>
            {results === null ? "Enter renter details to check for existing reports." : `${results.length} matching record(s) found.`}
          </DialogDescription>
        </DialogHeader>

        {results === null ? (
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <PhoneInput
              country={form.country.toLowerCase()}
              value={form.phone}
              onChange={(phone, country: any) =>
                setForm({ ...form, phone, country: country.countryCode.toUpperCase() })
              }
              inputStyle={{ width: '100%', height: '40px', fontSize: '14px' }}
              buttonStyle={{ height: '40px'}}
            />
            <Input
              placeholder="Address (include postal code)"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <Select
              options={countries}
              value={countries.find((c) => c.value === form.country)}
              onChange={(val: any) => setForm({ ...form, country: val.value })}
              placeholder="Select Country"
            />
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Searching...' : 'Search Reports'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {results.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No strong matches found.</p>
            ) : results.map((m, i) => (
                <div key={i} className="border p-3 rounded-lg bg-gray-50 mt-2">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">{m.renterName} ({m.renterCountry})</p>
                        <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                    <p className="text-sm text-gray-500">{m.renterEmail}</p>
                    <div className="flex items-center mt-2">
                        <div className="h-2 w-full bg-gray-200 rounded-full mr-2">
                            <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${m.matchScore}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-medium">{Math.round(m.matchScore)}%</span>
                    </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
