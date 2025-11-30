'use client';

import { Bell, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const mockNotifications = [
    {
        id: 1,
        type: 'alert',
        icon: <AlertTriangle className="text-red-500" />,
        title: "High-Risk Applicant Detected",
        description: "Applicant 'John Doe' has a fraud score of 87%. Immediate review recommended.",
        time: "2 min ago",
        read: false,
    },
    {
        id: 2,
        type: 'success',
        icon: <CheckCircle2 className="text-green-500" />,
        title: "Report Completed for Jane Smith",
        description: "The comprehensive background and credit report is now available.",
        time: "15 min ago",
        read: false,
    },
        {
        id: 3,
        type: 'alert',
        icon: <AlertTriangle className="text-yellow-500" />,
        title: "Duplicate Application Found",
        description: "An application with similar details to 'Emily White' was submitted.",
        time: "1 hour ago",
        read: true,
    },
    {
        id: 4,
        type: 'success',
        icon: <CheckCircle2 className="text-green-500" />,
        title: "Team Member Michael Scott Added",
        description: "Michael Scott has been successfully invited to your workspace.",
        time: "3 hours ago",
        read: true,
    },
];

export default function DemoNotificationsClient() {
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Bell size={36} className="text-emerald-600" /> Notifications
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-3xl">
        Keep track of important account activities, AI-driven alerts, and report statuses in real-time.
      </p>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
        <div className="space-y-4">
            {mockNotifications.map((notif, index) => (
                <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-5 rounded-lg flex items-start gap-4 border-l-4 ${notif.read ? 'bg-gray-50/70 border-gray-300' : 'bg-emerald-50/80 border-emerald-500'}`}>
                    <div className="flex-shrink-0 mt-1">{notif.icon}</div>
                    <div className="flex-1">
                        <h3 className={`font-semibold ${notif.read ? 'text-gray-600' : 'text-gray-800'}`}>{notif.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{notif.description}</p>
                    </div>
                    <div className="text-xs text-gray-400 font-medium flex-shrink-0">{notif.time}</div>
                </motion.div>
            ))}
        </div>
      </div>
    </>
  );
}
