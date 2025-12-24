"use client";

import { useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Loader2 } from "lucide-react";
import { auth } from "@/firebase/client";

/* -------------------------------- TYPES -------------------------------- */

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

type Props = {
  mode: "login" | "signup";
  onAuthed: (payload: {
    uid: string;
    fullName: string;
    companyName: string;
    companyType: CompanyType;
  }) => Promise<void> | void;
};

/* ---------------------------- ERROR MAPPING ---------------------------- */

function mapAuthError(err: any) {
  switch (err?.code) {
    case "auth/email-already-in-use":
      return "Account already exists. Please sign in.";
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Unable to continue. Please try again.";
  }
}

/* -------------------------------- COMPONENT -------------------------------- */

export default function AuthForm({ mode, onAuthed }: Props) {
  const [tab, setTab] = useState<"login" | "signup">(mode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] =
    useState<CompanyType>("INDIVIDUAL");

  const canSubmit = useMemo(() => {
    if (!email || !password) return false;
    if (tab === "signup" && fullName.length < 2) return false;
    if (tab === "signup" && companyName.length < 2) return false;
    return true;
  }, [tab, email, password, fullName, companyName]);

  async function finalize() {
    const user = auth.currentUser;
    if (!user) throw new Error("Auth incomplete");

    await onAuthed({
      uid: user.uid,
      fullName: user.displayName || fullName,
      companyName,
      companyType,
    });
  }

  async function handleEmail() {
    if (!canSubmit || loading) return;
    setLoading(true);
    setMessage(null);

    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName });
      }
      await finalize();
    } catch (err: any) {
      setMessage(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (loading) return;
    setLoading(true);
    setMessage(null);

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      await finalize();
    } catch {
      setMessage("Unable to continue with Google.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {message}
        </div>
      )}

      {tab === "signup" && (
        <input
          placeholder="Full legal name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      )}

      <input
        type="email"
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />

      {tab === "signup" && (
        <>
          <input
            placeholder="Company / organization"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />

          <select
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value as CompanyType)}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="PROPERTY_MANAGEMENT">Property management</option>
            <option value="CAR_RENTAL">Car rental</option>
            <option value="EQUIPMENT_RENTAL">Equipment rental</option>
            <option value="VACATION_RENTAL">Vacation rental</option>
            <option value="FLEET_MANAGEMENT">Fleet management</option>
            <option value="STORAGE">Storage</option>
            <option value="BROKERAGE">Brokerage</option>
            <option value="OTHER">Other</option>
          </select>
        </>
      )}

      <button
        onClick={handleEmail}
        disabled={!canSubmit || loading}
        className="w-full rounded-full bg-gray-900 py-2.5 text-white font-semibold"
      >
        {loading ? <Loader2 className="animate-spin mx-auto" /> :
          tab === "signup" ? "Create Account" : "Sign In"}
      </button>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full rounded-full border py-2.5 font-semibold"
      >
        Continue with Google
      </button>

      <p className="text-center text-sm text-gray-500">
        {tab === "signup" ? (
          <>Already have an account?{" "}
            <button onClick={() => setTab("login")} className="underline">
              Sign in
            </button>
          </>
        ) : (
          <>New here?{" "}
            <button onClick={() => setTab("signup")} className="underline">
              Create account
            </button>
          </>
        )}
      </p>
    </div>
  );
}
