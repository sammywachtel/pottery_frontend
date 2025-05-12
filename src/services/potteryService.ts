import { mockPieces } from '@/data/mockPotteryData';
import type { Piece } from '@/types/pottery';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Updated getPieces to accept userId (now expected from hardcoded context)
// In a real backend, this would filter the query based on the authenticated user
export async function getPieces(userId?: string | null): Promise<Piece[]> {
  await delay(500); // Simulate network latency

  // If userId is provided (expected from the context), filter the mock data
  // This simulates fetching only the logged-in user's data.
  if (userId) {
    console.log(`Fetching pieces for hardcoded user: ${userId}`); // Log for debugging
    return mockPieces.filter(piece => piece.userId === userId);
  }

  // This case should not be reached if the context provides a userId
  console.warn("getPieces called without a userId.");
  return [];
}

// Updated getPieceById accepts userId (from hardcoded context) and checks ownership
export async function getPieceById(id: string, userId?: string | null): Promise<Piece | undefined> {
  await delay(300); // Simulate network latency
  const piece = mockPieces.find(piece => piece.id === id);

  // If a userId is provided (expected from context), check if the found piece belongs to that user.
  // This prevents accidentally showing data from other mock users.
  if (piece && userId && piece.userId !== userId) {
     console.warn(`Hardcoded user ${userId} attempted to access piece ${id} owned by ${piece.userId}. Access denied.`);
     return undefined; // Simulate access denied / not found for this user
   }

   if (piece && userId && piece.userId === userId) {
       console.log(`Fetching piece ${id} for hardcoded user ${userId}. Access granted.`); // Log for debugging
   } else if (piece && !userId) {
       console.warn(`Fetching piece ${id} without userId check (Auth likely bypassed).`);
   }


  return piece; // Return the piece if found and user check passes (or no user provided)
}
