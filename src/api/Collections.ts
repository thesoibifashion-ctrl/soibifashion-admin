import { apiDelete, apiGet, apiPatch, apiPost } from "./client";


export const getCollections = () => {
  return apiGet("/api/admin/collections");
};

export const getCollectionBySlug = (slug: string) => {
  return apiGet(`/api/collections/${slug}`);
};

export const getAdminCollections = () => {
  return apiGet("/api/admin/collections");
};

export const createCollection = (payload: unknown) => {
  return apiPost("/api/admin/collections", payload);
};

export const updateCollection = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/admin/collections/${id}`, payload);
};

export const deleteCollection = (id: string) => {
  return apiDelete(`/api/admin/collections/${id}`);
};