import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const EU_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

interface Props {
  sizes: number[];
  onToggle: (size: number) => void;
  customSize: string;
  onCustomSizeChange: (v: string) => void;
  onAddCustomSize: () => void;
  sortOrder: number;
  onSortOrderChange: (value: number) => void;
}

const SizesSection = ({
  sizes,
  sortOrder,
  onToggle,
  onSortOrderChange,
  customSize,
  onCustomSizeChange,
  onAddCustomSize,
}: Props) => {
  const allSizes = Array.from(new Set([...EU_SIZES, ...sizes])).sort(
    (a, b) => a - b
  );

  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 font-semibold text-near-brown">
        Available Sizes (EU)
      </h2>

      {/* Sizes */}
      <div className="flex flex-wrap gap-2">
        {allSizes.map((size) => {
          const active = sizes.includes(size);

          return (
            <button
              key={size}
              type="button"
              onClick={() => onToggle(size)}
              className={`h-12 w-12 rounded-xl border text-sm font-semibold ${
                active
                  ? "border-near-brown bg-near-brown text-white"
                  : "hover:border-[#C9A227]"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Add custom size */}
      <div className="mt-5 flex max-w-xs gap-2">
        <Input
          type="number"
          placeholder="Add new size"
          value={customSize}
          onChange={(e) => onCustomSizeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddCustomSize();
            }
          }}
        />

        <Button type="button" variant="outline" onClick={onAddCustomSize}>
          <Plus size={14} />
        </Button>
      </div>

      {/* Sort Order - completely independent */}
      <div className="mt-5 max-w-xs">
        <label className="mb-2 block text-sm font-medium text-near-brown">
          Sort Order
        </label>

        <Input
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => onSortOrderChange(Number(e.target.value))}
          placeholder="Enter sort order"
        />
      </div>
    </section>
  );
};

export default SizesSection;

export { EU_SIZES };