import type { GalleryImage } from "@/types";
import { apiDelete, apiGet, apiPost } from "../clients";

/*                                  PUBLIC                                    */

export const getGallery = () => {
  return apiGet<GalleryImage[]>("/api/gallery");
};

/*                                   ADMIN                                    */

export const createGallery = (payload: unknown) => {
  return apiPost("/api/admin/gallery", payload);
};

export const deleteGallery = (id: string) => {
  return apiDelete(`/api/admin/gallery/${id}`);
};




export const getAdminGallery = () => {
  return apiGet<GalleryImage[]>("/api/gallery");
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