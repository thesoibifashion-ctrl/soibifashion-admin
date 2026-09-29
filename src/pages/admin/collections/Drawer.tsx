"use client";

import FormInput from "@/components/shared/inputs/FormInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import SuccessModal from "@/components/shared/modals/SuccessModal";
import { Loader2 } from "lucide-react";
import { createCollection } from "@/api/Collections";
import { apiPatch } from "@/api/client";
import { uploadToCloudinary } from "@/lib/Cloudinary";

const CollectionDrawer = ({ props }: any) => {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!props?.id;

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const updateCollection = (payload: Record<string, any>) => {
    return apiPatch(`/api/admin/collections/${props.id}`, payload);
  };

  const {
    mutate: createCollections,
    isPending: createPending,
  } = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });

      setShowModal(true);
    },
  });

  const {
    mutate: editCollection,
    isPending: updatePending,
  } = useMutation({
    mutationFn: updateCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });

      setShowModal(true);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") || "").trim();

    const payload = {
      name,
      description: formData.get("description"),
      slug: name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
      imageUrl: imageUrl || props?.imageUrl || "",
      imagePublicId: `collection/${name}`,
      status: "draft",
      isFeatured: true,
      sortOrder: 0,
    };

    if (isEditing) {
      editCollection(payload);
    } else {
      createCollections(payload);
    }
  };

  const isPending = createPending || updatePending;

  return (
    <div className="mt-10 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FormInput
          placeholder="Add name"
          name="name"
          label="Name"
          type="text"
          defaultValue={props?.name || ""}
        />

        <FormInput
          placeholder="Add description"
          name="description"
          label="Description"
          type="text"
          defaultValue={props?.description || ""}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#404944]">
            Image
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading && (
            <p className="flex items-center gap-2 text-sm text-green-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </p>
          )}

          {imageUrl || props?.imageUrl ? (
            <div className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4">
              <button
                type="button"
                onClick={openFilePicker}
                className="text-sm font-semibold text-[#C9A227]"
              >
                Change image
              </button>

              <img
                src={imageUrl || props?.imageUrl}
                alt="Collection"
                className="h-[400px] w-full max-w-[518px] rounded-lg object-cover"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              className="flex h-60 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              Upload Image
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || isUploading}
          className="w-full rounded-lg bg-[#C9A227] py-3 font-semibold text-white disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </span>
          ) : isEditing ? (
            "Update"
          ) : (
            "Submit"
          )}
        </button>
      </form>

      <SuccessModal
        open={showModal}
        onOpenChange={setShowModal}
        title={
          isEditing
            ? "Collection successfully updated"
            : "Collection successfully created"
        }
        description={`Congratulations! Your collection has been ${
          isEditing ? "updated" : "created"
        } successfully.`}
      />
    </div>
  );
};

export default CollectionDrawer;