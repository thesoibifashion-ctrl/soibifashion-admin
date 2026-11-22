import type { CartOrder } from "@/types";
import { apiGet, apiPatch } from "../clients";


export const getAdminCartOrders = (query?: string) => {
  return apiGet<CartOrder[]>(`/api/admin/cart/history${query ? `?${query}` : ""}`);
};

export const getAdminCartOrderById = (id: string) => {
  return apiGet<CartOrder>(`/api/admin/cart/history/${id}`);
};

export const updateAdminCartOrderStatus = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/admin/cart/history/${id}/status`, payload);
};

export const updateAdminCartOrderPayment = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/admin/cart/history/${id}/payment`, payload);
};

export const updateAdminCartOrderFulfillment = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/admin/cart/history/${id}/fulfillment`, payload);
};
export type AdminPaymentStatus =
  | "unpaid"
  | "pending_approval"
  | "paid"
  | "rejected";

export const updateAdminCartOrderPaymentStatus = (
  id: string,
  paymentStatus: AdminPaymentStatus
) => {
  return apiPatch(`/api/admin/cart/history/${id}/payment`, { paymentStatus });
};

export const approveAdminCartOrderPayment = (id: string) =>
  updateAdminCartOrderPaymentStatus(id, "paid");

export const rejectAdminCartOrderPayment = (id: string) =>
  updateAdminCartOrderPaymentStatus(id, "rejected");