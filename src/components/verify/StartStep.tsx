import { ShieldCheck } from "lucide-react";

export function StartStep({ record, onBegin }: { record: any; onBegin: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="h-8 w-8 text-gray-900" />
        <h1 className="text-2xl font-bold">Identity Verification</h1>
      </div>
      <div className="rounded-xl border bg-gray-50 p-4 mb-6 text-sm">
        <p className="font-semibold">Verifying for: {record.renter.fullName}</p>
        <p className="text-gray-600">You'll be asked to upload your ID and take a selfie.</p>
      </div>
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-6">
        <li>Confirms your identity securely.</li>
        <li>Prevents misuse of your information.</li>
        <li>You control your data; nothing is shared publicly.</li>
      </ul>
      <button onClick={onBegin} className="w-full rounded-full bg-gray-900 text-white py-3 font-semibold hover:bg-black transition">
        Begin Verification
      </button>
    </div>
  );
}