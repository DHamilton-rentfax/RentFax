import { FileText } from "lucide-react";

const Disputes = ({ disputes }: { disputes: any[] }) => {
  if (!disputes || disputes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900">Disputes</h2>
      <ul className="mt-4 space-y-4">
        {disputes.map((dispute) => (
          <li key={dispute.id} className="flex items-start">
            <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-800">{dispute.title}</p>
              <p className="text-sm text-gray-600">{dispute.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Disputes;
