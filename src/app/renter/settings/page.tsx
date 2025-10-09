
"use client";
import { useEffect, useState, FormEvent } from "react";
import { auth, db, storage } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function RenterSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [renter, setRenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        window.location.href = "/renter/login";
        return;
      }
      setUser(currentUser);

      const renterRef = doc(db, "renters", currentUser.uid);
      const renterSnap = await getDoc(renterRef);
      if (renterSnap.exists()) {
        const data = renterSnap.data();
        setRenter(data);
        setForm({
          fullName: data.fullName || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, "renters", user.uid), {
        ...form,
        updatedAt: serverTimestamp(),
      });
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert("Error updating profile: " + err.message);
    }
  };

  const handleUploadId = async () => {
    if (!idFile || !user) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `renter_verifications/${user.uid}/${idFile.name}`);
      await uploadBytes(storageRef, idFile);
      const downloadUrl = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "renters", user.uid), {
        verificationFileUrl: downloadUrl,
        verificationStatus: "pending",
        updatedAt: serverTimestamp(),
      });

      alert("Verification document uploaded successfully!");
      setIdFile(null);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Settings</h1>
        <p className="text-gray-600 mb-6">
          Manage your personal information and verify your identity to ensure your rental record is accurate.
        </p>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value as string })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="123 Main St, City, State"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm"
          >
            Save Changes
          </button>
        </form>

        {/* Divider */}
        <hr className="my-8" />

        {/* Verification Upload */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Identity Verification
          </h2>
          <p className="text-gray-600 mb-4">
            Upload a government ID, lease agreement, or utility bill to verify your identity.
          </p>

          {renter?.verificationFileUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Current verification file:
              </p>
              <a
                href={renter.verificationFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Uploaded Document
              </a>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setIdFile(e.target.files?.[0] || null)}
              className="border rounded-lg p-2 w-full"
            />
            <button
              onClick={handleUploadId}
              disabled={!idFile || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 font-medium"
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Status:{" "}
            <span
              className={`font-semibold ${
                renter?.verificationStatus === "verified"
                  ? "text-green-600"
                  : renter?.verificationStatus === "pending"
                  ? "text-yellow-600"
                  : "text-gray-600"
              }`}
            >
              {renter?.verificationStatus || "Not Submitted"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
