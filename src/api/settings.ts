import { apiGet, apiPatch } from "./client";


export const getAdminSettings = () => {
  return apiGet("/api/admin/settings");
};

export const updateAdminSetting = (
  key: string,
  payload: {
    value?: string | boolean | null;
    valueJson?: unknown;
  }
) => {
  return apiPatch(`/api/admin/settings/${key}`, payload);
};