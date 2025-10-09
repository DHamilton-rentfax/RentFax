"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase/client";

export default function ResolutionDetailPage() {
  const { id } = useParams(); // URL param /renter/resolution/[id]
  const [resolution, setResolution] = useState<any>(null);
  const [incident, setIncident] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // 🔹 Fetch resolution data in real time
  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "resolutions", id as string), async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setResolution(data);

        // Fetch linked incident
        if (data.incidentId) {
          const incidentSnap = await getDoc(doc(db, "incidents", data.incidentId));
          if (incidentSnap.exists()) setIncident(incidentSnap.data());
        }
      }
    });
    return () => unsub();
  }, [id]);

  const handleFileUpload = async () => {
    if (!file || !id) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `resolutions/${id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "resolutions", id as string), {
        evidenceUrls: arrayUnion(fileUrl),
      });

      alert("Evidence uploaded successfully!");
      setFile(null);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!resolution)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading resolution details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resolution Details
        </h1>
        <p className="text-gray-500 mb-6">
          Case ID: <span className="font-mono text-sm">{id}</span>
        </p>

        {/* --- STATUS --- */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700">
            Current Status:
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm ${
                resolution.status === "resolved"
                  ? "bg-green-100 text-green-700"
                  : resolution.status === "under review"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {resolution.status}
            </span>
          </p>
        </div>

        {/* --- INCIDENT SUMMARY --- */}
        {incident && (
          <div className="mb-8 border-t pt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Linked Incident
            </h2>
            <p className="text-gray-700 mb-1">
              <strong>Type:</strong> {incident.incidentType || "N/A"}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Status:</strong> {incident.status || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {incident.description || "No details provided."}
            </p>
          </div>
        )}

        {/* --- RESOLUTION SUMMARY --- */}
        <div className="mb-8 border-t pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Renter’s Statement
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {resolution.summary || "No statement added yet."}
          </p>
        </div>

        {/* --- EVIDENCE SECTION --- */}
        <div className="mb-8 border-t pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Uploaded Evidence
          </h2>

          {resolution.evidenceUrls?.length ? (
            <ul className="list-disc ml-6 space-y-2">
              {resolution.evidenceUrls.map((url: string, idx: number) => (
                <li key={idx}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View File {idx + 1}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No evidence uploaded yet.</p>
          )}

          {/* File upload input */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border rounded-lg p-2 w-full"
            />
            <button
              onClick={handleFileUpload}
              disabled={!file || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 font-medium"
            >
              {uploading ? "Uploading..." : "Upload Evidence"}
            </button>
          </div>
        </div>

        {/* --- TIMESTAMPS --- */}
        <div className="text-sm text-gray-500 border-t pt-4">
          <p>Created: {resolution.createdAt?.toDate().toLocaleString()}</p>
          {resolution.updatedAt && (
            <p>Last Updated: {resolution.updatedAt?.toDate().toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
