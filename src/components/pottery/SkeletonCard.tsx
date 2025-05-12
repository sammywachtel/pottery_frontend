import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCard() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="aspect-[3/4] w-full" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      {/* Removed CardFooter containing skeletons for status and price */}
      {/* <CardFooter className="p-4 flex justify-between items-center">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </CardFooter> */}
    </Card>
  );
}
