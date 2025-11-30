'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { auth } from "@/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCred.user.getIdToken(true);

      const res = await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        throw new Error("Server-side session login failed.");
      }

      const data = await res.json();
      const role = data?.role;

      if (!role) {
        throw new Error("Login successful, but no user role was returned.");
      }

      const roleMap: Record<string, string> = {
        super_admin: "/admin/dashboard",
        admin: "/admin/dashboard",
        company: "/company/dashboard",
        landlord: "/landlord/dashboard",
        agency: "/agency/dashboard",
        renter: "/renter/dashboard",
      };

      const destination = roleMap[role] || "/renter/dashboard";

      router.push(destination);

    } catch (err: any) {
      console.error("Login page error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          setError("Invalid email or password. Please try again.");
      } else if (err.message) {
          setError(err.message);
      } else {
          setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900 text-white">
      {/* LEFT SIDE — Login form */}
      <div className="relative flex items-center justify-center p-4 sm:p-6 lg:p-8">
        
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
            </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/">
                <img
                  src="/logo.svg"
                  alt="RentFAX Logo"
                  className="mx-auto mb-4 h-11 w-auto"
                />
            </Link>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400">
              Sign in to access your dashboard
            </p>
          </div>

          <div
            className="bg-slate-800/50 border border-slate-700 backdrop-blur-lg shadow-2xl rounded-2xl p-6 sm:p-8"
          >
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-slate-900/70 text-white placeholder-slate-400 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300" htmlFor="password">
                        Password
                    </label>
                    <Link href="/reset-password" tabIndex={-1} className="text-sm text-blue-400 hover:text-blue-300">
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-slate-900/70 text-white placeholder-slate-400 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10 transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="flex items-center gap-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  <AlertCircle className="flex-shrink-0" size={20} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-[#1E40AF] hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="animate-spin" size={20} />}
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-sm text-slate-400">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="font-semibold text-blue-400 hover:text-blue-300">
                    Sign up
                    </Link>
                </p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-8">© {new Date().getFullYear()} RentFAX, Inc. All rights reserved.</p>
        </div>
      </div>

      {/* RIGHT SIDE — Static highlight */}
      <div className="relative hidden md:flex flex-col justify-center items-center bg-black overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50"></div>
        <div className="relative z-10 max-w-xl text-center p-8">
          <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-xl">
            Revolutionizing Renter Screening
          </h2>
          <p className="mt-4 text-slate-300 text-lg leading-relaxed">
            RentFAX uses AI-driven insights to verify renters, detect fraud, and streamline property decisions in minutes.
          </p>
        </div>
      </div>
    </main>
  );
}
