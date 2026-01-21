'use client';

import { Trash2 } from 'lucide-react';

export type UnauthorizedDriver = {
  id: string;
  fullName: string;
  relationship?: string;
  operatedVehicle: boolean;
  renterAware: boolean;
};

interface Props {
  driver: UnauthorizedDriver;
  onChange: (driver: UnauthorizedDriver) => void;
  onRemove: () => void;
}

export default function LinkedUnauthorizedDriverCard({
  driver,
  onChange,
  onRemove,
}: Props) {
  return (
    <div className="border rounded-md p-3 space-y-3 bg-gray-50">
      <div className="flex justify-between items-center">
        <p className="font-medium text-sm">Unauthorized Driver</p>
        <button onClick={onRemove} className="text-red-500">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder="Full name"
        value={driver.fullName}
        onChange={(e) =>
          onChange({ ...driver, fullName: e.target.value })
        }
      />

      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder="Relationship to renter (optional)"
        value={driver.relationship || ''}
        onChange={(e) =>
          onChange({ ...driver, relationship: e.target.value })
        }
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={driver.operatedVehicle}
          onChange={(e) =>
            onChange({ ...driver, operatedVehicle: e.target.checked })
          }
        />
        Operated the vehicle
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={driver.renterAware}
          onChange={(e) =>
            onChange({ ...driver, renterAware: e.target.checked })
          }
        />
        Renter was aware
      </label>
    </div>
  );
}
