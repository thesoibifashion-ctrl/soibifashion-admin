

import { formatDate } from "@/lib/utils/formatDate";
import { truncateText } from "@/lib/utils/truncateText";
import type { ColumnDef } from "@tanstack/react-table";

export type NewsData = {
  _id: string;
  title: string;
  fullname: string;
  email: string;
  message: string;
  image: string;
  position?:string
  phone?:string
  createdAt?:string
};

export const newsColumn: ColumnDef<NewsData>[] = [
  {
    accessorKey: "_id",
    header: "Id",
  },
//   {
//     accessorKey: "fullName",
//     header: "Full Name",
//   },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => truncateText(row.original.email, 12),
  },

  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.createdAt ?? ""),
  },
];





