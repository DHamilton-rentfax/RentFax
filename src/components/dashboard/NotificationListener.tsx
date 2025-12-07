"use client";

import { useEffect } from "react";
import { db } from "@/firebase/client";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";

export default function NotificationListener() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      if (snap.docChanges().length === 0) return;

      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          // Don’t spam old notifications on first load
          const created = data.createdAt?.toDate?.();
          const now = new Date();
          if (created && now.getTime() - created.getTime() > 30000) return;

          const title = data.title || "New Notification";
          const message = data.message || "You have a new update.";
          const link = data.link || null;

          toast.custom((t) => (
            <div
              className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 p-4 border-l-4 ${
                data.type === "DISPUTE"
                  ? "border-amber-400"
                  : data.type === "ALERT"
                  ? "border-green-400"
                  : "border-blue-400"
              } ${t.visible ? "animate-enter" : "animate-leave"}`}>
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="mt-1 text-sm text-gray-600">{message}</p>
                  {link && (
                    <a
                      href={link}
                      className="text-blue-600 text-xs hover:underline mt-1 block"
                    >
                      View details →
                    </a>
                  )}
                </div>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ));
        }
      });
    });

    return () => unsub();
  }, [user]);

  return null;
}
