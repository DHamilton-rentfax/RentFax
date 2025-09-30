'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { seedInitialUsers, runFraudAnalysisOnSeededUsers } from '@/app/actions/seed-action';

export default function SeedActions() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await seedInitialUsers();
      if (result.success) {
        setMessage(result.message || 'Seeding was successful!');
      } else {
        setMessage(`Error: ${result.error}` || 'An unknown error occurred.');
      }
    } catch (error: any) {
      setMessage(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await runFraudAnalysisOnSeededUsers();
      if (result.success) {
        setMessage(result.message || 'Analysis complete!');
      } else {
        setMessage(`Error: ${result.error}` || 'An unknown error occurred.');
      }
    } catch (error: any) {
      setMessage(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 border-dashed border-2 rounded-lg m-4">
        <h2 className="text-lg font-semibold mb-2">Database Actions</h2>
        <p className="text-sm text-muted-foreground mb-4">Use these buttons to seed the database or run fraud analysis.</p>
        <div className="flex gap-4">
            <Button onClick={handleSeed} disabled={loading}>
                {loading ? 'Seeding...' : '1. Seed Database'}
            </Button>
            <Button onClick={handleRunAnalysis} disabled={loading}>
                {loading ? 'Running...' : '2. Run Fraud Analysis'}
            </Button>
        </div>
        {message && <p className="mt-4 text-sm font-medium">{message}</p>}
    </div>
  );
}