"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";
import AccordionSection from "./AccordionSection";
import { Button } from "@/components/ui/button";

import { Car, User, AlertTriangle, FileWarning } from "lucide-react";

// Placeholder imports for CHUNK 2 sections
// (These files will be generated in next messages)
import UnauthorizedDriversSection from "./sections/UnauthorizedDriversSection";
import VehicleDamageSection from "./sections/VehicleDamageSection";
import AbandonmentSection from "./sections/AbandonmentSection";
import PaymentIssuesSection from "./sections/PaymentIssuesSection";
import CriminalActivitySection from "./sections/CriminalActivitySection";
import BiohazardSection from "./sections/BiohazardSection";
import ThreatsSection from "./sections/ThreatsSection";
import IdentityIssuesSection from "./sections/IdentityIssuesSection";

export default function IncidentForm() {
  /**
   * Smart Auto-Open Logic (Option C)
   * -----------------------------------------------------------------
   * Each section toggle controls:
   *  - accordion open state
   *  - conditional rendering
   *  - validation awareness
   *
   * This keeps the UI clean and intelligent.
   */
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [toggles, setToggles] = useState({
    vehicleDamage: false,
    unauthorizedDrivers: false,
    abandonment: false,
    paymentIssues: false,
    criminalActivity: false,
    biohazard: false,
    threats: false,
    identityIssues: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    const newValue = !toggles[key];

    setToggles({ ...toggles, [key]: newValue });

    // Smart Auto-Open → open accordion if toggled ON
    if (newValue) {
      setOpenSections([...openSections, key]);
    } else {
      setOpenSections(openSections.filter((s) => s !== key));
    }
  };

  return (
    <form className="space-y-10">
      {/* ------------------------------------------------------------
          BASIC INFORMATION (REQUIRED)
      ------------------------------------------------------------- */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Renter Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="(555) 555-5555"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="123 Main St, City, State"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* ------------------------------------------------------------
          VEHICLE INFORMATION (REQUIRED)
      ------------------------------------------------------------- */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Car className="w-5 h-5 text-primary" />
          Vehicle Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Make</label>
            <input className="w-full border rounded-md p-2" placeholder="Toyota" />
          </div>

          <div>
            <label className="text-sm font-medium">Model</label>
            <input className="w-full border rounded-md p-2" placeholder="Camry" />
          </div>

          <div>
            <label className="text-sm font-medium">Year</label>
            <input className="w-full border rounded-md p-2" placeholder="2020" />
          </div>

          <div>
            <label className="text-sm font-medium">License Plate</label>
            <input className="w-full border rounded-md p-2" placeholder="ABC-1234" />
          </div>
        </div>
      </div>

      <Separator />

      {/* ------------------------------------------------------------
          ACCORDION SECTIONS (SMART AUTO OPEN)
      ------------------------------------------------------------- */}
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="space-y-4"
      >
        {/* Vehicle Damage */}
        <AccordionSection
          id="vehicleDamage"
          label="Vehicle Damage"
          emoji="🚗"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          toggled={toggles.vehicleDamage}
          onToggle={() => handleToggle("vehicleDamage")}
        >
          <VehicleDamageSection />
        </AccordionSection>

        {/* Unauthorized Drivers */}
        <AccordionSection
          id="unauthorizedDrivers"
          label="Unauthorized Drivers"
          emoji="🧍"
          icon={<FileWarning className="h-5 w-5 text-yellow-500" />}
          toggled={toggles.unauthorizedDrivers}
          onToggle={() => handleToggle("unauthorizedDrivers")}
        >
          <UnauthorizedDriversSection />
        </AccordionSection>

        {/* Abandonment */}
        <AccordionSection
          id="abandonment"
          label="Abandonment / Improper Return"
          emoji="🔥"
          icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
          toggled={toggles.abandonment}
          onToggle={() => handleToggle("abandonment")}
        >
          <AbandonmentSection />
        </AccordionSection>

        {/* Payment Issues */}
        <AccordionSection
          id="paymentIssues"
          label="Payment Issues"
          emoji="💰"
          icon={<AlertTriangle className="h-5 w-5 text-green-600" />}
          toggled={toggles.paymentIssues}
          onToggle={() => handleToggle("paymentIssues")}
        >
          <PaymentIssuesSection />
        </AccordionSection>

        {/* Criminal Activity */}
        <AccordionSection
          id="criminalActivity"
          label="Criminal Activity"
          emoji="👮"
          icon={<AlertTriangle className="h-5 w-5 text-blue-600" />}
          toggled={toggles.criminalActivity}
          onToggle={() => handleToggle("criminalActivity")}
        >
          <CriminalActivitySection />
        </AccordionSection>

        {/* Biohazard */}
        <AccordionSection
          id="biohazard"
          label="Biohazard / Sanitation"
          emoji="🪳"
          icon={<AlertTriangle className="h-5 w-5 text-purple-600" />}
          toggled={toggles.biohazard}
          onToggle={() => handleToggle("biohazard")}
        >
          <BiohazardSection />
        </AccordionSection>

        {/* Threats */}
        <AccordionSection
          id="threats"
          label="Threats / Aggressive Behavior"
          emoji="⚠️"
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          toggled={toggles.threats}
          onToggle={() => handleToggle("threats")}
        >
          <ThreatsSection />
        </AccordionSection>

        {/* Identity Issues */}
        <AccordionSection
          id="identityIssues"
          label="Identity Issues"
          emoji="🪪"
          icon={<AlertTriangle className="h-5 w-5 text-primary" />}
          toggled={toggles.identityIssues}
          onToggle={() => handleToggle("identityIssues")}
        >
          <IdentityIssuesSection />
        </AccordionSection>
      </Accordion>

      <Separator />

      {/* Submit */}
      <div className="flex justify-end">
        <Button size="lg" className="px-8">
          Submit Incident Report
        </Button>
      </div>
    </form>
  );
}