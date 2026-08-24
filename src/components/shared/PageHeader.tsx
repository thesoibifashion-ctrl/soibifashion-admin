import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, breadcrumbs }: {
    title: string; subtitle?: string; breadcrumbs?: { label: string; active?: boolean }[]; 
  }) {
    return (
      <div className="mb-8">
        {breadcrumbs && (
          <nav className="flex items-center gap-1.5 mb-3">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[#D6CFC7]">/</span>}
                <span className={cn('text-sm', b.active ? 'text-[#1C1917] font-medium' : 'text-[#78716C]')}>{b.label}</span>
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#1C1917] leading-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-[#78716C] text-sm">{subtitle}</p>}
          </div>
        </div>
      </div>
    )
  }