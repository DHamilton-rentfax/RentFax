'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await signOut(auth);
    router.replace('/login');
  }

  return (
    <button onClick={handleLogout} className="text-sm text-red-600">
      Log out
    </button>
  );
}
