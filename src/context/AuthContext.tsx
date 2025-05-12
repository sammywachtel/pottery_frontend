// src/context/AuthContext.tsx
'use client';

import type { User } from 'firebase/auth';
// import { onAuthStateChanged } from 'firebase/auth'; // Removed Firebase auth listener
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
// import { auth } from '@/lib/firebase'; // Removed Firebase import
// import { Skeleton } from '@/components/ui/skeleton'; // Removed Skeleton import

// Define a mock user type that includes uid and email
type MockUser = {
  uid: string;
  email: string | null;
  // Add other User properties if needed by components, otherwise keep it minimal
};

interface AuthContextType {
  user: MockUser | null; // Use MockUser type
  loading: boolean;
  userId: string | null;
}

// Hardcoded admin user details
const MOCK_ADMIN_USER_ID = 'mockUserId123'; // Use one of the IDs from mock data
const mockAdminUser: MockUser = {
  uid: MOCK_ADMIN_USER_ID,
  email: 'admin@example.com', // Or null if preferred
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false, // Set loading to false initially
  userId: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Set the state directly to the hardcoded admin user
  const [user] = useState<MockUser | null>(mockAdminUser);
  const [loading] = useState(false); // No loading needed
  const [userId] = useState<string | null>(MOCK_ADMIN_USER_ID);

  // No need for useEffect or onAuthStateChanged listener anymore
  // No need for loading skeleton as loading is always false

  return (
    <AuthContext.Provider value={{ user, loading, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
