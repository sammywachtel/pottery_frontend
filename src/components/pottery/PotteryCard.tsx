import Link from 'next/link';
import Image from 'next/image';
import type { Piece } from '@/types/pottery';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// Removed Badge and CircleDollarSign imports as they are no longer used

interface PotteryCardProps {
  piece: Piece;
}

export function PotteryCard({ piece }: PotteryCardProps) {
  // Removed displayPrice logic

  return (
    <Link href={`/pottery/${piece.id}`} className="block group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl hover:border-primary/50">
        <CardHeader className="p-0">
          {piece.imageUrls.length > 0 ? (
            <div className="aspect-[3/4] overflow-hidden">
              <Image
                src={piece.imageUrls[0]}
                alt={`Image of ${piece.name}`}
                width={600}
                height={800}
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                data-ai-hint="pottery ceramic"
                priority={piece.id === 'p1' || piece.id === 'p2'} // Prioritize first few images for LCP
              />
            </div>
          ) : (
             <div className="aspect-[3/4] bg-muted flex items-center justify-center">
               {/* Placeholder Icon can be added here if desired */}
             </div>
           )
          }
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-2 leading-tight">{piece.name}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{piece.description}</p>
        </CardContent>
        {/* CardFooter can be removed if no longer needed, or kept for future elements */}
        {/* <CardFooter className="p-4"> */}
          {/* Removed Status Badge */}
          {/* Removed Price Display */}
        {/* </CardFooter> */}
      </Card>
    </Link>
  );
}
