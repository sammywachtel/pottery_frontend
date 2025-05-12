export interface Category {
  id: string;
  name: string;
}

export interface Piece {
  id: string;
  userId: string; // Added to associate piece with a user
  name: string;
  description: string;
  height?: number; // in cm
  width?: number;  // in cm
  depth?: number;  // in cm
  materials: string;
  category: Category;
  imageUrls: string[];
  creationDate?: string; // ISO date string
}
