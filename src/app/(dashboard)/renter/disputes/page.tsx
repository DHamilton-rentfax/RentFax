'use client';
import { useState } from "react";

const disputeData = [
  {
    id: "DIS-001",
    incidentId: "INC-002",
    incidentTitle: "Property Damage",
    status: "Under Review",
    dateFiled: "2024-08-22",
    reason: "The claimed amount for damages is excessive. The window was already cracked when I moved in, which is noted on the initial inspection report.",
    timeline: [
      { status: "Awaiting Landlord Response", date: "2024-08-23" },
      { status: "Evidence Submitted by Renter", date: "2024-08-22" },
      { status: "Dispute Filed", date: "2024-08-22" },
    ]
  },
];

const getStatusClass = (status) => {
    switch(status) {
        case 'Under Review': return 'bg-yellow-100 text-yellow-800';
        case 'Resolved': return 'bg-green-100 text-green-800';
        case 'Action Required': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export default function MyDisputesPage() {

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Disputes</h1>
        <button className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-green-700">
            Start a New Dispute
        </button>
      </div>

      <div className="space-y-6">
        {disputeData.map((dispute) => (
          <div key={dispute.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                  <h2 className="text-xl font-bold">Incident: {dispute.incidentTitle}</h2>
                  <p className="text-gray-600">Dispute ID: {dispute.id}</p>
                  <p className="text-sm text-gray-500">Filed on: {dispute.dateFiled}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(dispute.status)}`}>{dispute.status}</span>
            </div>

            <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold">Your Original Claim:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded mt-2">\"{dispute.reason}\"</p>

                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Dispute History & Timeline</h4>
                    <div className="border-l-2 border-gray-200 ml-2">
                        {dispute.timeline.map((item, index) => (
                             <div key={index} className="relative pl-6 pb-4">
                                 <div className="absolute left-0 w-4 h-4 bg-gray-300 rounded-full -ml-2.5 mt-1"></div>
                                 <h5 className="font-semibold">{item.status}</h5>
                                 <p className="text-sm text-gray-500">{item.date}</p>
                             </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex space-x-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Upload More Evidence</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded font-semibold">Withdraw Dispute</button>
                </div>
            </div>

          </div>
        ))}
        
        {disputeData.length === 0 && (
            <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">No Active Disputes</h3>
                <p className="text-gray-500 mt-2">You have not filed any disputes. If you disagree with an incident, you can start a dispute from the \"My Incidents\" page.</p>
            </div>
        )}
      </div>
    </div>
  );
}
