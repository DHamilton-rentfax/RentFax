"use client";

type IdentityDetails = {
  method?: string;      // e.g. "ID_UPLOAD", "KYC_PROVIDER"
  provider?: string;    // e.g. "Incode", "Onfido"
  verifiedAt?: any;
  documentType?: string;
  country?: string;
};

function formatDate(val: any) {
  if (!val) return "Unknown date";
  if (typeof val === "string") return new Date(val).toLocaleDateString();
  if (val.toDate) return val.toDate().toLocaleDateString();
  return "Unknown date";
}

export default function IdentitySection({
  verified,
  details,
}: {
  verified: boolean;
  details?: IdentityDetails;
}) {
  return (
    <div className="bg-white border rounded-2xl shadow p-8 space-y-4">
      <h2 className="text-2xl font-semibold">Identity Verification</h2>

      {verified ? (
        <>
          <p className="text-sm text-green-700">
            ✅ This renter&apos;s identity has been verified.
          </p>
          {details && (
            <div className="mt-2 text-sm text-gray-700 space-y-1">
              {details.provider && (
                <p>Provider: {details.provider}</p>
              )}
              {details.documentType && (
                <p>Document Type: {details.documentType}</p>
              )}
              {details.country && (
                <p>Country: {details.country}</p>
              )}
              {details.verifiedAt && (
                <p>Verified At: {formatDate(details.verifiedAt)}</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-yellow-700">
          ⚠ This renter has not completed identity verification. We recommend
          requesting verification before final approval.
        </p>
      )}
    </div>
  );
}
