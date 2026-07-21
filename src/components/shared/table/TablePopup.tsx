import { Link, useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useState } from "react";

interface BlogHeaderProps {
  blogId?: string;
  status?: string;
  currentStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "HIGHLIGHTED";
  setCurrentStatus?: (
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "HIGHLIGHTED"
  ) => void;
}

export default function BlogHeader({
  blogId,
}: BlogHeaderProps) {
  const { id } = useParams<{ id: string }>();



  const navigate = useNavigate();

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <div className="px-8 py-6 flex justify-between items-center bg-[white]  w-full">
      <div className="p-1 rounded-full flex items-center gap-[30px] bg-[#F9F9F9]">
        <Link to="/dashboard/content">
          <X color="#1C1F1D" />
        </Link>
        {/* {status ? <getStat status={status} /> : <div />} */}
      </div>

      {id && (
        <>
          <div className="flex gap-[10px]">
            {/* Menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="p-4 rounded-full bg-[#EFEFEF] cursor-pointer rotate-90">
                  {/* <CiMenuKebab color="#121212" /> */}sasd
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  // onClick={() => handleUpdate("DRAFT")}
                >
                  Save as Draft
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setArchiveOpen(true)}
                >
                  Archive
                </DropdownMenuItem>

                {/* <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setHighlightOpen(true)}
                >
                  Highlight
                </DropdownMenuItem> */}

                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Preview + Publish */}
            <button className="font-medium text-base text-[#121212] px-5 py-3 rounded-[100px] bg-[#EFEFEF]">
              <Link to={`/preview/${blogId}`}>Preview</Link>
            </button>

            <button
              className="bg-gradient-to-b from-[#6c4fffb6] via-[#5C3DFF] to-[#6d4fffb6] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-indigo-700 transition"
              // onClick={() => handleUpdate("PUBLISHED")}
            >
              
                "Publish"
            </button>
          </div>

          {/* ---------------- MODALS ---------------- */}

          {/* Draft Modal */}

          {/* Archive Modal */}
          <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
            <DialogContent className="w-[390px] rounded-[32px] bg-[#FBFBFB]">
              <DialogHeader className="mt-5">
                <DialogTitle className="font-medium text-2xl text-[#1E1E1E]">
                  Archive Blog?
                </DialogTitle>
                <DialogDescription className="font-normal text-sm text-[#1E1E1EA6]">
                  Archiving will hide this blog from your website. Are you sure
                  you want to archive this blog?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="mt-11">
                <button
                  className="bg-[white]  border font-medium text-base border-[#F2F2F2] px-4 py-[10.5px] rounded-full"
                  onClick={() => setArchiveOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[white] purple-button font-medium text-base text-white border border-[#F2F2F2] px-4 py-[10.5px] rounded-full"
                
                >
                  { "Archive"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
            <DialogContent className="w-[390px] rounded-[32px] bg-[#FBFBFB]">
              <DialogHeader>
                <div className="flex justify-start items-center">
                  {/* <img src={success} alt="success" /> */}
                </div>
                <DialogTitle className="font-medium text-2xl text-[#1E1E1E]">
                  Blog successfully published
                </DialogTitle>
                <DialogDescription className="font-normal text-sm text-[#1E1E1EA6]">
                  Your blog has been successfully published{" "}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="mt-10">
                <button
                  onClick={() => {
                    window.location.href = "/new-blog";
                  }}
                  className="bg-[white] border border-[#F2F2F2] px-4 py-[10.5px] rounded-full"
                >
                  Create another
                </button>

                <button
                  className="bg-[white] purple-button text-white border border-[#F2F2F2] px-4 py-[10.5px] rounded-full"
                  onClick={() => {
                    navigate("/dashboard/content");
                  }}
                >
                  Done
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* ---------- DELETE MODAL ---------- */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="w-[390px] rounded-[32px] bg-[#FBFBFB]">
              <DialogHeader className="mt-5">
                <DialogTitle className="font-medium text-2xl text-[#1E1E1E]">
                  Delete Blog?
                </DialogTitle>
                <DialogDescription className="font-normal text-sm text-[#1E1E1EA6]">
                  Are you sure you want to delete this blog? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <button
                  className="bg-[white]  font-medium text-base border border-[#F2F2F2] px-4 py-[10.5px] rounded-full"
                  onClick={() => setDeleteOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[white] red-button  font-medium text-base text-white border border-[#F2F2F2] px-4 py-[10.5px] rounded-full"
                 
                >
                  
                    "Delete"
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
