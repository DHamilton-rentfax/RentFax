'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/firebase/client';

// Define a default set of features, which acts as a fallback and master list.
const defaultFeatures = {
  showDashboard: true,
  showReports: true,
  showAIInsights: false,
  showBilling: true,
  showDisputes: true,
  showLegalCases: false,
  showCollections: false,
  showAnalytics: true,
  showSettings: true,
};

// Cache to store fetched preferences and prevent redundant reads within a session.
const featuresCache = new Map<string, any>();

/**
 * Custom hook to fetch and provide feature toggles for a specific user role.
 * It fetches from Firestore once and then serves from a local cache.
 *
 * @param role The role of the user (e.g., 'company', 'agency', 'renter').
 * @returns An object containing the feature flags and a loading state.
 */
export function useFeatureToggles(role?: string) {
  const [features, setFeatures] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!role) {
      setLoading(false);
      return;
    }

    async function fetchFeatures() {
      // 1. Check cache first
      if (featuresCache.has(role)) {
        setFeatures(featuresCache.get(role));
        setLoading(false);
        return;
      }

      // 2. If not in cache, fetch from Firestore
      try {
        const docRef = doc(db, 'featureToggles', role);
        const docSnap = await getDoc(docRef);

        let fetchedPreferences;
        if (docSnap.exists()) {
          // Merge with defaults to ensure all feature keys are present
          fetchedPreferences = { ...defaultFeatures, ...docSnap.data().dashboardPreferences };
        } else {
          // If no specific settings in Firestore, use the hardcoded defaults
          fetchedPreferences = defaultFeatures;
        }

        // 3. Update cache and state
        featuresCache.set(role, fetchedPreferences);
        setFeatures(fetchedPreferences);

      } catch (error) {
        console.error("Error fetching feature toggles:", error);
        // In case of error, fall back to default features to ensure app stability
        setFeatures(defaultFeatures);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatures();

  }, [role]); // Re-run only if the role changes

  return { features, loading };
}
