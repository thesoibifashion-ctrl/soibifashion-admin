"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { createGalleryImage, deleteGalleryImage, getAdminGallery } from "@/api/requests/gallery";
import type { GalleryCategory, GalleryImage } from "@/types";



const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  workshop: "Workshop",
  craftsmanship: "Craftsmanship",
  completed_work: "Completed Work",
};

const categoryOptions: {
  value: GalleryCategory;
  label: string;
}[] = [
  {
    value: "workshop",
    label: "Workshop",
  },
  {
    value: "craftsmanship",
    label: "Craftsmanship",
  },
  {
    value: "completed_work",
    label: "Completed Work",
  },
];

const GalleryPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showUpload, setShowUpload] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<GalleryCategory>("craftsmanship");
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    GalleryCategory | "all"
  >("all");

  const loadGallery = async () => {
    try {
      setLoading(true);

      const response = await getAdminGallery();

      setGallery(response ?? []);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const resetUpload = () => {
    setTitle("");
    setCategory("craftsmanship");
    setSortOrder(0);
    setIsPublished(true);
    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseUpload = () => {
    if (uploading) return;

    setShowUpload(false);
    resetUpload();
  };

  const handleFileChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim() || uploading) return;

    try {
      setUploading(true);

      const imageUrl = await uploadToCloudinary(selectedFile);
      const imagePublicId = crypto.randomUUID();
      await createGalleryImage({
        title: title.trim(),
        imageUrl:imageUrl.secureUrl,
        imagePublicId: imagePublicId,
        category,
        sortOrder,
        isPublished,
      });

      await loadGallery();

      setShowUpload(false);
      resetUpload();
    } catch (error) {
      console.error("Failed to upload gallery image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove this gallery image?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteGalleryImage(id);

      setGallery((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete gallery image:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredGallery = gallery.filter((item) => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen  px-5 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
              Visual Archive
            </p>

            <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1C1917] md:text-4xl">
              Gallery
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#78716C]">
              Curate the craftsmanship, process, and finished work behind
              Signature By Sarah.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#8B5E3C] px-5 text-sm font-medium text-white transition-colors hover:bg-[#744C31] md:w-auto"
          >
            <Plus size={17} />
            Add Image
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Total Images"
            value={gallery.length}
          />

          <StatCard
            label="Published"
            value={gallery.filter((item) => item.isPublished).length}
          />

          <StatCard
            label="Craftsmanship"
            value={
              gallery.filter(
                (item) => item.category === "craftsmanship"
              ).length
            }
          />

          <StatCard
            label="Completed Work"
            value={
              gallery.filter(
                (item) => item.category === "completed_work"
              ).length
            }
          />
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <CategoryFilter
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            >
              All
            </CategoryFilter>

            {categoryOptions.map((item) => (
              <CategoryFilter
                key={item.value}
                active={activeCategory === item.value}
                onClick={() => setActiveCategory(item.value)}
              >
                {item.label}
              </CategoryFilter>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gallery..."
              className="h-10 w-full rounded-xl border border-[#E7E2DC] bg-white pl-9 pr-3 text-sm text-[#1C1917] outline-none transition focus:border-[#8B5E3C]"
            />
          </div>
        </div>

        {/* Gallery */}
        {loading ? (
          <GallerySkeleton />
        ) : filteredGallery.length === 0 ? (
          <EmptyGallery onAdd={() => setShowUpload(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGallery.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                deleting={deletingId === item.id}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Drawer */}
      {showUpload && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={handleCloseUpload}
          />

          <div className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-[#EDE9E4] px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B5E3C]">
                  Gallery
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#1C1917]">
                  Add new image
                </h2>
              </div>

              <button
                type="button"
                disabled={uploading}
                onClick={handleCloseUpload}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E7E2DC] text-[#78716C] transition hover:bg-[#F8F6F2] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={17} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-7">
              <div className="space-y-6">
                {/* Image upload */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                    Gallery Image
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0])
                    }
                  />

                  {previewUrl ? (
                    <div className="group relative overflow-hidden rounded-2xl border border-[#E7E2DC] bg-[#F8F6F2]">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-72 w-full object-cover"
                      />

                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 disabled:cursor-not-allowed"
                      >
                        <X size={16} />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10">
                        <p className="truncate text-xs text-white/80">
                          {selectedFile?.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-72 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#CFC7BF] bg-[#FAF9F7] px-6 text-center transition hover:border-[#8B5E3C] hover:bg-[#F8F6F2] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B5E3C]/10 text-[#8B5E3C]">
                        <ImagePlus size={25} strokeWidth={1.6} />
                      </div>

                      <p className="text-sm font-medium text-[#1C1917]">
                        Drop your image here
                      </p>

                      <p className="mt-1 text-xs text-[#A8A29E]">
                        or click to browse from your computer
                      </p>

                      <span className="mt-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[#78716C] shadow-sm">
                        JPG · PNG · WEBP
                      </span>
                    </button>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                    Image Title
                  </label>

                  <input
                    value={title}
                    disabled={uploading}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Hand stitching in the workshop"
                    className="h-11 w-full rounded-xl border border-[#E7E2DC] bg-white px-3 text-sm text-[#1C1917] outline-none placeholder:text-[#A8A29E] focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10 disabled:opacity-60"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                    Category
                  </label>

                  <div className="relative">
                    <select
                      value={category}
                      disabled={uploading}
                      onChange={(e) =>
                        setCategory(e.target.value as GalleryCategory)
                      }
                      className="h-11 w-full appearance-none rounded-xl border border-[#E7E2DC] bg-white px-3 pr-10 text-sm text-[#1C1917] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10 disabled:opacity-60"
                    >
                      {categoryOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Sort order */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                      Sort Order
                    </label>

                    <input
                      type="number"
                      min={0}
                      value={sortOrder}
                      disabled={uploading}
                      onChange={(e) =>
                        setSortOrder(Number(e.target.value))
                      }
                      className="h-11 w-full rounded-xl border border-[#E7E2DC] bg-white px-3 text-sm text-[#1C1917] outline-none focus:border-[#8B5E3C] disabled:opacity-60"
                    />
                  </div>

                  {/* Published */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                      Visibility
                    </label>

                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => setIsPublished((value) => !value)}
                      className={`flex h-11 w-full items-center justify-between rounded-xl border px-3 text-sm transition ${
                        isPublished
                          ? "border-[#8B5E3C]/30 bg-[#8B5E3C]/5 text-[#8B5E3C]"
                          : "border-[#E7E2DC] bg-white text-[#78716C]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <span>
                        {isPublished ? "Published" : "Hidden"}
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          isPublished
                            ? "bg-[#8B5E3C] text-white"
                            : "bg-[#E7E2DC]"
                        }`}
                      >
                        {isPublished && <Check size={12} />}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#EDE9E4] bg-white px-6 py-5">
              <button
                type="button"
                disabled={
                  uploading || !selectedFile || !title.trim()
                }
                onClick={handleUpload}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#8B5E3C] text-sm font-medium text-white transition hover:bg-[#744C31] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Uploading image...
                  </>
                ) : (
                  <>
                    <Upload size={17} />
                    Add to Gallery
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  return (
    <div className="rounded-2xl border border-[#E7E2DC] bg-white p-4 md:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8A29E]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1C1917]">
        {value}
      </p>
    </div>
  );
};

const CategoryFilter = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 cursor-pointer rounded-full px-4 text-xs font-medium transition ${
        active
          ? "bg-[#1C1917] text-white"
          : "border border-[#E7E2DC] bg-white text-[#78716C] hover:border-[#CFC7BF] hover:text-[#1C1917]"
      }`}
    >
      {children}
    </button>
  );
};

const GalleryCard = ({
  item,
  deleting,
  onDelete,
}: {
  item: GalleryImage;
  deleting: boolean;
  onDelete: () => void;
}) => {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#E7E2DC] bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F1EEEA]">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#1C1917] shadow-sm backdrop-blur">
            {CATEGORY_LABELS[item.category]}
          </span>

          <button
            type="button"
            disabled={deleting}
            onClick={onDelete}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#78716C] opacity-0 shadow-sm backdrop-blur transition hover:text-red-600 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>

        {!item.isPublished && (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
            Hidden
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[#1C1917]">
              {item.title}
            </h3>

            <p className="mt-1 text-xs text-[#A8A29E]">
              Order {item.sortOrder}
            </p>
          </div>

          <div
            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
              item.isPublished
                ? "bg-emerald-500"
                : "bg-[#D6D3D1]"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-[#E7E2DC] bg-white"
        >
          <div className="aspect-[4/5] animate-pulse bg-[#EDE9E4]" />

          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#EDE9E4]" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-[#F1EEEA]" />
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyGallery = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className="rounded-3xl border border-dashed border-[#CFC7BF] bg-white px-6 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8F6F2] text-[#8B5E3C]">
        <ImagePlus size={28} strokeWidth={1.5} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#1C1917]">
        Your gallery is empty
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#78716C]">
        Start building the visual archive by adding your first
        craftsmanship or completed-work image.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-6 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#8B5E3C] px-5 text-sm font-medium text-white transition hover:bg-[#744C31]"
      >
        <Plus size={16} />
        Add First Image
      </button>
    </div>
  );
};

export default GalleryPage;