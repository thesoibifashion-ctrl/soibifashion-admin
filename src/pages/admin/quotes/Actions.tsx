"use client";

import { useState } from "react";
import { Loader2, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationModal from "@/components/shared/modals/ActionsModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { statusType } from "@/types/status";
import { deleteProduct, updateProduct } from "@/api/products";

interface ProjectActionsProps {
  projectId: string;
  status: statusType;
  isFeatured?: boolean;
}

const ProjectActions = ({
  projectId,
  status,
  isFeatured,
}: ProjectActionsProps) => {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: deleteProject, isPending } = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete project");
    },
  });

  const { mutate: editProject, isPending: editLoading } = useMutation({
    mutationFn: (payload: Record<string, any>) =>
      updateProduct(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setArchiveOpen(false);
      toast.success("Product updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to edit project");
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
            {isFeatured ? "Remove Highlight" : "Highlight"}
          </DropdownMenuItem>
{/* 
          {status !== "archived" && (
            <DropdownMenuItem onClick={() => setArchiveOpen(true)}>
              Archive
            </DropdownMenuItem>
          )} */}

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
        title="Archive Project?"
        description="Archiving will hide this project from your website. Are you sure you want to archive this project?"
        confirmText="Yes, Archive"
        confirmButtonClassName="bg-[#C9A227]"
        onConfirm={() => handleStatusUpdate("archived")}
      />

      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Project?"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Yes, Delete"
        confirmButtonClassName="bg-[#DE0D0D]"
        onConfirm={() => {
          deleteProject(projectId);
          setDeleteOpen(false);
        }}
      />
    </>
  );
};

export default ProjectActions;