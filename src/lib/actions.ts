import { validators } from "./validator";

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
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`https://cephf.onrender.com/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();

      return {
        success: false,
        message: `${errorData?.message}`,
      };
    }

    const response = res.json();

    return {
      message: "successful",
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: "an error occured",
    };
  }
}
