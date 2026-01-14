'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/client';

export default function AISummaryCard() {
  const [summary, setSummary] = useState('Analyzing billing insights...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const q = query(
          collection(db, 'billing_insights'),
          orderBy('updatedAt', 'desc')
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setSummary('No insights available yet.');
          return;
        }

        const docs = snapshot.docs.map((d) => d.data());
        const insights = docs.map((d: any) => d.insight || '').join('\n');

        const upgrades = insights.match(/upgrade/gi)?.length || 0;
        const downgrades = insights.match(/downgrade/gi)?.length || 0;
        const overspend = insights.match(/overpay|overspend/gi)?.length || 0;

        const avgConfidence = Math.round(
          docs.reduce((sum: number, d: any) => {
            const match = (d.insight || '').match(/(\d{1,3})%/);
            return sum + (match ? parseInt(match[1], 10) : 0);
          }, 0) / docs.length
        );

        setSummary(
          `${upgrades} upgrades and ${downgrades} downgrades detected. ` +
          `${overspend} accounts show overpayment trends. ` +
          `Average confidence ${avgConfidence}%.`
        );
      } catch (err) {
        console.error('Summary Error:', err);
        setSummary('Unable to generate summary.');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  return (
    <motion.div
      className="p-6 rounded-xl shadow-sm border bg-gradient-to-br from-emerald-50 to-white flex flex-col gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="text-emerald-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">
          Billing Trend Summary
        </h3>
      </div>

      <p className="text-gray-700 leading-relaxed">
        {loading ? 'Generating insights...' : summary}
      </p>

      {!loading && (
        <motion.div
          className="mt-3 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Updated: {new Date().toLocaleString()}
        </motion.div>
      )}
    </motion.div>
  );
}
