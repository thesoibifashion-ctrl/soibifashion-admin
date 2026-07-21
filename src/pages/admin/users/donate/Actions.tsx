"use client";

import { CheckCheckIcon, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  apiUpdate } from "@/api/mutation";
import { toast } from "sonner";

interface DonateActionsProps {
  donateId: string;
  isConfirmed: boolean;
}

const DonateActions = ({ donateId, isConfirmed }: DonateActionsProps) => {

  const queryClient = useQueryClient();

  function updateDonate() {
    return apiUpdate(`/submissions/${donateId}/confirm`);
  }

  const { mutate: editDonate, isPending: donateLoading } = useMutation({
    mutationFn: updateDonate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("Donation confirmed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to confirm donation");
    },
  });

  return (
    <>
      {isConfirmed ? (
       <p  className="flex text-[#186D0F] items-center gap-1"> <CheckCheckIcon/>Confirmed</p>
      ) : (
        <button
          className="bg-[#186D0F] flex items-center justify-center w-20 h-8 rounded-lg text-white"
          onClick={() => editDonate()}
          disabled={donateLoading}
        >
          {donateLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Confirm"
          )}
        </button>
      )}
    </>
  );
};

export default DonateActions;
