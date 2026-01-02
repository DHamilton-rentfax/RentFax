'use client';

import { useAuth } from '@/hooks/use-auth';

export default function UserMenu() {
  const { user, signOut } = useAuth();

  // Basic user menu - can be expanded later
  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-right">
        <div className="font-medium text-gray-800">{user?.displayName || user?.email}</div>
        <div className="text-xs text-gray-500">User</div>
      </div>
       <button 
        onClick={signOut} 
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      > 
        Sign Out
      </button>
    </div>
  );
}
