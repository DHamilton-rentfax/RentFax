"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";

import { auth } from "@/firebase/client";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("individual");

  useEffect(() => {
    const type = localStorage.getItem("signupType");
    if (type) {
      setUserType(type);
    }
  }, []);

  // Watch for auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email || "");
        await user.reload();
        if (user.emailVerified) {
          setVerified(true);
          setTimeout(() => {
            if (userType === "company") router.push("/onboarding/company");
            else router.push("/onboarding/individual");
          }, 1000);
        } else {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsub();
  }, [router, userType]);

  // Send verification link
  const handleSendVerification = async () => {
    if (!auth.currentUser) return;
    setSent(true);
    await sendEmailVerification(auth.currentUser);
  };

  const handleCheckStatus = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      setVerified(true);
      if (userType === "company") router.push("/onboarding/company");
      else router.push("/onboarding/individual");
    } else {
      setLoading(false);
      alert("Still not verified. Check your inbox or try again.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 max-w-md text-center"
      >
        <OnboardingProgress step={1} totalSteps={userType === 'company' ? 4 : 3} />
        {verified ? (
          <>
            <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Email Verified 🎉</h1>
            <p className="text-gray-300">Redirecting you to complete your setup...</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-3">Verify Your Email</h1>
            <p className="text-gray-300 mb-6">
              We sent a verification link to <span className="font-semibold">{email}</span>
            </p>

            {!sent ? (
              <button
                onClick={handleSendVerification}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-medium"
              >
                Send Verification Email
              </button>
            ) : (
              <p className="text-blue-400 mb-4">Verification link sent!</p>
            )}

            <button
              onClick={handleCheckStatus}
              disabled={loading}
              className="mt-4 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 py-3 rounded-xl font-medium hover:opacity-90"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Checking..." : "I Verified My Email"}
            </button>

            <p className="text-xs text-gray-400 mt-4">Didn’t get the email? Check spam folder.</p>
          </>
        )}
      </motion.div>
    </main>
  );
}
