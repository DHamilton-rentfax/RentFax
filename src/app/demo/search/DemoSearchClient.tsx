'use client';

import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DemoSearchClient() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
        setResult({
            name: query,
            risk: Math.floor(Math.random() * 25) + 5, // More realistic risk
            report: `Renter profile for "${query}" shows consistent on-time payments and no eviction history. AI analysis flags one unverified previous address, representing a low-to-moderate risk. Overall fraud score is low.`,
          });
          setLoading(false);
    }, 1200);
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
        <Search size={36} className="text-emerald-600" /> Renter Search
      </h1>
       <p className="text-lg text-gray-600 mb-8 max-w-3xl">
              This demo simulates a real-time background check on a prospective renter, pulling from mock databases to generate a risk profile.
        </p>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search renter by name, email, or phone..."
            className="border border-gray-300 rounded-lg px-4 py-3 w-full text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {loading && (
             <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                <p className='animate-pulse font-medium text-gray-600'>Analyzing records for "{query}"...</p>
            </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-8 border-t border-gray-200 pt-8"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="text-emerald-600" /> Report for: {result.name}
            </h3>
            <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-lg p-6 space-y-3">
                <p className="text-gray-800 text-lg">
                    AI-Calculated Fraud Risk: <b className="text-red-600 font-bold">{result.risk}%</b>
                </p>
                <h4 className="font-semibold text-gray-700">AI Summary:</h4>
                <p className="text-gray-600 leading-relaxed">{result.report}</p>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
