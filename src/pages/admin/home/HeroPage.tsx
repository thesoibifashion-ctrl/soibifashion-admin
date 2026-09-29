import {
    deleteCarousel,
    getAdminCarousel,
    type Carousel,
  } from "@/api/requests/carousel";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { useState } from "react";
  import { CarouselDrawer } from "./drawer/HeroDrawer";
  import { ViewImage } from "@/components/shared/ImageViewer";
  
  export default function CarouselPage() {
    const queryClient = useQueryClient();
  
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCarousel, setSelectedCarousel] = useState<Carousel | null>(
      null
    );
  
    const { data: carousels = [], isLoading } = useQuery({
      queryKey: ["admin-carousel"],
      queryFn: getAdminCarousel,
    });
  
    const deleteMutation = useMutation({
      mutationFn: deleteCarousel,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["admin-carousel"],
        });
      },
    });
  
    const handleAdd = () => {
      setSelectedCarousel(null);
      setDrawerOpen(true);
    };
  
    const handleEdit = (carousel: Carousel) => {
      setSelectedCarousel(carousel);
      setDrawerOpen(true);
    };
  
    const handleDelete = (id: string) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this carousel image?"
      );
  
      if (!confirmed) return;
  
      deleteMutation.mutate(id);
    };
  
    const handleSaved = () => {
      setDrawerOpen(false);
      setSelectedCarousel(null);
  
      queryClient.invalidateQueries({
        queryKey: ["admin-carousel"],
      });
    };
  
    return (
      <div className="space-y-8  mt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Homepage Hero Section</h1>
  
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the images displayed on your homepage carousel.
            </p>
          </div>
  
          <button
            type="button"
            onClick={handleAdd}
            className="brown-button"
          >
            Add Image
          </button>
        </div>
  
        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading carousel...</p>
          </div>
        )}
  
        {/* Empty state */}
        {!isLoading && carousels.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed">
            <div className="text-center">
              <h2 className="text-lg font-semibold">No carousel images yet</h2>
  
              <p className="mt-1 text-sm text-muted-foreground">
                Add an image to start building your homepage carousel.
              </p>
  
              <button
                type="button"
                onClick={handleAdd}
                className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
              >
                Add Image
              </button>
            </div>
          </div>
        )}
  
        {/* Carousel grid */}
        {!isLoading && carousels.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[...carousels]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((carousel) => (
                <div
                  key={carousel.id}
                  className="overflow-hidden rounded-2xl border bg-white"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <img
                      src={carousel.imageUrl}
                      alt="Homepage carousel"
                      className="h-full w-full object-cover"
                    />
  
                    {/* Status */}
                    <div className="absolute left-3 top-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          carousel.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-black/70 text-white"
                        }`}
                      >
                        {carousel.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
  
                    {/* Sort order */}
                    <div className="absolute right-3 top-3">
                      <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                        #{carousel.sortOrder}
                      </span>
                    </div>
                  </div>
  
                  {/* Card footer */}
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <ViewImage src={carousel.imageUrl} />
                    </div>
  
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(carousel)}
                        className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                      >
                        Edit
                      </button>
  
                      <button
                        type="button"
                        onClick={() => handleDelete(carousel.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
  
        <CarouselDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          carousel={selectedCarousel}
          onSaved={handleSaved}
        />
      </div>
    );
  }
  