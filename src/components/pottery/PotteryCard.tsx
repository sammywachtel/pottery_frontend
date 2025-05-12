import Link from 'next/link';
import Image from 'next/image';
import type { Piece } from '@/types/pottery';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleDollarSign } from 'lucide-react';

interface PotteryCardProps {
  piece: Piece;
}

export function PotteryCard({ piece }: PotteryCardProps) {
  const displayPrice = piece.price !== undefined && piece.status !== "Sold" && piece.status !== "Not For Sale";

  return (
    <Link href={`/pottery/${piece.id}`} className="block group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl hover:border-primary/50">
        <CardHeader className="p-0">
          {piece.imageUrls.length > 0 && (
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
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-2 leading-tight">{piece.name}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{piece.description}</p>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <Badge variant={piece.status === 'Available' ? 'secondary' : piece.status === 'Sold' ? 'destructive' : 'outline'}
                 className={piece.status === 'Available' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-800/30 dark:text-green-300 dark:border-green-700' : 
                            piece.status === 'Sold' ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-800/30 dark:text-red-300 dark:border-red-700' :
                            piece.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-800/30 dark:text-yellow-300 dark:border-yellow-700' :
                            'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600'}>
            {piece.status}
          </Badge>
          {displayPrice && (
            <div className="flex items-center text-lg font-medium text-primary">
              <CircleDollarSign className="mr-1 h-5 w-5" />
              {piece.price?.toFixed(2)}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
