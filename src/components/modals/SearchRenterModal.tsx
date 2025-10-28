'use client';

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import countryList from "react-select-country-list";
import { Loader2, CheckCircle, MapPin, Mail, Lock, ChevronsUpDown } from 'lucide-react';
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

// Fixed Address Autocomplete using shadcn/ui components
function AddressAutocomplete({ onSelect, initialValue }: { onSelect: (address: string, coords?: any) => void; initialValue: string; }) {
  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({ debounce: 300, defaultValue: initialValue });
  const [open, setOpen] = useState(false);

  useEffect(() => { setValue(initialValue); }, [initialValue, setValue]);

  const handleSelect = (address: string) => {
    setValue(address, false);
    clearSuggestions();
    getGeocode({ address }).then(results => {
      const { lat, lng } = getLatLng(results[0]);
      onSelect(address, { lat, lng });
      setOpen(false);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-11 font-normal" disabled={!ready}>
          <span className="truncate">{value ? value : "Enter address..."}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search for an address..." value={value} onValueChange={setValue} />
          <CommandEmpty>No address found.</CommandEmpty>
          {status === 'OK' && (
            <CommandGroup>
              {data.map(({ place_id, description }) => (
                <CommandItem key={place_id} value={description} onSelect={() => handleSelect(description)}>
                  {description}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
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
      // For a new report, we must first create it to get an ID
      let finalRenterId = renterId;
      if (type === 'basic' && !renterId) {
        const createRes = await fetch("/api/report/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, country: form.country.value, createdBy: user.uid }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) throw new Error(createData.error || "Failed to create report.");
        finalRenterId = createData.renterId;
      }

      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, renterId: finalRenterId, email: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error('Could not start payment session.');
    } catch (err: any) {
      toast.error(err.message);
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
    setForm({ name: '', email: '', phone: '', address: '', coords: null, country: { value: 'US', label: 'United States' }, license: '' });
    setResult(null);
    setStep('form');
    setLoading(false);
    closeModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Search or Create Renter Report</DialogTitle>
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
                <p className="text-gray-600">A verified report exists for this renter. Access rental history and risk score.</p>
                <Button onClick={() => handleCheckout('full', result.renterId)} className="w-full bg-blue-600 hover:bg-blue-700">View Full Report – $20</Button>
              </>
            ) : (
              <>
                <MapPin className="text-yellow-500 h-10 w-10 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800">No Report Found</h3>
                <p className="text-gray-600 mb-2">Run a verified background check or create a free draft report.</p>
                <Button onClick={() => handleCheckout('basic')} className="w-full bg-blue-600 hover:bg-blue-700">Run Background Check – $4.99</Button>
                <Button onClick={handleCreateDraft} variant="outline" className="w-full mt-2">Create Draft Report</Button>
              </>
            )}
            <Button variant="link" onClick={() => { setResult(null); setStep('form'); }} className="mt-2">Search Again</Button>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="space-y-4 pt-2">
            <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="h-11" />
            <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="h-11" />
            <PhoneInput country={form.country.value.toLowerCase()} value={form.phone} onChange={(phone, country: any) => setForm({ ...form, phone, country: { value: country.countryCode.toUpperCase(), label: country.name }})} inputStyle={{ width: '100%', height: '2.75rem' }} />
            <AddressAutocomplete onSelect={(address, coords) => setForm({ ...form, address, coords })} initialValue={form.address} />
            <Input placeholder="Driver’s License / ID Number (Optional)" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} className="h-11" />
            <Button type="submit" className="w-full h-11">Search Reports</Button>
          </form>
        )}

        {!user && !loading && step === 'form' && (
          <div className="flex items-center justify-center mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => (window.location.href = '/login')}>Sign In to Continue</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
