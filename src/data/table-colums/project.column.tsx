import { Badge } from "@/components/shared/Badge";
import { statusBadge } from "@/lib/utils/statusBadge";
import { truncateText } from "@/lib/utils/truncateText";
import ProjectActions from "@/pages/admin/quotes/Actions";
import type { Product } from "@/types";
import type { statusType } from "@/types/status";
import type { ColumnDef } from "@tanstack/react-table";
import { Sparkles } from "lucide-react";


export const ProjectColumn: ColumnDef<Product>[] = [
  {
    accessorKey: "coverImage",
    header: "Product Image",
    cell: ({ row }) => (
      <span>
        <img
          src={row?.original?.images?.[0]?.imageUrl}
          className="w-10 h-10 object-cover object-top rounded-lg"
        />
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => truncateText(row.original.name, 20),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => truncateText(row.original.description, 20),
  },

  // {
  //   accessorKey: "description",
  //   header: "Description",
  //   cell: ({ row }) => (
  //     <span>
  //       <img
  //         src={row.original.coverImage}
  //         className="w-20 h-10 object-cover object-top rounded-lg"
  //       />
  //     </span>
  //   ),
  // },

  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) => {
      const collection = row.original.collections?.[0];
      return collection ? truncateText(collection.name, 20) : "-";
    },
  },
  {
    accessorKey: "baseBrise",
    header: "Price",
    cell: ({ row }) => (row.original.basePrice || 0),

  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="flex items-center gap-1"><Badge variant={row.original.status}>{row.original.status}</Badge></span>,

    // cell: ({ row }) => getStatus(row.original.status ?? "draft"),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <ProjectActions
          status={row.original.status}
          projectId={row.original.id}
        />
      </div>
    ),
  },
];
