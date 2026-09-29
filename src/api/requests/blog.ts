import { apiGet, apiPost, apiPatch, apiDelete } from "../clients";

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  status?: BlogStatus;
}

export interface UpdateBlogPostPayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  status?: BlogStatus;
}
export const getBlogPosts = () => {
  return apiGet<BlogPost[]>("/api/admin/blog");
};

export const getBlogPost = (id: string) => {
  return apiGet<BlogPost>(`/api/admin/blog/${id}`);
};

export const createBlogPost = (payload: CreateBlogPostPayload) => {
  return apiPost("/api/admin/blog", payload);
};

export const updateBlogPost = (
  id: string,
  payload: UpdateBlogPostPayload,
) => {
  return apiPatch(`/api/admin/blog/${id}`, payload);
};

export const deleteBlogPost = (id: string) => {
  return apiDelete(`/api/admin/blog/${id}`);
};