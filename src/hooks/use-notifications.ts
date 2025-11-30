'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/client';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: any;
  link?: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
        setNotifications(notifs);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return { notifications };
}
