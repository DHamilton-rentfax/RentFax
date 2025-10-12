'use client';

import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [deepReportCredits, setDeepReportCredits] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [renterName, setRenterName] = useState('');
  const [renterAddress, setRenterAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isBuyingCredits, setIsBuyingCredits] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const auth = getAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const paymentCanceled = searchParams.get('payment_canceled');
    const reportGenerating = searchParams.get('report_generating');

    if (paymentSuccess) {
      setMessage('Payment successful! Your credits have been added.');
    }

    if (paymentCanceled) {
      setMessage('Payment canceled. You have not been charged.');
    }

    if (reportGenerating) {
        setIsGeneratingReport(true);
        setMessage("We’re generating your verification — ready in 60 seconds");
        // Here you might want to start polling for the report status
      }
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = doc(db, 'users', userAuth.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);
          setDeepReportCredits(userData.deepReportCredits || 0);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResult(null);
    setMessage(null);

    try {
      const response = await fetch('/api/reports/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renterName, address: renterAddress, licenseNumber }),
      });

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      setMessage('An error occurred while searching.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePurchaseDeepReport = async () => {
    setMessage(null);
    try {
      const response = await fetch('/api/payments/deep-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ renterName, renterAddress, licenseNumber }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (stripe) {
        stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) { 
      setMessage('An error occurred during the purchase process.');
    }
  };

  const handleBuyCredits = async () => {
    setIsBuyingCredits(true);
    setMessage(null);
    const response = await fetch('/api/stripe/checkout-session', {
      method: 'POST',
    });
    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    if (stripe) {
      stripe.redirectToCheckout({ sessionId });
    }
    setIsBuyingCredits(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Dashboard</h1>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${searchParams.get('payment_success') || isGeneratingReport ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <div className="bg-slate-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Renter Verification</h2>
        <p className="text-slate-700 mb-4">Search for an existing report or generate a new one.</p>
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input type="text" placeholder="Renter Name" value={renterName} onChange={(e) => setRenterName(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Address" value={renterAddress} onChange={(e) => setRenterAddress(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="p-2 border rounded" />
          </div>
          <button type="submit" disabled={isSearching} className="bg-blue-500 text-white px-5 py-2 rounded-md font-medium">
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchResult && (
          <div className="mt-6">
            {searchResult.found === false && (
              <div>
                <p className="text-slate-800 font-semibold">No report found for this renter.</p>
                <p className="text-slate-600 mb-4">We can run a new Deep Report for $20</p>
                <button onClick={handlePurchaseDeepReport} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md font-medium">
                  Purchase Deep Report
                </button>
              </div>
            )}
            {searchResult.status === 'outdated' && (
              <div>
                <p className="text-slate-800 font-semibold">An outdated report was found.</p>
                <p className="text-slate-600 mb-4">For the most accurate information, we recommend generating a new Deep Report for $20</p>
                {/* Optionally, show a preview of the outdated report */}
                <button onClick={handlePurchaseDeepReport} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md font-medium">
                  Purchase New Report
                </button>
              </div>
            )}
            {searchResult.status === 'fresh' && (
              <div>
                <p className="text-green-700 font-semibold">Fresh report found!</p>
                {/* Link to the report page, which we haven't built yet */}
                <a href={`/reports/${searchResult.report.id}`} className="text-blue-500 hover:underline">View Report</a>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Account Overview</h2>
        {user ? (
          <div>
            <p className="text-slate-700">Email: {user.email}</p>
            <p className="text-slate-700">Plan: {user.activePlan || 'Free'}</p>
            <p className="text-slate-700">Deep Report Credits: {deepReportCredits}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <div className="bg-slate-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Purchase Deep Report Credits</h2>
        <p className="text-slate-700 mb-4">Purchase credits to run deep reports on your applicants.</p>
        <button 
          onClick={handleBuyCredits}
          disabled={isBuyingCredits}
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md font-medium"
        >
          {isBuyingCredits ? 'Processing...' : 'Buy Credits ($20)'}
        </button>
      </div>

    </div>
  );
}