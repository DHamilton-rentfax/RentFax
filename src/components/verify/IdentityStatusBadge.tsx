export function IdentityStatusBadge({ status }: { status: string }) {
  const map: any = {
    unverified: "bg-gray-200 text-gray-700",
    pending_review: "bg-yellow-200 text-yellow-800",
    verified: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-full font-medium ${map[status]}`}>
      {status === "pending_review" && "Pending Review"}
      {status === "unverified" && "Unverified"}
      {status === "verified" && "Verified"}
      {status === "rejected" && "Rejected"}
    </span>
  );
}
