'use client';
import { useState } from "react";
// import { loginRenter } from "@/app/api/renter/auth";

const loginRenter = async (email: string) => {
    // This is a placeholder for the actual login logic.
    console.log(`Logging in renter with email: ${email}`);
    alert(`A login link has been sent to ${email}`);
    return Promise.resolve();
}

export default function RenterLogin() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    await loginRenter(email);
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Access Your Renter Portal</h1>
      <p className='text-gray-600 mt-2'>Enter your email address to receive a secure link to view your rental-related history, including incidents and disputes.</p>
      <input 
        type='email'
        className="border w-full p-3 mt-4"
        placeholder="Enter your email address"
        onChange={e => setEmail(e.target.value)}
        value={email}
      />
      <button 
        className="bg-blue-600 text-white w-full px-4 py-3 rounded mt-4 font-bold"
        onClick={submit}
      >
        Send Secure Login Link
      </button>
    </div>
  );
}
