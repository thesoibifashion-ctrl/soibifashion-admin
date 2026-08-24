import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  children,
  action,
  className,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E7E2DC] bg-white shadow-sm",
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-[#E7E2DC] px-6 py-4">
          <h2 className="font-serif text-base font-semibold text-[#1C1917]">
            {title}
          </h2>

          {action}
        </div>
      )}

      {children}
    </div>
  );
}

export default SectionCard;