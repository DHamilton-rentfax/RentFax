import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";
import { IdentitySession } from "@/types/identity";
import {
  approveIdentity,
  rejectIdentity,
} from "@/app/actions/identity-actions";

export default async function SupportIdentityRequestPage({
  params,
}: {
  params: { id: string };
}) {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.COMPLIANCE_AGENT]);

  // 🚧 TEMP MOCK — safe, server-only
  const request: IdentitySession = {
    id: params.id,
    userId: "user-456",
    renter: {
      fullName: "John Doe",
      email: "john.doe@example.com",
    },
    status: "submitted",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Identity Verification</h1>
        <p className="text-sm text-gray-500">
          Review and approve or reject identity documents
        </p>
      </header>

      <div className="bg-white border rounded-xl p-6 grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Full Name</p>
          <p>{request.renter.fullName}</p>
        </div>
        <div>
          <p className="font-medium">Email</p>
          <p>{request.renter.email}</p>
        </div>
        <div>
          <p className="font-medium">Status</p>
          <p>{request.status}</p>
        </div>
        <div>
          <p className="font-medium">Submitted</p>
          <p>{new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <form action={approveIdentity.bind(null, request.id)}>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Approve
          </button>
        </form>

        <form
          action={rejectIdentity.bind(
            null,
            request.id,
            "Invalid documents"
          )}
        >
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
            Reject
          </button>
        </form>
      </div>
    </main>
  );
}