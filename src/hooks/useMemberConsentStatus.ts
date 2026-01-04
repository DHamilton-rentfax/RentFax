import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext'; // Assuming you have an AuthContext that provides the token

export type ConsentStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED' | 'LOADING' | 'ERROR';

export function useMemberConsentStatus(renterId: string | null) {
  const [status, setStatus] = useState<ConsentStatus>('LOADING');
  const { token } = useAuth(); // Get the Firebase auth token

  const fetchStatus = useCallback(async () => {
    if (!renterId || !token) {
      setStatus('LOADING');
      return;
    }

    try {
      const response = await fetch(`/api/member-id/status?renterId=${renterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch consent status');
      }

      const data = await response.json();
      setStatus(data.status || 'NONE');
    } catch (error) {
      console.error('Error fetching member consent status:', error);
      setStatus('ERROR');
    }
  }, [renterId, token]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { status, refetch: fetchStatus };
}
