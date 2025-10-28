'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { Loader2, CheckCircle, MapPin, Mail, Lock } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/hooks/use-auth';
import toast from 'react-hot-toast';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox } from '@headlessui/react';

// Google Address Autocomplete Component
function AddressAutocomplete({ onSelect }: { onSelect: (address: string, coords?: any) => void }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300 });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    onSelect(address, { lat, lng });
  };

  return (
    <Combobox value={value} onChange={handleSelect}>
      <div className="relative">
        <Combobox.Input
          disabled={!ready}
          className="w-full border p-2 rounded"
          placeholder="Enter address"
          onChange={(e) => setValue(e.target.value)}
        />
        {status === 'OK' && (
          <ul className="absolute z-50 bg-white border rounded mt-1 max-h-48 overflow-auto w-full shadow">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Combobox>
  );
}

export default function SearchRenterModal() {
  const { isModalOpen, closeModal } = useModal();
  const { user } = useAuth();
  const router = useRouter();
  const countries = useMemo(() => countryList().getData(), []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    coords: null as null | { lat: number; lng: number },
    country: { value: 'US', label: 'United States' },
    license: '',
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [result, setResult] = useState<null | { match: boolean; renterId?: string }>(null);

  // Validate email & phone (mock functions; replace with real APIs)
  async function validateEmail(email: string) {
    if (!email.includes('@')) return false;
    // Example Kickbox-style call
    // const res = await fetch(`/api/verify/email?email=${email}`);
    return true;
  }

  async function validatePhone(phone: string) {
    if (!phone || phone.length < 7) return false;
    // Example Twilio lookup integration later
    return true;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      if (!(await validateEmail(form.email))) throw new Error('Invalid email address.');
      if (!(await validatePhone(form.phone))) throw new Error('Invalid phone number.');

      const res = await fetch('/api/report/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, country: form.country.value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      setResult(data);
      setStep('results');
    } catch (err: any) {
      toast.error(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (type: 'basic' | 'full', renterId?: string) => {
    if (!user) return toast.error('Please sign in to continue.');
    setLoading(true);
    try {
      const body = renterId
        ? { type, renterId, email: user.email }
        : { type, email: user.email, ...form, country: form.country.value };
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error('Could not start payment session.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDraft = async () => {
    if (!user) return toast.error('Please sign in to create a draft.');
    setLoading(true);
    try {
      const res = await fetch('/api/report/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, country: form.country.value, createdBy: user.uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create draft.');
      toast.success('Draft report created successfully!');
      router.push(`/report/${data.renterId}`);
      resetModal();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      coords: null,
      country: { value: 'US', label: 'United States' },
      license: '',
    });
    setResult(null);
    setStep('form');
    setLoading(false);
    closeModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Search Renter Records</DialogTitle>
          <DialogDescription>
            Verify renter identity and view trusted rental data across the RentFAX network.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-2" />
            <p className="text-gray-600">Processing...</p>
          </div>
        ) : step === 'results' && result ? (
          <div className="text-center py-4 space-y-3">
            {result.match ? (
              <>
                <CheckCircle className="text-green-600 h-10 w-10 mx-auto" />
                <h3 className="text-lg font-semibold text-green-700">Match Found!</h3>
                <p className="text-gray-600">
                  A verified report exists for this renter. Access rental history and risk score.
                </p>
                <Button onClick={() => handleCheckout('full', result.renterId)} className="w-full bg-blue-600 hover:bg-blue-700">
                  View Full Report – $20
                </Button>
              </>
            ) : (
              <>
                <MapPin className="text-yellow-500 h-10 w-10 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800">No Report Found</h3>
                <p className="text-gray-600 mb-2">
                  Run a verified background check or create a free draft report.
                </p>
                <Button onClick={() => handleCheckout('basic')} className="w-full bg-blue-600 hover:bg-blue-700">
                  Run Background Check – $4.99
                </Button>
                <Button onClick={handleCreateDraft} variant="outline" className="w-full mt-2 border-gray-400 text-gray-700 hover:bg-gray-100">
                  Create Draft Report (Skip Verification)
                </Button>
              </>
            )}
            <Button variant="link" onClick={() => setStep('form')} className="mt-2">
              Search Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="space-y-4 pt-2">
            <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <PhoneInput
              country={form.country.value.toLowerCase()}
              value={form.phone}
              onChange={(phone, country: any) =>
                setForm({
                  ...form,
                  phone,
                  country: { value: country.countryCode.toUpperCase(), label: country.name },
                })
              }
              inputStyle={{ width: '100%' }}
            />
            <AddressAutocomplete
              onSelect={(address, coords) => setForm({ ...form, address, coords })}
            />
            <Input
              placeholder="Driver’s License / ID Number"
              value={form.license}
              onChange={(e) => setForm({ ...form, license: e.target.value })}
            />
            <Select
              options={countries}
              value={form.country}
              onChange={(val: any) => setForm({ ...form, country: val })}
            />
            <Button type="submit" className="w-full">
              Search Reports
            </Button>
          </form>
        )}

        {!user && !loading && step === 'form' && (
          <div className="flex flex-col items-center mt-4 border-t pt-4">
            <Lock className="h-5 w-5 mb-1 text-gray-600" />
            <p className="text-sm text-gray-500 mb-2">Already have a RentFAX account?</p>
            <Button variant="outline" onClick={() => (window.location.href = '/login')} className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Sign In
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
