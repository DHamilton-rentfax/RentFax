
import Image from 'next/image';

interface Renter {
    name?: string;
    email?: string;
    photoURL?: string;
    // ... other renter fields
}

interface Props {
    renter: Renter | null;
}

// A simple function to determine risk tier. This can be expanded later.
const getRiskTier = (incidents: any[]): 'Low' | 'Moderate' | 'High' => {
    if (incidents.length > 2) return 'High';
    if (incidents.length > 0) return 'Moderate';
    return 'Low';
};

export function RenterSummary({ renter }: Props) {
    if (!renter) return null;

    const riskTier = getRiskTier([]); // This will be dynamic later

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                    <Image 
                        src={renter.photoURL || '/default-avatar.png'}
                        alt={renter.name || 'Renter'}
                        width={96}
                        height={96}
                        className="rounded-full"
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{renter.name}</h2>
                    <p className="text-md text-gray-600">{renter.email}</p>
                    <div className="mt-2">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${riskTier === 'Low' ? 'bg-green-100 text-green-800' : riskTier === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {riskTier} Risk
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
