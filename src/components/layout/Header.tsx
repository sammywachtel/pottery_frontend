// src/components/layout/Header.tsx
'use client'; // Still needed if other client features are used, but auth logic removed

import Link from 'next/link';
import { PotIcon } from '@/components/icons/PotIcon';
// Removed imports: useAuth, Button, signOut, auth, useRouter, LogIn, LogOut

export function Header() {
  // Removed useAuth hook and handleLogout function

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
          {/* Removed nav section with login/logout buttons */}
          {/* Optionally add user email here if desired, accessing from useAuth */}
           {/* <span className="text-sm text-muted-foreground">Admin Mode</span> */}
        </div>
      </div>
    </header>
  );
}
