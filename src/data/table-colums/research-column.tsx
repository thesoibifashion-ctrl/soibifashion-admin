
import { formatDate } from "@/lib/utils/formatDate";
import { statusBadge } from "@/lib/utils/statusBadge";
import ResearchActions from "@/pages/admin/research/Actions";
import type { statusType } from "@/types/status";
import type { ColumnDef } from "@tanstack/react-table";
import { Sparkles } from "lucide-react";

export type ResearchData = {
    _id: string;
    title?: string;
    content?: string;
    coverImage?: string;
    pdfUrl?: string;
    tags?: string;
    type?: string;
    status?:statusType;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
    message?:string;
    publishedAt?:string
};

export const ResearchColumn: ColumnDef<ResearchData>[] = [
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
  },
  {
    accessorKey: "createdAt",
    header: "Date Published",
    cell: ({ row }) => <span>{formatDate(row.original.publishedAt ?? "")}</span>,
  },
  {
    accessorKey: "author",
    header: "Author",
  },  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="flex items-center gap-1">{statusBadge(row.original.status)} {row.original.status === "highlighted" &&<Sparkles color="#2563EB" size={18}/>}</span>,
    
    // cell: ({ row }) => getStatus(row.original.status ?? "draft"),


  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <ResearchActions status={row.original.status ?? "draft"}  researchId={row?.original._id ?? ""} />
      </div>
    ),
  },
];
