'use client';

const IncidentCard = ({ incident }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <h3 className="text-xl font-semibold">{incident.title}</h3>
    <p className="text-gray-600 mt-2">{incident.description}</p>
  </div>
);

export default IncidentCard;
