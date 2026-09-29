import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useCreateLatestCollectionCategory,
  useDeleteLatestCollectionOption,
  useLatestCollectionCategory,
} from "@/hooks/use-customization";
import { LatestCollectionDrawer } from "./drawer/LatestCollectionDrawer";
import type { CustomizationOption } from "@/api/requests/customization";

export default function LatestCollectionPage() {
  const { category, isLoading, isError } = useLatestCollectionCategory({
    slug: "latest-collection",
    name: "latest collection",
  });
    const createCategory = useCreateLatestCollectionCategory({
      slug: "latest-collection",
      name: "latest-collection",
    });
  const deleteCategory = useDeleteLatestCollectionOption();
  console.log(category);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<CustomizationOption | null>(null);
  const handleDelete = (id: string) => {
    deleteCategory.mutate(id);
  };
  const handleEdit = (item: CustomizationOption) => {
    setSelectedOption(item);
    setIsDrawerOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedOption(null);
    setIsDrawerOpen(true);
  };

  const handleSaved = () => {
    setIsDrawerOpen(false);
    setSelectedOption(null);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
          <div className="h-80 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Unable to load Latest Collection
          </h2>

          <p className="mt-1 text-sm text-red-700">
            Something went wrong while loading the collection.
          </p>
        </div>
      </div>
    );
  }
  if (!category) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
          +
        </div>

        <h2 className="mt-5 text-base font-semibold">Create Gallery</h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Create the Gallery category to start adding collection images to your
          storefront.
        </p>

        <button
          type="button"
          onClick={() => createCategory.mutate()}
          disabled={createCategory.isPending}
          className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createCategory.isPending ? "Creating..." : "Create Collection"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Homepage
            </p>

            <h1 className="text-2xl font-semibold tracking-tight">
              Latest Collection
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Manage the image displayed in the Latest Collection section of
              your storefront.
            </p>
          </div>

          <Button onClick={handleOpenCreate}>Add Collection Item</Button>
        </div>

        {/* Content */}
        {category.options.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
              +
            </div>

            <h2 className="mt-5 text-base font-semibold">
              No collection items yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Add an image to start displaying content in the Latest Collection
              section.
            </p>

            <Button onClick={handleOpenCreate} className="mt-6">
              Add Collection Item
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border bg-card shadow-sm">
            <div className="border-b px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Collection Items</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.options.length}{" "}
                    {category.options.length === 1 ? "item" : "items"}
                  </p>
                </div>

                <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {
                    category.options.filter((item) => item.status === "active")
                      .length
                  }{" "}
                  active
                </div>
              </div>
            </div>

            <div className="divide-y">
              {category.options.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-5 px-6 py-5 transition hover:bg-muted/30"
                >
                  {/* Image */}
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium">{item.name}</h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-muted-foreground">
                      Sort order: {item.sortOrder}
                    </p>
                  </div>

                  {/* Action */}
                  <Button variant="outline" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(item.id)}>
                    {deleteCategory.isPending ? "deleting" : "delete"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drawer */}
        <LatestCollectionDrawer
          open={isDrawerOpen}
          onOpenChange={(open) => {
            setIsDrawerOpen(open);

            if (!open) {
              setSelectedOption(null);
            }
          }}
          categoryId={category.id}
          option={selectedOption}
          onSaved={handleSaved}
          category={category}
          activeLimit={5}
        />
      </div>
    </div>
  );
}
