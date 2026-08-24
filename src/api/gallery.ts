import { apiDelete, apiGet, apiPost } from "./client";

/*                                  PUBLIC                                    */

export const getGallery = () => {
  return apiGet("/api/gallery");
};

/*                                   ADMIN                                    */

export const createGallery = (payload: unknown) => {
  return apiPost("/api/admin/gallery", payload);
};

export const deleteGallery = (id: string) => {
  return apiDelete(`/api/admin/gallery/${id}`);
};




export const getAdminGallery = () => {
  return apiGet("/api/gallery");
};

export const createGalleryImage = (payload: {
  title: string;
  imageUrl: string;
  imagePublicId: string;
  category: "workshop" | "craftsmanship" | "completed_work";
  sortOrder: number;
  isPublished: boolean;
}) => {
  return apiPost("/api/admin/gallery", payload);
};

export const deleteGalleryImage = (id: string) => {
  return apiDelete(`/api/admin/gallery/${id}`);
};