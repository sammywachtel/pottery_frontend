// src/app/pottery/[id]/page.tsx
'use client'; // Required for hooks

import { useEffect, useState } from 'react';
import { getPieceById, getPieces } from '@/services/potteryService';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link';
import { ArrowLeft, Ruler, Palette, Tag, CalendarDays, ShapesIcon } from 'lucide-react';
import type { Metadata } from 'next'; // Metadata generation still happens server-side initially
import type { Piece } from '@/types/pottery';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import LoadingPotteryDetail from './loading'; // Import loading component

// --- Server-Side Data Fetching for Metadata and Static Params ---
// NOTE: These functions run at build time or on demand (ISR).
// They DO NOT have access to the client-side AuthContext.
// Authentication checks happen client-side after the page loads.

// export async function generateStaticParams() {
//   // TODO: This needs adjustment if pieces are user-specific.
//   // For now, it might generate params for all pieces, but access control
//   // will happen client-side. A better approach would be needed for
//   // truly user-specific static generation or switch to dynamic rendering.
//   // Let's comment this out for now to avoid potential issues.
//   // const pieces = await getPieces();
//   // return pieces.map((piece) => ({
//   //   id: piece.id,
//   // }));
//   return []; // Return empty array if not generating static params per user
// }

// export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
//   // This fetches data without user context, potentially leaking titles/descriptions.
//   // For a secure app, metadata might need to be generic or fetched client-side.
//   // Let's keep it simple for now, but be aware of the limitation.
//   const piece = await getPieceById(params.id /* needs userId too ideally */);

//   if (!piece) {
//     return { title: 'Piece Not Found' };
//   }

//   return {
//     title: `${piece.name} - Earthen Hub`,
//     description: piece.description.substring(0, 150),
//     openGraph: {
//       title: piece.name,
//       description: piece.description.substring(0, 150),
//       images: piece.imageUrls.length > 0 ? [{ url: piece.imageUrls[0], width: 600, height: 800, alt: piece.name }] : [],
//     },
//   };
// }
// --- End Server-Side ---


function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | number | null }) {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex items-start space-x-3">
      <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base text-foreground">{String(value)}</p>
      </div>
    </div>
  );
}


export default function PotteryDetailPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading, userId } = useAuth();
  const router = useRouter();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [isLoadingPiece, setIsLoadingPiece] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && userId) {
      const fetchPiece = async () => {
        setIsLoadingPiece(true);
        setAccessDenied(false);
        try {
          // TODO: Update getPieceById to check userId when backend supports it
          const fetchedPiece = await getPieceById(params.id /*, userId */);

          if (!fetchedPiece) {
            setPiece(null); // Piece doesn't exist
          }
           // TODO: Uncomment this block when pieces have userId and service checks it
          // else if (fetchedPiece.userId !== userId) {
          //   setAccessDenied(true); // Piece exists but doesn't belong to user
          //   setPiece(null);
          // }
           else {
            setPiece(fetchedPiece); // Piece found and belongs to user (assuming for now)
          }
        } catch (error) {
          console.error("Failed to fetch pottery piece:", error);
          setPiece(null); // Handle error case
        } finally {
          setIsLoadingPiece(false);
        }
      };
      fetchPiece();
    } else if (!authLoading && !user) {
      // Handle case where user logs out while on the page
      setIsLoadingPiece(false);
      setPiece(null);
    }
  }, [user, authLoading, userId, params.id, router]);

  // Show loading state
  if (authLoading || isLoadingPiece) {
    return <LoadingPotteryDetail />;
  }

  // Redirect should have happened if not logged in
   if (!user) {
     return (
        <div className="text-center py-10">
          <p>Please log in to view this piece.</p>
        </div>
     );
   }

  // Handle access denied (piece exists but not owned by user)
  if (accessDenied) {
     return (
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have permission to view this pottery piece.</p>
          <Button variant="outline" asChild>
             <Link href="/">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Showcase
             </Link>
           </Button>
        </div>
     );
  }

  // Handle piece not found
  if (!piece) {
    // Use Next.js notFound function for proper 404 handling *after* checks
    notFound();
  }

  // Piece loaded and user is authenticated & authorized
  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Showcase
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {piece.imageUrls.map((url, index) => (
            <div key={index} className={`rounded-lg overflow-hidden shadow-lg ${index === 0 ? 'aspect-[3/4]' : 'aspect-video'}`}>
              <Image
                src={url}
                alt={`Image ${index + 1} of ${piece.name}`}
                width={index === 0 ? 600 : 400}
                height={index === 0 ? 800 : 300}
                className="w-full h-full object-cover"
                data-ai-hint={index === 0 ? "pottery detail" : "ceramic angle"}
                priority={index === 0}
              />
            </div>
          ))}
           {piece.imageUrls.length === 0 && (
             <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
               <ShapesIcon className="w-24 h-24 text-muted-foreground" />
             </div>
           )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{piece.name}</h1>

          <p className="text-base text-muted-foreground leading-relaxed">{piece.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
            <DetailItem icon={Palette} label="Materials" value={piece.materials} />
            <DetailItem icon={Tag} label="Category" value={piece.category.name} />

            { (piece.height || piece.width || piece.depth) &&
              <div className="flex items-start space-x-3">
                <Ruler className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dimensions (cm)</p>
                  <p className="text-base text-foreground">
                    {piece.height && `H: ${piece.height} `}
                    {piece.width && `W: ${piece.width} `}
                    {piece.depth && `D: ${piece.depth}`}
                  </p>
                </div>
              </div>
            }

            {piece.creationDate && (
              <DetailItem
                icon={CalendarDays}
                label="Created On"
                value={new Date(piece.creationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
