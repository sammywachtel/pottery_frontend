export interface Category {
  id: string;
  name: string;
}

// Removed PieceStatus type as items are not for sale.

export interface Piece {
  id: string;
  name: string;
  description: string;
  // Removed status field
  // Removed price field
  height?: number; // in cm
  width?: number;  // in cm
  depth?: number;  // in cm
  materials: string;
  category: Category;
  imageUrls: string[];
  creationDate?: string; // ISO date string
}
