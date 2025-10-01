
'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, where } from "firebase/firestore";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';

type Notification = { id: string; type: string; title: string; body: string; link?: string; isRead: boolean; dismissed: boolean; createdAt: number };

export default function NotificationBell({ uid }: { uid: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!uid) return;
    const q = query(
        collection(db, `users/${uid}/notifications`), 
        where("dismissed", "==", false),
        orderBy("createdAt", "desc")
    );
    
    const unsub = onSnapshot(q, 
        (snap) => {
            setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
        },
        (error) => {
            console.error("[NotificationBell.tsx] Firestore snapshot error:", error);
            toast({
                title: "Could not load notifications",
                description: "You may not have permission to view this data.",
                variant: "destructive"
            });
        }
    );

    return () => unsub();
  }, [uid, toast]);

  const handleAction = async (id: string, action: 'read' | 'dismiss') => {
    try {
      const fieldToUpdate = action === 'read' ? { isRead: true } : { dismissed: true };
      await updateDoc(doc(db, `users/${uid}/notifications/${id}`), fieldToUpdate);
    } catch(error: any) {
        toast({ title: "Error", description: `Failed to update notification: ${error.message}`, variant: "destructive" });
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg max-h-[70vh] overflow-y-auto z-50">
          <div className="p-3 font-semibold border-b">Notifications</div>
          <ul>
            {notifications.length > 0 ? notifications.map(n => (
              <li
                key={n.id}
                className={`p-3 border-b border-border/50 ${n.isRead ? "opacity-70" : ""}`}
              >
                <Link href={n.link || '#'} onClick={() => { handleAction(n.id, 'read'); setIsOpen(false); }}>
                    <p className={`font-semibold ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </Link>
                <div className="flex gap-2 mt-2">
                    {!n.isRead && (
                        <Button variant="ghost" size="sm" onClick={() => handleAction(n.id, 'read')} className="text-xs h-7">
                            <Check className="h-3 w-3 mr-1" /> Mark as Read
                        </Button>
                    )}
                     <Button variant="ghost" size="sm" onClick={() => handleAction(n.id, 'dismiss')} className="text-xs h-7 text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3 mr-1" /> Dismiss
                    </Button>
                </div>
              </li>
            )) : (
                 <li className="p-4 text-center text-muted-foreground">No new notifications.</li>
             )}
          </ul>
        </div>
      )}
    </div>
  );
}
