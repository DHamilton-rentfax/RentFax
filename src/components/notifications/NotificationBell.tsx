'use client'
import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'
import NotificationDropdown from './NotificationDropdown'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications } = useNotifications()

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
        <Bell className="w-6 h-6 text-gray-700" />
        {unread > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unread}
          </span>
        )}
      </button>
      {open && <NotificationDropdown items={notifications} onClose={() => setOpen(false)} />}
    </div>
  )
}
