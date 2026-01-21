import { useState } from "react";

import RentalContextSection from "./sections/RentalContextSection";
import CarConditionSection, {
  CarConditionState,
} from "./sections/CarConditionSection";
import IncidentSection, {
  IncidentState,
} from "./sections/IncidentSection";
import EvidenceUploadSection, {
  EvidenceFile,
} from "./sections/EvidenceUploadSection";
import EquipmentConditionSection, { EquipmentConditionState } from "./sections/EquipmentConditionSection";
import HousingConditionSection, { HousingConditionState } from "./sections/HousingConditionSection";

/* ---------------------------------------------
 * INITIAL STATE
 * -------------------------------------------*/

const INITIAL_CAR_STATE: CarConditionState = {
  smoking: false,
  smokingNotes: "",
  dirty: false,
  dirtyNotes: "",
  fuel: false,
  fuelNotes: "",
  driver: false,
  driverNotes: "",
  keys: false,
  keysNotes: "",
  tampering: false,
  tamperingNotes: "",
};

const INITIAL_INCIDENT_STATE: IncidentState = {
  abandoned: false,
  stolen: false,
  policeReport: false,
  policeReportNumber: "",
  impounded: false,
  accident: false,
  insuranceClaim: false,
  insuranceClaimNumber: "",
};

const INITIAL_EQUIPMENT_STATE: EquipmentConditionState = {
  damaged: false,
  misuse: false,
  missingParts: false,
  unauthorizedOperator: false,
  lateReturn: false,
  repairRequired: false,
  estimatedCost: "",
  notes: "",
};

const INITIAL_HOUSING_STATE: HousingConditionState = {
  unauthorizedOccupants: false,
  smoking: false,
  propertyDamage: false,
  excessiveFilth: false,
  infestation: false,
  noiseComplaints: false,
  leaseViolation: false,
  earlyAbandonment: false,
  evictionInitiated: false,
  balanceOwed: "",
  notes: "",
};

/* ---------------------------------------------
 * COMPONENT
 * -------------------------------------------*/

export default function FinalRenterReportForm() {
  const [rentalType, setRentalType] =
    useState<"car" | "equipment" | "home">("car");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [completed, setCompleted] = useState<boolean | null>(null);

  const [carCondition, setCarCondition] =
    useState<CarConditionState>(INITIAL_CAR_STATE);

  const [incident, setIncident] =
    useState<IncidentState>(INITIAL_INCIDENT_STATE);

  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);

  const [equipmentCondition, setEquipmentCondition] = useState(INITIAL_EQUIPMENT_STATE);

  const [housingCondition, setHousingCondition] = useState(INITIAL_HOUSING_STATE);

  return (
    <div className="space-y-10 divide-y divide-gray-200">
      {/* STEP 1 — RENTAL CONTEXT */}
      <RentalContextSection
        rentalType={rentalType}
        setRentalType={setRentalType}
        startDate={startDate}
        endDate={endDate}
        completed={completed}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setCompleted={setCompleted}
      />

      {/* STEP 2+ — ISSUE-BASED SECTIONS */}
      {completed === false && (
        <div className="pt-10 space-y-10">
          {rentalType === "car" && (
            <CarConditionSection
              state={carCondition}
              onStateChange={(update) =>
                setCarCondition((prev) => ({ ...prev, ...update }))
              }
            />
          )}
          
          {rentalType === "equipment" && (
            <EquipmentConditionSection
              state={equipmentCondition}
              onStateChange={setEquipmentCondition as any}
            />
          )}

          {rentalType === "home" && (
            <HousingConditionSection
              state={housingCondition}
              onStateChange={setHousingCondition as any}
            />
          )}

          <IncidentSection
            state={incident}
            onStateChange={(update) =>
              setIncident((prev) => ({ ...prev, ...update }))
            }
          />

          <EvidenceUploadSection
            files={evidenceFiles}
            onFilesChange={setEvidenceFiles}
          />
        </div>
      )}
    </div>
  );
}
