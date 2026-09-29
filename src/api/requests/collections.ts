import { apiDelete, apiGet, apiPatch, apiPost } from "../clients";

  export type CollectionStatus = "draft" | "published" | "archived";
  
  export interface Collection {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    imagePublicId: string | null;
    status: CollectionStatus;
    isFeatured: boolean;
    sortOrder: number;
    productCount:number
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateCollectionPayload {
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    status?: CollectionStatus;
    isFeatured?: boolean;
    sortOrder?: number;
  }
  
  export interface UpdateCollectionPayload {
    name?: string;
    slug?: string;
    description?: string | null;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    status?: CollectionStatus;
    isFeatured?: boolean;
    sortOrder?: number;
  }
  
  export const getAdminCollections = () =>
    apiGet<Collection[]>("/api/admin/collections");
  
  export const createCollection = (payload: CreateCollectionPayload) =>
    apiPost<Collection>("/api/admin/collections", payload);
  
  export const updateCollection = ({
    id,
    payload,
  }: {
    id: string;
    payload: Partial<CreateCollectionPayload>;
  }) => {
    return apiPatch<Collection>(
      `/api/admin/collections/${id}`,
      payload
    );
  };
  export const deleteCollection = (id: string) =>
    apiDelete(`/api/admin/collections/${id}`);