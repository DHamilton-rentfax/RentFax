"use client";
import { useEffect, useState } from "react";

const incidentData = [
  {
    id: "INC-001",
    title: "Unpaid Rent - August 2024",
    amount: "$820.00",
    status: "Open",
    property: "123 Main St, Apt 4B",
    date: "2024-09-05",
    evidence: [{ name: "Ledger.pdf", url: "#" }],
    description: "This incident was filed because the landlord reported unpaid rent for August 2024 totaling $820."
  },
  {
    id: "INC-002",
    title: "Property Damage",
    amount: "$250.00",
    status: "Disputed",
    property: "123 Main St, Apt 4B",
    date: "2024-08-20",
    evidence: [{ name: "photo_damage.jpg", url: "#" }],
    description: "Claim for a broken window reported by the property manager during a routine inspection."
  },
    {
    id: "INC-003",
    title: "Lease Violation - Unauthorized Pet",
    amount: "$0.00",
    status: "Resolved",
    property: "123 Main St, Apt 4B",
    date: "2024-07-10",
    evidence: [],
    description: "A formal warning was issued for housing a pet in violation of the lease agreement. The issue has since been resolved with the removal of the pet."
  },
];

const getStatusClass = (status) => {
    switch(status) {
        case 'Open': return 'bg-red-100 text-red-800';
        case 'Disputed': return 'bg-yellow-100 text-yellow-800';
        case 'Resolved': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export default function MyIncidentsPage() {

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Incidents</h1>

      <div className="space-y-6">
        {incidentData.map((incident) => (
          <div key={incident.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                  <h2 className="text-xl font-bold">{incident.title}</h2>
                  <p className="text-gray-600">{incident.property}</p>
                  <p className="text-sm text-gray-500">Reported on: {incident.date}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(incident.status)}`}>{incident.status}</span>
            </div>

            <div className="mt-4 pt-4 border-t">
                <p className="font-bold text-lg text-gray-800">Amount Claimed: {incident.amount}</p>
                
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-800">AI-Powered Explanation</h4>
                    <p className="text-sm text-blue-700 mt-1">{incident.description}</p>
                </div>

                {incident.evidence.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold">Landlord's Evidence:</h4>
                        <ul className="list-disc list-inside">
                            {incident.evidence.map(e => <li key={e.name}><a href={e.url} className="text-blue-600 hover:underline">{e.name}</a></li>)}
                        </ul>
                    </div>
                )}
                
                <div className="mt-6 flex space-x-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Dispute This Incident</button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold">Resolve / Pay Balance</button>
                </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
