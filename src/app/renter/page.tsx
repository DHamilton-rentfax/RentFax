
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RenterLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to the RentFAX Renter Resolution Portal
        </h1>
        <p className="text-gray-600 mb-8">
          Your personal space to view reports, manage resolutions, and ensure your rental record stays accurate and fair.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/renter/signup"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
          >
            Sign Up
          </Link>
          <Link
            href="/renter/login"
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100"
          >
            Log In
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Have a report you want to resolve?{" "}
          <Link href="/renter/signup" className="text-blue-600 underline">
            Create your account to begin.
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
