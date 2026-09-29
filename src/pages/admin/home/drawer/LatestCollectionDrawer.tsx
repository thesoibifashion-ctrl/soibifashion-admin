"use client";

import {
  createCustomizationOption,
  updateCustomizationOption,
  type CustomizationCategory,
  type CustomizationOption,
} from "@/api/requests/customization";
import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import { imageUpload } from "@/lib/ImageUpload";
interface LatestCollectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option: CustomizationOption | null;
  onSaved: () => void;
  categoryId: string;
  // category: CustomizationOption
  category: CustomizationCategory;
  activeLimit?: number;
  showImage?: boolean;
}

export function LatestCollectionDrawer({
  open,
  onOpenChange,
  option,
  onSaved,
  category,
  activeLimit = 1,
  showImage = true
}: LatestCollectionDrawerProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const isEditing = Boolean(option);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createCustomizationOption,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-customizations"],
      });

      onSaved();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCustomizationOption,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-customizations"],
      });

      onSaved();
    },
  });
  const saving =
    uploading || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (option) {
      setName(option.name);
      setSlug(option.slug);
      setDescription(option.description ?? "");
      setSortOrder(option.sortOrder);
      setStatus(option.status);
      setPreview(option.imageUrl);
      setFile(null);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setSortOrder(0);
      setStatus("inactive");
      setPreview(null);
      setFile(null);
    }
  }, [option, open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleNameChange = (value: string) => {
    setName(value);

    if (!isEditing) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  // Inserts `text` at the current cursor position (replacing any
  // selection), updates state, then restores the cursor right after
  // the inserted text once React has re-rendered.
  const insertAtCursor = (textarea: HTMLTextAreaElement, text: string) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    setDescription((current) => current.slice(0, start) + text + current.slice(end));

    requestAnimationFrame(() => {
      const cursorPos = start + text.length;
      textarea.selectionStart = textarea.selectionEnd = cursorPos;
      textarea.focus();
    });
  };

  const handleDescriptionKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      insertAtCursor(event.currentTarget, "<br/>");
    }
  };

  const handleDescriptionDoubleClick = (
    event: React.MouseEvent<HTMLTextAreaElement>
  ) => {
    insertAtCursor(event.currentTarget, "<br/><br/>");
  };

  const handleSave = async () => {
    try {
      let imageUrl = option?.imageUrl ?? null;
      let imagePublicId = option?.imagePublicId ?? null;

      if (file) {
        setUploading(true);

        try {
          const uploaded = await imageUpload(file);

          imageUrl = uploaded.secureUrl;
          imagePublicId = uploaded.publicId;
        } finally {
          setUploading(false);
        }
      }

      // if (!imageUrl) {
      //   toast("Please upload an image.");
      // }

      if (!name.trim()) {
        toast("Please enter a name.");
      }

      if (!slug.trim()) {
        toast("Please enter a slug.");
      }

      if (option) {
        updateMutation.mutate({
          id: option.id,
          payload: {
            categoryId: option.categoryId,
            name: name.trim(),
            slug: slug.trim(),
            imageUrl,
            imagePublicId,
            description: description.trim() || null,
            status,
            sortOrder,
          },
        });
      } else {
        createMutation.mutate({
          categoryId: category.id,
          name: name.trim(),
          slug: slug.trim(),
          imageUrl,
          imagePublicId,
          description: description.trim() || null,
          status,
          sortOrder,
        });
      }
    } catch (error) {
      setUploading(false);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving."
      );
    }
  };

  const activeOptionsCount =
    category?.options.filter((item) => item.status === "active").length ?? 0;

  function toggleActive() {
    if (
      status === "inactive" &&
      activeOptionsCount >= activeLimit &&
      option?.status !== "active"
    ) {
      alert(
        `You can only have ${activeLimit} active ${
          activeLimit === 1 ? "item" : "items"
        }.`
      );

      return;
    }

    setStatus((current) => (current === "active" ? "inactive" : "active"));
  }

  return (
    <AppDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Collection Item" : "Add Collection Item"}
      width="w-[520px] lg:max-w-[520px]!"
    >
      <div className="space-y-7">
        {/* Image */}
       {
        showImage &&  <div>
        <label className="mb-2 block text-sm font-medium">Image</label>

        <label className="group block cursor-pointer">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border-2 border-dashed bg-muted transition group-hover:border-black">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Collection preview"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3 text-xs text-white">
                  Click to replace image
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                  +
                </div>

                <p className="text-sm font-medium">Upload image</p>

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
       }

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium">Name</label>

          <input
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="e.g. Classic Handbag"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-2 block text-sm font-medium">Slug</label>

          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="classic-handbag"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* Description */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium">Description</label>

            <span className="text-xs text-muted-foreground">
              Enter = line break · double-click = paragraph break
            </span>
          </div>

          <textarea
            ref={descriptionRef}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onKeyDown={handleDescriptionKeyDown}
            onDoubleClick={handleDescriptionDoubleClick}
            placeholder="Short description..."
            rows={4}
            className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black"
          />

          {description.trim() && (
            <div className="mt-2 rounded-lg border bg-muted/40 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Preview
              </p>

              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(description, {
                    ALLOWED_TAGS: ["br"],
                    ALLOWED_ATTR: [],
                  }),
                }}
              />
            </div>
          )}
        </div>

        {/* Sort order */}
        <div>
          <label className="mb-2 block text-sm font-medium">Sort order</label>

          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Lower numbers appear first.
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between rounded-xl border p-4">
          <div>
            <p className="text-sm font-medium">Active</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Show this item in the Latest Collection.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleActive}
            className={`relative h-6 w-11 rounded-full transition ${
              status === "active" ? "bg-black" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                status === "active" ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-5">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading image..."
              : saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Item"}
          </button>
        </div>
      </div>
    </AppDrawer>
  );
}