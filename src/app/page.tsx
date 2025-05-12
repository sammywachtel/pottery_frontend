// src/app/page.tsx
'use client'; // Required for hooks (useAuth, useRouter, useEffect)

import { useEffect, useState } from 'react';
import { getPieces } from '@/services/potteryService';
import { PotteryGrid } from '@/components/pottery/PotteryGrid';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { useRouter } from 'next/navigation'; // Import useRouter
import type { Piece } from '@/types/pottery';
import Loading from './loading'; // Import the loading component

export default function HomePage() {
  const { user, loading: authLoading, userId } = useAuth(); // Get user, loading state, and userId
  const router = useRouter();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [isLoadingPieces, setIsLoadingPieces] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated and loading is finished
    if (!authLoading && !user) {
      router.push('/login');
      return; // Stop further execution in this effect
    }

    // Fetch pieces only if the user is authenticated
    if (user && userId) {
      const fetchPieces = async () => {
        setIsLoadingPieces(true);
        try {
          // TODO: Update getPieces to accept userId when backend is ready
          // For now, we fetch all pieces as before, but only *after* login
          const userPieces = await getPieces(/* Pass userId here in the future */);
          // TODO: Filter pieces by userId when data includes it
          // const userPieces = allPieces.filter(p => p.userId === userId);
          setPieces(userPieces);
        } catch (error) {
          console.error("Failed to fetch pottery pieces:", error);
          // Handle error state if needed
        } finally {
          setIsLoadingPieces(false);
        }
      };
      fetchPieces();
    } else if (!authLoading && !user) {
        // Handle case where user logs out while on the page
        setIsLoadingPieces(false);
        setPieces([]);
    }
  }, [user, authLoading, userId, router]);

  // Show loading state while authentication check is in progress or pieces are loading
  if (authLoading || (user && isLoadingPieces)) {
    return <Loading />;
  }

  // If user is not logged in (and not loading), the redirect should have happened.
  // But as a fallback, or if the redirect is pending, show nothing or a message.
  if (!user) {
     return (
        <div className="text-center py-10">
          <p>Please log in to view the pottery showcase.</p>
        </div>
     );
  }

  // User is logged in, show their pieces or a message if they have none
  return (
    <div className="space-y-8">
      <section aria-labelledby="pottery-showcase-title">
        <h1 id="pottery-showcase-title" className="text-3xl font-bold tracking-tight text-center mb-8 sm:text-4xl">
          Welcome{user.email ? `, ${user.email}` : ''}!
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore your collection of unique, handcrafted pottery.
        </p>
        {pieces.length > 0 ? (
          <PotteryGrid pieces={pieces} />
        ) : (
          <p className="text-center text-muted-foreground">You haven't added any pottery pieces yet.</p>
        )}
      </section>
    </div>
  );
}
