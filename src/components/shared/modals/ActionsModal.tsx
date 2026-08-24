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
  confirmButtonClassName = "bg-[#8B5E3C] hover:bg-[#7A5235]",
  onConfirm,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-32px)] max-w-[420px] rounded-[24px] border border-[#E7E2DC] bg-[#FBFAF8] p-7 shadow-xl">
        <DialogHeader className="space-y-3 text-left">
          <DialogTitle className="text-xl font-semibold text-[#1C1917]">
            {title}
          </DialogTitle>

          <DialogDescription className="text-sm leading-6 text-[#78716C]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-7 flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl border border-[#E7E2DC] bg-white px-5 text-sm font-medium text-[#57534E] transition-colors hover:bg-[#F5F0EB] cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`h-10 rounded-xl px-5 text-sm font-medium text-white transition-colors cursor-pointer ${confirmButtonClassName}`}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}