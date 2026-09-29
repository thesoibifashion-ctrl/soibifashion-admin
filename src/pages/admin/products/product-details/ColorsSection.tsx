import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";





interface SavedColor {
  id: string;
  name: string;
  hex?: string;
  hexCode?: string;
}

interface Props {
  editing: boolean;
  savedColors: SavedColor[];
  colors: { name: string; hex: string }[];
  onRemoveColor: (name: string) => void;
  newColorHex: string;
  onNewColorHexChange: (v: string) => void;
  onAddColor: () => void;
  getColorName: (hex: string) => string;
}

const ColorsSection = ({
  editing,
  savedColors,
  colors,
  onRemoveColor,
  newColorHex,
  onNewColorHexChange,
  onAddColor,
  getColorName,
}: Props) => {
  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 font-semibold text-near-brown">Colors</h2>

      {editing && savedColors.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {savedColors.map((c) => (
            <span key={c.id} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
              <span className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: c.hex ?? c.hexCode }} />
              {c.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <span key={c.name} className="flex items-center gap-2 rounded-full border border-[#C9A227] bg-[#C9A227]/10 px-3 py-1.5 text-sm">
            <span className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: c.hex }} />
            {c.name}
            <button type="button" onClick={() => onRemoveColor(c.name)} className="text-[#C9A227] hover:text-red-600">
              <X size={13} />
            </button>
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="color"
          value={newColorHex}
          onChange={(e) => onNewColorHexChange(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-md border p-1"
        />
        <span className="flex-1 text-sm text-gray-500">{getColorName(newColorHex)}</span>
        <Button type="button" onClick={onAddColor} variant="outline">
          <Plus size={16} /> Add Color
        </Button>
      </div>
    </section>
  );
};

export default ColorsSection;