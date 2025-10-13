"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function ScreenPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "_test_",
    lastName: "Doe",
    email: "test@example.com",
    phone: "123-456-7890",
    licenseNumber: "D1234567",
    state: "CA",
    address: "123 Main St",
  });

  const handleNextStep = () => {
    // Here you would typically handle form validation
    setStep(2);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    fieldName?: string,
  ) => {
    if (typeof e === "string") {
      setFormData((prev) => ({ ...prev, [fieldName!]: e }));
    } else {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  return (
    <div className="container py-12 sm:py-16 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Start Your Screening</CardTitle>
              <CardDescription>
                Enter the individual's information to begin the verification
                process.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="123-456-7890"
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Driver's License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="D1234567"
                  value={formData.licenseNumber}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  onValueChange={(value) => handleFormChange(value, "state")}
                  value={formData.state}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add all US states */}
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    {/* ... other states */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNextStep} className="ml-auto">
                Continue to Payment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Proceed to Secure Payment</CardTitle>
              <CardDescription>
                You will now be redirected to Stripe to complete the $20 payment
                for the comprehensive report.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Review Information</h3>
                <p>
                  <strong>Name:</strong> {formData.firstName}{" "}
                  {formData.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Driver's License:</strong> {formData.licenseNumber} (
                  {formData.state})
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="ml-auto">
                <a href="/api/checkout/session">
                  Pay with Stripe <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
