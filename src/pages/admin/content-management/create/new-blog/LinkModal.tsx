
  interface LinkModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    linkText: string;
    linkUrl: string;
    onLinkTextChange: (text: string) => void;
    onLinkUrlChange: (url: string) => void;
    onInsert: () => void;
  }
  
  export function LinkModal({ 
    isOpen, 
    onClose, 
    linkText,
    linkUrl,
    onLinkTextChange,
    onLinkUrlChange,
    onInsert,
  }: LinkModalProps) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4 shadow-xl">
          <p className="font-semibold text-base">Insert Link</p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Display Text"
              value={linkText}
              onChange={(e) => onLinkTextChange(e.target.value)}
              className="w-full border placeholder:text-[#0D0D0D66] placeholder:text-sm rounded-[12px] h-10 border-[#EBEBEB] px-3"
            />
            <input
              type="text"
              placeholder="URL (e.g. https://...)"
              value={linkUrl}
              onChange={(e) => onLinkUrlChange(e.target.value)}
              className="w-full border placeholder:text-[#0D0D0D66] placeholder:text-sm rounded-[12px] h-10 border-[#EBEBEB] px-3"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm rounded-lg border"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm rounded-lg bg-[#186D0F] text-white"
              onClick={onInsert}
            >
              Insert
            </button>
          </div>
        </div>
      </div>
    );
  }