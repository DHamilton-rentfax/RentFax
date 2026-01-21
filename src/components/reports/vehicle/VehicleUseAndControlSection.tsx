'use client';

import { useState } from 'react';
import ExpandableSection from '../ExpandableSection';
import LinkedUnauthorizedDriverCard, {
  UnauthorizedDriver,
} from '../LinkedUnauthorizedDriverCard';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import SectionUploadArea from '../SectionUploadArea';

export default function VehicleUseAndControlSection() {
  const [hasUnauthorizedDrivers, setHasUnauthorizedDrivers] = useState<
    boolean | null
  >(null);

  const [drivers, setDrivers] = useState<UnauthorizedDriver[]>([]);

  function addDriver() {
    setDrivers((d) => [
      ...d,
      {
        id: nanoid(),
        fullName: '',
        relationship: '',
        operatedVehicle: false,
        renterAware: false,
      },
    ]);
  }

  function updateDriver(id: string, updated: UnauthorizedDriver) {
    setDrivers((d) => d.map((x) => (x.id === id ? updated : x)));
  }

  function removeDriver(id: string) {
    setDrivers((d) => d.filter((x) => x.id !== id));
  }

  const isAttention = hasUnauthorizedDrivers === true;

  const status = isAttention
    ? 'attention'
    : hasUnauthorizedDrivers === false
    ? 'completed'
    : 'empty';

  return (
    <ExpandableSection
      id="vehicle-use-control"
      title="Asset Use & Control"
      description="Unauthorized drivers, misuse, or access concerns"
      status={status}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">
            Were there any unauthorized drivers?
          </p>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={hasUnauthorizedDrivers === false}
                onChange={() => {
                  setHasUnauthorizedDrivers(false);
                  setDrivers([]);
                }}
              />
              No
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={hasUnauthorizedDrivers === true}
                onChange={() => setHasUnauthorizedDrivers(true)}
              />
              Yes
            </label>
          </div>
        </div>

        {/* UNAUTHORIZED DRIVERS */}
        {hasUnauthorizedDrivers && (
          <div className="space-y-3">
            {drivers.map((driver) => (
              <LinkedUnauthorizedDriverCard
                key={driver.id}
                driver={driver}
                onChange={(updated) =>
                  updateDriver(driver.id, updated)
                }
                onRemove={() => removeDriver(driver.id)}
              />
            ))}

            <button
              type="button"
              onClick={addDriver}
              className="flex items-center gap-2 text-sm text-[#1A2540]"
            >
              <Plus className="h-4 w-4" />
              Add another unauthorized driver
            </button>
          </div>
        )}

        {isAttention && (
          <SectionUploadArea
            label="Upload evidence"
            hint="Photos, social media, or other proof of unauthorized drivers"
          />
        )}
      </div>
    </ExpandableSection>
  );
}
