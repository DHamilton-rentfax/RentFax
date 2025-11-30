import { CheckCircle } from "lucide-react";

export default function ReportPurchaseSuccess() {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-3xl font-bold">Purchase Successful!</h1>
      <p className="mt-2 text-lg text-gray-600">
        Your report is now available.
      </p>
    </div>
  );
}
