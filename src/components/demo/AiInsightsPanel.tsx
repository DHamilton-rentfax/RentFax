"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, BrainCircuit } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import DemoChart from "./DemoChart"; // Re-using the chart for fraud trends

// Mock data for charts
const riskDistributionData = [
  { name: "Low Risk (<700)", value: 400 },
  { name: "Medium Risk (700-780)", value: 300 },
  { name: "High Risk (>780)", value: 120 },
];

const COLORS = ["#059669", "#F59E0B", "#EF4444"];

const mockInsightText =
  "Analysis of recent reports indicates a positive portfolio shift. High-risk tenants are decreasing by 8% month-over-month, while on-time payments have improved by 15% across the board. Fraud flags are concentrated in the Downtown region, suggesting a need for stricter verification there. Overall portfolio health is strong, with an upward trend in renter quality.";

export default function AiInsightsPanel() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const handleGenerate = () => {
    setLoading(true);
    setInsights(null);
    setTimeout(() => {
      setInsights(mockInsightText);
      setLoading(false);
    }, 2500); // Simulate AI thinking
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BrainCircuit className="text-emerald-600" />
          AI Insights Engine
        </h3>
        {!insights && !loading && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Sparkles size={16} />
            Generate Insights
          </motion.button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-gray-50/50">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="mt-4 font-semibold text-gray-600">
            Analyzing portfolio data...
          </p>
        </div>
      )}

      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-lg"
        >
          <h4 className="font-bold mb-2">AI Summary:</h4>
          <p className="text-sm">{insights}</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6 pt-4">
        <div>
          <h4 className="text-md font-semibold mb-2 text-center">Risk Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <DemoChart />
      </div>
    </div>
  );
}
