'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

import DemoChart from '@/components/demo/DemoChart';

export default function AiInsightsClient() {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateInsight = async () => {
    setLoading(true);
    setInsight(null);
    setTimeout(() => {
      setInsight(
        "Based on the renter’s behavioral data and payment consistency, RentFAX AI predicts a 94% likelihood of positive future rental performance. Fraud indicators remain minimal, with only a 6% risk probability. Suggested action: maintain active monitoring and continue favorable rental terms."
      );
      setLoading(false);
    }, 1800);
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Brain size={36} className="text-emerald-600" /> AI Insights
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-3xl">
        This demo showcases the AI engine's ability to synthesize data into actionable recommendations and risk assessments.
      </p>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Renter Performance Projection</h2>
          <DemoChart />
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Generate New Insight</h3>
          <p className="text-gray-600 mb-6">
              Click the button to simulate the AI's analysis of a renter's profile based on various data points.
          </p>
          <button
            onClick={generateInsight}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition flex items-center gap-2 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Analyzing..." : "Generate AI Insight"}
          </button>

          { (insight || loading) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 bg-emerald-50/80 border border-emerald-200/60 rounded-lg p-6"
              >
                {loading && !insight && (
                    <p className='animate-pulse text-emerald-800/80 font-medium'>Generating insight from simulated data...</p>
                )}
                {insight && (
                  <div>
                    <h4 className="font-bold text-emerald-800 mb-2">AI-Generated Summary:</h4>
                    <p className="text-emerald-900/80 leading-relaxed">{insight}</p>
                  </div>
                )}
              </motion.div>
          )}
      </div>
    </>
  );
}
