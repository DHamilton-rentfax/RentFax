'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import countryList from 'react-select-country-list'
import Select from 'react-select'

export default function RenterSearchModal({ open, setOpen }: any) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: 'US',
  })
  const [loading, setLoading] = useState(false)

  const countries = countryList().getData()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/renter/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        alert(`Reports found for ${form.name}: ${data.matches.length}`)
      } else {
        alert('No records found for this renter.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while searching.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Search Renter Records</DialogTitle>
        </DialogHeader>

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
            inputStyle={{ width: '100%' }}
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Searching...' : 'Search Reports'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
