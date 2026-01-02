"use client";
import { useEffect, useState } from "react";

const activityData = [
  {
    id: 1,
    type: "fraud_alert",
    title: "High-Risk Renter Flagged",
    description: "John Smith (Unit 12B) has been flagged for suspicious activity across multiple properties.",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Received",
    description: "Received a payment of $1,250.00 from Jane Doe (Unit 5A).",
    timestamp: "1 hour ago",
  },
  {
    id: 3,
    type: "dispute",
    title: "New Dispute Filed",
    description: "A new dispute has been filed by a renter regarding Incident #1024.",
    timestamp: "3 hours ago",
  },
    {
    id: 4,
    type: "verification",
    title: "Renter Verified",
    description: "Michael Johnson's identity has been successfully verified.",
    timestamp: "Yesterday",
  },
  {
    id: 5,
    type: "incident",
    title: "New Incident Reported",
    description: "You created a new incident for unpaid rent for Emily White.",
    timestamp: "Yesterday",
  },
];

const getIconForType = (type) => {
    switch (type) {
        case 'fraud_alert': return '🚨';
        case 'payment': return '💰';
        case 'dispute': return '⚖️';
        case 'verification': return '✅';
        case 'incident': return '📄';
        default: return '🔔';
    }
}

export default function LandlordActivityFeed() {

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Portfolio Activity</h1>
      
      <div className="space-y-4">
        {activityData.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex items-start">
              <div className="text-2xl mr-4">{getIconForType(item.type)}</div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
