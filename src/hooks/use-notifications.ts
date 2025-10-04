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
import { useAdminSettings } from './useAdminSettings'; // Import the new hook

interface Notification {
  id: string;
  userId: string;
  priority: 'high' | 'normal' | 'low';
  message: string;
  createdAt: string; // ISO string
  link?: string;
  read: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  const { mute } = useAdminSettings(); // Get the mute state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to play the alert sound
  const playAlertSound = () => {
    if (mute) return; // Respect mute setting

    // Ensure Audio context is available (runs in browser)
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
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [user.uid, 'superadmin']),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const newNotifications: Notification[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));

      // On initial load, just set the notifications
      if (initialLoad.current) {
        setNotifications(newNotifications);
        setLoading(false);
        initialLoad.current = false;
        return;
      }

      // After initial load, check for new notifications to show a toast and play sound
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newNotif = { id: change.doc.id, ...change.doc.data() } as Notification;
          
          if (newNotif.priority && newNotif.priority !== 'low') {
            // Play sound for high/normal priority
            if(newNotif.priority === 'high'){
                playAlertSound();
            }

            toast.info(newNotif.message, {
              description: new Date(newNotif.createdAt).toLocaleString(),
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
  }, [user, mute]); // Add mute to dependency array

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
