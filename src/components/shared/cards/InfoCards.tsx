import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCard {
  label: string;
  value: string;
  sub: string;
  change: string;
  positive?: boolean;
  loading?: boolean;
  icon: LucideIcon;
  pending?:boolean
}

const InfoCards = ({
  label,
  value,
  sub,
  change,
  positive,
  icon: Icon,
  loading,
  pending
}: KpiCard) => {
  if (loading) {
    return (
      <Skeleton className="mb-8 mt-8 h-37.75 bg-[#e5e5e5] w-full rounded-2xl" />
    );
  }

  return (
    <div className="mb-8 gap-4">
      <div className="mt-8 rounded-2xl border relative border-[#E7E2DC] bg-white p-5 shadow-sm">
        {
          pending && 
        <div className="absolute -top-1 -right-2 bg-[#980000] w-7 h-7 flex items-center justify-center text-[white] text-xs rounded-full">{sub}</div>

        }
        <div className="mb-3 flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F0EB]">
            <Icon size={16} className="text-[#8B5E3C]" />
          </div>

          <div
            className={cn(
              "flex items-center gap-1 text-xs font-semibold",
              positive === true
                ? "text-emerald-600"
                : positive === false
                  ? "text-red-500"
                  : "text-[#78716C]"
            )}
          >
            {positive === true && <TrendingUp size={12} />}
            {positive === false && <TrendingDown size={12} />}
            {change}
          </div>
        </div>

        <p className="font-serif text-2xl font-semibold text-[#1C1917]">
          {value}
        </p>

        <p className="mt-1 font-display text-xs font-medium text-[#78716C]">
          {label}
        </p>

      
      </div>
    </div>
  );
};

export default InfoCards;