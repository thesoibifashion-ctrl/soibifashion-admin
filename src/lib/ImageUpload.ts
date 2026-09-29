export async function imageUpload(file: File): Promise<{
    secureUrl: string;
    publicId: string | null;
  }> {
    const formData = new FormData();
  
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
  
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    if (!res.ok) {
      throw new Error("File upload failed");
    }
  
    const data = await res.json();
  
    return {
      secureUrl: data.secure_url,
      publicId: data.public_id ?? null,
    };
  }