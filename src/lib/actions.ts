import { validators } from "./validator";
import { apiClient } from "@/lib/api-client";

export async function actions( formData: FormData) {
  
  const data = Object.fromEntries(formData);
  const { path, formValidator, ...payload } = data;
  const validate = validators[formValidator as string];
  const errors = validate ? validate(payload) : null;
  if (errors) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors,
      values: { payload },
    };
  }

  try {
    const endpoint = String(path).startsWith("/") ? String(path) : `/${path}`;
    const response = await apiClient(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      message: "successful",
      success: true,
      data: response,
    };
  } catch {
    return {
      success: false,
      message: "an error occured",
    };
  }
}
