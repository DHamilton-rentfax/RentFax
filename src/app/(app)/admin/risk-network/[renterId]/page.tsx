
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph").then(mod => mod.ForceGraph2D), { ssr: false });

export default function RiskNetworkPage() {
  const { renterId } = useParams();
  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    const nodes: any[] = [];
    const links: any[] = [];

    // Base renter node
    nodes.push({
      id: renterId,
      name: `Renter ${renterId}`,
      group: "renter",
      color: "#2563eb",
    });

    // Incidents
    const incidentsSnap = await getDocs(query(collection(db, "incidents"), where("renterId", "==", renterId)));
    incidentsSnap.forEach((d) => {
      const inc = d.data();
      const incidentNodeId = `incident_${d.id}`;
      nodes.push({ id: incidentNodeId, name: `Incident: ${inc.type || "N/A"}`, group: "incident", color: "#f59e0b" });
      links.push({ source: renterId, target: incidentNodeId });
      if (inc.address) {
        const addrId = `address_${inc.address}`;
        if (!nodes.find((n) => n.id === addrId)) {
          nodes.push({ id: addrId, name: inc.address, group: "address", color: "#10b981" });
        }
        links.push({ source: incidentNodeId, target: addrId });
      }
    });

    // Unauthorized drivers
    const unauthSnap = await getDocs(query(collection(db, "unauthorizedDrivers"), where("linkedRenterId", "==", renterId)));
    unauthSnap.forEach((d) => {
      const u = d.data();
      const uid = `unauth_${d.id}`;
      nodes.push({ id: uid, name: `Unauthorized: ${u.driverName}`, group: "unauthorized", color: "#ef4444" });
      links.push({ source: renterId, target: uid });
    });

    // Disputes
    const disputesSnap = await getDocs(query(collection(db, "disputes"), where("renterId", "==", renterId)));
    disputesSnap.forEach((d) => {
      const disp = d.data();
      const did = `dispute_${d.id}`;
      nodes.push({ id: did, name: `Dispute: ${disp.status || "Pending"}`, group: "dispute", color: "#f87171" });
      links.push({ source: renterId, target: did });
    });

    // Addresses reused by other renters
    const addressNodes = nodes.filter((n) => n.group === "address");
    for (const addr of addressNodes) {
      const otherSnap = await getDocs(query(collection(db, "incidents"), where("address", "==", addr.name)));
      otherSnap.forEach((d) => {
        const data = d.data();
        if (data.renterId && data.renterId !== renterId) {
          const linkedRenterId = `renter_${data.renterId}`;
          if (!nodes.find((n) => n.id === linkedRenterId)) {
            nodes.push({
              id: linkedRenterId,
              name: `Renter ${data.renterId}`,
              group: "renter",
              color: "#3b82f6",
            });
          }
          links.push({ source: addr.id, target: linkedRenterId });
        }
      });
    }

    setGraphData({ nodes, links });
    setLoading(false);
  };

  useEffect(() => {
    fetchConnections();
  }, [renterId]);

  if (loading) return <div className="p-8 text-lg">Loading network graph...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Risk Network — {renterId}
      </h1>
      <div className="border rounded-lg bg-white shadow-sm p-2">
        <ForceGraph2D
          graphData={graphData}
          width={1000}
          height={600}
          nodeAutoColorBy="group"
          linkColor={() => "rgba(0,0,0,0.2)"}
          nodeLabel={(node: any) => `${node.name}`}
          onNodeClick={(node: any) => {
            if (node.group === "renter" && node.id !== renterId) {
              window.location.href = `/admin/risk-network/${node.id.replace("renter_", "")}`;
            }
          }}
        />
      </div>
    </div>
  );
}
