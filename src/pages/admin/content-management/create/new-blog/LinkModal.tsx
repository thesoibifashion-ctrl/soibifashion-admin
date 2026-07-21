import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  
  interface LinkModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    linkText: string;
    linkUrl: string;
    onLinkTextChange: (text: string) => void;
    onLinkUrlChange: (url: string) => void;
    onInsert: () => void;
    trigger: React.ReactNode;
  }
  
  export function LinkModal({ 
    isOpen, 
    onClose, 
    linkText,
    linkUrl,
    onLinkTextChange,
    onLinkUrlChange,
    onInsert,
    trigger 
  }: LinkModalProps) {
    return (
      <Popover open={isOpen} onOpenChange={onClose}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-[270px]">
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
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="py-2 rounded-full bg-[#186D0F] w-full font-medium text-base text-[#FFFFFF] hover-none"
              onClick={onInsert}
            >
              Insert
            </button>
          </div>
           </PopoverContent>
      </Popover>
    );
  }