// src/app/page.tsx
'use client'; // Required for hooks (useAuth, useState, useEffect)

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPieces } from '@/services/potteryService';
import { PotteryGrid } from '@/components/pottery/PotteryGrid';
import { useAuth } from '@/context/AuthContext';
import type { Piece } from '@/types/pottery';
import Loading from './loading';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function HomePage() {
  const { user, userId } = useAuth();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [isLoadingPieces, setIsLoadingPieces] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchPieces = async () => {
        setIsLoadingPieces(true);
        try {
          const userPieces = await getPieces(userId);
          setPieces(userPieces);
        } catch (error) {
          console.error("Failed to fetch pottery pieces:", error);
        } finally {
          setIsLoadingPieces(false);
        }
      };
      fetchPieces();
    } else {
        console.error("User ID not available despite bypassed login.");
        setIsLoadingPieces(false);
        setPieces([]);
    }
  }, [userId]);

  if (isLoadingPieces && !user) { // Show loading only if user is not yet determined or pieces are loading
    return <Loading />;
  }
  
  if (!user) { // If user is null (not logged in), prompt to login or show minimal content
      // This state should not be reached with hardcoded auth, but good for future real auth
    return (
        <div className="text-center py-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Welcome to Earthen Hub</h1>
            <p className="text-lg text-muted-foreground mb-8">Please log in to view and manage your pottery collection.</p>
            {/* The login page will handle the bypassed auth message */}
            <Button asChild>
                <Link href="/login">Go to Login</Link>
            </Button>
        </div>
    );
  }

  // User is logged in (as admin or actual user in future)
  return (
    <div className="space-y-8">
      <section aria-labelledby="pottery-showcase-title">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 id="pottery-showcase-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome, {user.email || 'Admin'}!
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
              Explore your collection of unique, handcrafted pottery.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/pottery/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Piece
            </Link>
          </Button>
        </div>
        
        {isLoadingPieces ? (
            <Loading />
        ) : pieces.length > 0 ? (
          <PotteryGrid pieces={pieces} />
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground mb-6">You haven&apos;t added any pottery pieces yet.</p>
            <Button asChild size="lg">
              <Link href="/pottery/new">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Your First Piece
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
