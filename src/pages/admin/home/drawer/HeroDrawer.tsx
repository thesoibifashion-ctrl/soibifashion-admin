"use client";

import {
  createCarousel,
  updateCarousel,
  type Carousel,
} from "@/api/requests/carousel";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import { imageUpload } from "@/lib/ImageUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
interface CarouselDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carousel: Carousel | null;
  onSaved: () => void;
}

export function CarouselDrawer({
  open,
  onOpenChange,
  carousel,
  onSaved,
}: CarouselDrawerProps) {
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const isEditing = Boolean(carousel);

 
  useEffect(() => {
    if (carousel) {
      setPreview(carousel.imageUrl);
      setSortOrder(carousel.sortOrder);
      setIsActive(carousel.isActive);
    } else {
      setPreview(null);
      setSortOrder(0);
      setIsActive(true);
    }

    setFile(null);
  }, [carousel, open]);

  const createMutation = useMutation({
    mutationFn: createCarousel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-carousel"],
      });

      onSaved();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCarousel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-carousel"],
      });

      onSaved();
    },
  });

  const saving =
    createMutation.isPending || updateMutation.isPending;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreview(objectUrl);
  };

  const handleSave = async () => {
    try {
      let imageUrl = carousel?.imageUrl ?? "";
      let imagePublicId = carousel?.imagePublicId ?? "";

   
      if (file) {
        setUploading(true);

        const uploaded = await imageUpload(file);

        imageUrl = uploaded.secureUrl;
        imagePublicId = uploaded.publicId ?? "";

        setUploading(false);
      }

   
      if (!imageUrl) {
        throw new Error("Please upload an image.");
      }

      if (carousel) {
        updateMutation.mutate({
          id: carousel.id,
          payload: {
            imageUrl,
            imagePublicId,
            sortOrder,
            isActive,
          },
        });
      } else {
        createMutation.mutate({
          imageUrl,
          imagePublicId,
          sortOrder,
          isActive,
        });
      }
    } catch (error) {
      setUploading(false);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading."
      );
    }
  };

  return (
    <AppDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={
        isEditing
          ? "Edit Carousel Image"
          : "Add Carousel Image"
      }
      width="w-[520px] lg:max-w-[520px]!"
    >
      <div className="space-y-7">
        {/* Image upload */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Carousel Image
          </label>

          <label className="group block cursor-pointer">
            <div className="relative flex aspect-[16/9] overflow-hidden rounded-xl border-2 border-dashed bg-muted transition group-hover:border-black">
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Carousel preview"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3 text-xs text-white">
                    Click to replace image
                  </div>
                </>
              ) : (
                <div className="flex w-full flex-col items-center justify-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                    +
                  </div>

                  <p className="text-sm font-medium">
                    Upload carousel image
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Click to choose an image
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <p className="mt-2 text-xs text-muted-foreground">
            The image will be uploaded securely to Cloudinary.
          </p>
        </div>

        {/* Sort order */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Sort order
          </label>

          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(Number(event.target.value))
            }
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Lower numbers appear first.
          </p>
        </div>

        {/* Active */}
        <div className="flex items-center justify-between rounded-xl border p-4">
          <div>
            <p className="text-sm font-medium">Active</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Show this image on the homepage carousel.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsActive((current) => !current)
            }
            className={`relative h-6 w-11 rounded-full transition ${
              isActive ? "bg-black" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                isActive ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-5">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={saving || uploading}
            className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : saving
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Add Image"}
          </button>
        </div>
      </div>
    </AppDrawer>
  );
}