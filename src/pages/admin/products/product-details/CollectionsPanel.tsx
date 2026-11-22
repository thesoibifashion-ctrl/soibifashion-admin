import type { Collection } from "@/types";
import { Loader2 } from "lucide-react";



interface Props {
  collections: Collection[];
  selectedCollections: string[];
  isLoading: boolean;
  onToggle: (id: string) => void;
}

const CollectionsPanel = ({ collections, selectedCollections, isLoading, onToggle }: Props) => {
  return (
    <div className="rounded-2xl border bg-white p-5">
    <h3 className="mb-3 font-semibold text-near-brown">Collections</h3>

    {collections.length === 0 ? (
      <p className="text-sm text-gray-500">No collections yet.</p>
    ) : (
      <div className="space-y-1.5">
        {collections.map((col) => {
          const active = selectedCollections.includes(col.id);

          return (
            <label
              key={col.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 ${active ? "bg-[#C9A227]/10" : "hover:bg-gray-50"}`}
            >
              <input
                type="checkbox"
                checked={active}
                disabled={isLoading}
                onChange={() => onToggle(col.id)}
                className="h-3.5 w-3.5 accent-[#C9A227]"
              />
              <span className="flex-1 text-sm">{col.name}</span>
              {isLoading && <Loader2 size={14} className="animate-spin text-[#C9A227]" />}
            </label>
          );
        })}
      </div>
    )}
  </div>
  )
}

export default CollectionsPanel;