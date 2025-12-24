"use client";

import { CompanyType } from "@/types/user";
import { useState } from "react";

type ModalAuthGateProps = {
  mode?: "login" | "signup";
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onAuthed: (payload: {
    uid: string;
    fullName: string;
    companyName: string;
    companyType: CompanyType;
  }) => Promise<void> | void;
};

export default function ModalAuthGate({
  mode = "signup",
  title,
  subtitle,
  onClose,
  onAuthed,
}: ModalAuthGateProps) {

  // This is a simplified auth form. 
  // In a real app, this would have more robust state management and validation.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthAction = () => {
    // In a real app, you would call your authentication service here.
    // For this example, we'''ll simulate a successful authentication and call onAuthed.
    const fakeUser = {
      uid: "12345",
      fullName: "Test User",
      companyName: "Test Company",
      companyType: "landlord" as CompanyType,
    };
    onAuthed(fakeUser);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          {title ?? "Verify & Continue"}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
      
      <div className="space-y-4">
         <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
              placeholder="you@company.com"
            />
         </div>
         <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
              placeholder="••••••••"
            />
         </div>
        <button 
          onClick={handleAuthAction}
          className="w-full rounded-full bg-gray-900 text-white py-2.5 font-semibold"
        >
            {mode === 'signup' ? 'Create Account & Continue' : 'Sign In & Continue'}
        </button>
        <button 
          onClick={onClose}
          className="w-full text-center text-sm text-gray-600 mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
