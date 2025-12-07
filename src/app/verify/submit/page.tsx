'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  ShieldCheck,
  Upload,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

type VerifyRecord = {
  renter: {
    fullName: string;
    email?: string;
    phone?: string;
  };
  status: string;
  createdAt: number;
};

export default function VerifySubmitPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [record, setRecord] = useState<VerifyRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Upload state
  const [frontId, setFrontId] = useState<File | null>(null);
  const [backId, setBackId] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  // Preview URLs
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  // ======================================================
  // STEP 1: Read token from query string
  // ======================================================

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) {
      setError('Missing verification token.');
      setLoading(false);
      return;
    }
    setToken(t);
  }, []);

  // ======================================================
  // STEP 2: Fetch the verification request record
  // ======================================================

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`/api/self-verify/get?token=${token}`);
        const json = await res.json();

        if (!res.ok) {
          setError(json.error || 'Invalid verification link.');
        } else {
          setRecord(json);
        }
      } catch (err: any) {
        setError('Failed to load verification record.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // ======================================================
  // HANDLERS — Upload previews
  // ======================================================

  function handleFrontUpload(e: any) {
    const file = e.target.files?.[0];
    if (file) {
      setFrontId(file);
      setFrontPreview(URL.createObjectURL(file));
    }
  }

  function handleBackUpload(e: any) {
    const file = e.target.files?.[0];
    if (file) {
      setBackId(file);
      setBackPreview(URL.createObjectURL(file));
    }
  }

  function handleSelfieUpload(e: any) {
    const file = e.target.files?.[0];
    if (file) {
      setSelfie(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  }

  // ======================================================
  // SUBMIT TO API
  // ======================================================

  async function handleSubmitVerification() {
    if (!frontId || !selfie) {
      alert('Please upload at least the front ID and selfie.');
      return;
    }

    if (!token) {
      alert('Missing token. Reload the page.');
      return;
    }

    try {
      setSubmitting(true);
      const form = new FormData();

      form.append('token', token);
      form.append('frontId', frontId);
      if (backId) form.append('backId', backId);
      form.append('selfie', selfie);

      const res = await fetch('/api/self-verify/submit', {
        method: 'POST',
        body: form,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit verification.');
      }

      await fetch('/api/verify/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      window.location.href = '/verify/success';
    } catch (err: any) {
      alert(err.message || 'Failed to submit verification.');
    } finally {
      setSubmitting(false);
    }
  }

  // ======================================================
  // UI STATES
  // ======================================================

  if (loading || !record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
          <p className="mt-4 text-sm text-gray-600">Loading verification…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white p-6 rounded-xl shadow max-w-md w-full">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Verification Error
          </h1>
          <p className="text-sm text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  const { renter } = record;

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-gray-900" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Submit Your Verification
            </h1>
            <p className="text-sm text-gray-600">
              Your information is encrypted and secure.
            </p>
          </div>
        </div>

        {/* Renter Info */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Verifying: {renter.fullName}
          </h2>

          {renter.email && (
            <p className="text-sm text-gray-800">
              <span className="font-semibold">Email:</span> {renter.email}
            </p>
          )}

          {renter.phone && (
            <p className="text-sm text-gray-800">
              <span className="font-semibold">Phone:</span> {renter.phone}
            </p>
          )}
        </div>

        {/* Upload Sections */}
        <div className="space-y-6">

          {/* FRONT ID */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Upload Front of ID <span className="text-red-600">*</span>
            </label>

            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 flex flex-col items-center">
              {frontPreview ? (
                <img
                  src={frontPreview}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <Upload className="h-8 w-8 text-gray-500 mb-2" />
              )}
              <input type="file" accept="image/*" onChange={handleFrontUpload} />
            </div>
          </div>

          {/* BACK ID */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Upload Back of ID (optional)
            </label>

            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 flex flex-col items-center">
              {backPreview ? (
                <img
                  src={backPreview}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <Upload className="h-8 w-8 text-gray-500 mb-2" />
              )}
              <input type="file" accept="image/*" onChange={handleBackUpload} />
            </div>
          </div>

          {/* SELFIE */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Upload a Selfie Holding Your ID <span className="text-red-600">*</span>
            </label>

            <p className="text-xs text-gray-600">
              Make sure your face and ID are clearly visible.
            </p>

            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 flex flex-col items-center">
              {selfiePreview ? (
                <img
                  src={selfiePreview}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <Upload className="h-8 w-8 text-gray-500 mb-2" />
              )}
              <input type="file" accept="image/*" onChange={handleSelfieUpload} />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmitVerification}
          disabled={submitting}
          className="w-full rounded-full bg-gray-900 text-white py-3 font-semibold text-sm hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Submit Verification
            </span>
          )}
        </button>

        <p className="text-center text-xs text-gray-500">
          Your photos are encrypted and only used for identity verification.
        </p>
      </div>
    </div>
  );
}
