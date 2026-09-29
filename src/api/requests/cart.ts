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