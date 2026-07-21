"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
// import { Loader } from "../Loader";

interface ActionPopoverProps {
  id: string;
  status: string;
  highlighted: boolean;
  onEdit: (id: string) => void;
  onArchive: (id: string, status: string) => Promise<void>;
  onPublish: (id: string, status: string) => Promise<void>;
  onHighlight: (
    id: string,
    // highlighted: boolean,
    status: string
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  route: string;
  page: string;
  publishing: boolean;
}

export function ActionPopover({
  id,
  onArchive,
  onPublish,
  route,
  onHighlight,
  onDelete,
  status,
  page,
}: ActionPopoverProps) {
  const [openPopover, setOpenPopover] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "archive" | "highlight" | "delete" | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (activeModal === "archive") await onArchive(id, status);
      if (activeModal === "highlight") await onHighlight(id, status);
      if (activeModal === "delete") await onDelete(id);
      setActiveModal(null);
      // toast.success(`${page} updated successfully`);
    } catch (err) {
      console.log(`Failed to update ${page}`);
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  console.log("Popover:", openPopover);

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <button className="p-2 rounded-md">
            <MoreHorizontal size={18} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          onMouseDown={(e) => e.preventDefault()}
          className="w-40 p-2 space-y-1"
        >
          <button
            // onClick={() => onEdit(id)}
            onClick={() => navigate(`${route}`)}
            className="w-full text-left text-sm hover:bg-accent rounded px-2 py-1"
          >
            Edit
          </button>
          <button
            onClick={() => setActiveModal("archive")}
            className="w-full text-left text-sm hover:bg-accent rounded px-2 py-1"
          >
            Archive
          </button>
          <button
            onClick={() => onPublish(id, "PUBLISHED")}
            className="w-full text-left text-sm hover:bg-accent rounded px-2 py-1"
          >
            {/* {publishing ? <span className="flex items-center gap-1"><Loader color="black" /> Publishing </span> : "Publish"} */}
          </button>
          <button
            onClick={() => setActiveModal("highlight")}
            className="w-full text-left text-sm hover:bg-accent rounded px-2 py-1"
          >
            Highlight
          </button>
          <button
            onClick={() => setActiveModal("delete")}
            className="w-full text-left text-sm hover:bg-accent rounded px-2 py-1 text-red-600"
          >
            Delete
          </button>
        </PopoverContent>
      </Popover>

      {/* Confirmation Modals */}
      <Dialog open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-medium text-base text-[#121212]">
              {activeModal === "archive" && `Archive ${page}`}
              {activeModal === "highlight" && `Highlight ${page}`}
              {activeModal === "delete" && `Delete ${page}`}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-[#121212B2]">
            {activeModal === "delete"
              ? `Are you sure you want to permanently delete this ${page}?`
              : `Are you sure you want to ${activeModal} this ${page}?`}
          </p>

          <DialogFooter className="mt-4">
            <Button
              className="font-medium text-sm rounded-full bg-[#EFEFEF] text-[#121212]"
              onClick={() => setActiveModal(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={`font-medium text-sm rounded-full  text-[white] ${
                activeModal === "delete"
                  ? "w-fit bg-gradient-to-b from-[#ff2828cb] via-[#FF2828] via-[#FF2828] via-[#FF2828] to-[#ff2828cb] text-white px-6 py-3 "
                  : "bg-gradient-to-b from-[#6c4fffb6] via-[#5C3DFF] to-[#6d4fffb6] text-white px-4 py-3 rounded-full flex items-center gap-2 hover:bg-indigo-700 transition"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <>
                  {activeModal === "archive" && "Yes, archive"}
                  {activeModal === "highlight" && "Confirm"}
                  {activeModal === "delete" && "Yes, delete"}
                </>
              )}
              {loading}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
