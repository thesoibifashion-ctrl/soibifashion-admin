"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  confirmText: string;
  cancelText?: string;

  confirmButtonClassName?: string;

  onConfirm: () => void;
}

export default function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  confirmButtonClassName = "bg-[green]",
  onConfirm,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[390px] rounded-[32px] bg-[#FBFBFB]">
        <DialogHeader className="mt-5">
          <DialogTitle className="font-medium text-2xl text-[#1E1E1E]">
            {title}
          </DialogTitle>

          <DialogDescription className="font-normal text-sm text-[#1E1E1EA6]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-11">
          <button
            onClick={() => onOpenChange(false)}
            className="bg-white border border-[#F2F2F2] px-5 py-2 rounded-full font-medium text-base"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`px-5 py-2  rounded-full text-white font-medium text-base ${confirmButtonClassName}`}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}