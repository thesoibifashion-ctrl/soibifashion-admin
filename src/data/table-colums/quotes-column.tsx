import ProjectActions from "@/pages/admin/quotes/Actions";
import { truncateText } from "@/lib/utils/truncateText";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/shared/Badge";
import type { Quote } from "@/types";




export const QuoteColumns: ColumnDef<Quote>[] = [
  {
    accessorKey: "referenceNumber",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-bold font-sans text-[#1C1917]">
        {row.original.referenceNumber}
      </span>
    ),
  },

  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-medium text-[#1C1917]">
          {truncateText(row.original.customerName, 24)}
        </p>

        <p className="text-xs text-[#78716C] mt-0.5">
          {truncateText(row.original.customerEmail, 28)}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "customerPhone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm text-[#44403C]">
        {row.original.customerPhone || "-"}
      </span>
    ),
  },

  {
    accessorKey: "contactMethod",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-sm text-[#44403C] capitalize">
        {row.original.contactMethod || "-"}
      </span>
    ),
  },

  // {
  //   accessorKey: "customerStatus",
  //   header: "Customer Status",
  //   cell: ({ row }) => <span className="flex items-center gap-1"><Badge variant={row.original.customerStatus}>{row.original.status}</Badge></span>,

  // },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <Badge variant={row.original.status}>{row.original.status}</Badge>
    ),
  },



//   {
//     id: "actions",
//     header: "",
//     cell: ({ row }) => (
//       <div onClick={(e) => e.stopPropagation()}>
//         <ProjectActions quote={row.original} />
//       </div>
//     ),
//   },
];
