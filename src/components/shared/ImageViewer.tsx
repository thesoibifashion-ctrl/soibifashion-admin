"use client";

import  { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface ViewImageProps {
  src: string;
  alt?: string;
  triggerClassName?: string;
}

export function ViewImage({
  src,
  alt = "Image preview",
}: ViewImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="flex items-center justify-center gap-2 cursor-pointer">
          View Image
          <Eye size={14} />
        </span>
      </DialogTrigger>

      <DialogContent className="max-w-[90vw]!  max-h-[90vh]! overflow-auto border-none bg-black/95 p-2">
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        <div className="flex  items-center justify-center">
          <img
            src={src}
            alt={alt}
            className=" max-w-full w-full rounded-lg object-cover object-top"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
