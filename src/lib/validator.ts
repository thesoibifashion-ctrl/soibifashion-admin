export function validateProjectForm(data: {
  title?: string;
  description?: string;
  community?: string;
  coverImageUrl?:String;
  date?:string
}) {
  const errors: { title?: string; community?: string; description?: string,coverImageUrl?:String,date?:string } =
    {};

  if (!data.title || data.title.length < 3) {
    errors.title = data.title
      ? "Please add at least 3 characters"
      : "Title name is required";
  }
  if (!data.community || data.community.length < 3) {
    errors.community = data.community
      ? "Please add at least 3 characters"
      : "Community name is required";
  }
  if (!data.description || data.description.length < 3) {
    errors.description = data.description
      ? "Please add at least 3 characters"
      : "Title name is required";
  }
  if (!data.coverImageUrl || data.coverImageUrl.length < 3) {
    errors.coverImageUrl = data.coverImageUrl
     "Cover image is required";
  }
  if (!data.date || data.date.length < 3) {
    errors.date = data.date
       "Please add a date";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateNewsletterForm(data: { email?: string }) {
  const errors: { email?: string } = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
export function validateDonateForm(data: {
  email?: string;
  fullname?: string;
  phone?: string;
}) {
  const errors: { fullname?: string; email?: string; phone?: string } = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!data.fullname || data.fullname.length < 3) {
    errors.fullname = data.fullname
      ? "Please add at least 3 characters"
      : "Full name is required";
  }
  if (!data.phone || data.phone.length < 6) {
    errors.phone = data.phone
      ? "Please enter a valid phone number"
      : "Phone number is required";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export function validatePartnerForm(data: {
  email?: string;
  fullname?: string;
  phone?: string;
  position?: string;
}) {
  const errors: {
    fullname?: string;
    email?: string;
    phone?: string;
    position?: string;
  } = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!data.fullname || data.fullname.length < 3) {
    errors.fullname = data.fullname
      ? "Please add at least 3 characters"
      : "Full name is required";
  }
  if (!data.phone || data.phone.length < 6) {
    errors.phone = data.phone
      ? "Please enter a valid phone number"
      : "Phone number is required";
  }
  if (!data.position) {
    errors.position = "Please select a position";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
export const validators: Record<string, (data: any) => any> = {
  project: validateProjectForm,
  newsletter: validateNewsletterForm,
  donate: validateDonateForm,
  partner: validatePartnerForm,
};
