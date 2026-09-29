import type {
  Currency,
  Measurement,
  Product,
  ProductMeasurement,
  ProductPrice,
  ProductPriceResponse,
  ProductVariant,
} from "@/types";

import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from "../clients";

/*                                  PUBLIC                                    */

export const getProducts = () => {
  return apiGet<Product[]>("/api/admin/products");
};

export const getFilteredProducts = (query: string) => {
  return apiGet(`/api/products?${query}`);
};

/*                                  ADMIN                                    */
export const getAdminProducts = () => {
  return apiGet<Product[]>("/api/admin/products");
};
/* ----------------------------- PRODUCTS ----------------------------- */

export const createProduct = (payload: unknown) => {
  return apiPost("/api/admin/products", payload);
};

export const updateProduct = (id: string, payload: unknown) => {
  return apiPatch(`/api/admin/products/${id}`, payload);
};

export const deleteProduct = (id: string) => {
  return apiDelete(`/api/admin/products/${id}`);
};

export const getAdminCollections = () => {
  return apiGet<Product[]>("/api/admin/products");
};

/* ----------------------------- IMAGES ----------------------------- */

export const addProductImage = (
  productId: string,
  payload: unknown
) => {
  return apiPost(
    `/api/admin/products/${productId}/images`,
    payload
  );
};

export const updateProductImage = (
  productId: string,
  imageId: string,
  payload: unknown
) => {
  return apiPatch(
    `/api/admin/products/${productId}/images/${imageId}`,
    payload
  );
};

export const deleteProductImage = (
  productId: string,
  imageId: string
) => {
  return apiDelete(
    `/api/admin/products/${productId}/images/${imageId}`
  );
};

/* ----------------------------- COLLECTIONS ----------------------------- */

export const assignProductToCollection = (
  productId: string,
  payload: unknown
) => {
  return apiPost(
    `/api/admin/products/${productId}/collections`,
    payload
  );
};

export const removeProductFromCollection = (
  productId: string,
  collectionId: string
) => {
  return apiDelete(
    `/api/admin/products/${productId}/collections/${collectionId}`
  );
};

/* ----------------------------- VARIANTS ----------------------------- */

export const createProductVariant = (
  productId: string,
  payload: unknown
) => {
  return apiPost<ProductVariant>(
    `/api/admin/products/${productId}/variants`,
    payload
  );
};

export const updateProductVariant = (
  productId: string,
  variantId: string,
  payload: unknown
) => {
  return apiPatch(
    `/api/admin/products/${productId}/variants/${variantId}`,
    payload
  );
};

export const deleteProductVariant = (
  productId: string,
  variantId: string
) => {
  return apiDelete(
    `/api/admin/products/${productId}/variants/${variantId}`
  );
};

/* ----------------------------- PRICING ----------------------------- */

export const getAdminCurrencies = () => {
  return apiGet<Currency[]>("/api/admin/currencies");
};

export const getProductPrices = (productId: string) => {
  return apiGet<ProductPriceResponse[]>(
    `/api/admin/products/${productId}/prices`
  );
};

export const replaceProductPrices = (
  productId: string,
  prices: ProductPrice[]
) => {
  return apiPut(
    `/api/admin/products/${productId}/prices`,
    { prices }
  );
};

export const addProductPrice = (
  productId: string,
  payload: ProductPrice
) => {
  return apiPost<ProductPriceResponse>(
    `/api/admin/products/${productId}/prices`,
    payload
  );
};

export const updateProductPrice = (
  productId: string,
  currencyId: string,
  amount: number
) => {
  return apiPatch<ProductPriceResponse>(
    `/api/admin/products/${productId}/prices/${currencyId}`,
    { amount }
  );
};

export const deleteProductPrice = (
  productId: string,
  currencyId: string
) => {
  return apiDelete(
    `/api/admin/products/${productId}/prices/${currencyId}`
  );
};

/* ----------------------------- CURRENCIES ----------------------------- */

export const createCurrency = (payload: {
  code: string;
  name: string;
  symbol: string;
}) => {
  return apiPost<Currency>(
    "/api/admin/currencies",
    payload
  );
};

export const updateCurrency = (
  currencyId: string,
  payload: Partial<Currency>
) => {
  return apiPatch<Currency>(
    `/api/admin/currencies/${currencyId}`,
    payload
  );
};

export const deleteCurrency = (currencyId: string) => {
  return apiDelete(
    `/api/admin/currencies/${currencyId}`
  );
};

/* ----------------------------- MEASUREMENTS ----------------------------- */

/*
 * Reusable measurement definitions
 * Example:
 * Chest
 * Waist
 * Sleeve Length
 */

export const getMeasurements = () => {
  return apiGet<Measurement[]>(
    "/api/admin/measurements"
  );
};

export const createMeasurement = (payload: {
  title: string;
  imageUrl: string;
}) => {
  return apiPost<Measurement>(
    "/api/admin/measurements",
    payload
  );
};

export const updateMeasurement = (
  measurementId: string,
  payload: {
    title?: string;
    imageUrl?: string;
  }
) => {
  return apiPatch<Measurement>(
    `/api/admin/measurements/${measurementId}`,
    payload
  );
};

export const deleteMeasurement = (
  measurementId: string
) => {
  return apiDelete(
    `/api/admin/measurements/${measurementId}`
  );
};

/* ------------------------- PRODUCT MEASUREMENTS ------------------------- */

/*
 * Measurements assigned to a specific product.
 *
 * Example:
 * Chest -> 42 inches
 * Waist -> 36 inches
 */

export const getProductMeasurements = (
  productId: string
) => {
  return apiGet<ProductMeasurement[]>(
    `/api/admin/products/${productId}/measurements`
  );
};

export const addProductMeasurement = (
  productId: string,
  payload: {
    measurementId: string;
    value: string;
    sortOrder: number;
  }
) => {
  return apiPost<ProductMeasurement>(
    `/api/admin/products/${productId}/measurements`,
    payload
  );
};

export const updateProductMeasurement = (
  productId: string,
  measurementId: string,
  payload: {
    value?: string;
    sortOrder?: number;
  }
) => {
  return apiPatch<ProductMeasurement>(
    `/api/admin/products/${productId}/measurements/${measurementId}`,
    payload
  );
};

export const deleteProductMeasurement = (
  productId: string,
  measurementId: string
) => {
  return apiDelete(
    `/api/admin/products/${productId}/measurements/${measurementId}`
  );
};