'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Loader2 } from "lucide-react";
import ReportIdentitySection from "@/components/reports/ReportIdentitySection";
import RecommendedHelp from "@/components/support/RecommendedHelp";
import SupportChat from "@/components/support/SupportChat";

export default function IncidentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [incident, setIncident] = useState<any>(null);
  const [renter, setRenter] = useState<any>(null);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);

      // INCIDENT
      const incSnap = await getDoc(doc(db, "incidents", id));
      if (incSnap.exists()) {
        const incData = incSnap.data();
        setIncident({ id, ...incData });

        // RENTER
        if (incData.renterId) {
          const rSnap = await getDoc(
            doc(db, "renterProfiles", incData.renterId)
          );
          if (rSnap.exists()) setRenter(rSnap.data());
        }

        // DISPUTES LINKED TO THIS INCIDENT
        const disputesSnap = await getDocs(
          query(
            collection(db, "disputes"),
            where("incidentId", "==", id),
            orderBy("createdAt", "desc")
          )
        );

        setDisputes(disputesSnap.docs.map((d) => d.data()));
      }

      setLoading(false);
    };

    load();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );

  if (!incident)
    return (
      <div className="text-center text-gray-500 py-10">
        Incident not found.
      </div>
    );

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-[#1A2540]">
          Incident Details
        </h1>
        <p className="text-gray-600 mt-2">{incident.description}</p>

        {renter && (
          <p className="text-sm mt-3">
            Renter:{" "}
            <Link
              href={`/renters/${incident.renterId}`}
              className="text-blue-600 hover:underline"
            >
              {renter.name ?? "View Renter"}
            </Link>
          </p>
        )}

        <p className="text-sm text-gray-500 mt-1 capitalize">
          Status:{" "}
          <span
            className={`font-semibold ${
              incident.status === "open"
                ? "text-yellow-600"
                : incident.status === "resolved"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {incident.status ?? "unknown"}
          </span>
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Risk Score:{" "}
          <span
            className={`font-semibold ${
              (incident.riskScore ?? 0) > 75
                ? "text-red-600"
                : (incident.riskScore ?? 0) > 40
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {incident.riskScore ?? "N/A"}
          </span>
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Date:{" "}
          {incident.createdAt?.seconds
            ? new Date(
                incident.createdAt.seconds * 1000
              ).toLocaleDateString()
            : "—"}
        </p>
      </Card>

      {/* IDENTITY SECTION */}
      {incident.fraudSignals && renter && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Identity Analysis</h2>
          <ReportIdentitySection
            renter={renter}
            fraudSignals={incident.fraudSignals}
            matchScore={incident.matchScore ?? 0}
          />
        </Card>
      )}

      {/* EVIDENCE LIST */}
      {incident.evidence && incident.evidence.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Evidence</h2>

          <ul className="space-y-2">
            {incident.evidence.map((file: any, i: number) => (
              <li key={i}>
                <a
                  href={file.url}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {file.name ?? `Evidence ${i + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* DISPUTES */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Disputes Linked to This Incident
        </h2>

        {disputes.length === 0 ? (
          <p className="text-gray-500">No disputes submitted.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {disputes.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="capitalize">
                    <span
                      className={`font-semibold ${
                        d.status === "resolved"
                          ? "text-green-600"
                          : d.status === "pending"
                          ? "text-yellow-600"
                          : "text-gray-600"
                      }`}
                    >
                      {d.status ?? "unknown"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {d.createdAt?.seconds
                      ? new Date(
                          d.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`/disputes/${d.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View →
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      <RecommendedHelp context="incident_view" />
      <SupportChat context="incident_view" />
    </div>
  );
}
