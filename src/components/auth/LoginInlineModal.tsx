"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { X, Loader2 } from "lucide-react";

export function LoginInlineModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[30000] bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-semibold mb-1">Log in to use credits</h3>
        <p className="text-xs text-gray-600 mb-4">
          Sign in to unlock the report using your membership credits.
        </p>

        {error && <div className="text-xs text-red-600 mb-2">{error}</div>}

        <input
          className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              setError(null);
              await signInWithEmailAndPassword(auth, email, password);
              onSuccess();
            } catch {
              setError("Invalid email or password.");
            } finally {
              setLoading(false);
            }
          }}
          className="w-full bg-gray-900 text-white rounded-full py-2 text-sm font-semibold disabled:opacity-50"
          type="button"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Log in"}
        </button>
      </div>
    </div>
  );
}
