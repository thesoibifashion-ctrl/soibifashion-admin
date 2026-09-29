import { useState } from "react";
import {
  Mail,
  Phone,
  User,
  Package,
  CreditCard,
  Truck,
  MapPin,
  Check,
  Copy,
  ExternalLink,
  Ruler,
  StickyNote,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, getInitials } from "@/utils/formatDate";
import type { CartOrder } from "@/types";
import ImagePreview from "@/components/shared/ImagePreview";

const SUGGESTED_STATUSES = [
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

const PROGRESS_STEPS = ["confirmed", "processing", "shipped", "completed"];

const STATUS_STYLES: Record<string, { dot: string; badge: string }> = {
  pending: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmed: {
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  processing: {
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
  },
  shipped: {
    dot: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  completed: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
};

const getStatusStyle = (status?: string) =>
  STATUS_STYLES[status ?? ""] ?? {
    dot: "bg-[#A8A29E]",
    badge: "bg-[#F5F0EB] text-[#78716C] border-[#E7E2DC]",
  };

/**
 * Safely turns any loosely typed value into a renderable string (or null).
 * Prevents "Type 'unknown' is not assignable to type 'ReactNode'" errors.
 */
const asText = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
};

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    !(value instanceof Date)
  ) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateTime = (value: unknown) => {
  const date = toDate(value);
  if (!date) return "-";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatShortDate = (value: unknown) => {
  const date = toDate(value);
  if (!date) return "-";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
};

type HistoryEntry = {
  status?: string;
  note?: unknown;
  createdAt?: unknown;
};

const SectionTitle = ({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="mb-3 flex items-center gap-2">
    <Icon size={14} className="text-[#8B5E3C]" />
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78716C]">
      {children}
    </h3>
  </div>
);

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-2xl border border-[#E7E2DC] bg-white p-4 shadow-[0_1px_2px_rgba(28,25,23,0.04)]",
      className
    )}
  >
    {children}
  </div>
);

const CartOrderDrawer = ({
  order,
  onClose,
  onUpdate,
  isLoading,
}: {
  order: CartOrder;
  onClose: () => void;
  onUpdate: (order: CartOrder) => void;
  isLoading: boolean;
}) => {
  const [status, setStatus] = useState(order.status);
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    if (status === order.status) return;

    await onUpdate({
      ...order,
      status,
    });

    onClose();
  };

  /* ---------- Safe, renderable values ---------- */
  const customerName =
    asText(order.customerName) ?? asText(order.customer?.name);
  const displayName = customerName ?? "Guest Customer";
  const customerPhone =
    asText(order.customerPhone) ?? asText(order.customer?.phone);
  const customerEmail =
    asText(order.customerEmail) ?? asText(order.customer?.email);

  const orderNumber = asText(order.orderNumber);
  const receiptUrl = asText(order.receiptUrl);

  const address = asText(order.address);
  const cityState = [asText(order.city), asText(order.state)]
    .filter(Boolean)
    .join(", ");

  const trackingNumber = asText(order.shippingTrackingNumber);
  const trackingUrl = asText(order.shippingTrackingUrl);
  const shippingDetails = asText(order.shippingDetails);
  const hasShipping = Boolean(trackingNumber || trackingUrl || shippingDetails);

  const statusHistory: HistoryEntry[] = Array.isArray(order.statusHistory)
    ? (order.statusHistory as unknown as HistoryEntry[])
    : [];

  const handleCopyTracking = async () => {
    if (!trackingNumber) return;
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable, ignore
    }
  };

  const itemsTotal = order.items.reduce(
    (total, item) =>
      total + (item.unitPriceSnapshot ?? 0) * (item.quantity ?? 1),
    0
  );

  const isCancelled = order.status === "cancelled";
  const currentStepIndex = PROGRESS_STEPS.indexOf(order.status);
  const hasChanges = status !== order.status;
  const currentStyle = getStatusStyle(order.status);

  return (
    <div className="flex min-h-full flex-col bg-[#FAFAF8]">
      {/* Header */}
      <div className="border-b border-[#E7E2DC] bg-white px-6 pb-5 pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F0EB] ring-4 ring-[#F5F0EB]/60">
            {customerName ? (
              <span className="text-sm font-semibold text-[#8B5E3C]">
                {getInitials(customerName)}
              </span>
            ) : (
              <User size={18} className="text-[#8B5E3C]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 className="truncate text-lg font-semibold text-[#1C1917]">
                {displayName}
              </h2>

              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize",
                  currentStyle.badge
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", currentStyle.dot)}
                />
                {order.status}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {customerPhone && (
                <a
                  href={`tel:${customerPhone}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E2DC] bg-[#FAFAF8] px-2.5 py-1 text-xs text-[#57534E] transition-colors hover:border-[#8B5E3C]/40"
                >
                  <Phone size={11} className="text-[#8B5E3C]" />
                  {customerPhone}
                </a>
              )}

              {customerEmail && (
                <a
                  href={`mailto:${customerEmail}`}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E7E2DC] bg-[#FAFAF8] px-2.5 py-1 text-xs text-[#57534E] transition-colors hover:border-[#8B5E3C]/40"
                >
                  <Mail size={11} className="shrink-0 text-[#8B5E3C]" />
                  <span className="truncate">{customerEmail}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Quick facts */}
        <div className="mt-5 grid grid-cols-3 divide-x divide-[#E7E2DC] rounded-xl border border-[#E7E2DC] bg-[#FAFAF8]">
          <div className="px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-[#A8A29E]">
              Order
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-[#1C1917]">
              {orderNumber ? `#${orderNumber}` : "-"}
            </p>
          </div>

          <div className="px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-[#A8A29E]">
              Placed
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-[#1C1917]">
              {formatShortDate(order.createdAt)}
            </p>
          </div>

          <div className="px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-[#A8A29E]">
              Items
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[#1C1917]">
              {order.items.length}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-7 px-6 py-6">
        {/* Progress */}
        <div>
          <SectionTitle icon={Clock}>Progress</SectionTitle>

          {isCancelled ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              This order was cancelled.
            </div>
          ) : (
            <Card className="px-4 py-5">
              <div className="flex items-start">
                {PROGRESS_STEPS.map((step, index) => {
                  const done = index <= currentStepIndex;
                  const isLast = index === PROGRESS_STEPS.length - 1;

                  return (
                    <div
                      key={step}
                      className={cn("flex items-start", !isLast && "flex-1")}
                    >
                      <div className="flex w-14 flex-col items-center gap-1.5">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] transition-colors",
                            done
                              ? "border-[#8B5E3C] bg-[#8B5E3C] text-white"
                              : "border-[#E7E2DC] bg-white text-[#A8A29E]"
                          )}
                        >
                          {done ? <Check size={12} /> : index + 1}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-medium capitalize",
                            done ? "text-[#1C1917]" : "text-[#A8A29E]"
                          )}
                        >
                          {step}
                        </span>
                      </div>

                      {!isLast && (
                        <div
                          className={cn(
                            "mt-3 h-0.5 flex-1 rounded-full",
                            index < currentStepIndex
                              ? "bg-[#8B5E3C]"
                              : "bg-[#E7E2DC]"
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        {/* Items */}
        <div>
          <SectionTitle icon={Package}>Order Items</SectionTitle>

          <div className="space-y-3">
            {order.items.map((item, index) => {
              const imageUrl = asText(item.imageUrlSnapshot);
              const productName = asText(item.productNameSnapshot);
              const size = asText(item.selectedSize);
              const color = asText(item.selectedColor);
              const material = asText(item.selectedMaterial);
              const notes = asText(item.customNotes);

              const measurements: [string, unknown][] =
                item.customMeasurements &&
                typeof item.customMeasurements === "object"
                  ? Object.entries(
                      item.customMeasurements as Record<string, unknown>
                    )
                  : [];

              return (
                <Card key={item.productId ?? index}>
                  <div className="flex gap-3">
                    {imageUrl ? (
                      <ImagePreview src={imageUrl} />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#E7E2DC] bg-[#F5F0EB]">
                        <Package size={20} className="text-[#8B5E3C]" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug text-[#1C1917]">
                        {productName ?? "Product removed"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {size && (
                          <span className="rounded-md bg-[#F5F0EB] px-2 py-0.5 text-[11px] font-medium text-[#78716C]">
                            Size {size}
                          </span>
                        )}
                        {color && (
                          <span className="rounded-md bg-[#F5F0EB] px-2 py-0.5 text-[11px] font-medium text-[#78716C]">
                            {color}
                          </span>
                        )}
                        {material && (
                          <span className="rounded-md bg-[#F5F0EB] px-2 py-0.5 text-[11px] font-medium text-[#78716C]">
                            {material}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-[#1C1917]">
                        {formatPrice(item.unitPriceSnapshot ?? 0)}
                      </p>
                      <p className="mt-1 text-xs text-[#A8A29E]">
                        Qty {item.quantity ?? 1}
                      </p>
                    </div>
                  </div>

                  {notes && (
                    <div className="mt-4 flex gap-2.5 rounded-xl bg-[#FAFAF8] p-3">
                      <StickyNote
                        size={14}
                        className="mt-0.5 shrink-0 text-[#8B5E3C]"
                      />
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[#A8A29E]">
                          Custom notes
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[#44403C]">
                          {notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {measurements.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Ruler size={13} className="text-[#8B5E3C]" />
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[#A8A29E]">
                          Measurements
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {measurements.map(([key, value]) => (
                          <div
                            key={key}
                            className="rounded-lg border border-[#E7E2DC] bg-[#FAFAF8] px-2.5 py-2"
                          >
                            <p className="truncate text-[10px] capitalize text-[#A8A29E]">
                              {key.replace(/([A-Z])/g, " $1")}
                            </p>
                            <p className="mt-0.5 text-sm font-semibold text-[#1C1917]">
                              {String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Totals */}
            <Card className="space-y-2.5 bg-[#FAFAF8]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#78716C]">Subtotal</span>
                <span className="text-sm font-medium text-[#1C1917]">
                  {formatPrice(itemsTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-[#D6D0C9] pt-2.5">
                <span className="text-sm font-semibold text-[#1C1917]">
                  Order total
                </span>
                <span className="text-lg font-semibold text-[#1C1917]">
                  {formatPrice(order.totalSnapshot)}
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Payment */}
        <div>
          <SectionTitle icon={CreditCard}>Payment</SectionTitle>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F0EB]">
                  <CreditCard size={16} className="text-[#8B5E3C]" />
                </div>
                <div>
                  <p className="text-xs text-[#A8A29E]">Payment evidence</p>
                  <p className="text-sm font-medium text-[#44403C]">
                    {receiptUrl ? "Receipt uploaded" : "No receipt uploaded"}
                  </p>
                </div>
              </div>

              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                  receiptUrl
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                )}
              >
                {receiptUrl ? "Received" : "Missing"}
              </span>
            </div>

            {receiptUrl && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group mt-4 block overflow-hidden rounded-xl border border-[#E7E2DC] bg-[#FAFAF8]"
              >
                <img
                  src={receiptUrl}
                  alt="Payment receipt"
                  className="max-h-[320px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />

                <div className="flex items-center justify-center gap-1.5 border-t border-[#E7E2DC] bg-white px-4 py-2.5 text-xs font-medium text-[#8B5E3C]">
                  <ExternalLink size={12} />
                  Open / download receipt
                </div>
              </a>
            )}
          </Card>
        </div>

        {/* Delivery */}
        <div>
          <SectionTitle icon={MapPin}>Delivery Address</SectionTitle>

          <Card>
            {address ? (
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5F0EB]">
                  <MapPin size={16} className="text-[#8B5E3C]" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-[#1C1917]">
                    {address}
                  </p>
                  <p className="mt-1 text-xs text-[#78716C]">
                    {cityState || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#A8A29E]">
                No delivery address provided.
              </p>
            )}
          </Card>
        </div>

        {/* Shipping */}
        {hasShipping && (
          <div>
            <SectionTitle icon={Truck}>Shipping</SectionTitle>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5F0EB]">
                    <Truck size={16} className="text-[#8B5E3C]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#A8A29E]">Tracking number</p>
                    <p className="truncate text-sm font-medium text-[#44403C]">
                      {trackingNumber ?? "Not assigned"}
                    </p>
                  </div>
                </div>

                {trackingNumber && (
                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E7E2DC] px-2.5 text-xs font-medium text-[#78716C] transition-colors hover:border-[#8B5E3C]/40"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>

              {shippingDetails && (
                <p className="mt-4 rounded-xl bg-[#FAFAF8] p-3 text-sm leading-relaxed text-[#44403C]">
                  {shippingDetails}
                </p>
              )}

              {trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-[#E7E2DC] bg-[#FAFAF8] py-2.5 text-sm font-medium text-[#8B5E3C] transition-colors hover:bg-[#F5F0EB]"
                >
                  <ExternalLink size={13} />
                  Track shipment
                </a>
              )}
            </Card>
          </div>
        )}

        {/* Status History */}
        {statusHistory.length > 0 && (
          <div>
            <SectionTitle icon={Clock}>Status History</SectionTitle>

            <Card>
              <ol className="relative space-y-5">
                <span className="absolute bottom-2 left-[5px] top-2 w-px bg-[#E7E2DC]" />

                {[...statusHistory].reverse().map((history, index) => {
                  const note = asText(history.note);

                  return (
                    <li key={index} className="relative flex gap-4">
                      <span
                        className={cn(
                          "relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full ring-4 ring-white",
                          getStatusStyle(history.status).dot
                        )}
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-medium capitalize text-[#1C1917]">
                          {history.status}
                        </p>

                        {note && (
                          <p className="mt-0.5 text-xs leading-relaxed text-[#78716C]">
                            {note}
                          </p>
                        )}

                        <p className="mt-0.5 text-[11px] text-[#A8A29E]">
                          {formatDateTime(history.createdAt)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>
          </div>
        )}

        {/* Update status */}
        <div>
          <SectionTitle icon={Check}>Update Status</SectionTitle>

          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_STATUSES.map((s) => {
              const isCurrentStatus = order.status === s;
              const isSelected = status === s;
              const style = getStatusStyle(s);

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  disabled={isLoading}
                  className={cn(
                    "flex h-11 cursor-pointer items-center justify-between rounded-xl border px-3.5 text-sm font-medium capitalize transition-all",
                    isSelected
                      ? "border-[#18120E] bg-[#18120E] text-white shadow-sm"
                      : "border-[#E7E2DC] bg-white text-[#57534E] hover:border-[#8B5E3C]/40",
                    isLoading && "cursor-not-allowed opacity-60"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", style.dot)} />
                    {s}
                  </span>

                  {isCurrentStatus && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                        isSelected
                          ? "bg-white/15 text-white"
                          : "bg-[#F5F0EB] text-[#8B5E3C]"
                      )}
                    >
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 border-t border-[#E7E2DC] bg-white/95 px-6 py-4 backdrop-blur">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="text-[#A8A29E]">
            {hasChanges ? (
              <>
                Changing to{" "}
                <span className="font-semibold capitalize text-[#1C1917]">
                  {status}
                </span>
              </>
            ) : (
              "No changes to save"
            )}
          </span>

          <span className="font-semibold text-[#1C1917]">
            {formatPrice(order.totalSnapshot)}
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#8B5E3C] text-sm font-medium text-white transition-colors hover:bg-[#7A5235] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
};

export default CartOrderDrawer;