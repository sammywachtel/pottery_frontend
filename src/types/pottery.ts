export interface Category {
  id: string;
  name: string;
}

export type PieceStatus = "Available" | "Sold" | "Reserved" | "Not For Sale";

export interface Piece {
  id: string;
  name: string;
  description: string;
  status: PieceStatus;
  price?: number;
  height?: number; // in cm
  width?: number;  // in cm
  depth?: number;  // in cm
  materials: string;
  category: Category;
  imageUrls: string[];
  creationDate?: string; // ISO date string
}
