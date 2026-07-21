import type { statusType } from "@/types/status";

type StatusStyles = {
  [key: string]: { label: string; bg: string; text: string; dot: string };
};

interface Status {
    status:statusType;
  }
  
  export function getStatus({ status }: Status) {
    const styles: StatusStyles = {
      published: {
        label: "Published",
        bg: "bg-[#186D0F54]",
        text: "text-[#186D0F]",
        dot: "bg-[#186D0F]",
      },
      pending: {
        label: "Pending",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
      },
      highlighted: {
        label: "Highlighted",
        bg: "bg-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-500",
      },
      draft: {
        label: "Highlighted",
        bg: "bg-[#F3F4F6]",
        text: "text-[#374151]",
        dot: "bg-[#374151]",
      },
      archived: {
        label: "Highlighted",
        bg: "bg-[#EEF2FF]",
        text: "text-[#4F46E5]",
        dot: "bg-[#4F46E5]",
      },
    };
  

    
    const current = styles[status] ?? { label: status, bg: "", text: "", dot: "" };
  
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${current.bg} ${current.text}`}
      >
        <span className={`h-2 w-2 rounded-full ${current.dot}`} />
        {current.label}
      </span>
    );
  }