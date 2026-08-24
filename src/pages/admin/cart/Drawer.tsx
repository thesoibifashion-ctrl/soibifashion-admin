import { useState } from "react";
import {
  Check,
  Mail,
  Phone,
  User,
  Package,
  CreditCard,
  Truck,
  DotIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/formatDate";
import { formatPrice, getInitials } from "@/utils/formatDate";
import type { CartOrder } from "@/types";
import ImagePreview from "@/components/shared/ImagePreview";

const SUGGESTED_STATUSES = [
  // "pending",
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

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

  const handleSave = async () => {
    if (status === order.status) return;

    await onUpdate({
      ...order,
      status,
    });

    onClose();
  };

  const itemsTotal = order.items.reduce(
    (total, item) =>
      total + (item.unitPriceSnapshot ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#E7E2DC]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#F5F0EB] flex items-center justify-center shrink-0">
            {order.customer ? (
              <span className="text-sm font-semibold text-[#8B5E3C]">
                {getInitials(order.customer.name)}
              </span>
            ) : (
              <User size={18} className="text-[#8B5E3C]" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[#1C1917]">
              {order.customerName ?? "Guest Customer"}
            </h2>

            <p className="text-xs flex items-centergap-1 text-[#A8A29E] mt-1 font-medium">
              {order.customerPhone} <DotIcon/> {order.customerEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Order Summary */}
        <div>
          <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-3">
            Order Details
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#FAFAF8] rounded-xl p-3 border border-[#E7E2DC]">
              <p className="text-xs text-[#A8A29E]">Order Number</p>
              <p className="text-sm font-medium text-[#1C1917] mt-1">
                {order.orderNumber}
              </p>
            </div>

            <div className="bg-[#FAFAF8] rounded-xl p-3 border border-[#E7E2DC]">
              <p className="text-xs text-[#A8A29E]">Status</p>
              <p className="text-sm font-medium text-[#1C1917] mt-1 capitalize">
                {order.status}
              </p>
            </div>

            <div className="bg-[#FAFAF8] rounded-xl p-3 border border-[#E7E2DC]">
              <p className="text-xs text-[#A8A29E]">Created</p>
              <p className="text-sm font-medium text-[#1C1917] mt-1">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="bg-[#FAFAF8] rounded-xl p-3 border border-[#E7E2DC]">
              <p className="text-xs text-[#A8A29E]">Items</p>
              <p className="text-sm font-medium text-[#1C1917] mt-1">
                {order.items.length}
              </p>
            </div>
          </div>
        </div>

        {/* Customer */}
        {order.customer && (
          <div>
            <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-3">
              Customer
            </p>

            <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#E7E2DC] space-y-3">
              <div className="flex items-center gap-3">
                <User size={15} className="text-[#8B5E3C]" />

                <div>
                  <p className="text-xs text-[#A8A29E]">Name</p>
                  <p className="text-sm font-medium text-[#1C1917]">
                    {order.customer.name}
                  </p>
                </div>
              </div>

              {order.customer.email && (
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-[#8B5E3C]" />

                  <div>
                    <p className="text-xs text-[#A8A29E]">Email</p>
                    <p className="text-sm text-[#44403C]">
                      {order.customer.email}
                    </p>
                  </div>
                </div>
              )}

              {order.customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-[#8B5E3C]" />

                  <div>
                    <p className="text-xs text-[#A8A29E]">Phone</p>
                    <p className="text-sm text-[#44403C]">
                      {order.customer.phone}
                    </p>
                  </div>
                </div>
              )}

              {order.customer.contactMethod && (
                <div className="pt-2 border-t border-[#E7E2DC]">
                  <p className="text-xs text-[#A8A29E]">Preferred contact</p>

                  <p className="text-sm font-medium text-[#44403C] capitalize">
                    {order.customer.contactMethod}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items */}
        <div>
          <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-3">
            Order Items
          </p>

          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={item.productId ?? index}
                className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#E7E2DC]"
              >
                <div className="flex gap-3">
                  {item.imageUrlSnapshot ? (
                    // <img
                    //   src={item.imageUrlSnapshot}
                    //   alt={item.productNameSnapshot ?? "Product"}
                    //   className="w-16 h-16 rounded-xl object-cover border border-[#E7E2DC] shrink-0"
                    // />
                    <ImagePreview src={item.imageUrlSnapshot}/>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#F5F0EB] border border-[#E7E2DC] flex items-center justify-center shrink-0">
                      <Package size={20} className="text-[#8B5E3C]" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-[#1C1917]">
                      {item.productNameSnapshot ?? "Product removed"}
                    </p>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-[#78716C]">
                      {item.selectedSize && (
                        <span>Size {item.selectedSize}</span>
                      )}

                      {item.selectedColor && (
                        <span>{item.selectedColor}</span>
                      )}

                      {item.selectedMaterial && (
                        <span>{item.selectedMaterial}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-[#1C1917]">
                      {formatPrice(item.unitPriceSnapshot ?? 0)}
                    </p>

                    <p className="text-xs text-[#A8A29E] mt-1">
                      Qty: {item.quantity ?? 1}
                    </p>
                  </div>
                </div>

                {item.customNotes && (
                  <div className="mt-3 pt-3 border-t border-[#E7E2DC]">
                    <p className="text-xs text-[#A8A29E] mb-1">
                      Custom Notes
                    </p>

                    <p className="text-sm text-[#44403C] leading-relaxed">
                      {item.customNotes}
                    </p>
                  </div>
                )}

                {item.customMeasurements &&
                  Object.keys(item.customMeasurements).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E7E2DC]">
                      <p className="text-xs text-[#A8A29E] mb-2">
                        Measurements
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(item.customMeasurements).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="bg-white rounded-lg px-3 py-2 border border-[#E7E2DC]"
                            >
                              <p className="text-[11px] text-[#A8A29E] capitalize">
                                {key.replace(/([A-Z])/g, " $1")}
                              </p>

                              <p className="text-sm font-medium text-[#1C1917] mt-0.5">
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

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm text-[#78716C]">Subtotal</span>

                <span className="text-sm font-semibold text-[#1C1917]">
                  {formatPrice(itemsTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between px-1 pt-3 border-t border-[#E7E2DC]">
                <span className="text-sm font-semibold text-[#1C1917]">
                  Order Total
                </span>

                <span className="text-base font-semibold text-[#1C1917]">
                  {formatPrice(order.totalSnapshot)}
                </span>
              </div>
            </div>
          </div>
        </div>

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
          {order.receiptUrl
            ? "Receipt uploaded"
            : "No receipt uploaded"}
        </p>
      </div>
    </div>

    {order.receiptUrl && (
      <div className="mt-4 border-t border-[#E7E2DC] pt-4">
        <p className="mb-3 text-xs text-[#A8A29E]">
          Receipt
        </p>

        <a
          href={order.receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="group block overflow-hidden rounded-xl border border-[#E7E2DC] bg-white"
        >
          <img
            src={order.receiptUrl}
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
    {order.address ? (
      <div className="space-y-3">
        <div>
          <p className="text-xs text-[#A8A29E]">Address</p>

          <p className="mt-1 text-sm leading-relaxed text-[#1C1917]">
            {order.address}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-[#E7E2DC] pt-3">
          <div>
            <p className="text-xs text-[#A8A29E]">City</p>

            <p className="mt-1 text-sm font-medium text-[#44403C]">
              {order.city ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#A8A29E]">State</p>

            <p className="mt-1 text-sm font-medium text-[#44403C]">
              {order.state ?? "-"}
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
        {(order.shippingTrackingNumber ||
          order.shippingTrackingUrl ||
          order.shippingDetails) && (
          <div>
            <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-3">
              Shipping
            </p>

            <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#E7E2DC]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F5F0EB] flex items-center justify-center">
                  <Truck size={16} className="text-[#8B5E3C]" />
                </div>

                <div>
                  <p className="text-xs text-[#A8A29E]">Tracking Number</p>

                  <p className="text-sm font-medium text-[#44403C]">
                    {order.shippingTrackingNumber ?? "Not assigned"}
                  </p>
                </div>
              </div>

              {/* {order.shippingDetails && (
                <div className="mt-3 pt-3 border-t border-[#E7E2DC]">
                  <p className="text-xs text-[#A8A29E]">
                    Shipping Details
                  </p>

                  <p className="text-sm text-[#44403C] mt-1 leading-relaxed">
                    {order.shippingDetails}
                  </p>
                </div>
              )} */}

              {order.shippingTrackingUrl && (
                <div className="mt-3 pt-3 border-t border-[#E7E2DC]">
                  <a
                    href={order.shippingTrackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#8B5E3C] font-medium hover:underline"
                  >
                    Track shipment
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status History */}
        {order.statusHistory?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-3">
              Status History
            </p>

            <div className="space-y-3">
              {[...order.statusHistory].reverse().map((history, index) => (
                <div
                  key={history.createdAt ?? index}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#F5F0EB] flex items-center justify-center shrink-0">
                    <Check size={11} className="text-[#8B5E3C]" />
                  </div>

                  <div>
                    <p className="text-sm text-[#1C1917] capitalize">
                      {history.status}
                    </p>

                    {history.note && (
                      <p className="text-xs text-[#78716C] mt-0.5">
                        {history.note}
                      </p>
                    )}

                    <p className="text-xs text-[#A8A29E] mt-0.5">
                      {formatDate(history.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div>
          <p className="text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-3">
            Update Status
          </p>

          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_STATUSES.map((s) => {
              const isCurrentStatus = order.status === s;
              const isSelected = status === s;

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  disabled={isLoading}
                  className={cn(
                    "h-10 rounded-xl text-sm font-medium border cursor-pointer capitalize transition-all flex items-center justify-center gap-2",
                    isSelected
                      ? "bg-[#18120E] text-white border-[#18120E]"
                      : "bg-white text-[#78716C] border-[#E7E2DC] hover:border-[#8B5E3C]/40",
                    isCurrentStatus &&
                      !isSelected &&
                      "ring-2 ring-[#8B5E3C]/20 border-[#8B5E3C]/50",
                    isLoading && "cursor-not-allowed opacity-60"
                  )}
                >
                  {isCurrentStatus && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}

                  {s}

                  {isCurrentStatus && (
                    <span className="text-[10px] opacity-70">
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
      <div className="sticky bottom-0 px-6 py-4 border-t border-[#E7E2DC] bg-white">
        <button
          onClick={handleSave}
          disabled={isLoading || status === order.status}
          className="w-full h-10 bg-[#8B5E3C] text-white rounded-xl font-medium text-sm hover:bg-[#7A5235] disabled:opacity-50 cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

export default CartOrderDrawer;