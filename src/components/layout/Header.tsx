// src/components/layout/Header.tsx
'use client'; // Need client component for hooks

import Link from 'next/link';
import { PotIcon } from '@/components/icons/PotIcon';
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut } from 'lucide-react'; // Import icons

export function Header() {
  const { user, loading } = useAuth(); // Get user and loading state
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login page after logout
      router.refresh(); // Ensure layout updates
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally show a toast notification for logout error
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <PotIcon className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-xl">
            Earthen Hub
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {!loading && ( // Only render buttons when not loading
              <>
                {user ? (
                  // If user is logged in, show Logout button
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                ) : (
                  // If user is not logged in, show Login button
                  <Button variant="ghost" asChild>
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" /> Login
                    </Link>
                  </Button>
                )}
              </>
            )}
             {loading && (
                // Optional: Show a placeholder or skeleton while loading
                <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
             )}
          </nav>
        </div>
      </div>
    </header>
  );
}
