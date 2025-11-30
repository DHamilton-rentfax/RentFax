import { XCircle } from "lucide-react";

export default function ReportPurchaseCancel() {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center text-center">
      <XCircle className="h-16 w-16 text-red-500" />
      <h1 className="mt-4 text-3xl font-bold">Purchase Canceled</h1>
      <p className="mt-2 text-lg text-gray-600">
        You have not been charged. Please try again.
      </p>
    </div>
  );
}
