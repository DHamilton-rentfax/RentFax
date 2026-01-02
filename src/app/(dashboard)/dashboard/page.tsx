'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/firebase/client';
import { db } from '@/firebase/client';
import StartSearch from '@/components/dashboard/StartSearch';
import SearchRenterModal from '@/components/search/SearchRenterModal';

interface UserProfile {
  onboardingComplete?: boolean;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // This effect is the client-side guard. It ensures the user is authenticated
  // and has completed onboarding. It's a fallback for the server-side guard
  // in the layout, providing a smoother experience on client-side navigations.
  useEffect(() => {
    if (loading) {
      return; // Wait for auth state to be resolved
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userProfile = docSnap.data() as UserProfile;
          if (userProfile.onboardingComplete === false) {
            router.replace('/onboarding');
          } else {
            // User is authenticated and onboarded, ready to show dashboard
            setIsCheckingStatus(false);
          }
        } else {
          // This case should ideally be handled by the backend guard, but as a fallback:
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.replace('/login'); // Safe fallback
      }
    };

    fetchProfile();
  }, [user, loading, router]);

  // While checking auth and onboarding status, show a loading spinner.
  if (isCheckingStatus || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-gray-600">Welcome to your RentFAX dashboard.</p>
        </div>
        <div>
            {/* Other header actions can go here */}
        </div>
      </header>

      <div className="mt-12">
        <StartSearch onStart={() => setIsSearchModalOpen(true)} />
      </div>

      <SearchRenterModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </div>
  );
}
