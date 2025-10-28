
"use client";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import Select from "react-select";
import { Loader2, HelpCircle } from "lucide-react";
import { useModal } from "@/context/ModalContext";

interface RenterForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  license: string;
}

type SearchResult = { match: boolean; renterId?: string } | null;

export default function SearchRenterModal() {
  const { isModalOpen, closeModal } = useModal();
  const countries = useMemo(() => countryList().getData(), []);

  const [form, setForm] = useState<RenterForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "US",
    license: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/report/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Search failed", error);
      // Optionally, set an error state to show a message to the user
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (type: "basic" | "full") => {
    setLoading(true);
    try {
        const res = await fetch("/api/checkout/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, renterId: result?.renterId, email: form.email }),
        });
        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
        }
    } catch (error) {
        console.error("Checkout failed", error);
        // Optionally, set an error state
    } finally {
        setLoading(false);
    }
  };

  const resetModal = () => {
    setForm({
        name: "", email: "", phone: "", address: "", country: "US", license: "",
    });
    setResult(null);
    setLoading(false);
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Search Renter Records</DialogTitle>
          <DialogDescription>
             We use multiple data sources to verify renters. Your search will be matched against verified records in the RentFAX global database.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : result ? (
            // Results View
            <div className="text-center py-4">
                {result.match ? (
                    <>
                        <h3 className="text-lg font-semibold">Match Found!</h3>
                        <p className="text-sm text-gray-600 mt-2 mb-4">We found an existing record for this renter. View a detailed report containing incidents, disputes, and risk score.</p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={() => handleCheckout("full")} className="w-full">View Full Report - $20</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Provides a comprehensive history of the renter from our collective database.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold">No Report Found</h3>
                        <p className="text-sm text-gray-600 mt-2 mb-4">You can perform a basic verification check to confirm renter authenticity and fraud signals.</p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={() => handleCheckout("basic")} className="w-full">Run Basic Lookup - $4.99</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Verifies renter identity against live data sources for fraud and duplication signals.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </>
                )}
                <Button variant="link" onClick={() => setResult(null)} className="mt-2">Search again</Button>
            </div>
        ) : (
          // Form View
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
                <Input id="name" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <p className="text-xs text-gray-500 mt-1">Enter the renter’s legal name.</p>
            </div>
            <div>
                <Input id="email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required/>
                <p className="text-xs text-gray-500 mt-1">Used to match existing reports.</p>
            </div>
            <PhoneInput country={form.country.toLowerCase()} value={form.phone} onChange={(phone, country: any) => setForm({...form, phone, country: country.countryCode.toUpperCase()})} inputStyle={{width: '100%'}}/>
            <div>
                <Input id="address" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}/>
                 <p className="text-xs text-gray-500 mt-1">Helps verify identity and link records.</p>
            </div>
             <div>
                <Input id="license" placeholder="Driver’s License / ID Number" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })}/>
                 <p className="text-xs text-gray-500 mt-1">Increases accuracy of the search.</p>
            </div>
            <Select options={countries} value={countries.find(c => c.value === form.country)} onChange={(val: any) => setForm({ ...form, country: val.value})} />
            <Button type="submit" className="w-full">Search Reports</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
