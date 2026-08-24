"use client";

import { useEffect, useState } from "react";

import { AppDrawer } from "@/components/shared/drawer/DataDrawer";
import type { CustomizationOption, OptionPayload } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  option?: CustomizationOption | null;
  saving?: boolean;
  onSave: (payload: OptionPayload) => void;
};

const createSlug = (value: string) => {
  const baseSlug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const uuid = crypto.randomUUID().split("-")[0];

  return `${baseSlug}-${uuid}`;
};

const CustomizationOptionDrawer = ({
  open,
  onOpenChange,
  categoryName,
  option,
  saving = false,
  onSave,
}: Props) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    if (option) {
      setName(option.name);
      setSlug(option.slug);
      setStatus(option.status);
      setSortOrder(option.sortOrder);
    } else {
      setName("");
      setSlug("");
      setStatus("active");
      setSortOrder(0);
    }
  }, [option, open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && saving) {
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = () => {
    if (!name.trim() || saving) return;

    const generatedSlug = option?.slug || createSlug(name);

    setSlug(generatedSlug);

    onSave({
      name: name.trim(),
      slug: generatedSlug,
      imageUrl: null,
      imagePublicId: null,
      description: null,
      status,
      sortOrder,
    });
  };

  return (
    <AppDrawer
      width="w-[60%] lg:max-w-[40%]!"
      open={open}
      onOpenChange={handleOpenChange}
      title={option ? `Edit ${categoryName}` : `Add to ${categoryName}`}
    >
      <div className="mt-10 space-y-6">
        {/* Option Name */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
            Option Name
          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            placeholder={`e.g. ${categoryName}`}
            className="h-11 w-full rounded-xl border border-[#E7E2DC] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#8B5E3C] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Slug Preview */}
        <div className="rounded-xl bg-[#F8F6F2] px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
            Slug
          </p>

          <p className="break-all text-sm text-[#1C1917]">
            {slug || "Generated automatically"}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
            Status
          </p>

          <div className="grid grid-cols-2 gap-2">
            {(["active", "inactive"] as const).map((value) => (
              <button
                key={value}
                type="button"
                disabled={saving}
                onClick={() => setStatus(value)}
                className={`h-10 cursor-pointer rounded-xl border text-sm font-medium capitalize transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                  status === value
                    ? "border-[#8B5E3C] bg-[#8B5E3C] text-white"
                    : "border-[#E7E2DC] bg-white text-[#78716C] hover:border-[#8B5E3C]/40"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Order */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
            Sort Order
          </p>

          <input
            type="number"
            min={0}
            value={sortOrder}
            disabled={saving}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="h-11 w-full rounded-xl border border-[#E7E2DC] bg-white px-3 text-sm text-[#1C1917] focus:border-[#8B5E3C] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="button"
            disabled={saving || !name.trim()}
            onClick={handleSubmit}
            className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[#8B5E3C] text-sm font-medium text-white transition-colors hover:bg-[#7A5235] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : option ? "Save Changes" : "Add Option"}
          </button>
        </div>
      </div>
    </AppDrawer>
  );
};

export default CustomizationOptionDrawer;