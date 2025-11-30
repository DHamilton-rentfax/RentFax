"use client";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function UnauthorizedDriverForm({
  reportId,
}: {
  reportId: string;
}) {
  const [driverName, setDriverName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCountry, setLicenseCountry] = useState("US");
  const [relation, setRelation] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      const storage = getStorage();

      let fileURL = null;
      if (file) {
        const filename = `unauth-drivers/${reportId}/${uuidv4()}_${file.name}`;
        const sRef = ref(storage, filename);
        await uploadBytes(sRef, file);
        fileURL = await getDownloadURL(sRef);
      }

      await addDoc(collection(db, "unauthorizedDrivers"), {
        reportId,
        createdBy: user?.uid || null,
        createdByEmail: user?.email || null,
        driverName,
        licenseNumber,
        licenseCountry,
        relation,
        description,
        evidenceUrl: fileURL,
        status: "submitted",
        createdAt: new Date().toISOString(),
      });

      // Optionally log audit event by writing to auditLogs (if you keep separate)
      setSuccess(true);
      setDriverName("");
      setLicenseNumber("");
      setLicenseCountry("US");
      setRelation("");
      setDescription("");
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="p-4 bg-green-50 rounded-md">
        ✅ Unauthorized driver report submitted. Admins will review and you'll
        receive a notification.
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 border rounded-md bg-white"
    >
      <h3 className="text-lg font-semibold">Report Unauthorized Driver</h3>
      <label className="text-sm">Driver Full Name</label>
      <input
        value={driverName}
        onChange={(e) => setDriverName(e.target.value)}
        required
        className="w-full border rounded p-2"
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm">License Number</label>
          <input
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="text-sm">License Country</label>
          <select
            value={licenseCountry}
            onChange={(e) => setLicenseCountry(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
            {/* add more as needed */}
          </select>
        </div>
      </div>
      <label className="text-sm">
        Relation / Notes (e.g., friend, subtenant)
      </label>
      <input
        value={relation}
        onChange={(e) => setRelation(e.target.value)}
        className="w-full border rounded p-2"
      />
      <label className="text-sm">Description of Incident</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full border rounded p-2"
        rows={4}
      />
      <label className="text-sm">
        Evidence (photo of license, photos of damage)
      </label>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFile}
        className="w-full"
      />
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="bg-amber-500 text-white rounded px-4 py-2"
      >
        {loading ? "Submitting…" : "Submit Unauthorized Driver Report"}
      </button>
    </form>
  );
}
