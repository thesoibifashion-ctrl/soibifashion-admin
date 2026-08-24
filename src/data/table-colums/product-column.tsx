import { Badge } from "@/components/shared/Badge";
import ImagePreview from "@/components/shared/ImagePreview";
import { formatDate } from "@/lib/utils/formatDate";
import { statusBadge } from "@/lib/utils/statusBadge";
import { truncateText } from "@/lib/utils/truncateText";
import ProductActions from "@/pages/admin/products/Actions";
import type { Product } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

export const ProductColumn: ColumnDef<Product>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.images?.[0];

      return (
        // <img
        //   src={image?.imageUrl ?? "/placeholder-product.png"}
        //   alt={row.original.name ?? "Product"}
        //   className="w-10 h-10 object-cover object-top rounded-lg"
        // />
        <div onClick={(e) => e.stopPropagation()}>
          <ImagePreview src={image?.imageUrl} />
          {/* <img
                  src=
                  className="w-10 h-10 object-cover object-top rounded-lg"
                /> */}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="max-w-[180px]">
        <p className="font-medium truncate">
          {truncateText(row.original.name ?? "", 20)}
        </p>
        <p className="text-xs text-muted-foreground">
          {row.original.category ?? "Uncategorized"}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "basePrice",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-medium">
        ₦{Number(row.original.basePrice ?? 0).toLocaleString()}
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
    accessorKey: "isCustomizable",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.original.isCustomizable ? "default" : "secondary"}>
        {row.original.isCustomizable ? "Customizable" : "Standard"}
      </Badge>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => <span>{row.original.isFeatured ? "Yes" : "No"}</span>,
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <ProductActions productId={row.original.id ?? ""} />
      </div>
    ),
  },
];
