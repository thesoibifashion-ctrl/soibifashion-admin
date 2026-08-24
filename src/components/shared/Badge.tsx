import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = string

const badgeStyles: Record<BadgeVariant, string> = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  submitted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-stone-100 text-stone-600 border-stone-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-stone-100 text-stone-500 border-stone-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  enrolled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  read: 'bg-stone-100 text-stone-500 border-stone-200',
  unread: 'bg-amber-50 text-amber-700 border-amber-200',
  featured: 'bg-amber-50 text-amber-700 border-amber-200',
  hero: 'bg-purple-50 text-purple-700 border-purple-200',
  'coming-soon': 'bg-stone-100 text-stone-500 border-stone-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-stone-100 text-stone-600 border-stone-200',
}

export function Badge({ variant, children, className }: { variant: BadgeVariant; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', badgeStyles[variant], className)}>
      {children}
    </span>
  )
}
