export default function CompanyRiskCard({ label, value, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
  );
}
