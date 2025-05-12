import { mockPieces } from '@/data/mockPotteryData';
import type { Piece } from '@/types/pottery';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPieces(): Promise<Piece[]> {
  await delay(500); // Simulate network latency
  return mockPieces;
}

export async function getPieceById(id: string): Promise<Piece | undefined> {
  await delay(300); // Simulate network latency
  return mockPieces.find(piece => piece.id === id);
}
