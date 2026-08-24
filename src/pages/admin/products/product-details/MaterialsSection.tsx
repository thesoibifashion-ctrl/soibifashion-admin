import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface Props {
  materials: string[];
  onRemove: (name: string) => void;
  newMaterial: string;
  onNewMaterialChange: (v: string) => void;
  onAdd: () => void;
}

const MaterialsSection = ({ materials, onRemove, newMaterial, onNewMaterialChange, onAdd }: Props) => {
  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 font-semibold text-near-brown">Materials</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {materials.map((m) => (
          <span key={m} className="flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm">
            {m}
            <button type="button" onClick={() => onRemove(m)} className="text-gray-400 hover:text-red-600">
              <X size={13} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add material"
          value={newMaterial}
          onChange={(e) => onNewMaterialChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <Button type="button" onClick={onAdd} className="bg-[#j] hover:bg-[#b99220]">
          <Plus size={18} />
        </Button>
      </div>
    </section>
  );
};

export default MaterialsSection;