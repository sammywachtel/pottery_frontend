import { getPieceById, getPieces } from '@/services/potteryService';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Ruler, Palette, Tag, CircleDollarSign, CalendarDays, ShapesIcon } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Piece } from '@/types/pottery';

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const pieces = await getPieces();
  return pieces.map((piece) => ({
    id: piece.id,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const piece = await getPieceById(params.id);

  if (!piece) {
    return {
      title: 'Piece Not Found',
    };
  }

  return {
    title: `${piece.name} - Earthen Hub`,
    description: piece.description.substring(0, 150),
    openGraph: {
      title: piece.name,
      description: piece.description.substring(0,150),
      images: piece.imageUrls.length > 0 ? [{ url: piece.imageUrls[0], width: 600, height: 800, alt: piece.name }] : [],
    },
  };
}


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


export default async function PotteryDetailPage({ params }: Props) {
  const piece = await getPieceById(params.id);

  if (!piece) {
    notFound();
  }

  const displayPrice = piece.price !== undefined && piece.status !== "Sold" && piece.status !== "Not For Sale";

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
          
          <Badge 
            variant={piece.status === 'Available' ? 'secondary' : piece.status === 'Sold' ? 'destructive' : 'outline'}
            className={`text-sm px-3 py-1 ${piece.status === 'Available' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-800/30 dark:text-green-300 dark:border-green-700' : 
                        piece.status === 'Sold' ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-800/30 dark:text-red-300 dark:border-red-700' :
                        piece.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-800/30 dark:text-yellow-300 dark:border-yellow-700' :
                        'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600'}`}
          >
            {piece.status}
          </Badge>

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

            {displayPrice && (
              <DetailItem icon={CircleDollarSign} label="Price" value={`$${piece.price?.toFixed(2)}`} />
            )}

            {piece.creationDate && (
              <DetailItem 
                icon={CalendarDays} 
                label="Created On" 
                value={new Date(piece.creationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} 
              />
            )}
          </div>
          
          {piece.status === "Available" && displayPrice && (
            <Button size="lg" className="w-full mt-4">
              Inquire About This Piece
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
