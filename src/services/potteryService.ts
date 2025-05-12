import { mockPieces } from '@/data/mockPotteryData';
import type { Piece } from '@/types/pottery';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Updated getPieces to potentially accept userId
// In a real backend, this would filter the query
export async function getPieces(userId?: string | null): Promise<Piece[]> {
  await delay(500); // Simulate network latency

  // If userId is provided, filter the mock data
  // In a real app, the backend query would handle this filtering
  if (userId) {
    return mockPieces.filter(piece => piece.userId === userId);
  }

  // If no userId (e.g., for some public view if needed later, or error case), return empty or handle appropriately
  // For now, returning empty if no user logged in.
   // IMPORTANT: For the current implementation where page.tsx calls this *only* when logged in,
   // we'll return all pieces associated with the mock user used in page.tsx's check.
   // This simulates fetching only the logged-in user's data.
   // Adjust MOCK_USER_ID if needed or remove filter entirely if page.tsx handles it.
  return mockPieces.filter(p => p.userId === 'mockUserId123'); // Simulating fetch for logged-in user

  // Alternatively, return all pieces if the filtering/check happens in the component:
  // return mockPieces;
}

// Updated getPieceById to potentially accept userId and check ownership
export async function getPieceById(id: string, userId?: string | null): Promise<Piece | undefined> {
  await delay(300); // Simulate network latency
  const piece = mockPieces.find(piece => piece.id === id);

  // If a userId is provided, check if the found piece belongs to that user
  // In a real app, the backend query might combine fetching and checking ownership
  if (piece && userId && piece.userId !== userId) {
     console.warn(`User ${userId} attempted to access piece ${id} owned by ${piece.userId}`);
     return undefined; // Simulate access denied / not found for this user
   }


  return piece; // Return the piece if found and user check passes (or no user check needed)
}
