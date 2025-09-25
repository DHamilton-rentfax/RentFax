'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Toast = { id: number; message: string; type: 'success' | 'error' };

const ToastContext = createContext<{ notify: (msg: string, type?: 'success' | 'error') => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function notify(message: string, type: 'success' | 'error' = 'success') {
    const id = Date.now();
    setToasts(toasts => [...toasts, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(toast => toast.id !== id)), 3000);
  }

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow text-white ${
              t.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
