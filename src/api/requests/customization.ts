import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "../clients";

export type CustomizationStatus = "active" | "inactive";

export interface CustomizationOption {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  description: string | null;
  status: CustomizationStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomizationCategory {
  id: string;
  name: string;
  slug: string;
  status: CustomizationStatus;
  sortOrder: number;
  options: CustomizationOption[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomizationCategoryPayload {
  name: string;
  slug: string;
  status?: CustomizationStatus;
  sortOrder?: number;
}

export interface UpdateCustomizationCategoryPayload {
  name?: string;
  slug?: string;
  status?: CustomizationStatus;
  sortOrder?: number;
}

export interface CreateCustomizationOptionPayload {
  categoryId?: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  description?: string | null;
  status?: CustomizationStatus;
  sortOrder?: number;
}

export interface UpdateCustomizationOptionPayload {
  categoryId?:string,
  name?: string;
  slug?: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  description?: string | null;
  status?: CustomizationStatus;
  sortOrder?: number;
}

/* -------------------------------- */
/* Categories                       */
/* -------------------------------- */

export const getCustomizations = () =>
  apiGet<CustomizationCategory[]>("/api/customizations");

export const getAdminCustomizations = () =>
  apiGet<CustomizationCategory[]>("/api/admin/customizations");

export const createCustomizationCategory = (
  payload: CreateCustomizationCategoryPayload
) =>
  apiPost<CustomizationCategory>(
    "/api/admin/customizations/categories",
    payload
  );

export const updateCustomizationCategory = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCustomizationCategoryPayload;
}) =>
  apiPatch<CustomizationCategory>(
    `/api/admin/customizations/categories/${id}`,
    payload
  );

export const deleteCustomizationCategory = (id: string) =>
  apiDelete(`/api/admin/customizations/categories/${id}`);

/* -------------------------------- */
/* Options                          */
/* -------------------------------- */

export const createCustomizationOption = (
  payload: CreateCustomizationOptionPayload
) =>
  apiPost<CustomizationOption>(
    "/api/admin/customizations/options",
    payload
  );

export const updateCustomizationOption = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCustomizationOptionPayload;
}) =>
  apiPatch<CustomizationOption>(
    `/api/admin/customizations/options/${id}`,
    payload
  );

export const deleteCustomizationOption = (id: string) =>
  apiDelete(`/api/admin/customizations/options/${id}`);