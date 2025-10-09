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
} from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface Notification {
  id: string;
  userId: string;
  priority: 'high' | 'normal' | 'low';
  message: string;
  createdAt: any; 
  link?: string;
  read: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAlertSound = () => {
    if (typeof window !== 'undefined') {
        if (!audioRef.current) {
            audioRef.current = new Audio('/sounds/alert.mp3');
        }
        audioRef.current.play().catch((err) => {
            console.warn('🔇 Sound blocked by browser:', err);
        });
    }
  };


  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };

    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [user.uid, 'SUPER_ADMIN']),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const newNotifications: Notification[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));

      if (initialLoad.current) {
        setNotifications(newNotifications);
        setLoading(false);
        initialLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newNotif = { id: change.doc.id, ...change.doc.data() } as Notification;
          
          if (newNotif.priority && newNotif.priority !== 'low') {
            if(newNotif.priority === 'high'){
                playAlertSound();
            }

            toast.info(newNotif.message, {
              description: newNotif.createdAt ? new Date(newNotif.createdAt.toDate()).toLocaleString() : '',
              action: newNotif.link
                ? { label: 'View', onClick: () => window.location.href = newNotif.link! }
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
    if (!user) return;
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
  };

  return { notifications, loading, markAsRead };
}
