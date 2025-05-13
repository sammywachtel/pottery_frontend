import { mockPieces, categories as mockCategories } from '@/data/mockPotteryData';
import type { Piece, Category, NewPieceData } from '@/types/pottery';

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

export async function getCategories(): Promise<Category[]> {
  await delay(100); // Simulate network latency
  return mockCategories;
}

export async function addPiece(newPieceData: NewPieceData, userId: string): Promise<Piece> {
  await delay(700); // Simulate network latency

  if (!userId) {
    throw new Error('User ID is required to add a piece.');
  }

  const category = mockCategories.find(cat => cat.id === newPieceData.categoryId);
  if (!category) {
    throw new Error(`Category with ID ${newPieceData.categoryId} not found.`);
  }

  const newPiece: Piece = {
    ...newPieceData,
    id: `p${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`, // More unique ID
    userId,
    category, // Assign the full category object
    creationDate: new Date().toISOString(),
    imageUrls: newPieceData.imageUrls, // Already data URIs from form
  };

  // In a real app, this would be an API call to a backend.
  // For mock data, we'll add it to the in-memory array.
  // Ensure mockPieces is mutable if you're directly pushing to it.
  // If mockPieces is imported from a module where it's const, this won't work as expected.
  // It's better to manage state in a way that it can be updated.
  // For this example, we assume mockPieces can be mutated or we return a new array.
  
  // Option 1: Mutate (if mockPieces is let)
  mockPieces.push(newPiece);
  
  // Option 2: Return new array (if mockPieces is const or for better practice)
  // This would require getPieces to be aware of this update mechanism,
  // or for the state to be managed by a context/store.
  // For simplicity with current structure, we'll assume direct mutation for mock data.

  console.log("Added new piece:", newPiece);
  return newPiece;
}
