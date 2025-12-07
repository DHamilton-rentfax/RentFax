import { CheckCircle2, ShieldAlert } from "lucide-react";

const ReportHeader = ({ report }: { report: any }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RentFAX Report</h1>
          <p className="mt-1 text-sm text-gray-500">
            For {report.renter.fullName}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          {report.unlocked ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle2 className="-ml-1 mr-1.5 h-4 w-4" /> Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <ShieldAlert className="-ml-1 mr-1.5 h-4 w-4" /> Locked
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="font-medium text-gray-900">Renter</p>
          <p>{report.renter.fullName}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Email</p>
          <p>{report.renter.email}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Phone</p>
          <p>{report.renter.phone}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Report ID</p>
          <p className="font-mono text-xs">{report.id}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
