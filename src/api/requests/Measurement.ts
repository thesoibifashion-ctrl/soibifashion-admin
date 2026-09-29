import { apiDelete, apiGet, apiPatch, apiPost } from "../clients";

export interface Measurement {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeasurementPayload {
  title: string;
  imageUrl: string;
}

export interface UpdateMeasurementPayload {
  title?: string;
  imageUrl?: string;
}

export const getAdminMeasurements = () =>
  apiGet<Measurement[]>("/api/admin/measurements");

export const createMeasurement = (payload: CreateMeasurementPayload) =>
  apiPost<Measurement>("/api/admin/measurements", payload);

export const updateMeasurement = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateMeasurementPayload;
}) => {
  return apiPatch<Measurement>(
    `/api/admin/measurements/${id}`,
    payload
  );
};

export const deleteMeasurement = (id: string) =>
  apiDelete(`/api/admin/measurements/${id}`);