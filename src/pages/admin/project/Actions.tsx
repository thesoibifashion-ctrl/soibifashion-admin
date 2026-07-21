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
import { apiDelete, apiUpdate } from "@/api/mutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { statusType } from "@/types/status";

interface ProjectActionsProps {
  projectId: string;
  status: statusType;
}

const ProjectActions = ({ projectId, status }: ProjectActionsProps) => {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteProject, isPending } = useMutation({
    mutationFn: (id: string) => apiDelete(`/project/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Project deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete project");
    },
  });
  function updateProject(payload: Record<string, any>) {
    return apiUpdate(`/project/${projectId}`, payload);
  }

  const { mutate: editProject, isPending: editLoading } = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      setArchiveOpen(false);
      toast.success("Project updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to edit post");
    },
  });

  const handleStatusUpdate = (status: statusType) => {
    editProject({ status });
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
              <Loader2 className="animate-spin" />
            ) : (
              <MoreHorizontal className="h-5 w-5" />
            )}{" "}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {status === "draft" ? (
            <DropdownMenuItem onClick={() => handleStatusUpdate("published")}>
              Publish
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleStatusUpdate("draft")}>
              Save as Draft
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleStatusUpdate("highlighted")}>
            Highlight
          </DropdownMenuItem>

          {status !== "archived" && (
            <DropdownMenuItem onClick={() => setArchiveOpen(true)}>
              Archive
            </DropdownMenuItem>
          )}

          {/* {status !== "highlighted" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("highlighted")}>
            Highlight
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
        title="Archive Blog?"
        description="Archiving will hide this blog from your website. Are you sure you want to archive this blog?"
        confirmText="Yes, Archive"
        confirmButtonClassName="bg-[#186D0F]"
        onConfirm={() => handleStatusUpdate("archived")}
      />

      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Blog?"
        description="Are you sure you want to delete this blog? This action cannot be undone."
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
