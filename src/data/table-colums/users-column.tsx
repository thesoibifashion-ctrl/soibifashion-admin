import { truncateText } from "@/lib/utils/truncateText";
// import DonateActions from "@/pages/admin/users/donate/Actions";
import type { ContactForm } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

export type Data = {
  _id: string;
  title: string;
  fullName: string;
  email: string;
  message: string;
  image: string;
  position?: string;
  subject?:string
  receipt?: string;
  phone?: string;
  amount?: string;
  currency?: string;
  motivation?:string
  isConfirmed?:boolean
};

export const userColumns: ColumnDef<Data>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="text-[#1F2937] pl-2">{truncateText(row.original.title, 13)}</span>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => truncateText(row.original.email, 12),
  },

  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => truncateText(row.original.message, 20),
  },
];

export const involvedColumn: ColumnDef<Data>[] = [
  {
    accessorKey: "fullname",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => truncateText(row.original.email, 12),
  },
  {
    accessorKey: "phone",
    header: "Phone number",
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => truncateText(row.original.position ?? "", 20),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => truncateText(row.original.message, 20),
  },
];

export const contactColumn: ColumnDef<ContactForm>[] = [
  {
    accessorKey: "name",
    header: "Full Name",
    cell: ({ getValue }) => (
      <span className="text-[#1F2937] pl-2">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => truncateText(row.original.email, 12),
  },
  {
    accessorKey: "phone",
    header: "Phone number",
  },

  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => truncateText(row.original.message, 20),
  },
];
export const academyColumn: ColumnDef<ContactForm>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ getValue,row }) => (
      <span className="text-[#1F2937] pl-2 flex items-center gap-2">{!row.original.isRead && <div className="w-2 h-2 rounded-full bg-[red]"/>}{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => truncateText(row.original.email, 12),
  },
  {
    accessorKey: "phone",
    header: "Phone number",
  },

  {
    accessorKey: "motivation",
    header: "Motivation",
    cell: ({ row }) => truncateText(row.original.motivation, 20),
  },
];

export const donateColumn: ColumnDef<Data>[] = [
  {
    accessorKey: "fullname",
    header: "Full Name",
    cell: ({ getValue }) => (
      <span className="text-[#1F2937] pl-2">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => truncateText(row.original.email, 12),
  },
  {
    accessorKey: "phone",
    header: "Phone number",
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="">
        {row.original.currency} {row.original.amount}
      </span>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => truncateText(row.original.message, 20),
  },
  // {
  //   id: "actions",
  //   header: "",
  //   cell: ({ row }) => {
  //     console.log("Row:", row.original._id);

  //     return (
  //       <div onClick={(e) => e.stopPropagation()}>
  //         <DonateActions isConfirmed={row.original.isConfirmed ?? false} donateId={row.original._id} />
  //       </div>
  //     );
  //   },
  // },
];
