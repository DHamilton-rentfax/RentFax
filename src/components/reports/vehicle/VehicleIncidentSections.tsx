"use client";

import VehiclePaymentBehaviorSection from "./VehiclePaymentBehaviorSection";
import VehicleUseAndControlSection from "./VehicleUseAndControlSection";
import VehicleTheftAndTamperingSection from "./VehicleTheftAndTamperingSection";
import VehicleDrivingAndLegalSection from "./VehicleDrivingAndLegalSection";
import VehicleConditionAndCareSection from "./VehicleConditionAndCareSection";
import VehicleCommunicationSection from "./VehicleCommunicationSection";

export default function VehicleIncidentSections() {
  return (
    <div className="space-y-4">
      <VehiclePaymentBehaviorSection />
      <VehicleUseAndControlSection />
      <VehicleTheftAndTamperingSection />
      <VehicleDrivingAndLegalSection />
      <VehicleConditionAndCareSection />
      <VehicleCommunicationSection />
    </div>
  );
}
