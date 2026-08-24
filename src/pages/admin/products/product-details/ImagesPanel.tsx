import ImagePreview from "@/components/shared/ImagePreview";
import { Loader2, Star, Trash2, Upload, X } from "lucide-react";

interface SavedImage {
  id: string;
  imageUrl: string;
  altText?: string | null;
  isPrimary: boolean;
}

interface PendingImage {
  file: File;
  previewUrl: string;
  altText: string;
  isPrimary: boolean;
}

interface Props {
  savedImages: SavedImage[];
  pendingImages: PendingImage[];
  deletingImageId: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteSaved: (imageId: string) => void;
  onSetPendingPrimary: (index: number) => void;
  onUpdatePendingAlt: (index: number, altText: string) => void;
  onRemovePending: (index: number) => void;
}

const ImagesPanel = ({
  savedImages,
  pendingImages,
  deletingImageId,
  onUpload,
  onDeleteSaved,
  onSetPendingPrimary,
  onUpdatePendingAlt,
  onRemovePending,
}: Props) => {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-near-brown">Images</h3>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#C9A227] hover:underline">
          <Upload size={12} /> Upload
          <input type="file" multiple accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      </div>

      <div className="space-y-2">
        {savedImages.map((img) => (
          <div key={img.id} className="flex items-center gap-2.5 rounded-xl border p-2">
            {/* <img src={img.imageUrl} alt={img.altText ?? ""} className="h-9 w-9 rounded-lg object-cover" /> */}
            <ImagePreview src={img.imageUrl}/>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs text-gray-600">{img.altText || "No alt text"}</p>
              {img.isPrimary && <span className="text-[10px] font-semibold text-[#C9A227]">Primary</span>}
            </div>
            <button
              type="button"
              onClick={() => onDeleteSaved(img.id)}
              disabled={deletingImageId === img.id}
              className="text-gray-400 hover:text-red-500"
            >
              {deletingImageId === img.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          </div>
        ))}

        {pendingImages.map((img, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-dashed p-2">
            {/* <img src={img.previewUrl} alt="" className="h-9 w-9 rounded-lg object-cover" /> */}
            <ImagePreview src={img.previewUrl}/>

            <div className="flex-1 min-w-0">
              <input
                value={img.altText}
                onChange={(e) => onUpdatePendingAlt(i, e.target.value)}
                placeholder="Alt text"
                className="w-full border-none bg-transparent text-xs outline-none"
              />
              {img.isPrimary && <span className="text-[10px] font-semibold text-[#C9A227]">Primary (pending)</span>}
            </div>
            <button
              type="button"
              onClick={() => onSetPendingPrimary(i)}
              title="Set primary"
              className={`h-6 w-6 rounded-md text-xs ${img.isPrimary ? "bg-[#C9A227] text-white" : "text-gray-300 hover:text-[#C9A227]"}`}
            >
              <Star size={13} className="mx-auto" />
            </button>
            <button type="button" onClick={() => onRemovePending(i)} className="text-gray-400 hover:text-red-500">
              <X size={14} />
            </button>
          </div>
        ))}

        {savedImages.length === 0 && pendingImages.length === 0 && (
          <p className="text-xs text-gray-500">No images yet.</p>
        )}
      </div>
    </div>
  );
};

export default ImagesPanel;