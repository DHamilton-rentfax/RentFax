import { IdentityStatusBadge } from "@/components/verify/IdentityStatusBadge";

export default function RenterDashboard() {
    // This is a placeholder for the actual user data
    const user = {
        identityStatus: 'unverified'
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <IdentityStatusBadge status={user.identityStatus ?? "unverified"} />
            </div>
        </div>
    );
}
