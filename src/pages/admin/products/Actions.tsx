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
import { toast } from "sonner";

import { deleteProduct } from "@/api/products";

interface ProductActionsProps {
  productId: string;
}

const ProductActions = ({
  productId,
}: ProductActionsProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate:deleteProd, isPending } = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("product deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete product");
    },
  });


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="rounded-full p-2 hover:bg-[#F5F5F5]"
          >
            { isPending ? (
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

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Collection?"
        description="Are you sure you want to delete this collection? This action cannot be undone."
        confirmText="Yes, Delete"
        confirmButtonClassName="bg-[#DE0D0D]"
        onConfirm={() => {
            deleteProd(productId);
          setDeleteOpen(false);
        }}
      />
    </>
  );
};

export default ProductActions;