"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/shared/Badge";
import type { CustomizationOption } from "@/types";

type Props = {
  option: CustomizationOption;
  onEdit: () => void;
  onDelete: () => void;
};

const CustomizationOptionRow = ({
  option,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#F8F6F2] flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-[#8B5E3C]">
            {option.sortOrder + 1}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1C1917] truncate">
            {option.name}
          </p>

          <p className="text-xs text-[#A8A29E] mt-0.5">
            Sort order: {option.sortOrder}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Badge
          variant={option.status === "active" ? "success" : "neutral"}
        >
          {option.status}
        </Badge>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#78716C] hover:text-[#8B5E3C] hover:bg-[#F8F6F2] transition-colors cursor-pointer"
            title="Edit option"
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#78716C] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete option"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationOptionRow;