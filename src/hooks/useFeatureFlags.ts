import { useState, useEffect } from 'react';

export type FeatureFlags = {
  enableConfidenceScore: boolean;
  showConfidenceInAdmin: boolean;
  showConfidenceToLandlords: boolean;
};

/**
 * @description A hook to fetch and manage feature flags from the API.
 */
export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlags() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/feature-flags');
        if (!response.ok) {
          throw new Error('Failed to fetch feature flags');
        }
        const data = await response.json();
        setFlags(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFlags();
  }, []);

  return { flags, loading, error };
}
