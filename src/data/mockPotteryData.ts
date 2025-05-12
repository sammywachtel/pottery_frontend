import type { Piece, Category } from '@/types/pottery';

// Placeholder user ID for mock data. In a real app, this would come from auth.
const MOCK_USER_ID = 'mockUserId123';

const categories: Category[] = [
  { id: 'cat1', name: 'Vases' },
  { id: 'cat2', name: 'Bowls' },
  { id: 'cat3', name: 'Mugs' },
  { id: 'cat4', name: 'Decorative' },
];

export const mockPieces: Piece[] = [
  {
    id: 'p1',
    userId: MOCK_USER_ID,
    name: 'Terracotta Sunrise Vase',
    description: 'A handcrafted terracotta vase, inspired by the warm hues of a sunrise. Perfect for medium-sized bouquets or as a standalone art piece.',
    height: 25, // cm
    width: 12,  // cm
    depth: 12,  // cm
    materials: 'Terracotta clay, Clear glaze',
    category: categories[0], // Vases
    imageUrls: ['https://picsum.photos/seed/p1_1/600/800', 'https://picsum.photos/seed/p1_2/600/800'],
    creationDate: '2023-05-15T00:00:00.000Z',
  },
  {
    id: 'p2',
    userId: MOCK_USER_ID,
    name: 'Earthenware Serving Bowl',
    description: 'Large earthenware bowl with a rustic beige finish, ideal for serving salads or fruits. Features subtle hand-carved patterns.',
    height: 10,
    width: 30,
    depth: 30,
    materials: 'Earthenware clay, Food-safe beige glaze',
    category: categories[1], // Bowls
    imageUrls: ['https://picsum.photos/seed/p2_1/600/800'],
    creationDate: '2023-08-20T00:00:00.000Z',
  },
  {
    id: 'p3',
    userId: 'anotherMockUserId456', // Assign some pieces to a different user for testing
    name: 'Forest Whisper Mug Set',
    description: 'Set of two stoneware mugs, glazed in deep forest green with a comfortable, ergonomic handle. Perfect for your morning coffee or tea.',
    height: 10,
    width: 9,
    depth: 12, // including handle
    materials: 'Stoneware clay, Lead-free green glaze',
    category: categories[2], // Mugs
    imageUrls: ['https://picsum.photos/seed/p3_1/600/800', 'https://picsum.photos/seed/p3_2/600/800'],
    creationDate: '2023-03-10T00:00:00.000Z',
  },
  {
    id: 'p4',
    userId: MOCK_USER_ID,
    name: 'Abstract Clay Sculpture "Cycles"',
    description: 'A unique decorative sculpture exploring themes of nature and continuity. Finished with a matte warm gray glaze.',
    height: 40,
    width: 20,
    depth: 15,
    materials: 'Sculptural clay body, Matte gray glaze',
    category: categories[3], // Decorative
    imageUrls: ['https://picsum.photos/seed/p4_1/600/800'],
    creationDate: '2022-11-05T00:00:00.000Z',
  },
  {
    id: 'p5',
    userId: MOCK_USER_ID,
    name: 'Minimalist Beige Planter',
    description: 'A sleek, minimalist planter with a smooth beige finish, perfect for small to medium-sized indoor plants. Includes a drainage hole and matching saucer.',
    height: 15,
    width: 16,
    depth: 16,
    materials: 'Stoneware, Matte beige glaze',
    category: categories[3], // Decorative (or could be a new 'Planters' category)
    imageUrls: ['https://picsum.photos/seed/p5_1/600/800', 'https://picsum.photos/seed/p5_2/600/800', 'https://picsum.photos/seed/p5_3/600/800'],
    creationDate: '2023-10-01T00:00:00.000Z',
  },
  {
    id: 'p6',
    userId: 'anotherMockUserId456',
    name: 'Burnt Sienna Coffee Pour Over',
    description: 'A stylish pour-over coffee maker in a striking burnt sienna glaze. Designed for a perfect brew and a beautiful kitchen accent.',
    height: 18,
    width: 13,
    depth: 13,
    materials: 'Porcelain, Burnt sienna glaze',
    category: categories[1], // Bowls (or 'Kitchenware')
    imageUrls: ['https://picsum.photos/seed/p6_1/600/800'],
    creationDate: '2023-09-12T00:00:00.000Z',
  },
];
