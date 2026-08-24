import type { ColumnDef } from "@tanstack/react-table";
import { truncateText } from "@/lib/utils/truncateText";
import type { CartOrder } from "@/types";
import { Badge } from "@/components/shared/Badge";

export const CartOrderColumns: ColumnDef<CartOrder>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.orderNumber || row.original.id}
      </span>
    ),
  },

  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">
          {truncateText(row.original.customer?.name || "—", 24)}
        </p>
        <p className="text-xs text-[#78716C] mt-0.5">
          {truncateText(row.original.customer?.email || "—", 28)}
        </p>
      </div>
    ),
  },

  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items || [];
      const firstItem = items[0];

      return (
        <div>
          <p className="font-medium">
            {firstItem?.productNameSnapshot || "Custom Item"}
          </p>
          {items.length > 1 && (
            <p className="text-xs text-[#78716C] mt-0.5">
              +{items.length - 1} more item{items.length - 1 > 1 ? "s" : ""}
            </p>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "totalSnapshot",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">
        ₦{row.original.totalSnapshot.toLocaleString()}
      </span>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status}>{row.original.status}</Badge>

    ),
  },

  {
    id: "contactMethod",
    header: "Contact",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.customer?.phone
          ? "WhatsApp / Phone"
          : row.original.customer?.email
            ? "Email"
            : "—"}
      </span>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.createdAt).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
];