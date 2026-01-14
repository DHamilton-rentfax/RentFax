'use client';

import { useState, useTransition } from 'react';

export function useDispatch() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const dispatch = async (action: () => Promise<any>) => {
    startTransition(async () => {
      try {
        const res = await action();
        setResult(res);
      } catch (e: any) {
        setError(e.message);
      }
    });
  };

  return { dispatch, isPending, error, result };
}
