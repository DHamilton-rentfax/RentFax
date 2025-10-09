'use client'
import { markAsRead } from '@/lib/notifications/markAsRead'
import Link from 'next/link'

export default function NotificationDropdown({ items, onClose }: { items:any[], onClose: () => void }) {

  const handleItemClick = (id: string) => {
    markAsRead(id);
    onClose();
  }
  
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-50">
       <div className="p-3 border-b font-semibold">
        Notifications
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No notifications</p>
      ) : (
        <ul className="max-h-96 overflow-y-auto divide-y">
          {items.map(n => (
            <li key={n.id}
              className={`p-3 hover:bg-gray-50 ${!n.read ? 'font-semibold' : 'text-gray-600'}`}
             >
              <Link href={n.link || '#'} onClick={() => handleItemClick(n.id)} className="block">
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt?.toDate?.()||Date.now()).toLocaleString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
