"use client";

import { useState } from "react";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ConfirmationModal from "@/components/shared/modals/ActionsModal";
import type { statusType } from "@/types/status";
import { toast } from "sonner";
import { deleteCollection, updateCollection } from "@/api/requests/collections";

interface ResearchActionsProps {
  researchId: string;
  status: statusType;
  isFeatured?: boolean;
}

const ResearchActions = ({
  researchId,
  status,
  isFeatured,
}: ResearchActionsProps) => {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: deleteProject, isPending } = useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete collection");
    },
  });

  const { mutate: editProject, isPending: editLoading } = useMutation({
    mutationFn: (payload: Record<string, any>) =>
      updateCollection({
        id: researchId,
        payload,
      }),
  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setArchiveOpen(false);
      toast.success("Collection updated successfully");
    },
  
    onError: (error: any) => {
      toast.error(error?.message || "Failed to edit collection");
    },
  });
  const handleStatusUpdate = (status: statusType) => {
    editProject({ status });
  };

  const handleFeaturedToggle = () => {
    editProject({
      isFeatured: !isFeatured,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="rounded-full p-2 hover:bg-[#F5F5F5]"
          >
            {editLoading || isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MoreHorizontal className="w-4 h-4" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          {status === "draft" ? (
            <DropdownMenuItem onClick={() => handleStatusUpdate("published")}>
              Publish
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleStatusUpdate("draft")}>
              Save as Draft
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleFeaturedToggle}>
            {isFeatured ? "unHighlight" : "Highlight"}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive Collection?"
        description="Archiving will hide this collection from your website. Are you sure you want to archive this collection?"
        confirmText="Yes, Archive"
        confirmButtonClassName="bg-[#C9A227]"
        onConfirm={() => handleStatusUpdate("archived")}
      />

      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Collection?"
        description="Are you sure you want to delete this collection? This action cannot be undone."
        confirmText="Yes, Delete"
        confirmButtonClassName="bg-[#DE0D0D]"
        onConfirm={() => {
          deleteProject(researchId);
          setDeleteOpen(false);
        }}
      />
    </>
  );
};

export default ResearchActions;