import { apiDelete, apiGet, apiPatch, apiPost } from "./client";

/*                                  PUBLIC                                    */

export const getProducts = () => {
  return apiGet("/api/admin/products");
};

export const getFilteredProducts = (query: string) => {
  return apiGet(`/api/products?${query}`);
};

/*                                  ADMIN                                    */


export const createProduct = (payload: unknown) => {
  return apiPost("/api/admin/products", payload);
};

export const updateProduct = (id: string, payload: unknown) => {
  return apiPatch(`/api/admin/products/${id}`, payload);
};

export const deleteProduct = (id: string) => {
  return apiDelete(`/api/admin/products/${id}`);
};
export const getAdminProducts = () => {
  return apiGet("/api/admin/products");
};

export const addProductImage = (
  productId: string,
  payload: unknown
) => {
  return apiPost(`/api/admin/products/${productId}/images`, payload);
};

export const deleteProductImage = (
  productId: string,
  imageId: string
) => {
  return apiDelete(
    `/api/admin/products/${productId}/images/${imageId}`
  );
};


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


export const createProductVariant = (
  productId: string,
  payload: unknown
) => {
  return apiPost(
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