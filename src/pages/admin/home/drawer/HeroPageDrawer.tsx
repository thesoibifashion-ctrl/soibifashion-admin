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

type Device = "mobile" | "desktop";

interface HeroPageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option: CustomizationOption | null;
  onSaved: () => void;
  category: CustomizationCategory;
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i;

function isVideoUrl(url: string | null | undefined) {
  if (!url) return false;
  return VIDEO_EXT.test(url) || url.includes("/video/upload/");
}

export function HeroPageDrawer({
  open,
  onOpenChange,
  option,
  onSaved,
  category,
}: HeroPageDrawerProps) {
  const [device, setDevice] = useState<Device>("mobile");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewIsVideo, setPreviewIsVideo] = useState(false);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const isEditing = Boolean(option);
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-customizations"] });
    onSaved();
  };

  const createMutation = useMutation({
    mutationFn: createCustomizationOption,
    onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: updateCustomizationOption,
    onSuccess,
  });

  const saving =
    uploading || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (option) {
      setDevice(option.name === "desktop" ? "desktop" : "mobile");
      setDescription(option.description ?? "");
      setSortOrder(option.sortOrder);
      setStatus(option.status);
      setPreview(option.imageUrl);
      setPreviewIsVideo(isVideoUrl(option.imageUrl));
      setFile(null);
    } else {
      setDevice("mobile");
      setDescription("");
      setSortOrder(0);
      setStatus("inactive");
      setPreview(null);
      setPreviewIsVideo(false);
      setFile(null);
    }
  }, [option, open]);

  // Free the temporary blob URL when the preview changes / unmounts.
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setPreviewIsVideo(selectedFile.type.startsWith("video/"));
  };

  // Returns the other item that is already active for `target` device, if any.
  const findActiveConflict = (target: Device) =>
    category?.options.find(
      (item) =>
        item.id !== option?.id &&
        item.name === target &&
        item.status === "active"
    );

  const showConflictError = (target: Device) =>
    toast.error(`There is already an active ${target} hero. Deactivate it first.`);

  const handleDeviceChange = (value: Device) => {
    setDevice(value);

    // If this item is set to active, switching device may create a conflict.
    if (status === "active" && findActiveConflict(value)) {
      showConflictError(value);
      setStatus("inactive");
    }
  };

  function toggleActive() {
    if (status === "inactive" && findActiveConflict(device)) {
      showConflictError(device);
      return;
    }
    setStatus((current) => (current === "active" ? "inactive" : "active"));
  }

  // Inserts `text` at the cursor (replacing any selection), then restores
  // the cursor right after the inserted text.
  const insertAtCursor = (textarea: HTMLTextAreaElement, text: string) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    setDescription(
      (current) => current.slice(0, start) + text + current.slice(end)
    );

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
    // Validate BEFORE uploading anything.
    if (!preview) {
      toast.error("Please upload an image or video.");
      return;
    }

    if (status === "active" && findActiveConflict(device)) {
      showConflictError(device);
      return;
    }

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

      // name = device ("mobile" | "desktop"); slug is generated once.
      const slug =
        option?.slug ?? `hero-${device}-${Date.now().toString(36)}`;

      const payload = {
        name: device,
        slug,
        imageUrl,
        imagePublicId,
        description: description.trim() || null,
        status,
        sortOrder,
      };

      if (option) {
        updateMutation.mutate({
          id: option.id,
          payload: { categoryId: option.categoryId, ...payload },
        });
      } else {
        createMutation.mutate({ categoryId: category.id, ...payload });
      }
    } catch (error) {
      setUploading(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving."
      );
    }
  };

  return (
    <AppDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Hero Item" : "Add Hero Item"}
      width="w-[520px] lg:max-w-[520px]!"
    >
      <div className="space-y-7">
        {/* Media (image or video) */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Image or video
          </label>

          <label className="group block cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border-2 border-dashed bg-muted transition group-hover:border-black">
              {preview ? (
                <>
                  {previewIsVideo ? (
                    <video
                      key={preview}
                      src={preview}
                      className="h-full w-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="Hero preview"
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3 text-xs text-white">
                    Click to replace {previewIsVideo ? "video" : "image"}
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                    +
                  </div>
                  <p className="text-sm font-medium">Upload image or video</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click to choose a file
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <p className="mt-2 text-xs text-muted-foreground">
            The file will be uploaded securely to Cloudinary.
          </p>
        </div>

        {/* Device */}
        <div>
          <label className="mb-2 block text-sm font-medium">Device</label>

          <select
            value={device}
            onChange={(e) => handleDeviceChange(e.target.value as Device)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black"
          >
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>

          <p className="mt-1 text-xs text-muted-foreground">
            Only one mobile and one desktop hero can be active at a time.
          </p>
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
              Show this item as the {device} hero on the homepage.
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
              ? "Uploading..."
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