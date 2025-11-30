'use client';

const PublicDataCard = ({ data }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Public Data</h3>
    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

export default PublicDataCard;
