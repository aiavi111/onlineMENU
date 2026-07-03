import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-2xl", className)} />;
}

/** placeholder matching DishCard geometry — zero layout shift on load */
export function DishCardSkeleton() {
  return (
    <div className="rounded-4xl bg-card border border-line p-3 pb-4">
      <Skeleton className="aspect-[16/10] w-full rounded-3xl" />
      <div className="mt-4 space-y-2.5 px-1">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-11 w-11 rounded-full" />
        </div>
      </div>
    </div>
  );
}
