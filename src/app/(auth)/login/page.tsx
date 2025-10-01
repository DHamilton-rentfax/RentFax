
'use client';

import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo + Heading */}
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent"
          >
            RentFAX
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-gray-900">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {mode === "login"
              ? "Sign in to your dashboard"
              : "Start your free trial today"}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          className="w-full py-3 px-6 border border-gray-300 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-50"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>

        {/* Toggle */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-indigo-600 font-medium hover:underline"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
