'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '@/firebase/client';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [user.uid, 'superadmin']),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const newNotifications: any[] = [];
      snapshot.forEach((doc) => {
        newNotifications.push({ id: doc.id, ...doc.data() });
      });

      // On initial load, just set the notifications
      if (initialLoad.current) {
        setNotifications(newNotifications);
        setLoading(false);
        initialLoad.current = false;
        return;
      }

      // After initial load, check for new notifications to show a toast
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newNotif = { id: change.doc.id, ...change.doc.data() };
          // Trigger toast only for high/normal priority
          if (newNotif.priority && newNotif.priority !== 'low') {
            toast.info(newNotif.message, {
              description: new Date(newNotif.createdAt).toLocaleString(),
              action: newNotif.link
                ? { label: 'View', onClick: () => window.location.href = newNotif.link }
                : undefined,
              duration: newNotif.priority === 'high' ? 8000 : 5000,
            });
          }
        }
      });

      setNotifications(newNotifications);
    });

    return () => unsub();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
  };

  const deleteNotification = async (notificationId: string) => {
    const notifRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notifRef);
  };

  return { notifications, loading, markAsRead, deleteNotification };
}
