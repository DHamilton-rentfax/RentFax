import React from 'react';
import {
  CheckCircle, XCircle, AlertTriangle, ShieldCheck, HelpCircle
} from "lucide-react";


const getStatusIcon = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return <ShieldCheck className="w-10 h-10 text-green-600" />;
    case 'DENIED':
      return <XCircle className="w-10 h-10 text-red-600" />;
    case 'MANUAL_REVIEW':
      return <AlertTriangle className="w-10 h-10 text-yellow-500" />;
    default:
      return <HelpCircle className="w-10 h-10 text-gray-500" />;
  }
}

const getStatusCopy = (status: string) => {
    switch (status) {
      case 'APPROVED': return { title: 'Identity Verified', description: 'The renter’s identity has been successfully verified against their provided documents.' };
      case 'DENIED': return { title: 'Identity Verification Failed', description: 'We could not verify the renter’s identity based on the documents provided.' };
      case 'MANUAL_REVIEW': return { title: 'Manual Review Required', description: 'Automated checks could not complete. Manual review is needed.' };
      default: return { title: 'Verification Pending', description: 'The renter has not yet completed the identity verification process.' };
    }
}

export function IdentityVerificationReport({ verificationData }: { verificationData: any }) {
  if (!verificationData) {
    return null; 
  }

  const { status, extracted, fraudSignals } = verificationData;
  const { title, description } = getStatusCopy(status);

  const hasFraudSignals = fraudSignals && Object.values(fraudSignals).some(v => v === true);

  return (
    <div className="bg-white shadow-lg rounded-xl border border-slate-200">
        <div className="p-6">
            <div className="flex items-start gap-4">
                <div>{getStatusIcon(status)}</div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                    <p className="text-md text-slate-600 mt-1">{description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-lg border">
                    <span className="text-sm text-slate-500">Face Match Score</span>
                    <span className={`text-4xl font-bold ${ (extracted?.faceMatchScore ?? 0) > 70 ? 'text-green-600' : 'text-amber-600'}`}>
                        {extracted?.faceMatchScore ? `${Math.round(extracted.faceMatchScore)}%` : 'N/A'}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-lg border">
                    <span className="text-sm text-slate-500">OCR Confidence</span>
                     <span className={`text-4xl font-bold ${ (extracted?.ocrConfidence ?? 0) > 0.85 ? 'text-green-600' : 'text-amber-600'}`}>
                        {extracted?.ocrConfidence ? `${Math.round(extracted.ocrConfidence * 100)}%` : 'N/A'}
                    </span>
                </div>
                 <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-lg border">
                    <span className="text-sm text-slate-500">Verification Status</span>
                    <span className="text-2xl font-bold text-slate-700 capitalize mt-2">{status.replace('_',' ')}</span>
                </div>
            </div>

            {hasFraudSignals && (
                <div className="mt-8">
                    <h3 className="font-bold text-lg text-amber-700 flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/>Fraud & Risk Signals</h3>
                    <ul className="list-disc pl-5 mt-2 text-slate-700 space-y-1">
                       {Object.entries(fraudSignals).filter(([_, value]) => value === true).map(([key]) => (
                           <li key={key} className="font-medium">
                               {key.replace(/([A-Z])/g, ' $1').trim()}
                           </li>
                       ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
  );
}
