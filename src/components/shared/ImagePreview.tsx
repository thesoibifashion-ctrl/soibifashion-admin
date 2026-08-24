"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ImagePreviewProps = {
  src: string;
  alt?: string;
  className?: string;
};

export default function ImagePreview({
  src,
  alt = "Image",
  className,
}: ImagePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <img
          src={src}
          alt={alt}
          className={`h-12 w-12 shrink-0 cursor-zoom-in rounded-xl border border-[#E7E2DC] object-cover ${className ?? ""}`}
        />
      </DialogTrigger>

      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-2xl object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}