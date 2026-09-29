"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
  Upload,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminCarousel, createCarousel, updateCarousel, deleteCarousel } from "@/api/customizations";
import { uploadToCloudinary } from "@/lib/Cloudinary";

interface CarouselItem {
  id: string;
  imageUrl: string;
  imagePublicId?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CarouselResponse {
  success: boolean;
  message: string;
  data: CarouselItem[];
}

interface FormState {
  imageUrl: string;
  sortOrder: string;
  isActive: boolean;
}

const initialForm: FormState = {
  imageUrl: "",
  sortOrder: "0",
  isActive: true,
};

const CarouselPage = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  const { data, isLoading } = useQuery<CarouselResponse>({
    queryKey: ["admin-carousel"],
    queryFn: getAdminCarousel,
  });

  const createMutation = useMutation({
    mutationFn: createCarousel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-carousel"],
      });

      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        imageUrl?: string;
        sortOrder?: number;
        isActive?: boolean;
      };
    }) => updateCarousel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-carousel"],
      });

      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCarousel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-carousel"],
      });
    },
  });

  const items = [...(data?.data ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: CarouselItem) => {
    setEditingItem(item);

    setForm({
      imageUrl: item.imageUrl,
      sortOrder: String(item.sortOrder),
      isActive: item.isActive,
    });

    setSelectedFile(null);
    setPreviewUrl(item.imageUrl);
    setUploadError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingItem(null);
    setForm(initialForm);
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadError("");
  };

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;

    setUploadError("");
    setSelectedFile(file);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploadError("");

    try {
      let imageUrl = form.imageUrl;

      /*
       * New slide:
       * A file is required because there is no existing image.
       *
       * Editing:
       * If a new file was selected, upload it.
       * Otherwise keep the existing image URL.
       */
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile);
      }

      if (!imageUrl) {
        setUploadError("Please select an image.");
        return;
      }

      const payload = {
        imageUrl,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };

      if (editingItem) {
        updateMutation.mutate({
          id: editingItem.id,
          data: payload,
        });

        return;
      }

      createMutation.mutate(payload);
    } catch (error) {
      console.error("Carousel image upload failed:", error);

      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to upload the image."
      );
    }
  };

  const handleToggle = (item: CarouselItem, checked: boolean) => {
    updateMutation.mutate({
      id: item.id,
      data: {
        isActive: checked,
      },
    });
  };

  const handleDelete = (item: CarouselItem) => {
    const confirmed = window.confirm(
      "Delete this carousel slide? This cannot be undone."
    );

    if (!confirmed) return;

    deleteMutation.mutate(item.id);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex gap-4 justify-end w-full">
     

        <Button
          onClick={openCreateModal}
          className="gap-2 mt-10  bg-[#292524]"
        >
          <Plus size={16} />
          Add Slide
        </Button>
      </div>

      {/* Carousel list */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#E7E2DC] bg-white"
            >
              <Skeleton className="h-64 w-full rounded-none" />

              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />

                <div className="flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D0C8] bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F0EB]">
            <ImageIcon size={20} className="text-[#8B5E3C]" />
          </div>

          <h2 className="mt-4 font-display text-lg font-bold text-[#1C1917]">
            No carousel slides
          </h2>

          <p className="mt-1 text-sm text-[#78716C]">
            Add your first homepage carousel slide.
          </p>

          <Button
            onClick={openCreateModal}
            className="mt-5 gap-2 bg-[#1C1917] hover:bg-[#292524]"
          >
            <Plus size={16} />
            Add Slide
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-[#E7E2DC] bg-white shadow-sm"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F0EB]">
                <img
                  src={item.imageUrl}
                  alt={`Carousel slide ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1C1917] backdrop-blur">
                  Slide {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    item.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A8A29E]">
                      Sort Order
                    </p>

                    <p className="mt-1 font-display text-lg font-bold text-[#1C1917]">
                      {item.sortOrder}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#78716C]">
                      {item.isActive ? "Visible" : "Hidden"}
                    </span>

                    <Switch
                      checked={item.isActive}
                      onCheckedChange={(checked) =>
                        handleToggle(item, checked)
                      }
                      disabled={updateMutation.isPending}
                    />
                  </div>
                </div>

                <div className="flex gap-2 border-t border-[#E7E2DC] pt-4">
                  <Button
                    variant="outline"
                    onClick={() => openEditModal(item)}
                    className="flex-1 gap-2"
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleDelete(item)}
                    disabled={deleteMutation.isPending}
                    className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#E7E2DC] px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-bold text-[#1C1917]">
                  {editingItem ? "Edit Carousel Slide" : "Add Carousel Slide"}
                </h2>

                <p className="mt-1 text-xs text-[#78716C]">
                  {editingItem
                    ? "Update this homepage carousel slide."
                    : "Upload a new image for the homepage carousel."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F5F0EB] disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C]">
                  Carousel Image
                </label>

                <label
                  htmlFor="carousel-image"
                  className="group flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#CFC8BF] bg-[#F8F6F2] transition hover:border-[#927F04]"
                >
                  {previewUrl ? (
                    <div className="relative w-full">
                      <img
                        src={previewUrl}
                        alt="Carousel preview"
                        className="h-56 w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white opacity-0 shadow transition group-hover:opacity-100">
                          <Upload size={17} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center px-6 py-12 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                        <Upload size={20} className="text-[#8B5E3C]" />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-[#1C1917]">
                        Click to upload image
                      </p>

                      <p className="mt-1 text-xs text-[#78716C]">
                        PNG, JPG, JPEG or WEBP
                      </p>
                    </div>
                  )}

                  <input
                    id="carousel-image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                  />
                </label>

                {selectedFile && (
                  <p className="text-[11px] text-[#78716C]">
                    Selected: {selectedFile.name}
                  </p>
                )}

                {uploadError && (
                  <p className="text-xs font-medium text-red-600">
                    {uploadError}
                  </p>
                )}
              </div>

              {/* Sort order */}
              <div className="space-y-2">
                <label
                  htmlFor="sort-order"
                  className="text-xs font-semibold uppercase tracking-wider text-[#44403C]"
                >
                  Sort Order
                </label>

                <Input
                  id="sort-order"
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sortOrder: e.target.value,
                    }))
                  }
                />

                <p className="text-[11px] text-[#A8A29E]">
                  Lower numbers appear first.
                </p>
              </div>

              {/* Active */}
              <div className="flex items-center justify-between rounded-xl bg-[#F8F6F2] p-4">
                <div>
                  <p className="text-sm font-semibold text-[#1C1917]">
                    Active slide
                  </p>

                  <p className="mt-1 text-xs text-[#78716C]">
                    Show this slide on the public homepage.
                  </p>
                </div>

                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: checked,
                    }))
                  }
                  disabled={isSaving}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-[#E7E2DC] pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="min-w-32 bg-[#1C1917] hover:bg-[#292524]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      {selectedFile ? "Uploading..." : "Saving..."}
                    </>
                  ) : editingItem ? (
                    "Save Changes"
                  ) : (
                    "Add Slide"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselPage;