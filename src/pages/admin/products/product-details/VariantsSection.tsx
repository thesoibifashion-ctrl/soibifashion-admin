import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, X } from "lucide-react";
import type { ProductVariant } from "@/types";


interface SavedColor {
  id: string;
  name: string;
  hex?: string;
  hexCode?: string;
}




interface Props {
  editing: boolean;
  variants: ProductVariant[];
  savedColors: SavedColor[];
  variantSavingId: string | null;
  onAdd: () => void;
  onUpdateField: (index: number, field: keyof ProductVariant, value: any) => void;
  onSave: (index: number) => void;
  onRemove: (index: number) => void;
}

const VariantsSection = ({
  editing,
  variants,
  savedColors,
  variantSavingId,
  onAdd,
  onUpdateField,
  onSave,
  onRemove,
}: Props) => {
  return (
    <section className="rounded-2xl border bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-near-brown">Variants</h2>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus size={14} /> Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <p className="text-sm text-gray-500">No variants yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {["Size Label", "Size", "SKU", "Color", "Price Adj.", "Available", ""].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {variants.map((v, i) => (
                <tr key={v.id ?? `new-${i}`} className="border-b last:border-b-0">
                  <td className="px-3 py-2">
                    <Input value={v.sizeLabel} onChange={(e) => onUpdateField(i, "sizeLabel", e.target.value)} className="h-8 w-20" />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      value={v.sizeValue ?? ""}
                      onChange={(e) => onUpdateField(i, "sizeValue", e.target.value ? Number(e.target.value) : null)}
                      className="h-8 w-16"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input value={v.sku} onChange={(e) => onUpdateField(i, "sku", e.target.value)} className="h-8 w-28" />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={v.colorId ?? ""}
                      onChange={(e) => onUpdateField(i, "colorId", e.target.value || null)}
                      className="h-8 rounded-lg border px-2 text-sm"
                    >
                      <option value="">—</option>
                      {savedColors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      value={v.priceAdjustment}
                      onChange={(e) => onUpdateField(i, "priceAdjustment", Number(e.target.value))}
                      className="h-8 w-24"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onUpdateField(i, "isAvailable", !v.isAvailable)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                        v.isAvailable ? "border-green-300 bg-green-50 text-green-600" : "border-gray-200 bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Check size={14} />
                    </button>
                  </td>
                  <td className="flex items-center gap-2 px-3 py-2">
                    {editing && (
                      <button
                        type="button"
                        onClick={() => onSave(i)}
                        disabled={variantSavingId === (v.id ?? `new-${i}`)}
                        className="text-xs font-semibold text-[#C9A227] hover:underline"
                      >
                        {variantSavingId === (v.id ?? `new-${i}`) ? <Loader2 size={14} className="animate-spin" /> : "Save"}
                      </button>
                    )}
                    <button type="button" onClick={() => onRemove(i)} className="text-gray-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!editing && variants.length > 0 && (
        <p className="mt-2 text-xs text-gray-500">Variants will be created once you save the product.</p>
      )}
    </section>
  );
};

export default VariantsSection;