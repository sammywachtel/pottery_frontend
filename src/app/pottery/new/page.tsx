// src/app/pottery/new/page.tsx
import { AddPotteryForm } from '@/components/pottery/AddPotteryForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Pottery Piece | Earthen Hub',
  description: 'Add a new handcrafted pottery piece to your collection.',
};

export default function AddNewPotteryPage() {
  // Auth check could happen here if not handled by a layout or middleware
  // For now, assuming AuthContext handles redirection or UI changes if not authenticated.
  
  return (
    <div className="container mx-auto py-8 px-4">
      <AddPotteryForm />
    </div>
  );
}
