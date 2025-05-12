import type { Piece } from '@/types/pottery';
import { PotteryCard } from './PotteryCard';

interface PotteryGridProps {
  pieces: Piece[];
}

export function PotteryGrid({ pieces }: PotteryGridProps) {
  if (!pieces || pieces.length === 0) {
    return <p className="text-center text-muted-foreground">No pottery pieces to display.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pieces.map(piece => (
        <PotteryCard key={piece.id} piece={piece} />
      ))}
    </div>
  );
}
