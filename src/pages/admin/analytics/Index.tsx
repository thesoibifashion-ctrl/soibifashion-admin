"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Box,
  CheckCircle2,
  Clock3,
  Eye,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

import { apiGet } from "@/api/clients";

const GOLD = "#C9A227";
// const BLACK = "#0E0E0E";

type AnalyticsResponse = {
  success: boolean;
  message: string;
    products: {
      total: number;
      published: number;
      draft: number;
      featured: number;
      hero: number;
      totalViews: number;
      topProducts: {
        id: string;
        name: string;
        views: number;
      }[];
    };
    carts: {
      total: number;
      active: number;
      submitted: number;
      totalValue: number;
      byStatus: Record<string, number>;
      recent: {
        id: string;
        orderNumber: string;
        status: string;
        createdAt: string;
      }[];
    };
    quotes: {
      total: number;
      totalValue: number;
      byStatus: Record<string, number>;
      recent: {
        id: string;
        referenceNumber: string;
        status: string;
        createdAt: string;
      }[];
    };
    users: {
      total: number;
      new: number;
    };
    contacts: {
      total: number;
      unread: number;
      recent: {
        id: string;
        name: string;
        createdAt: string;
      }[];
    };
    academy: {
      total: number;
      byStatus: Record<string, number>;
      byExperienceLevel: Record<string, number>;
    };
};

// const formatCurrency = (value: number) =>
//   new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     maximumFractionDigits: 0,
//   }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-NG").format(value);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

// const formatStatus = (status: string) =>
//   status.charAt(0).toUpperCase() + status.slice(1).replaceAll("_", " ");

// const statusColor = (status: string) => {
//   switch (status) {
//     case "completed":
//     case "confirmed":
//       return "#166534";

//     case "processing":
//     case "reviewing":
//       return "#A16207";

//     case "pending":
//       return "#6B7280";

//     case "cancelled":
//       return "#B91C1C";

//     case "submitted":
//       return "#1D4ED8";

//     default:
//       return "#525252";
//   }
// };

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-[#EDEAE4] bg-white px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-[#0E0E0E]">
        {payload[0].name}
      </p>
      <p className="mt-1 text-sm text-[#666]">
        {formatNumber(payload[0].value)}
      </p>
    </div>
  );
};

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A227]">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#0E0E0E]">
        {title}
      </h2>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = false,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-shadow hover:shadow-md ${
        accent
          ? "border-[#C9A227]/30 bg-[#0E0E0E]"
          : "border-[#EDEAE4] bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            accent ? "bg-[#C9A227]" : "bg-[#F8F6F2]"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              accent ? "text-[#0E0E0E]" : "text-[#C9A227]"
            }`}
          />
        </div>

        <ArrowUpRight
          className={`h-4 w-4 ${
            accent ? "text-[#C9A227]" : "text-[#999]"
          }`}
        />
      </div>

      <div className="mt-5">
        <p
          className={`text-sm ${
            accent ? "text-white/60" : "text-[#777]"
          }`}
        >
          {title}
        </p>

        <p
          className={`mt-1 text-2xl font-semibold tracking-tight ${
            accent ? "text-white" : "text-[#0E0E0E]"
          }`}
        >
          {value}
        </p>

        {subtitle && (
          <p
            className={`mt-1 text-xs ${
              accent ? "text-white/45" : "text-[#999]"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// function StatusList({
//   data,
// }: {
//   data: Record<string, number>;
// }) {
//   const total = Object.values(data).reduce((sum, value) => sum + value, 0);

//   return (
//     <div className="space-y-4">
//       {Object.entries(data).map(([status, value]) => {
//         const percentage = total ? (value / total) * 100 : 0;

//         return (
//           <div key={status}>
//             <div className="mb-2 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span
//                   className="h-2 w-2 rounded-full"
//                   style={{
//                     backgroundColor: statusColor(status),
//                   }}
//                 />

//                 <span className="text-sm text-[#444]">
//                   {formatStatus(status)}
//                 </span>
//               </div>

//               <span className="text-sm font-semibold text-[#0E0E0E]">
//                 {value}
//               </span>
//             </div>

//             <div className="h-1.5 overflow-hidden rounded-full bg-[#F1F0ED]">
//               <div
//                 className="h-full rounded-full transition-all"
//                 style={{
//                   width: `${percentage}%`,
//                   backgroundColor: statusColor(status),
//                 }}
//               />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

export default function AnalyticsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();

    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const queryString = params.toString();

    return queryString
      ? `/api/admin/analytics?${queryString}`
      : "/api/admin/analytics";
  }, [from, to]);

  const { data, isLoading, isError } = useQuery<AnalyticsResponse>({
    queryKey: ["admin-analytics", from, to],
    queryFn: () => apiGet(query),
  });

  const analytics = data;


  // const cartChartData = analytics
  //   ? Object.entries(analytics.carts.byStatus).map(
  //       ([name, value]) => ({
  //         name: formatStatus(name),
  //         value,
  //       }),
  //     )
  //   : [];

  // const academyChartData = analytics
  //   ? Object.entries(analytics.academy.byExperienceLevel).map(
  //       ([name, value]) => ({
  //         name: formatStatus(name),
  //         value,
  //       }),
  //     )
  //   : [];

  const productChartData =
    analytics?.products.topProducts
      ?.slice(0, 6)
      .map((product) => ({
        name:
          product.name.length > 18
            ? `${product.name.slice(0, 18)}...`
            : product.name,
        views: product.views,
      })) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-[#EDEAE4]" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-[#F1F0ED]"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[380px] animate-pulse rounded-2xl bg-[#F1F0ED]" />
          <div className="h-[380px] animate-pulse rounded-2xl bg-[#F1F0ED]" />
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="flex min-h-[500px] items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F6F2]">
            <Activity className="h-5 w-5 text-[#C9A227]" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-[#0E0E0E]">
            Unable to load analytics
          </h2>

          <p className="mt-1 text-sm text-[#777]">
            Please try again in a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C9A227]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
               Analytics
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#0E0E0E]">
              Hello, Soibi
            </h1>

            <p className="mt-1 max-w-xl text-sm text-[#777]">
              A clear view of your catalogue, customer activity,
              quotes and submitted orders.
            </p>
          </div>

          {/* Date filters */}
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#666]">
                From
              </label>

              <input
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="h-10 rounded-xl border border-[#E4E1DA] bg-white px-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#666]">
                To
              </label>

              <input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="h-10 rounded-xl border border-[#E4E1DA] bg-white px-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            {(from || to) && (
              <button
                type="button"
                onClick={() => {
                  setFrom("");
                  setTo("");
                }}
                className="h-10 rounded-xl border border-[#E4E1DA] bg-white px-4 text-sm font-medium text-[#555] transition hover:border-[#C9A227] hover:text-[#0E0E0E]"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Primary metrics */}
        <section>
          <SectionHeader
            eyebrow="Overview"
            title="Business at a glance"
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Submitted Orders"
              value={formatNumber(analytics.carts.submitted)}
              subtitle={`${formatNumber(
                analytics.carts.total,
              )} total carts`}
              icon={ShoppingBag}
              accent
            />

            {/* <StatCard
              title="Order Value"
              value={formatCurrency(analytics.carts.totalValue)}
              subtitle="Submitted cart value"
              icon={Package}
            /> */}

        
            <StatCard
              title="Customers"
              value={formatNumber(analytics.users.total)}
              subtitle={`+${analytics.users.new} new`}
              icon={Users}
            />
          </div>
        </section>

        {/* Secondary metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Products"
            value={analytics.products.total}
            subtitle={`${analytics.products.published} published`}
            icon={Box}
          />

          <StatCard
            title="Product Views"
            value={formatNumber(analytics.products.totalViews)}
            subtitle="Tracked catalogue views"
            icon={Eye}
          />

          <StatCard
            title="Unread Contacts"
            value={analytics.contacts.unread}
            subtitle={`${analytics.contacts.total} total messages`}
            icon={MessageSquare}
          />

    
        </div>

        {/* Charts */}
     
        {/* Product performance */}
        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-[#EDEAE4] bg-white p-6">
            <SectionHeader
              eyebrow="Catalogue performance"
              title="Most viewed products"
            />

            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productChartData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="#EEECE7"
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#999", fontSize: 11 }}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#555", fontSize: 11 }}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Bar
                    dataKey="views"
                    fill={GOLD}
                    radius={[0, 6, 6, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product lifecycle */}
          <div className="rounded-2xl border border-[#EDEAE4] bg-white p-6">
            <SectionHeader
              eyebrow="Catalogue"
              title="Product lifecycle"
            />

            <div className="space-y-5">
              {[
                {
                  label: "Total products",
                  value: analytics.products.total,
                  icon: Box,
                },
                {
                  label: "Published",
                  value: analytics.products.published,
                  icon: CheckCircle2,
                },
                {
                  label: "Draft",
                  value: analytics.products.draft,
                  icon: Clock3,
                },
                {
                  label: "Featured",
                  value: analytics.products.featured,
                  icon: Sparkles,
                },
                {
                  label: "Hero products",
                  value: analytics.products.hero,
                  icon: Activity,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8F6F2]">
                      <Icon className="h-4 w-4 text-[#C9A227]" />
                    </div>

                    <span className="text-sm text-[#555]">
                      {label}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-[#0E0E0E]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Academy */}

        {/* Recent activity */}
     

        {/* Contacts */}
        <section className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <div className="rounded-2xl border border-[#EDEAE4] bg-[#0E0E0E] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A227]">
              <Bell className="h-5 w-5 text-[#0E0E0E]" />
            </div>

            <p className="mt-6 text-sm text-white/50">
              Unread enquiries
            </p>

            <p className="mt-1 text-4xl font-semibold text-white">
              {analytics.contacts.unread}
            </p>

            <p className="mt-2 text-sm text-white/45">
              {analytics.contacts.total} total contact submissions
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#EDEAE4] bg-white">
            <div className="border-b border-[#EDEAE4] px-6 py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#C9A227]" />

                <span className="text-sm font-semibold text-[#0E0E0E]">
                  Recent enquiries
                </span>
              </div>
            </div>

            <div className="divide-y divide-[#F0EEE9]">
              {analytics.contacts.recent.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F6F2] text-xs font-semibold text-[#555]">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="text-sm font-medium text-[#0E0E0E]">
                      {contact.name}
                    </span>
                  </div>

                  <span className="text-xs text-[#999]">
                    {formatDate(contact.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}