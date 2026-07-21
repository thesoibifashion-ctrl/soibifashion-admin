// lib/utils/getStatus.tsx
import type { JSX } from "react";

type StatusConfig = {
  label: string;
  dot: string;
  text: string;
  bg: string;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  draft: {
    label: "Draft",
    dot: "bg-[#9CA3AF]",
    text: "text-[#6B7280]",
    bg: "bg-[#F3F4F6]",
  },
  published: {
    label: "Published",
    dot: "bg-[#186D0F]",
    text: "text-[#186D0F]",
    bg: "bg-[#E6F4E4]",
  },
  pending: {
    label: "Pending",
    dot: "bg-[#D97706]",
    text: "text-[#D97706]",
    bg: "bg-[#FEF3C7]",
  },
  archived: {
    label: "Archived",
    dot: "bg-[#DC2626]",
    text: "text-[#DC2626]",
    bg: "bg-[#FEE2E2]",
  },
  highlighted: {
    label: "Highlighted",
    dot: "bg-[#2563EB]",
    text: "text-[#2563EB]",
    bg: "bg-[#DBEAFE]",
  },
};

const FALLBACK: StatusConfig = {
  label: "Unknown",
  dot: "bg-[#9CA3AF]",
  text: "text-[#6B7280]",
  bg: "bg-[#F3F4F6]",
};

export function statusBadge(status: unknown): JSX.Element {
  let config = FALLBACK;

  try {
    const key = typeof status === "string" ? status.toLowerCase().trim() : "";
    if (key && STATUS_MAP[key]) {
      config = STATUS_MAP[key];
    }
  } catch {
    config = FALLBACK;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}