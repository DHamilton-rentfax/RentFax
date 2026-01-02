"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

import { db } from "@/firebase/client";
import { useAuth } from "@/hooks/use-auth";

export default function EndOfRentalForm() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    rentalType: "car",
    renterName: "",
    renterEmail: "",
    renterPhone: "",
    propertyOrVehicleId: "",
    startDate: "",
    endDate: "",
    paymentLate: false,
    paymentLateDetails: "",
    damage: false,
    damageDetails: "",
    biohazard: false,
    biohazardDetails: "",
    unauthorizedUse: false,
    unauthorizedUseDetails: "",
    communicationQuality: "",
    balanceOwed: "",
    balanceStatus: "none",
    inCollections: false,
    judgementActive: false,
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in.");
    setSubmitting(true);
    try {
      await addDoc(collection(db, "rentalReports"), {
        ...form,
        agencyId: user.uid,
        createdAt: serverTimestamp(),
        status: "pending_review",
        aiSummary: "",
        score: null,
      });
      toast.success("Report submitted successfully!");
      setForm({
        rentalType: "car",
        renterName: "",
        renterEmail: "",
        renterPhone: "",
        propertyOrVehicleId: "",
        startDate: "",
        endDate: "",
        paymentLate: false,
        paymentLateDetails: "",
        damage: false,
        damageDetails: "",
        biohazard: false,
        biohazardDetails: "",
        unauthorizedUse: false,
        unauthorizedUseDetails: "",
        communicationQuality: "",
        balanceOwed: "",
        balanceStatus: "none",
        inCollections: false,
        judgementActive: false,
        notes: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-[#1A2540]">End of Rental Report</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-6 rounded-2xl">
        {/* Rental Type */}
        <div>
          <label className="block font-semibold mb-1">Rental Type</label>
          <select name="rentalType" value={form.rentalType} onChange={handleChange} className="border p-2 rounded-md w-full">
            <option value="car">Car / Vehicle</option>
            <option value="home">Home / Property</option>
            <option value="equipment">Equipment / Tools</option>
            <option value="storage">Storage Unit</option>
          </select>
        </div>

        {/* Renter Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1">Renter Name</label>
            <input name="renterName" value={form.renterName} onChange={handleChange} className="border p-2 rounded-md w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input name="renterEmail" value={form.renterEmail} onChange={handleChange} className="border p-2 rounded-md w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input name="renterPhone" value={form.renterPhone} onChange={handleChange} className="border p-2 rounded-md w-full" />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="border p-2 rounded-md w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="border p-2 rounded-md w-full" />
          </div>
        </div>

        {/* Incidents */}
        <fieldset className="border p-4 rounded-md">
          <legend className="font-semibold text-lg mb-2">Rental Events</legend>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="paymentLate" checked={form.paymentLate} onChange={handleChange} />
              Late Payment(s)
            </label>
            {form.paymentLate && (
              <textarea
                name="paymentLateDetails"
                placeholder="Describe payment issue..."
                value={form.paymentLateDetails}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              />
            )}

            <label className="flex items-center gap-2">
              <input type="checkbox" name="damage" checked={form.damage} onChange={handleChange} />
              Property / Vehicle Damage
            </label>
            {form.damage && (
              <textarea
                name="damageDetails"
                placeholder="Describe damage..."
                value={form.damageDetails}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              />
            )}

            <label className="flex items-center gap-2">
              <input type="checkbox" name="biohazard" checked={form.biohazard} onChange={handleChange} />
              Biohazard or Unsanitary Condition
            </label>
            {form.biohazard && (
              <textarea
                name="biohazardDetails"
                placeholder="Describe issue..."
                value={form.biohazardDetails}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              />
            )}

            <label className="flex items-center gap-2">
              <input type="checkbox" name="unauthorizedUse" checked={form.unauthorizedUse} onChange={handleChange} />
              Unauthorized User / Secondary Driver / Sublet
            </label>
            {form.unauthorizedUse && (
              <textarea
                name="unauthorizedUseDetails"
                placeholder="Describe unauthorized use..."
                value={form.unauthorizedUseDetails}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              />
            )}
          </div>
        </fieldset>

        {/* Communication & Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Communication Quality</label>
            <select name="communicationQuality" value={form.communicationQuality} onChange={handleChange} className="border p-2 rounded-md w-full">
              <option value="">Select...</option>
              <option value="excellent">Excellent</option>
              <option value="responsive">Responsive</option>
              <option value="poor">Poor</option>
              <option value="none">Did Not Respond</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Ending Balance</label>
            <input
              name="balanceOwed"
              placeholder="0.00"
              value={form.balanceOwed}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
          </div>
        </div>

        {/* Legal Flags */}
        <fieldset className="border p-4 rounded-md">
          <legend className="font-semibold text-lg mb-2">Legal & Collections</legend>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="inCollections" checked={form.inCollections} onChange={handleChange} />
              Account is in collections
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="judgementActive" checked={form.judgementActive} onChange={handleChange} />
              Legal judgement active
            </label>
          </div>
        </fieldset>

        {/* Notes */}
        <div>
          <label className="block font-semibold mb-1">Additional Notes</label>
          <textarea
            name="notes"
            placeholder="Include any final remarks or context..."
            value={form.notes}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1A2540] text-white font-semibold py-2 rounded-md hover:bg-[#2d3c66] transition"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}