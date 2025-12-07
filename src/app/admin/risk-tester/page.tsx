'use client';

import { useState } from 'react';
import { computeConfidenceScore, computeConfidenceDebug } from '@/lib/risk/computeConfidenceScore';

const RiskTesterPage = () => {
  const [input, setInput] = useState({
    fullNameMatch: 85,
    emailMatch: 90,
    phoneMatch: 95,
    addressMatch: 80,
    licenseMatch: true,
    fraudScore: 10,
    incidentCount: 1,
    unresolvedDebt: 50,
    disputes: 0,
    aiRiskScore: 15,
  });

  const [debugInfo, setDebugInfo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value),
    }));
  };

  const runTest = () => {
    const debug = computeConfidenceDebug(input);
    setDebugInfo(debug);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Confidence Score Tester</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Input Signals</h2>
          <div className="space-y-4">
            {Object.keys(input).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                {typeof input[key] === 'boolean' ? (
                  <input
                    type="checkbox"
                    name={key}
                    checked={input[key]}
                    onChange={handleInputChange}
                    className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                ) : (
                  <input
                    type="range"
                    name={key}
                    min="0"
                    max="100"
                    value={input[key]}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                )}
                <span className="text-sm text-gray-500">{input[key].toString()}</span>
              </div>
            ))}
          </div>
          <button
            onClick={runTest}
            className="mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Run Test
          </button>
        </div>

        {/* Results */}
        {debugInfo && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-gray-600">Final Score</p>
              <p className="text-6xl font-bold text-blue-600">{debugInfo.score}</p>
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskTesterPage;
