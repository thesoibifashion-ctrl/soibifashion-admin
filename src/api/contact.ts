import { apiGet, apiPatch, apiPost } from "./client";

export const submitContact = (payload: unknown) => {
  return apiPost("/api/contact", payload);
};

export const getAdminContacts = () => {
  return apiGet("/api/admin/contact");
};

export const getAdminContact = (id: string) => {
  return apiGet(`/api/admin/contact/${id}`);
};

export const getAdminAcademy = () => {
  return apiGet("/api/admin/academy/applications");
};

export const markContactAsRead = (id: string) => {
  return apiPatch(`/api/admin/contact/${id}/is-read`, {
    isRead: true,
  });
};

export const markAcademyAsRead = (id: string) => {
  return apiPatch(`/api/admin/academy/applications/${id}/is-read`, {
    isRead: true,
  });
};