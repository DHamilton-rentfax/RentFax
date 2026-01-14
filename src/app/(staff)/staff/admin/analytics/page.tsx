// ===========================================
// RentFAX | Super-Admin Analytics Dashboard
// Location: src/app/super-admin/analytics/page.tsx
// ===========================================

// Fetch data from our new API endpoint
async function getAnalyticsData() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/analytics`, {
            headers: {
                // This is the placeholder secret from our API.
                // In a real app, you'd get this from a secure source.
                'Authorization': `Bearer SUPER_SECRET_ADMIN_KEY`
            },
            // Revalidate every hour to get fresh data
            next: { revalidate: 3600 }, 
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch analytics: ${res.statusText}`);
        }

        const data = await res.json();
        return data.analytics;

    } catch (error) {
        console.error("Could not load admin analytics:", error);
        return null; // Return null on error so the page can handle it gracefully
    }
}

// The main dashboard component
export default async function AdminAnalyticsPage() {
    const analytics = await getAnalyticsData();

    if (!analytics) {
        return (
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold text-red-600">Error Loading Analytics</h1>
                <p className="text-gray-500 mt-2">Could not connect to the analytics service. Please check the server logs.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800">Super-Admin Dashboard</h1>
                <p className="text-lg text-gray-500 mt-2">Platform-wide Analytics Overview</p>
                <p className="text-xs text-gray-400 mt-1">Last updated: {new Date(analytics.lastUpdated).toLocaleString()}</p>
            </div>

            {/* Key Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Users */}
                <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
                    <p className="text-5xl font-bold text-indigo-600 mt-2">{analytics.totalUsers}</p>
                </div>

                {/* Total Renter Profiles */}
                <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-600">Renter Profiles</h3>
                    <p className="text-5xl font-bold text-blue-600 mt-2">{analytics.totalRenterProfiles}</p>
                </div>

                {/* Total Reviews Submitted */}
                <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-600">Reviews Logged</h3>
                    <p className="text-5xl font-bold text-green-600 mt-2">{analytics.totalReviews}</p>
                </div>

                {/* Average Behavior Score */}
                <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-600">Avg. Behavior Score</h3>
                    <p className="text-5xl font-bold text-teal-600 mt-2">{analytics.averageBehaviorScore}</p>
                </div>

            </div>
        </div>
    );
}
