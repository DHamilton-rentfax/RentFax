'use client';

const DisputeCard = ({ dispute }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <h3 className="text-xl font-semibold">Dispute ({dispute.status})</h3>
    <p className="text-gray-600 mt-2">{dispute.claim}</p>
  </div>
);

export default DisputeCard;
