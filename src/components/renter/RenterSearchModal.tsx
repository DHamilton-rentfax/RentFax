
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import Select from "react-select";
import { Loader2 } from "lucide-react";

interface RenterSearchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface RenterForm {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: string;
  country: string;
}

export default function RenterSearchModal({
  open,
  setOpen,
}: RenterSearchModalProps) {
  const countries = countryList().getData();

  const [form, setForm] = useState<RenterForm>({
    firstName: "",
    lastName: "",
    licenseNumber: "",
    email: "",
    phone: "",
    address: "",
    country: "US",
  });

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    setResults([]);
    setAiSummary(null);

    try {
      const res = await fetch("/api/renter/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.matches?.length > 0) {
        setResults(data.matches);
      } else {
        // No matches – trigger AI analysis
        const aiRes = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const aiData = await aiRes.json();
        setAiSummary(aiData);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    setProcessingPayment(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          plan: 'pro',
        }),
      });
  
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Unable to start checkout. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while connecting to Stripe.');
    } finally {
        setProcessingPayment(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg bg-white/90 backdrop-blur-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Search Renter Records
          </DialogTitle>
        </DialogHeader>

        {/* --- Search Form --- */}
        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
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
              setForm({
                ...form,
                phone,
                country: country.countryCode.toUpperCase(),
              })
            }
            inputStyle={{ width: "100%" }}
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
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Searching..." : "Search Reports"}
          </Button>
        </div>

        {/* --- Search Results / AI Summary --- */}
        {searched && !loading && (
          <div className="mt-6">
            {results.length > 0 ? (
              <>
                <h3 className="text-lg font-medium mb-3">
                  {results.length} potential record
                  {results.length > 1 && "s"} found
                </h3>

                <div className="space-y-3 max-h-56 overflow-y-auto">
                  {results.map((r, i) => (
                      <div key={i} className="border p-3 rounded-lg bg-gray-50 mt-2">
                        <p className="font-semibold">{r.renterName} ({r.renterCountry})</p>
                        <p className="text-sm text-gray-500">{r.renterEmail}</p>
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-full bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: `${r.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{r.matchScore}%</span>
                        </div>
                      </div>
                  ))}
                </div>

                <Button
                  onClick={handleProceedToPayment}
                  disabled={processingPayment}
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {processingPayment
                    ? "Processing..."
                    : "Continue to Payment"}
                </Button>
              </>
            ) : aiSummary ? (
              <div className="bg-gray-50 border p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-800">
                  AI Summary
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {aiSummary.message}
                </p>
                <p className="text-sm text-gray-500">
                  AI Confidence:{" "}
                  <span className="font-semibold">
                    {aiSummary.confidence}%
                  </span>
                </p>

                <Button
                  onClick={handleProceedToPayment}
                  disabled={processingPayment}
                  className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {processingPayment
                    ? "Processing..."
                    : "Start New Verification"}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No reports found.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
