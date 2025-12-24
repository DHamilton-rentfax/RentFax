'use client';
import { useState } from "react";
import { HelpInline } from "@/components/support/HelpInline";

// Placeholder components for each step of the wizard
const SelectRenterStep = ({ next }) => (
  <div>
    <div className="flex items-center gap-x-3 mb-4">
      <h2 className="text-xl font-bold">Step 1: Select Renter</h2>
      <HelpInline context="incident_create_select_renter" />
    </div>
    {/* This would be a searchable dropdown or list */}
    <p className="mb-4">Renter selection UI goes here.</p>
    <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
      Next
    </button>
  </div>
);

const IncidentDetailsStep = ({ next, back }) => (
  <div>
    <div className="flex items-center gap-x-3 mb-4">
        <h2 className="text-xl font-bold">Step 2: Incident Details</h2>
        <HelpInline context="incident_create_details" />
    </div>
    <input className="border w-full p-2 mb-4" placeholder="Incident Type (e.g., Unpaid Rent)" />
    <input className="border w-full p-2 mb-4" placeholder="Amount Claimed" type="number" />
    <textarea className="border w-full p-2 mb-4" placeholder="Description of incident..."></textarea>
    <button onClick={back} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
      Back
    </button>
    <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
      Next
    </button>
  </div>
);

const EvidenceStep = ({ next, back }) => (
  <div>
    <div className="flex items-center gap-x-3 mb-4">
        <h2 className="text-xl font-bold">Step 3: Upload Evidence</h2>
        <HelpInline context="incident_create_evidence" />
    </div>
    {/* This would be a file dropzone */}
    <div className="border-dashed border-2 border-gray-300 p-10 text-center mb-4">
      <p>Drag & drop files here or click to upload.</p>
    </div>
    <button onClick={back} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
      Back
    </button>
    <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
      Next
    </button>
  </div>
);

const ReviewAndSubmit = ({ back }) => (
  <div>
    <div className="flex items-center gap-x-3 mb-4">
        <h2 className="text-xl font-bold">Step 4: Review and Submit</h2>
        <HelpInline context="incident_create_review" />
    </div>
    {/* This would show a summary of all entered data */}
    <div className="bg-gray-50 p-4 rounded mb-4">
      <h3 className="font-bold">Review Details:</h3>
      <p>Renter: John Doe</p>
      <p>Amount: $1200</p>
      <p>Evidence: 3 files</p>
    </div>
    <button onClick={back} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
      Back
    </button>
    <button className="bg-green-600 text-white px-4 py-2 rounded">
      Submit Incident
    </button>
  </div>
);


export default function CreateIncidentWizard() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Incident</h1>
      {step === 1 && <SelectRenterStep next={next} />}
      {step === 2 && <IncidentDetailsStep next={next} back={back} />}
      {step === 3 && <EvidenceStep next={next} back={back} />}
      {step === 4 && <ReviewAndSubmit back={back} />}
    </div>
  );
}
