"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";

interface BlogActionsProps {
  blogId: string;
}

const BlogActions = ({ }: BlogActionsProps) => {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setArchiveOpen(true)}>
            Archive
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Archive Dialog */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="w-[390px] rounded-[32px] bg-[#FBFBFB]">
          <DialogHeader className="mt-5">
            <DialogTitle className="text-2xl font-medium">
              Archive Blog?
            </DialogTitle>

            <DialogDescription>
              Archiving will hide this blog from your website. Are you sure you
              want to archive this blog?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8">
            <button
              onClick={() => setArchiveOpen(false)}
              className="rounded-full border px-4 py-2"
            >
              Cancel
            </button>

            <button className="rounded-full bg-[#186D0F] px-4 py-2 text-white">
              Archive
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="w-[390px] rounded-[32px] bg-[#FBFBFB]">
          <DialogHeader className="mt-5">
            <DialogTitle className="text-2xl font-medium">
              Delete Blog?
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8">
            <button
              onClick={() => setDeleteOpen(false)}
              className="rounded-full border px-4 py-2"
            >
              Cancel
            </button>

            <button className="rounded-full bg-red-600 px-4 py-2 text-white">
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogActions;