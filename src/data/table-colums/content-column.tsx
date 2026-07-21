import { formatDate } from "@/lib/utils/formatDate";
import { statusBadge } from "@/lib/utils/statusBadge";
import ContentAction from "@/pages/admin/content-management/Actions";
import type { statusType } from "@/types/status";
import type { ColumnDef } from "@tanstack/react-table";
import { Sparkles } from "lucide-react";

export interface ContentData {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  publishedAt: string;
  status: statusType;
  tags: string[];
  title: string;
  type: string;
  updatedAt: string;
  coverImage: string;
}

export const ContentColumn: ColumnDef<ContentData>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue }) => (
      <span className="text-[#1F2937] pl-2">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tags",
    header: "Category",
    cell: ({ row }) => (
      <span>{(row.original.tags || []).join(", ")}</span>
    ),
  },
  {
    accessorKey: "coverImage",
    header: "Cover Image",
    cell: ({ row }) => (
      <span>
        <img
          src={row?.original?.coverImage}
          className="w-20 h-10 object-cover object-top rounded-lg"
        />
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Published",
    cell: ({ row }) => <span>{formatDate(row?.original.createdAt || row?.original.publishedAt)}</span>,
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="flex items-center gap-1">{statusBadge(row.original.status)} {row.original.status === "highlighted" &&<Sparkles color="#2563EB" size={18}/>}</span>,

  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <ContentAction status={row.original.status} contentId={row.original._id} />
      </div>
    ),
  },
];