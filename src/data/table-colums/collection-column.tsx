
import { Badge } from "@/components/shared/Badge";
import ImagePreview from "@/components/shared/ImagePreview";
import { formatDate } from "@/lib/utils/formatDate";
import { statusBadge } from "@/lib/utils/statusBadge";
import { truncateText } from "@/lib/utils/truncateText";
import ResearchActions from "@/pages/admin/collections/Actions";
import type { Collection } from "@/types";
import type { statusType } from "@/types/status";
import type { ColumnDef } from "@tanstack/react-table";
import { Sparkles } from "lucide-react";


export const CollectionColun: ColumnDef<Collection>[] = [
  {
    accessorKey: "coverImage",
    header: "Cover Image",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>

        <ImagePreview src={row?.original?.imageUrl }/>
        {/* <img
          src=
          className="w-10 h-10 object-cover object-top rounded-lg"
        /> */}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="text-[#1F2937] pl-2">{truncateText(row.original.name ?? "", 13)}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-[#1F2937] pl-2">{truncateText(row.original.description ?? "", 25)}</span>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => (
      <span className="text-[#1F2937] pl-2">{row.original.productCount || 0}</span>
    ),
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Date Published",
  //   cell: ({ row }) => <span>{formatDate(row.original.publishedAt ?? "")}</span>,
  // },

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
        <ResearchActions status={row.original.status ?? "draft"}  researchId={row?.original.id ?? ""} />
      </div>
    ),
  },
];
