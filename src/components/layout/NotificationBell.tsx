'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

export default function NotificationBell() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]); // Placeholder for notifications

  if (!user) return null;

  return (
    <div className="relative">
      <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
        <Bell className="h-6 w-6 text-gray-500" />
        {notifications.length > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0.5 text-xs">
            {notifications.length}
          </Badge>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border p-4">
          <h4 className="font-bold mb-2">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No new notifications.</p>
          ) : (
            <div>
              {/* Placeholder for notification items */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
