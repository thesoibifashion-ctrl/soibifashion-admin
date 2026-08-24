import { useEffect, useState } from "react";
import {
  Check,
  Mail,
  Phone,
  User,
  Package,
  CreditCard,
  Truck,
  Loader2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/ui/drawer";
import { formatDate } from "@/lib/utils/formatDate";
import { formatPrice, getInitials } from "@/utils/formatDate";
import type { Quote, QuoteStatus } from "@/types";
import { updateQuoteStatus } from "@/api/quotes";
import { apiGet } from "@/api/client";
import ImagePreview from "@/components/shared/ImagePreview";
import { toast } from "sonner";

function getStatusClass(status: QuoteStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-500";
    case "reviewing":
      return "bg-blue-500";
    case "approved":
      return "bg-emerald-500";
    case "completed":
      return "bg-[#8B5E3C]";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function QuoteDrawer({
  quote,
  onClose,
  onUpdate,
}: {
  quote: Quote;
  onClose: () => void;
  onUpdate: (q: Quote) => void;
}) {
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [notes, setNotes] = useState(quote.adminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  /*
   * The quote returned by the list endpoint does not contain items.
   * Fetch the complete quote using:
   * GET /api/admin/quotes/:id
   */
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-quotes", quote.id],
    queryFn: () => apiGet(`/api/admin/quotes/${quote.id}`),
    enabled: Boolean(quote.id),
  });

  const fullQuote: Quote = response?.data ?? response ?? quote;

  useEffect(() => {
    setStatus(fullQuote.status);
    setNotes(fullQuote.adminNotes ?? "");
  }, [fullQuote.status, fullQuote.adminNotes]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await updateQuoteStatus(fullQuote.id, {
        status,
      });

      const updatedQuote = response?.data ?? response;

      onUpdate({
        ...fullQuote,
        ...updatedQuote,
        status,
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-quotes"],
      });

      toast.success("Quote updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to update quote:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer>
      <div className="flex h-full flex-col bg-white">
        {/* Header */}
        <div className="border-b border-[#E7E2DC] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F0EB] text-sm font-semibold text-[#8B5E3C]">
              {getInitials(fullQuote.customerName)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#1C1917]">
                    {fullQuote.customerName}
                  </h2>

                  <p className="mt-0.5 text-sm text-[#78716C]">
                    {fullQuote.customerEmail}
                  </p>
                </div>

                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize text-white",
                    getStatusClass(status)
                  )}
                >
                  {status}
                </span>
              </div>

              <p className="mt-2 text-xs font-medium text-[#A8A29E]">
                {fullQuote.referenceNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-[#78716C]">
                <Loader2 size={18} className="animate-spin text-[#8B5E3C]" />
                Loading quote details...
              </div>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">
                Failed to load quote details.
              </p>

              <p className="mt-1 text-xs text-red-500">
                Please close this drawer and try again.
              </p>
            </div>
          ) : (
            <>
              {/* Customer */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                  Customer
                </p>

                <div className="space-y-3 rounded-2xl border border-[#E7E2DC] bg-[#FAFAF8] p-4">
                  <div className="flex items-center gap-3">
                    <User size={15} className="text-[#8B5E3C]" />

                    <div>
                      <p className="text-xs text-[#A8A29E]">Name</p>

                      <p className="text-sm font-medium text-[#1C1917]">
                        {fullQuote.customerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={15} className="text-[#8B5E3C]" />

                    <div>
                      <p className="text-xs text-[#A8A29E]">Email</p>

                      <p className="text-sm text-[#44403C]">
                        {fullQuote.customerEmail}
                      </p>
                    </div>
                  </div>

                  {fullQuote.customerPhone && (
                    <div className="flex items-center gap-3">
                      <Phone size={15} className="text-[#8B5E3C]" />

                      <div>
                        <p className="text-xs text-[#A8A29E]">Phone</p>

                        <p className="text-sm text-[#44403C]">
                          {fullQuote.customerPhone}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-[#E7E2DC] pt-2">
                    <p className="text-xs text-[#A8A29E]">Preferred contact</p>

                    <p className="text-sm font-medium capitalize text-[#44403C]">
                      {fullQuote.contactMethod ?? "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote Details */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                  Quote Details
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-[#E7E2DC] bg-[#FAFAF8] p-3">
                    <p className="text-xs text-[#A8A29E]">Reference</p>

                    <p className="mt-1 text-sm font-medium text-[#1C1917]">
                      {fullQuote.referenceNumber}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E7E2DC] bg-[#FAFAF8] p-3">
                    <p className="text-xs text-[#A8A29E]">Customer Status</p>

                    <p className="mt-1 text-sm font-medium capitalize text-[#1C1917]">
                      {fullQuote.customerStatus ?? "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E7E2DC] bg-[#FAFAF8] p-3">
                    <p className="text-xs text-[#A8A29E]">Created</p>

                    <p className="mt-1 text-sm font-medium text-[#1C1917]">
                      {formatDate(fullQuote.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E7E2DC] bg-[#FAFAF8] p-3">
                    <p className="text-xs text-[#A8A29E]">Submitted</p>

                    <p className="mt-1 text-sm font-medium text-[#1C1917]">
                      {formatDate(fullQuote.submittedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                  Requested Items
                </p>

                {fullQuote.items && fullQuote.items.length > 0 ? (
                  <div className="space-y-3">
                    {fullQuote.items.map((item, index) => (
                      <div
                        key={item.id ?? index}
                        className="rounded-2xl border border-[#E7E2DC] bg-[#FAFAF8] p-4"
                      >
                        <div className="flex gap-3">
                          {item.imageUrlSnapshot ? (
                            <ImagePreview src={item.imageUrlSnapshot} />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#E7E2DC] bg-[#F5F0EB]">
                              <Package size={20} className="text-[#8B5E3C]" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#1C1917]">
                              {item.productNameSnapshot ??
                                item.shoeNameSnapshot ??
                                "Custom Item"}
                            </p>

                            {item.variantLabelSnapshot && (
                              <p className="mt-1 text-xs text-[#78716C]">
                                {item.variantLabelSnapshot}
                              </p>
                            )}

                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#78716C]">
                              {item.size && <span>Size {item.size}</span>}

                              {item.colorNameSnapshot && (
                                <span>{item.colorNameSnapshot}</span>
                              )}

                              {item.materialNameSnapshot && (
                                <span>{item.materialNameSnapshot}</span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold text-[#1C1917]">
                              {formatPrice(item.unitPriceSnapshot)}
                            </p>

                            <p className="mt-1 text-xs text-[#A8A29E]">
                              Qty: {item.quantity ?? 1}
                            </p>
                          </div>
                        </div>

                        {item.customNotes && (
                          <div className="mt-3 border-t border-[#E7E2DC] pt-3">
                            <p className="mb-1 text-xs text-[#A8A29E]">
                              Custom Notes
                            </p>

                            <p className="text-sm leading-relaxed text-[#44403C]">
                              {item.customNotes}
                            </p>
                          </div>
                        )}

                        {item.customMeasurements &&
                          Object.keys(item.customMeasurements).length > 0 && (
                            <div className="mt-3 border-t border-[#E7E2DC] pt-3">
                              <p className="mb-2 text-xs text-[#A8A29E]">
                                Measurements
                              </p>

                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(item.customMeasurements).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="rounded-lg border border-[#E7E2DC] bg-white px-3 py-2"
                                    >
                                      <p className="text-[11px] capitalize text-[#A8A29E]">
                                        {key.replace(/([A-Z])/g, " $1")}
                                      </p>

                                      <p className="mt-0.5 text-sm font-medium text-[#1C1917]">
                                        {String(value)}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#E7E2DC] bg-[#FAFAF8] p-6 text-center">
                    <Package size={22} className="mx-auto text-[#A8A29E]" />

                    <p className="mt-2 text-sm font-medium text-[#44403C]">
                      No items in this quote
                    </p>

                    <p className="mt-1 text-xs text-[#A8A29E]">
                      This quote was submitted without any item details.
                    </p>
                  </div>
                )}
              </div>

              {/* Customer Notes */}
              {fullQuote.customerNotes && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                    Customer Notes
                  </p>

                  <div className="rounded-xl border border-[#E7E2DC] bg-[#FAFAF8] p-4 text-sm leading-relaxed text-[#44403C]">
                    {fullQuote.customerNotes}
                  </div>
                </div>
              )}

              {/* Payment */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                  Payment
                </p>

                <div className="rounded-2xl border border-[#E7E2DC] bg-[#FAFAF8] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F0EB]">
                      <CreditCard size={16} className="text-[#8B5E3C]" />
                    </div>

                    <div>
                      <p className="text-xs text-[#A8A29E]">Payment Evidence</p>

                      <p className="text-sm font-medium text-[#44403C]">
                        {fullQuote.receiptUrl
                          ? "Receipt uploaded"
                          : "No receipt uploaded"}
                      </p>
                    </div>
                  </div>

                  {fullQuote.receiptUrl && (
                    <div className="mt-4 border-t border-[#E7E2DC] pt-4">
                      <p className="mb-3 text-xs text-[#A8A29E]">Receipt</p>

                      <a
                        href={fullQuote.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="group block overflow-hidden rounded-xl border border-[#E7E2DC] bg-white"
                      >
                        <img
                          src={fullQuote.receiptUrl}
                          alt="Payment receipt"
                          className="max-h-[350px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        />

                        <div className="border-t border-[#E7E2DC] px-4 py-3">
                          <p className="text-xs font-medium text-[#8B5E3C]">
                            Open / Download Receipt
                          </p>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                  Delivery Address
                </p>

                <div className="rounded-2xl border border-[#E7E2DC] bg-[#FAFAF8] p-4">
                  {fullQuote.address ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#A8A29E]">Address</p>

                        <p className="mt-1 text-sm leading-relaxed text-[#1C1917]">
                          {fullQuote.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-[#E7E2DC] pt-3">
                        <div>
                          <p className="text-xs text-[#A8A29E]">City</p>

                          <p className="mt-1 text-sm font-medium text-[#44403C]">
                            {fullQuote.city ?? "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[#A8A29E]">State</p>

                          <p className="mt-1 text-sm font-medium text-[#44403C]">
                            {fullQuote.state ?? "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#A8A29E]">
                      No delivery address provided.
                    </p>
                  )}
                </div>
              </div>
              {/* Shipping */}
              {(fullQuote.shippingDetails ||
                fullQuote.shippingTrackingNumber ||
                fullQuote.shippingTrackingUrl) && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                    Shipping
                  </p>

                  <div className="rounded-2xl border border-[#E7E2DC] bg-[#FAFAF8] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F0EB]">
                        <Truck size={16} className="text-[#8B5E3C]" />
                      </div>

                      <div>
                        <p className="text-xs text-[#A8A29E]">
                          Tracking Number
                        </p>

                        <p className="text-sm font-medium text-[#44403C]">
                          {fullQuote.shippingTrackingNumber ?? "Not assigned"}
                        </p>
                      </div>
                    </div>

                    {fullQuote.shippingDetails && (
                      <p className="mt-3 border-t border-[#E7E2DC] pt-3 text-sm text-[#44403C]">
                        {fullQuote.shippingDetails}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                  Timeline
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5F0EB]">
                      <Check size={11} className="text-[#8B5E3C]" />
                    </div>

                    <div>
                      <p className="text-sm text-[#1C1917]">Quote created</p>

                      <p className="text-xs text-[#78716C]">
                        {formatDate(fullQuote.createdAt)}
                      </p>
                    </div>
                  </div>

                  {fullQuote.reviewedAt && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5F0EB]">
                        <Check size={11} className="text-[#8B5E3C]" />
                      </div>

                      <div>
                        <p className="text-sm text-[#1C1917]">Quote reviewed</p>

                        <p className="text-xs text-[#78716C]">
                          {formatDate(fullQuote.reviewedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {fullQuote.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5F0EB]">
                        <Check size={11} className="text-[#8B5E3C]" />
                      </div>

                      <div>
                        <p className="text-sm text-[#1C1917]">
                          Quote completed
                        </p>

                        <p className="text-xs text-[#78716C]">
                          {formatDate(fullQuote.completedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                  Admin Notes
                </p>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes…"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#E7E2DC] bg-white px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#8B5E3C] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
                />
              </div>

              {/* Status */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#78716C]">
                  Update Status
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      "pending",
                      "reviewing",
                      "approved",
                      "completed",
                      "cancelled",
                    ] as QuoteStatus[]
                  ).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={cn(
                        "h-10 cursor-pointer rounded-xl border text-sm font-medium capitalize transition-all",
                        status === s
                          ? `border-transparent text-white ${getStatusClass(s)}`
                          : "border-[#E7E2DC] bg-white text-[#78716C] hover:border-[#8B5E3C]/40"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-[#E7E2DC] bg-white px-6 py-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || isLoading || isError}
            className="h-10 w-full cursor-pointer rounded-xl bg-[#8B5E3C] text-sm font-medium text-white transition-colors hover:bg-[#7A5235] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </Drawer>
  );
}

export default QuoteDrawer;
