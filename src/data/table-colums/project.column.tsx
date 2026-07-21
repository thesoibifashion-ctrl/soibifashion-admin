import { statusBadge } from "@/lib/utils/statusBadge";
import { truncateText } from "@/lib/utils/truncateText";
import ProjectActions from "@/pages/admin/project/Actions";
import type { statusType } from "@/types/status";
import type { ColumnDef } from "@tanstack/react-table";
import { Sparkles } from "lucide-react";

export type Data = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  date: string;
  community: string;
  status: statusType;
};

export const ProjectColumn: ColumnDef<Data>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => truncateText(row.original.title, 20),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => truncateText(row.original.description, 20),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span>
        <img
          src={row.original.coverImage}
          className="w-20 h-10 object-cover object-top rounded-lg"
        />
      </span>
    ),
  },
  // {
  //   accessorKey: "date",
  //   header: "Date",
  //   cell: ({ row }) => <span>{formatDate(row.original.date)}</span>,
  // },
  {
    accessorKey: "community",
    header: "Community",
    cell: ({ row }) => truncateText(row.original.community, 20),
  },
  {
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
        <ProjectActions
          status={row.original.status}
          projectId={row.original._id}
        />
      </div>
    ),
  },
];
