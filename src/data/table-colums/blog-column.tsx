import type { BlogPost } from "@/api/requests/blog";
import { Badge } from "@/components/shared/Badge";
import ImagePreview from "@/components/shared/ImagePreview";
import { truncateText } from "@/lib/utils/truncateText";
import type { ColumnDef } from "@tanstack/react-table";

export const BlogColumn: ColumnDef<BlogPost>[] = [
  {
    accessorKey: "coverImageUrl",
    header: "Image",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <ImagePreview src={row.original.coverImageUrl ?? ""} />
      </div>
    ),
  },

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-60">
        <p className="font-medium truncate">
          {truncateText(row.original.title ?? "", 35)}
        </p>

        <p className="text-xs text-muted-foreground truncate">
          {row.original.excerpt || "No excerpt"}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {truncateText(row.original.slug ?? "", 30)}
      </span>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "published" ? "default" : "secondary"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },

  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.publishedAt
          ? new Date(row.original.publishedAt).toLocaleDateString()
          : "—"}
      </span>
    ),
  },
];