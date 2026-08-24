"use client";

import { Loader2, Plus, Settings2 } from "lucide-react";

import CustomizationOptionRow from "./CustomizationOptionRow";
import type { CustomizationCategory, CustomizationOption } from "@/types";


type Props = {
  category: CustomizationCategory;
  onAdd: () => void;
  onEdit: (option: CustomizationOption) => void;
  onDelete: (id: string) => void;
  loading:boolean
};

const CustomizationSection = ({
  category,
  onAdd,
  onEdit,
  onDelete,
  loading
}: Props) => {
  const activeCount = category.options.filter(
    (option) => option.status === "active"
  ).length;

  return (
    <section className="rounded-2xl max-h-120 overflow-auto border border-[#E7E2DC] bg-white ">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E2DC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8F6F2] flex items-center justify-center">
            <Settings2 size={18} className="text-[#8B5E3C]" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#1C1917]">
              {category.name}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-[#78716C]">
                {category.options.length}{" "}
                {category.options.length === 1 ? "option" : "options"}
              </p>

              <span className="text-[#D6D3D1]">•</span>

              <p className="text-xs text-[#78716C]">
                {activeCount} active
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="h-9 px-3 rounded-xl bg-[#8B5E3C] text-white text-xs font-medium flex items-center gap-1.5 hover:bg-[#7A5235] transition-colors cursor-pointer"
        >
       {loading ? <Loader2 className="animate-spin"/> : <span className="flex gap-2 items-center">   <Plus size={15} />  Add Option</span>}
        </button>
      </div>

      {category.options.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-medium text-[#44403C]">
            No options yet
          </p>
          <p className="text-xs text-[#A8A29E] mt-1">
            Add an option to this category.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#F0ECE7]">
          {category.options
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((option) => (
              <CustomizationOptionRow
                key={option.id}
                option={option}
                onEdit={() => onEdit(option)}
                onDelete={() => onDelete(option.id)}
              />
            ))}
        </div>
      )}
    </section>
  );
};

export default CustomizationSection;