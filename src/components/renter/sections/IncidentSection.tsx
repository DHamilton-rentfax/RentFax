'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, ChevronDown } from 'lucide-react';

export type IncidentState = {
  abandoned: boolean;
  stolen: boolean;
  policeReport: boolean;
  policeReportNumber: string;
  impounded: boolean;
  accident: boolean;
  insuranceClaim: boolean;
  insuranceClaimNumber: string;
};

type Props = {
  state: IncidentState;
  onStateChange: (newState: Partial<IncidentState>) => void;
};

const INCIDENT_CHECKS = [
  { id: 'abandoned', label: 'Vehicle abandoned' },
  { id: 'stolen', label: 'Vehicle reported stolen' },
  { id: 'policeReport', label: 'Police report filed' },
  { id: 'impounded', label: 'Vehicle was impounded' },
  { id: 'accident', label: 'Accident or major damage' },
  { id: 'insuranceClaim', label: 'Insurance claim filed' },
] as const;

export default function IncidentSection({ state, onStateChange }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = (id: keyof IncidentState, checked: boolean) => {
    onStateChange({ [id]: checked });
  };

  const handleInputChange = (id: keyof IncidentState, value: string) => {
    onStateChange({ [id]: value } as any);
  };

  return (
    <div className="space-y-4 rounded-md border border-dashed border-red-400 bg-red-50/50 p-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="font-semibold text-md flex items-center gap-2 text-red-800">
          <ShieldAlert size={20} />
          Serious Incidents
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-red-800 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="pt-4 space-y-6">
          <p className="text-sm text-red-700">
            Only report incidents that can be substantiated with evidence.
            Falsifying reports can have legal consequences.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {INCIDENT_CHECKS.map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={state[id as keyof IncidentState] as boolean}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(id as keyof IncidentState, Boolean(checked))
                  }
                />
                <Label htmlFor={id} className="font-medium text-gray-800">
                  {label}
                </Label>
              </div>
            ))}
          </div>

          {state.policeReport && (
            <div className="space-y-2 rounded-lg bg-white p-3 ring-1 ring-gray-200">
              <Label htmlFor="policeReportNumber" className="font-semibold">
                Police Report Number
              </Label>
              <Input
                id="policeReportNumber"
                placeholder="Enter report or case number"
                value={state.policeReportNumber}
                onChange={(e) =>
                  handleInputChange('policeReportNumber', e.target.value)
                }
              />
            </div>
          )}

          {state.insuranceClaim && (
            <div className="space-y-2 rounded-lg bg-white p-3 ring-1 ring-gray-200">
              <Label htmlFor="insuranceClaimNumber" className="font-semibold">
                Insurance Claim Number
              </Label>
              <Input
                id="insuranceClaimNumber"
                placeholder="Enter claim or reference number"
                value={state.insuranceClaimNumber}
                onChange={(e) =>
                  handleInputChange('insuranceClaimNumber', e.target.value)
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
