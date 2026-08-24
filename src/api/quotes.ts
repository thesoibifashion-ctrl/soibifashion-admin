import { apiGet, apiPatch, apiPost } from "./client";

/* -------------------------------------------------------------------------- */
/*                                  CUSTOMER                                  */
/* -------------------------------------------------------------------------- */

export const createQuote = (payload: unknown) => {
  return apiPost("/api/quotes", payload);
};

export const getMyQuotes = () => {
  return apiGet("/api/quotes/my");
};

export const getQuoteById = (id: string) => {
  return apiGet(`/api/quotes/${id}`);
};

export const updateQuote = (id: string, payload: unknown) => {
  return apiPatch(`/api/quotes/${id}`, payload);
};

export const uploadQuoteReceipt = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/quotes/${id}/receipt`, payload);
};

/* -------------------------------------------------------------------------- */
/*                                    ADMIN                                   */
/* -------------------------------------------------------------------------- */

export const getAdminQuotes = (params?: string) => {
  return apiGet(`/api/admin/quotes${params ? `?${params}` : ""}`);
};

export const getAdminQuote = (id: string) => {
  return apiGet(`/api/admin/quotes/${id}`);
};

export const updateQuoteStatus = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/admin/quotes/${id}/status`, payload);
};

export const updateQuotePayment = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/admin/quotes/${id}/payment`, payload);
};

export const updateQuoteFulfillment = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/admin/quotes/${id}/fulfillment`, payload);
};
