import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/firebase/client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the ID token to access custom claims
      const tokenResult = await user.getIdTokenResult(true);
      const role = tokenResult.claims.role as string;
      const companyName = tokenResult.claims.companyName as string;

      // Set cookies for middleware to read
      document.cookie = `role=${role || ''}; path=/; secure; samesite=lax`;
      document.cookie = `companyName=${companyName || ''}; path=/; secure; samesite=lax`;

      // Redirect based on role
      switch (role) {
        case 'ADMIN':
        case 'SUPER_ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'AGENCY':
          router.push('/agency/dashboard');
          break;
        case 'COMPANY':
          if (companyName) {
            router.push(`/${companyName}/dashboard`);
          } else {
            router.push('/unauthorized'); // Fallback if company name is missing
          }
          break;
        case 'RENTER':
          router.push('/renter/dashboard');
          break;
        default:
          router.push('/unauthorized');
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Login Error:', error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 p-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition">
        Login
      </button>
    </form>
  );
}
