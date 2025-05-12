import { getPieces } from '@/services/potteryService';
import { PotteryGrid } from '@/components/pottery/PotteryGrid';

export default async function HomePage() {
  const pieces = await getPieces();

  return (
    <div className="space-y-8">
      <section aria-labelledby="pottery-showcase-title">
        <h1 id="pottery-showcase-title" className="text-3xl font-bold tracking-tight text-center mb-8 sm:text-4xl">
          Welcome to Earthen Hub
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore our collection of unique, handcrafted pottery. Each piece tells a story of artistry and passion.
        </p>
        <PotteryGrid pieces={pieces} />
      </section>
    </div>
  );
}
