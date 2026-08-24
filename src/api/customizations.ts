import { apiDelete, apiGet, apiPatch, apiPost } from "./client";


export const getCustomizations = () => {
  return apiGet("/api/customizations");
};


export const getAdminCustomizations = () => {
  return apiGet("/api/admin/customizations");
};


export const createCustomizationCategory = (payload: unknown) => {
  return apiPost("/api/admin/customizations/categories", payload);
};

export const updateCustomizationCategory = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/admin/customizations/categories/${id}`, payload);
};

export const deleteCustomizationCategory = (id: string) => {
  return apiDelete(`/api/admin/customizations/categories/${id}`);
};


export const createCustomizationOption = (payload: unknown) => {
  return apiPost("/api/admin/customizations/options", payload);
};

export const updateCustomizationOption = (
  id: string,
  payload: unknown
) => {
  return apiPatch(`/api/admin/customizations/options/${id}`, payload);
};

export const deleteCustomizationOption = (id: string) => {
  return apiDelete(`/api/admin/customizations/options/${id}`);
};


export const getAdminCarousel = () => {
  return apiGet("/api/admin/home/carousel");
};

export const createCarousel = (data: {
  imageUrl: string;
  imagePublicId?: string;
  sortOrder?: number;
  isActive?: boolean;
}) => {
  return apiPost("/api/admin/home/carousel", data);
};

export const updateCarousel = (
  id: string,
  data: {
    imageUrl?: string;
    imagePublicId?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
) => {
  return apiPatch(`/api/admin/home/carousel/${id}`, data);
};

export const deleteCarousel = (id: string) => {
  return apiDelete(`/api/admin/home/carousel/${id}`);
};