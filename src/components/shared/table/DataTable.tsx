import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;

  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  page,
  pageCount,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md ">
      <Table>
        <TableHeader className="bg-[#DFDFDF4A] ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="text-[#6B7280]  font-bold text-xs"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="bg-[white] ">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={() => onRowClick?.(row.original)}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className="font-normal text-sm  py-4  text-[#4B5563]"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
     <div className="flex justify-between items-center pt-4">
      <div>Page <strong>{page}</strong> of {pageCount}</div>
     <div className="flex justify-end ">
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious
          onClick={() => onPageChange(Math.max(page - 1, 1))}
        />
      </PaginationItem>

      <PaginationItem>
        <PaginationLink
          isActive={page === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>

      {page > 3 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {Array.from({ length: pageCount }, (_, i) => i + 1)
        .filter((p) => p !== 1 && p !== pageCount)
        .filter((p) => Math.abs(p - page) <= 1)
        .map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === page}
              onClick={() => onPageChange(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

      {page < pageCount - 2 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {pageCount > 1 && (
        <PaginationItem>
          <PaginationLink
            isActive={page === pageCount}
            onClick={() => onPageChange(pageCount)}
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      )}

      {/* Next */}
      <PaginationItem>
        <PaginationNext
          onClick={() =>
            onPageChange(Math.min(page + 1, pageCount))
          }
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</div>
     </div>
    </div>
  );
}
