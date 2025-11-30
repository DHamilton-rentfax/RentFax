'use client';

const RiskScore = ({ score }) => (
  <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center">
    <div className="text-center">
      <p className="text-lg text-gray-600">Risk Score</p>
      <p className="text-6xl font-bold text-blue-600">{score}</p>
    </div>
  </div>
);

export default RiskScore;
