export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sortOrder?:number;
  basePrice?: number;
  salePrice?: number | null;
isHero?: boolean;
sizes?: number[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isCustomizable?: boolean;
  gender?: "male" | "female" | "unisex";
  status?: "published" | "draft";
  images?: ProductImage[];
  collections?: Collection[];
  variants?: ProductVariant[];
  category?:string;
  materials?: {
    id?: string;
    name: string;
  }[];

  colors: {
    id: string;
    name: string;
    hex?: string;
    hexCode?:string;
  }[];

  createdAt?: string;
  updatedAt?: string;
}
export interface CreateProductPayload {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sortOrder?: number;
  basePrice?: number;
  salePrice?: number | null;
  isHero?: boolean;
  sizes?: number[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isCustomizable?: boolean;
  gender?: "male" | "female" | "unisex";
  status?: "published" | "draft";
  prices?: ProductPriceResponse[];
  images?: ProductImage[];
  collections?: Collection[];
  variants?: ProductVariant[];
  category?: string;
  measurements?: ProductMeasurement[];

  materials?: {
    id?: string;
    name: string;
  }[];

  

  colors: {
    id?: string;
    name: string;
    hex?: string;
    hexCode?: string;
  }[];
}
export interface Measurement {
  id: string;
  title: string;
  imageUrl: string;
}

export interface ProductMeasurement {
  id?: string;
  measurementId: string;
  title?: string;
  value: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface ProductPrice {
  currencyId: string;
  amount: number;
}

export interface ProductPriceResponse {
  currencyId: string;
  currency: string;
  name: string;
  symbol: string;
  amount: number;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
  isActive: boolean;
}
export interface ProductPrice {
  currencyId: string;
  amount: number;
}

export interface ProductPriceResponse {
  currencyId: string;
  currency: string;
  name: string;
  symbol: string;
  amount: number;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  imagePublicId?: string | null;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id?: string;
  sizeLabel?: string;
  sizeValue?: number | null;
  sku?: string;
  priceAdjustment?: number;
  color?: Color;
  colorId?:string | null
  isAvailable?: boolean;
  sortOrder?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
  status: "published" | "draft";
  sortOrder: number;
  productCount: number;
  isFeatured: boolean;
}

export interface Material {
  id: string;
  name: string;
  slug: string;
}

export interface Color {
  id: string;
  name: string;
  hexCode: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  imagePublicId?: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  unitPriceSnapshot: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Favorite {
  id: string;
  product: Product;
}

export interface ContactForm {
  id:string;
  isRead?:boolean;
  fullName?: string;
  name?:string
  email?: string;
  phone?: string;
  subject?: string;
  motivation?:string
  message: string;
  experienceLevel?:string;
  status?:string;
  country:string;
  createdAt?:string
}

export interface QuoteRequest {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  productId?: string;
  quantity?: number;
}

export interface AcademyApplication {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  isRead?:boolean
}

export interface AuthUser {
  id: string;
  authUserId: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  phone?: string | null;
  role: "customer" | "admin" | "super-admin";
  isActive: boolean;
}



export type QuoteStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "completed"
  | "cancelled";

export type Quote = {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  contactMethod?: string | null;
  customerNotes?: string | null;
  adminNotes?: string | null;
  customerStatus?: string;
  status: QuoteStatus;
  createdAt: string;
  submittedAt?: string | null;
  updatedAt?: string | null;
  address?:string;
  city?:string;
  state?:string
  reviewedAt?: string | null;
  completedAt?: string | null;
  paymentUrl?: string | null;
  receiptUrl?: string | null;
  shippingDetails?: string | null;
  shippingTrackingNumber?: string | null;
  shippingTrackingUrl?: string | null;
  items?: QuoteItem[];
};


type QuoteItem = {
  id?: string;
  productId?: string | null;
  productNameSnapshot?: string | null;
  variantLabelSnapshot?: string | null;
  materialNameSnapshot?: string | null;
  colorNameSnapshot?: string | null;
  imageUrlSnapshot?: string | null;
  shoeNameSnapshot?: string | null;
  toeStyleSnapshot?: string | null;
  size?: number | null;
  quantity?: number;
  unitPriceSnapshot?: number | null;
  customMeasurements?: Record<string, unknown> | null;
  customNotes?: string | null;
};





export type CartOrderItem = {
  productId: string | null;
  productNameSnapshot: string | null;
  imageUrlSnapshot: string | null;
  quantity: number;
  selectedSize: number | string | null;
  selectedColor: string | null;
  selectedMaterial: string | null;
  unitPriceSnapshot: number | null;
  customNotes?:string
  customMeasurements:{}
};

export type CartOrderStatusHistory = {
  id?: string;
  status: string;
  note: string | null;
  createdAt: string;
};

export type CartOrderCustomer = {
  id?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  contactMethod?:string

};

export type CartOrder = {
  id: string;
  originalCartId: string;
  profileId: string;
  orderNumber?: string | null;
  items: CartOrderItem[];
  totalSnapshot: number;
  paymentStatus?:string
  status: string;
  paymentUrl: string | null;
  address?:string;
  city?:string
  state?:string
  receiptUrl: string | null;
  receiptPublicId: string | null;
  shippingTrackingNumber: string | null;
  shippingTrackingUrl: string | null;
  shippingDetails: unknown | null;
  createdAt: string;
  completedAt: string | null;
  statusHistory?: CartOrderStatusHistory[];
  customer?: CartOrderCustomer | null;
  customerName?:string
  customerPhone?:string
  customerEmail?:string

};

export type CartOrdersResponse = {
  success: boolean;
  message: string;
  data: CartOrder[];
};

export type CartOrderResponse = {
  success: boolean;
  message: string;
  data: CartOrder;
};

export type UpdateCartOrderStatusPayload = {
  status: string;
  note?: string | null;
};

export type UpdateCartOrderPaymentPayload = {
  paymentUrl?: string | null;
  receiptUrl?: string | null;
  receiptPublicId?: string | null;
};

export type UpdateCartOrderFulfillmentPayload = {
  shippingTrackingNumber?: string | null;
  shippingTrackingUrl?: string | null;
  shippingDetails?: unknown | null;
};

export type CustomizationOption = {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    imagePublicId: string | null;
    description: string | null;
    status: "active" | "inactive";
    sortOrder: number;
  };

export type OptionPayload = {
  name: string;
  slug: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  description: string | null;
  status: "active" | "inactive";
  sortOrder: number;
};


export type CustomizationCategory = {
id: string;
name: string;
status: "active" | "inactive";
sortOrder: number;
options: CustomizationOption[];
};

export type GalleryCategory = "workshop" | "craftsmanship" | "completed_work";

export type GalleryImage = {
  id: string;
  title: string;
  imageUrl: string;
  imagePublicId: string;
  category: GalleryCategory;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
};

