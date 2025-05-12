// src/app/page.tsx
'use client'; // Required for hooks (useAuth, useState, useEffect)

import { useEffect, useState } from 'react';
import { getPieces } from '@/services/potteryService';
import { PotteryGrid } from '@/components/pottery/PotteryGrid';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
// import { useRouter } from 'next/navigation'; // No longer needed for redirection
import type { Piece } from '@/types/pottery';
import Loading from './loading'; // Import the loading component

export default function HomePage() {
  // Since auth is bypassed, user and userId will always be populated, loading is always false
  const { user, userId } = useAuth();
  // const router = useRouter(); // No longer needed
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [isLoadingPieces, setIsLoadingPieces] = useState(true);

  useEffect(() => {
    // Fetch pieces directly since user is assumed logged in
    if (userId) {
      const fetchPieces = async () => {
        setIsLoadingPieces(true);
        try {
          // Pass the hardcoded userId from context to fetch the correct pieces
          const userPieces = await getPieces(userId);
          setPieces(userPieces);
        } catch (error) {
          console.error("Failed to fetch pottery pieces:", error);
          // Handle error state if needed
        } finally {
          setIsLoadingPieces(false);
        }
      };
      fetchPieces();
    } else {
        // This case should technically not happen with hardcoded auth, but good practice
        console.error("User ID not available despite bypassed login.");
        setIsLoadingPieces(false);
        setPieces([]);
    }
    // Dependency array simplified as user/userId are constant now
  }, [userId]);

  // Show loading state only while pieces are loading
  if (isLoadingPieces) {
    return <Loading />;
  }

  // User is always logged in (as admin)
  return (
    <div className="space-y-8">
      <section aria-labelledby="pottery-showcase-title">
        <h1 id="pottery-showcase-title" className="text-3xl font-bold tracking-tight text-center mb-8 sm:text-4xl">
          Welcome, Admin! {/* Display generic or admin welcome */}
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
