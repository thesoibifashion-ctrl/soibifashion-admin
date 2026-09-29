import { Skeleton } from "@/components/ui/skeleton";

const BlogSkeleton = () => {
  return (
    <div className="mt-20">
    
      

      <div className="flex items-center gap-2 py-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-md bg-[#D9D9D9]" />
        ))}
      </div>

      <div className="mt-[30px]">
        <Skeleton className="h-10 w-2/3 bg-[#D9D9D9]" />
      </div>

      <div className="mt-2 w-full">
        <Skeleton className="h-5 w-1/3 bg-[#D9D9D9]" />
      </div>

      <div className="mt-4">
        <Skeleton className="h-64 w-full rounded-xl bg-[#D9D9D9]" />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Skeleton className="h-4 w-full bg-[#D9D9D9]" />
        <Skeleton className="h-4 w-full bg-[#D9D9D9]" />
        <Skeleton className="h-4 w-5/6 bg-[#D9D9D9]" />
        <Skeleton className="h-4 w-full bg-[#D9D9D9]" />
        <Skeleton className="h-4 w-4/6 bg-[#D9D9D9]" />
      </div>
    </div>
  );
};

export default BlogSkeleton;
