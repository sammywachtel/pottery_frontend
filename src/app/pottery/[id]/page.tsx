// src/app/pottery/[id]/page.tsx
'use client'; // Required for hooks

import { useEffect, useState } from 'react';
import { getPieceById } from '@/services/potteryService'; // getPieces no longer needed here
import Image from 'next/image';
import { notFound } from 'next/navigation'; // useRouter no longer needed for redirection
import Link from 'next/link';
import { ArrowLeft, Ruler, Palette, Tag, CalendarDays, ShapesIcon } from 'lucide-react';
// import type { Metadata } from 'next'; // Metadata generation needs reconsideration if auth is bypassed
import type { Piece } from '@/types/pottery';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import LoadingPotteryDetail from './loading'; // Import loading component

// --- Server-Side Data Fetching (Needs Review for Bypassed Auth) ---
// Static params and metadata generation might behave unexpectedly or insecurely
// when auth is hardcoded client-side. Consider disabling or making generic.
// Commenting out for safety.

// export async function generateStaticParams() { ... }
// export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> { ... }

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
  // Extract id from params outside useEffect
  const pieceId = params.id;

  // Since auth is bypassed, user and userId will always be populated, loading is false
  const { user, userId } = useAuth();
  // const router = useRouter(); // No longer needed
  const [piece, setPiece] = useState<Piece | null>(null);
  const [isLoadingPiece, setIsLoadingPiece] = useState(true);
  // const [accessDenied, setAccessDenied] = useState(false); // No longer needed

  useEffect(() => {
    // Fetch piece directly using hardcoded userId and pieceId from props
    if (userId && pieceId) { // Ensure both userId and pieceId are available
      const fetchPiece = async () => {
        setIsLoadingPiece(true);
        // setAccessDenied(false); // No longer needed
        try {
          // Use the pieceId variable derived from props
          const fetchedPiece = await getPieceById(pieceId, userId);

          if (!fetchedPiece) {
            setPiece(null); // Piece doesn't exist or doesn't belong to hardcoded user
          } else {
            setPiece(fetchedPiece); // Piece found
          }
        } catch (error) {
          console.error("Failed to fetch pottery piece:", error);
          setPiece(null); // Handle error case
        } finally {
          setIsLoadingPiece(false);
        }
      };
      fetchPiece();
    } else if (!userId) {
       // This case should not happen with hardcoded auth
       console.error("User ID not available despite bypassed login.");
       setIsLoadingPiece(false);
       setPiece(null);
    } else {
        // Handle case where pieceId might be missing (though unlikely from routing)
        console.error("Piece ID is missing.");
        setIsLoadingPiece(false);
        setPiece(null);
    }
    // Depend on userId and the stable pieceId variable from props
  }, [userId, pieceId]);

  // Show loading state only while piece is loading
  if (isLoadingPiece) {
    return <LoadingPotteryDetail />;
  }

  // No need for !user check or accessDenied check

  // Handle piece not found (either doesn't exist or doesn't belong to hardcoded user)
  if (!piece) {
    notFound(); // Use Next.js notFound function
  }

  // Piece loaded and user is "authenticated"
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
                    {piece.height ? `H: ${piece.height} ` : ''}
                    {piece.width ? `W: ${piece.width} ` : ''}
                    {piece.depth ? `D: ${piece.depth}` : ''}
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
