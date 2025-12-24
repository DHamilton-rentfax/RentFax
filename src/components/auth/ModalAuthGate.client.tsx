"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase/client";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------------------------------------*/
export type CompanyType =
  | "CAR_RENTAL"
  | "PROPERTY_MANAGEMENT"
  | "BROKERAGE"
  | "EQUIPMENT_RENTAL"
  | "VACATION_RENTAL"
  | "FLEET_MANAGEMENT"
  | "STORAGE"
  | "INDIVIDUAL"
  | "OTHER";

type ModalAuthGateProps = {
  mode?: "login" | "signup";
  title: string;
  subtitle: string;
  onClose: () => void;

  // Parent controls what happens after auth (resume checkout, resume unlock, etc.)
  onAuthed: (payload: {
    uid: string;
    fullName: string;
    companyName: string;
    companyType: CompanyType;
  }) => Promise<void> | void;
};

/* -------------------------------------------------------------------------------------------------
 * ERROR MAPPING — NEVER SHOW RAW FIREBASE ERRORS
 * ------------------------------------------------------------------------------------------------*/
function mapAuthError(err: any) {
  switch (err?.code) {
    case "auth/email-already-in-use":
      return {
        type: "EXISTING_ACCOUNT",
        message: "We found your account. Please sign in to continue.",
      };
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return {
        type: "INVALID_CREDENTIALS",
        message: "Invalid email or password. Please try again.",
      };
    case "auth/too-many-requests":
      return {
        type: "RATE_LIMIT",
        message: "Too many attempts. Please try again shortly.",
      };
    case "auth/weak-password":
      return {
        type: "WEAK_PASSWORD",
        message: "Password is too weak. Please use at least 6 characters.",
      };
    default:
      return {
        type: "UNKNOWN",
        message: "Unable to continue. Please try again.",
      };
  }
}

/* -------------------------------------------------------------------------------------------------
 * UI HELPERS
 * ------------------------------------------------------------------------------------------------*/
const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/15 focus:border-gray-900/30 transition";

const labelClass = "text-xs font-semibold text-gray-900";

const cardClass = "w-full max-w-lg rounded-2xl bg-white text-gray-900 shadow-xl";

export default function ModalAuthGate({
  mode = "signup",
  title,
  subtitle,
  onClose,
  onAuthed,
}: ModalAuthGateProps) {
  const [tab, setTab] = useState<"login" | "signup">(mode);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Identity
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Company / Industry
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState<CompanyType>("INDIVIDUAL");

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;

    if (tab === "signup") {
      if (fullName.trim().length < 2) return false;
      // Company name is required even for individuals (can be "Individual Landlord")
      if (companyName.trim().length < 2) return false;
      if (!companyType) return false;
    }

    return true;
  }, [tab, email, password, fullName, companyName, companyType]);

  async function finalizeAuth() {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication incomplete");

    setSuccess(true);

    await onAuthed({
      uid: user.uid,
      fullName: user.displayName || fullName.trim(),
      companyName: companyName.trim(),
      companyType,
    });
  }

  async function handleEmailAuth() {
    if (!canSubmit || loading || success) return;

    setLoading(true);
    setMessage(null);

    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await updateProfile(cred.user, {
          displayName: fullName.trim(),
        });
      }

      await finalizeAuth();
    } catch (err: any) {
      const mapped = mapAuthError(err);

      if (mapped.type === "EXISTING_ACCOUNT") {
        setTab("login");
      }

      setMessage(mapped.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (loading || success) return;

    setLoading(true);
    setMessage(null);

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      await finalizeAuth();
    } catch (err) {
      console.error("Google auth error", err);
      setMessage("Unable to continue with Google. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[30000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={cardClass}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        {/* Header */}
        <div className="relative border-b border-gray-200 p-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-900 disabled:opacity-50"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          {success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-700">
              Account verified. Continuing…
            </div>
          ) : (
            <>
              {message && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-700">
                  {message}
                </div>
              )}

              {/* Toggle */}
              <div className="text-center text-sm text-gray-600">
                {tab === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setTab("login")}
                      disabled={loading}
                      className="font-semibold text-gray-900 hover:underline"
                      type="button"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    New here?{" "}
                    <button
                      onClick={() => setTab("signup")}
                      disabled={loading}
                      className="font-semibold text-gray-900 hover:underline"
                      type="button"
                    >
                      Create account
                    </button>
                  </>
                )}
              </div>

              {/* Identity */}
              {tab === "signup" && (
                <div className="space-y-1">
                  <div className={labelClass}>Full legal name</div>
                  <input
                    placeholder="Full legal name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              <div className="space-y-1">
                <div className={labelClass}>Work email</div>
                <input
                  type="email"
                  placeholder="Work email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <div className={labelClass}>Password</div>
                <input
                  type="password"
                  placeholder="Password (6+ characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Company / Industry */}
              {tab === "signup" && (
                <>
                  <div className="space-y-1">
                    <div className={labelClass}>Company / Organization</div>
                    <input
                      placeholder="Company or organization name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className={labelClass}>Industry</div>
                    <select
                      value={companyType}
                      onChange={(e) =>
                        setCompanyType(e.target.value as CompanyType)
                      }
                      className={inputClass}
                    >
                      <option value="INDIVIDUAL">Individual landlord</option>
                      <option value="PROPERTY_MANAGEMENT">Property management</option>
                      <option value="CAR_RENTAL">Car rental</option>
                      <option value="EQUIPMENT_RENTAL">Equipment rental</option>
                      <option value="VACATION_RENTAL">Vacation / short-term rental</option>
                      <option value="FLEET_MANAGEMENT">Fleet management</option>
                      <option value="STORAGE">Storage / warehousing</option>
                      <option value="BROKERAGE">Brokerage</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </>
              )}

              <button
                onClick={handleEmailAuth}
                disabled={!canSubmit || loading}
                className="flex w-full items-center justify-center rounded-full bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                type="button"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : tab === "signup" ? (
                  "Create account & Continue"
                ) : (
                  "Sign in & Continue"
                )}
              </button>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-3 text-xs font-semibold text-gray-400">
                  OR
                </span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                type="button"
              >
                Continue with Google
              </button>

              <p className="text-center text-xs text-gray-500">
                All access is logged for security and compliance.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
