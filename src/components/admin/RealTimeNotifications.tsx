
"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";

export default function RealTimeNotifications() {
  const { notifications } = useNotifications();
  const recentNotifications = notifications.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Real-Time Alerts</CardTitle>
        <Link href="/admin/super-dashboard/notifications" className="text-sm text-blue-500 hover:underline flex items-center">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </CardHeader>
      <CardContent>
        {recentNotifications.length > 0 ? (
          <ul className="space-y-3">
            {recentNotifications.map((n) => (
              <li key={n.id} className={`p-3 rounded-lg ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <Link href={n.link || '#'} className="flex items-center">
                    <Bell className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                        <p className={`text-sm font-medium ${n.read ? 'text-gray-600' : 'text-gray-900'}`}>{n.message}</p>
                        <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No new notifications.</p>
        )}
      </CardContent>
    </Card>
  );
}
