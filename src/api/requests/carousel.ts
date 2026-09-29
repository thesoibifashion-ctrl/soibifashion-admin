import { apiDelete, apiGet, apiPatch, apiPost } from "../clients";

export interface Carousel {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarouselPayload {
  imageUrl: string;
  imagePublicId: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCarouselPayload {
  imageUrl?: string;
  imagePublicId?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const getCarousel = () =>
  apiGet<Carousel[]>("/api/home/carousel");

export const getAdminCarousel = () =>
  apiGet<Carousel[]>("/api/admin/home/carousel");

export const createCarousel = (payload: CreateCarouselPayload) =>
  apiPost<Carousel>("/api/admin/home/carousel", payload);

export const updateCarousel = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCarouselPayload;
}) => {
  return apiPatch<Carousel>(
    `/api/admin/home/carousel/${id}`,
    payload
  );
};

export const deleteCarousel = (id: string) =>
  apiDelete(`/api/admin/home/carousel/${id}`);