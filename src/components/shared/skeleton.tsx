import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 10, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="w-full rounded-md  ">
      <div
        className="grid border-b rounded-t-3xl bg-[#8b8b8b4a] p-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-20" />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid items-center bg-white border-b p-4 last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={`h-4 ${
                colIndex === 0
                  ? "w-32"
                  : colIndex === columns - 1
                  ? "w-16"
                  : "w-24"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
