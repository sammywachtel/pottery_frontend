export interface Category {
  id: string;
  name: string;
}

export interface Piece {
  id: string;
  userId: string;
  name: string;
  description: string;
  height?: number; // in cm
  width?: number;  // in cm
  depth?: number;  // in cm
  materials: string;
  category: Category;
  imageUrls: string[];
  creationDate: string; // ISO date string - Will be set on creation
}

// Type for the form data before it's processed into a Piece
export interface NewPieceData {
  name: string;
  description: string;
  height?: number;
  width?: number;
  depth?: number;
  materials: string;
  categoryId: string; // Store category ID from form
  imageUrls: string[]; // Store as data URIs from form
}
