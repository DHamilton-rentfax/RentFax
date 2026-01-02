'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

// Mock components for UI structure. In a real app, these would be more robust.
const Step = ({ title, children, isActive }: { title: string, children: React.ReactNode, isActive: boolean }) => (
  <div className={isActive ? 'block' : 'hidden'}>
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const Toggle = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (value: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 flex rounded-md shadow-sm">
      {options.map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`px-4 py-2 border ${value === option ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'} first:rounded-l-md last:rounded-r-md`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const DatePicker = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  </div>
);

const NumericInput = ({ label, value, onChange }: { label: string, value: number, onChange: (value: number) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative mt-1 rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500 sm:text-sm">$</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="0.00"
      />
    </div>
  </div>
);


export default function FinalReportPage() {
  const params = useParams();
  const rentalId = params.rentalId;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    rentalCompleted: 'Yes, completed as agreed',
    endDate: '',
    accessReturned: 'Yes',
    paymentStatus: 'Paid in full',
    balanceOwed: 0,
    feesApplied: 'No',
    assetCondition: 'Good (no issues)',
    assetReturnedOnTime: 'On time',
    fraudConfirmed: false,
    damageConfirmed: false,
    unauthorizedUseConfirmed: false,
    evictionFiled: false,
    legalActionTaken: false,
    policeReportFiled: false,
    confirmAccuracy: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("Submitting final report:", { rentalId, ...formData });
    // API call will be built next
    // await fetch('/api/final-reports/create', { ... });
    alert("Report submitted! (API not yet connected)");
  };

  const totalSteps = 5;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-2">Final Rental Report</h1>
      <p className="text-gray-600 mb-8">Submitting for Rental ID: <span className="font-mono bg-gray-100 p-1 rounded">{rentalId}</span></p>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={(e) => e.preventDefault()}>
          <Step title="Step 1: Rental Confirmation" isActive={step === 1}>
            <Toggle label="Was this rental completed?" options={['Yes, completed as agreed', 'Ended early', 'Terminated for cause']} value={formData.rentalCompleted} onChange={val => handleChange('rentalCompleted', val)} />
            <DatePicker label="Rental end date" value={formData.endDate} onChange={val => handleChange('endDate', val)} />
            <Toggle label="Was access returned? (keys, car, etc.)" options={['Yes', 'Partially', 'No']} value={formData.accessReturned} onChange={val => handleChange('accessReturned', val)} />
          </Step>

          <Step title="Step 2: Payment Outcome" isActive={step === 2}>
            <Toggle label="Final payment status" options={['Paid in full', 'Paid late', 'Partially paid', 'Unpaid']} value={formData.paymentStatus} onChange={val => handleChange('paymentStatus', val)} />
            <NumericInput label="Balance owed at end of rental" value={formData.balanceOwed} onChange={val => handleChange('balanceOwed', val)} />
            <Toggle label="Were additional fees applied?" options={['Yes', 'No']} value={formData.feesApplied} onChange={val => handleChange('feesApplied', val)} />
          </Step>

          <Step title="Step 3: Asset Condition & Return" isActive={step === 3}>
            <Toggle label="Condition of asset at return" options={['Good (no issues)', 'Minor issues', 'Major issues']} value={formData.assetCondition} onChange={val => handleChange('assetCondition', val)} />
            <Toggle label="Was the asset returned on time?" options={['On time', 'Late', 'Not returned']} value={formData.assetReturnedOnTime} onChange={val => handleChange('assetReturnedOnTime', val)} />
          </Step>

          <Step title="Step 4: Rule-Based Flags" isActive={step === 4}>
             <p className="text-sm text-gray-500 mb-4">Select 'Yes' only for confirmed, documented events. All flags default to 'No'.</p>
             <Toggle label="Fraud confirmed?" options={['Yes', 'No']} value={formData.fraudConfirmed ? 'Yes' : 'No'} onChange={val => handleChange('fraudConfirmed', val === 'Yes')} />
             <Toggle label="Property damage confirmed?" options={['Yes', 'No']} value={formData.damageConfirmed ? 'Yes' : 'No'} onChange={val => handleChange('damageConfirmed', val === 'Yes')} />
             <Toggle label="Unauthorized use confirmed?" options={['Yes', 'No']} value={formData.unauthorizedUseConfirmed ? 'Yes' : 'No'} onChange={val => handleChange('unauthorizedUseConfirmed', val === 'Yes')} />
             {/* Housing-specific could be conditionally rendered based on industry */}
             {/* <Toggle label="Eviction filed?" options={['Yes', 'No']} value={formData.evictionFiled ? 'Yes' : 'No'} onChange={val => handleChange('evictionFiled', val === 'Yes')} /> */}
             <Toggle label="Legal action taken?" options={['Yes', 'No']} value={formData.legalActionTaken ? 'Yes' : 'No'} onChange={val => handleChange('legalActionTaken', val === 'Yes')} />
             <Toggle label="Police report filed?" options={['Yes', 'No']} value={formData.policeReportFiled ? 'Yes' : 'No'} onChange={val => handleChange('policeReportFiled', val === 'Yes')} />
          </Step>

          <Step title="Step 5: Review & Submit" isActive={step === 5}>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                      <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                              This report is factual, audited, and disputable by the renter. False reporting may result in account suspension.
                          </p>
                      </div>
                  </div>
              </div>
              <div className="relative flex items-start mt-4">
                  <div className="flex h-5 items-center">
                      <input
                          id="confirmAccuracy"
                          name="confirmAccuracy"
                          type="checkbox"
                          checked={formData.confirmAccuracy}
                          onChange={(e) => handleChange('confirmAccuracy', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                  </div>
                  <div className="ml-3 text-sm">
                      <label htmlFor="confirmAccuracy" className="font-medium text-gray-700">
                          I confirm this report is accurate and based on documented rental activity.
                      </label>
                  </div>
              </div>
          </Step>

          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Back
              </button>
              {step < totalSteps && (
                <button
                  type="button"
                  onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              )}
              {step === totalSteps && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.confirmAccuracy}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Submit Final Report
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
