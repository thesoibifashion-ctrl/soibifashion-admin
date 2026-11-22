

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { ArrowLeft, Check, Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import {
//   createProduct,
//   updateProduct,
//   getAdminProducts,
//   addProductImage,
//   deleteProductImage,
//   assignProductToCollection,
//   removeProductFromCollection,
//   createProductVariant,
//   getAdminCollections,
//   getAdminCollection,
// } from "@/api/requests/products";
// import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
// import CollectionsPanel from "./CollectionsPanel";
// import ColorsSection from "./ColorsSection";
// import FlagsPanel from "./FlagsPanel";
// import GeneralInfoSection, { CATEGORIES } from "./GeneralInfoSection";
// import ImagesPanel from "./ImagesPanel";
// import MetadataPanel from "./MetadataPanel";
// import SizesSection from "./SizesSection";
// import StatusPanel, { STATUS_OPTIONS } from "./StatusPanel";
// import type { Product, ProductVariant } from "@/types";
// import PricingSection from "./PricingSection";
// import { toast } from "sonner";
// import MaterialsSection from "./MaterialsSection";


// const slugify = () => crypto.randomUUID();
// const getColorName = (hex: string) => {
//   const named: Record<string, string> = {
//     "#000000": "Black",
//     "#FFFFFF": "White",
//     "#8B4513": "Saddle Brown",
//     "#A52A2A": "Brown",
//     "#808080": "Gray",
//     "#C9A227": "Gold",
//   };
//   return named[hex.toUpperCase()] ?? hex;
// };

// interface PendingImage {
//   file: File;
//   previewUrl: string;
//   altText: string;
//   isPrimary: boolean;
// }

// interface SavedImage {
//   id: string;
//   imageUrl: string;
//   altText?: string | null;
//   isPrimary: boolean;
//   sortOrder: number;
// }

// interface SavedColor {
//   id: string;
//   name: string;
//   hex?: string;
//   hexCode?: string;
// }



// const ProductDetailsPages = () => {
//   const { id } = useParams<{ id?: string }>();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const editing = !!id;

//   const { data: adminProducts, isLoading: productsLoading } = useQuery({
//     queryKey: ["admin-products"],
//     queryFn: getAdminProducts,
//     enabled: editing,
//   });

//   const existingProduct = useMemo(() => {
//     if (!editing) return null;
//     return (adminProducts ?? []).find((p: any) => p.id === id) ?? null;
//   }, [adminProducts, editing, id]);

//   const [newMaterial, setNewMaterial] = useState("");
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState(CATEGORIES[0]);
//   const [customCategory, setCustomCategory] = useState("");
//   const [gender, setGender] = useState("");
//   const [basePrice, setBasePrice] = useState<number>(0);
//   const [status, setStatus] =
//     useState<(typeof STATUS_OPTIONS)[number]>("draft");
//   const [isFeatured, setIsFeatured] = useState(false);
//   const [isHero, setIsHero] = useState(false);
//   const [isCustomizable, setIsCustomizable] = useState(false);
//   const [sizes, setSizes] = useState<number[]>([]);
//   const [customSize, setCustomSize] = useState("");
//   const [materials, setMaterials] = useState<string[]>([]);
//   const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
//   const [sortOrder, setSortOrder] = useState<number>(0);
//   const [newColorHex, setNewColorHex] = useState("#000000");

//   const { data: collectionsData, isLoading: collectionLoading } = useQuery({
//     queryKey: ["collections"],
//     queryFn: getAdminCollection,
//     staleTime: 1000 * 60 * 5,
//   });

//   console.log(collectionsData,"popo")
//   // collectionsData is undefined while loading, so default to []

//   const [selectedCollections, setSelectedCollections] = useState<string[]>(
//     []
//   );

//   const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
//   const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

//   const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
//   const [variants, setVariants] = useState<ProductVariant[]>([]);
//   // const [variantSavingId, setVariantSavingId] = useState<string | null>(null);
//   useEffect(() => {
//     if (!existingProduct) return;

//     setName(existingProduct.name ?? "");
//     setDescription(existingProduct.description ?? "");
//     setCategory(existingProduct.category ?? CATEGORIES[0]);
//     setGender(existingProduct.gender ?? "");
//     setBasePrice(existingProduct.basePrice ?? 0);
//     setStatus(existingProduct.status ?? "draft");
//     setIsFeatured(existingProduct.isFeatured ?? false);
//     setIsHero(existingProduct.isHero ?? false);
//     setIsCustomizable(existingProduct.isCustomizable ?? false);
//     setSizes(existingProduct.sizes ?? []);
//     setMaterials((existingProduct.materials ?? []).map((m: any) => m.name));
//     setSavedColors(existingProduct.colors ?? []);
//     setSelectedCollections(
//       (existingProduct.collections ?? []).map((c: any) => c.id)
//     );
//     setSavedImages(existingProduct.images ?? []);
//     setSortOrder(existingProduct.sortOrder ?? 0);

//     setVariants(
//       (existingProduct.variants ?? []).map((v: any) => ({
//         id: v.id,
//         sizeLabel: v.sizeLabel ?? "",
//         sizeValue: v.sizeValue ?? null,
//         sku: v.sku ?? "",
//         priceAdjustment: v.priceAdjustment ?? 0,
//         colorId: v.colorId ?? null,
//         isAvailable: v.isAvailable ?? true,
//       }))
//     );
//   }, [existingProduct]);

//   const toggleSize = (size: number) => {
//     setSizes((prev) =>
//       prev.includes(size)
//         ? prev.filter((s) => s !== size)
//         : [...prev, size].sort((a, b) => a - b)
//     );
//   };

//   const addCustomSize = () => {
//     const value = Number(customSize);

//     if (
//       !customSize.trim() ||
//       Number.isNaN(value) ||
//       value <= 0 ||
//       sizes.includes(value)
//     ) {
//       return;
//     }

//     setSizes((prev) => [...prev, value].sort((a, b) => a - b));
//     setCustomSize("");
//   };

//   const addCustomCategory = () => {
//     const trimmed = customCategory.trim();

//     if (!trimmed) return;

//     setCategory(trimmed);
//     setCustomCategory("");
//   };

//   const addMaterial = () => {
//     const trimmed = newMaterial.trim();

//     if (!trimmed || materials.includes(trimmed)) return;

//     setMaterials((prev) => [...prev, trimmed]);
//     setNewMaterial("");
//   };

//   const removeMaterial = (name: string) =>
//     setMaterials((prev) => prev.filter((m) => m !== name));

//   const addColor = () => {
//     const colorName = getColorName(newColorHex);

//     if (colors.some((c) => c.name === colorName)) return;

//     setColors((prev) => [
//       ...prev,
//       { name: colorName, hex: newColorHex },
//     ]);

//     setNewColorHex("#000000");
//   };

//   const removeColor = (name: string) =>
//     setColors((prev) => prev.filter((c) => c.name !== name));

//   const handleImagesSelected = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const files = Array.from(e.target.files ?? []);

//     if (files.length === 0) return;

//     const newImgs: PendingImage[] = files.map((file, i) => ({
//       file,
//       previewUrl: URL.createObjectURL(file),
//       altText: file.name
//         .replace(/\.[^.]+$/, "")
//         .replace(/-/g, " "),
//       isPrimary:
//         savedImages.length === 0 &&
//         pendingImages.length === 0 &&
//         i === 0,
//     }));

//     setPendingImages((prev) => [...prev, ...newImgs]);
//     e.target.value = "";
//   };

//   const removePendingImage = (index: number) =>
//     setPendingImages((prev) =>
//       prev.filter((_, i) => i !== index)
//     );

//   const setPendingPrimary = (index: number) =>
//     setPendingImages((prev) =>
//       prev.map((img, i) => ({
//         ...img,
//         isPrimary: i === index,
//       }))
//     );

//   const updatePendingAlt = (index: number, altText: string) =>
//     setPendingImages((prev) =>
//       prev.map((img, i) =>
//         i === index ? { ...img, altText } : img
//       )
//     );

//   // const addVariant = () => {
//   //   setVariants((prev) => [
//   //     ...prev,
//   //     {
//   //       sizeLabel: "",
//   //       sizeValue: null,
//   //       sku: "",
//   //       priceAdjustment: 0,
//   //       colorId: null,
//   //       isAvailable: true,
//   //     },
//   //   ]);
//   // };

//   // const updateVariantField = (
//   //   index: number,
//   //   field: keyof ProductVariant,
//   //   value: any
//   // ) => {
//   //   setVariants((prev) =>
//   //     prev.map((v, i) =>
//   //       i === index ? { ...v, [field]: value } : v
//   //     )
//   //   );
//   // };

//   // Collection toggle (editing only) — loading and errors come from the mutation
//   const {
//     mutate: toggleCollection,
//     isPending: isTogglingCollection,
//     variables: toggleVariables,
//   } = useMutation({
//     mutationFn: ({
//       collectionId,
//       isSelected,
//     }: {
//       collectionId: string;
//       isSelected: boolean;
//     }) =>
//       isSelected
//         ? removeProductFromCollection(id!, collectionId)
//         : assignProductToCollection(id!, { collectionId }),

//     onSuccess: (_data, { collectionId, isSelected }) => {
//       setSelectedCollections((prev) =>
//         isSelected
//           ? prev.filter((x) => x !== collectionId)
//           : [...prev, collectionId]
//       );

//       queryClient.invalidateQueries({
//         queryKey: ["admin-products"],
//       });
//       toast.success("Collection saved");
//     },

//     onError: () => {
//       toast.error("Failed to update collection");
//     },
//   });


//   const handleToggleCollection = (collectionId: string) => {
//     const isSelected = selectedCollections.includes(collectionId);

//     if (!editing) {
//       setSelectedCollections((prev) =>
//         isSelected
//           ? prev.filter((x) => x !== collectionId)
//           : [...prev, collectionId]
//       );
//       return;
//     }

//     toggleCollection({ collectionId, isSelected });
//   };

//   // Delete saved image — loading and errors come from the mutation
//   const {
//     mutate: deleteImage,
//     isPending: isDeletingImage,
//     variables: deleteVariables,
//   } = useMutation({
//     mutationFn: (imageId: string) => deleteProductImage(id!, imageId),

//     onSuccess: (_data, imageId) => {
//       setSavedImages((prev) =>
//         prev.filter((img) => img.id !== imageId)
//       );

//       queryClient.invalidateQueries({
//         queryKey: ["admin-products"],
//       });
//       toast.success("Image deleted");
//     },

//     onError: () => {
//       toast.error("Failed to delete image");
//     },
//   });

//   // Same prop ImagesPanel already uses, now derived from the mutation
//   const deletingImageId = isDeletingImage ? deleteVariables ?? null : null;

//   const handleDeleteSavedImage = (imageId: string) => {
//     if (!editing) return;

//     deleteImage(imageId);
//   };

//   // const handleSaveVariant = async (index: number) => {
//   //   if (!editing) return;

//   //   const variant = variants[index];

//   //   // setVariantSavingId(variant.id ?? `new-${index}`);

//   //   try {
//   //     const payload = {
//   //       sizeLabel: variant.sizeLabel || undefined,
//   //       sizeValue: variant.sizeValue,
//   //       sku: variant.sku || undefined,
//   //       priceAdjustment: variant.priceAdjustment,
//   //       colorId: variant.colorId,
//   //       isAvailable: variant.isAvailable,
//   //     };

//   //     if (variant.id) {
//   //       await updateProductVariant(id!, variant.id, payload);
//   //     } else {
//   //       const result = await createProductVariant(id!, payload);
//   //       const savedVariant = result

//   //       setVariants((prev) =>
//   //         prev.map((v, i) =>
//   //           i === index
//   //             ? { ...v, id: savedVariant?.id }
//   //             : v
//   //         )
//   //       );
//   //     }

//   //     queryClient.invalidateQueries({
//   //       queryKey: ["admin-products"],
//   //     });
//   //   } finally {
//   //     setVariantSavingId(null);
//   //   }
//   // };

//   // const handleRemoveVariant = async (index: number) => {
//   //   const variant = variants[index];

//   //   if (editing && variant.id) {
//   //     await deleteProductVariant(id!, variant.id);

//   //     queryClient.invalidateQueries({
//   //       queryKey: ["admin-products"],
//   //     });
//   //   }

//   //   setVariants((prev) =>
//   //     prev.filter((_, i) => i !== index)
//   //   );
//   // };

//   const { mutate: saveProduct, isPending: isSaving } = useMutation({
//     mutationFn: async (nextStatus: typeof status) => {
//       const payload = {
//         name,
//         slug:slugify(),
//         description,
//         category,
//         gender: gender || undefined,
//         basePrice: Number(basePrice),
//         status: nextStatus,
//         isFeatured,
//         isHero,
//         isCustomizable,
//         sortOrder,
//         colors: colors.length > 0 ? colors : undefined,
//         materials:
//           materials.length > 0
//             ? materials.map((n) => ({ name: n }))
//             : undefined,
//         sizes: sizes.length > 0 ? sizes : undefined,
//       };
  
//       if (editing) {
//         const result = await updateProduct(id!, payload);
//         return result as Product;
//       }
  
//       const result = await createProduct(payload);
//       return result as Product;
//     },

//     onSuccess: async (product:Product) => {
//       queryClient.invalidateQueries({
//         queryKey: ["admin-products"],
//       });

//       const productId = product?.id ?? id;

//       if (pendingImages.length > 0 && productId) {
//         for (let i = 0; i < pendingImages.length; i++) {
//           const img = pendingImages[i];
//           const imageUrl = await uploadToCloudinary(img.file);

//           await addProductImage(productId, {
//             imageUrl: imageUrl.secureUrl,
//             imagePublicId: imageUrl.publicId,
//             altText: img.altText,
//             sortOrder: savedImages.length + i,
//             isPrimary: img.isPrimary,
//           });
//         }

//         setPendingImages([]);
//       }

//       if (
//         !editing &&
//         productId &&
//         selectedCollections.length > 0
//       ) {
//         for (const collectionId of selectedCollections) {
//           await assignProductToCollection(productId, {
//             collectionId,
//           });
//         }
//       }

//       if (!editing && productId && variants.length > 0) {
//         for (const variant of variants) {
//           await createProductVariant(productId, {
//             sizeLabel: variant.sizeLabel || undefined,
//             sizeValue: variant.sizeValue,
//             sku: variant.sku || undefined,
//             priceAdjustment: variant.priceAdjustment,
//             colorId: variant.colorId,
//             isAvailable: variant.isAvailable,
//           });
//         }
//       }

//       queryClient.invalidateQueries({
//         queryKey: ["admin-products"],
//       });

//       if (!editing && productId) {
//         navigate(`/products-details/${productId}`, {
//           replace: true,
//         });
//       }
//       toast.success("Product saved");
//     },

//     onError: () => {
//       toast.error("Something went wrong");
//     },
//   });
//   // deployment

//   if (editing && productsLoading) {
//     return (
//       <div className="p-10 text-center text-sm text-gray-500">
//         Loading product...
//       </div>
//     );
//   }
//   return (
//     <div className="flex flex-col">
//       <div className="flex items-center gap-4 border-b bg-white px-8 py-4">
//         <button onClick={() => navigate("/products")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-near-brown">
//           <ArrowLeft size={16} /> Products
//         </button>

//         <span className="text-gray-300">/</span>

//         <h1 className="flex-1 truncate font-semibold text-lg text-near-brown">
//           {name || (editing ? "Edit Product" : "New Product")}
//         </h1>

//         <div className="flex gap-2">
//           <Button variant="outline" disabled={isSaving || !name.trim()} onClick={() => saveProduct("draft")}>
//             {isSaving ? <Loader2 className="animate-spin" size={16} /> : "Save Draft"}
//           </Button>

//           <Button disabled={isSaving || !name.trim()} onClick={() => saveProduct("published")} className="bg-[green] hover:bg-[#b99220]">
//             {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={14} className="mr-1" /> Publish</>}
//           </Button>
//         </div>
//       </div>
//       <div className="flex flex-1 flex-col gap-6 py-8 lg:flex-row">
//         <div className="flex-1 space-y-6">
//           <GeneralInfoSection
//             name={name}
//             onNameChange={setName}
//             slug={slugify()}
//             description={description}
//             onDescriptionChange={setDescription}
//             category={category}
//             onCategoryChange={setCategory}
//             customCategory={customCategory}
//             onCustomCategoryChange={setCustomCategory}
//             onAddCustomCategory={addCustomCategory}
//             gender={gender}
//             onGenderChange={setGender}
//           />
// <SizesSection
//   sizes={sizes}
//   onToggle={toggleSize}
//   customSize={customSize}
//   onCustomSizeChange={setCustomSize}
//   onAddCustomSize={addCustomSize}
//   sortOrder={sortOrder}
//   onSortOrderChange={setSortOrder}
// />

//           <ColorsSection
//             editing={editing}
//             savedColors={savedColors}
//             colors={colors}
//             onRemoveColor={removeColor}
//             newColorHex={newColorHex}
//             onNewColorHexChange={setNewColorHex}
//             onAddColor={addColor}
//             getColorName={getColorName}
//           />

//           <MaterialsSection editing={false} productMeasurements={[]} measurements={[]} savingMeasurementId={""} measurementBusyId={""} uploadingImage={false} onAddProductMeasurement={function (): void {
//             throw new Error("Function not implemented.");
//           } } onValueChange={function (index: number, value: string): void {
//             throw new Error("Function not implemented.");
//           } } onSaveProductMeasurement={function (index: number): void {
//             throw new Error("Function not implemented.");
//           } } onRemoveProductMeasurement={function (index: number): void {
//             throw new Error("Function not implemented.");
//           } } onCreateMeasurement={function (payload: { title: string; imageFile: File; }): Promise<void> {
//             throw new Error("Function not implemented.");
//           } } onUpdateMeasurement={function (measurementId: string, payload: { title: string; imageFile?: File; }): Promise<void> {
//             throw new Error("Function not implemented.");
//           } } onDeleteMeasurement={function (measurementId: string): Promise<void> {
//             throw new Error("Function not implemented.");
//           } }            // materials={materials}
//             // onRemove={removeMaterial}
//             // newMaterial={newMaterial}
//             // onNewMaterialChange={setNewMaterial}
//             // onAdd={addMaterial}
//           />

//            <PricingSection basePrice={basePrice} onChange={setBasePrice} /> 
//           {/* <VariantsSection
//             editing={editing}
//             variants={variants}
//             savedColors={savedColors}
//             variantSavingId={variantSavingId}
//             onAdd={addVariant}
//             onUpdateField={updateVariantField}
//             onSave={handleSaveVariant}
//             onRemove={handleRemoveVariant}
//           /> */}
//         </div>

//         <div className="w-full space-y-5 lg:w-[360px]">
//           <ImagesPanel
//             savedImages={savedImages}
//             pendingImages={pendingImages}
//             deletingImageId={deletingImageId}
//             onUpload={handleImagesSelected}
//             onDeleteSaved={handleDeleteSavedImage}
//             onSetPendingPrimary={setPendingPrimary}
//             onUpdatePendingAlt={updatePendingAlt}
//             onRemovePending={removePendingImage}
//           />

//           <StatusPanel status={status} onChange={setStatus} />

//           <FlagsPanel
//             isFeatured={isFeatured}
//             onFeaturedChange={setIsFeatured}
//             isHero={isHero}
//             onHeroChange={setIsHero}
//             isCustomizable={isCustomizable}
//             onCustomizableChange={setIsCustomizable}
//           />

//           {collectionLoading ? (
//             <div className="rounded-2xl border bg-white p-5 text-sm text-gray-500">
//               Loading collections...
//             </div>
//           ) : (
//             <CollectionsPanel
//               collections={collectionsData}
//               selectedCollections={selectedCollections}
//               isLoading={collectionLoading}
//               onToggle={handleToggleCollection}
//             />
//           )}

//           {editing && existingProduct && <MetadataPanel id={existingProduct.id} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPages;

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  createProduct,
  updateProduct,
  getAdminProducts,
  addProductImage,
  deleteProductImage,
  assignProductToCollection,
  removeProductFromCollection,
  createProductVariant,
  // getAdminCollections,
  getAdminCollection,
  // ASSUMED names — swap for your real product-measurement requests
  addProductMeasurement,
  updateProductMeasurement,
  deleteProductMeasurement,
} from "@/api/requests/products";
// import {
//   getAdminMeasurements,
  // createMeasurement,
  // updateMeasurement,
  // deleteMeasurement,
// } from "@/api/requests/measurements"; // ASSUMED path — point at the file you pasted
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import CollectionsPanel from "./CollectionsPanel";
import ColorsSection from "./ColorsSection";
import FlagsPanel from "./FlagsPanel";
import GeneralInfoSection, { CATEGORIES } from "./GeneralInfoSection";
import ImagesPanel from "./ImagesPanel";
import MetadataPanel from "./MetadataPanel";
import SizesSection from "./SizesSection";
import StatusPanel, { STATUS_OPTIONS } from "./StatusPanel";
import type { Product, ProductVariant } from "@/types";
import PricingSection from "./PricingSection";
import { toast } from "sonner";
import MeasurementsSection, {
  type EditableProductMeasurement,
} from "./MaterialsSection";
import { getAdminMeasurements,  createMeasurement,
  updateMeasurement,
  deleteMeasurement, } from "@/api/requests/Measurement";


const slugify = () => crypto.randomUUID();
const getColorName = (hex: string) => {
  const named: Record<string, string> = {
    "#000000": "Black",
    "#FFFFFF": "White",
    "#8B4513": "Saddle Brown",
    "#A52A2A": "Brown",
    "#808080": "Gray",
    "#C9A227": "Gold",
  };
  return named[hex.toUpperCase()] ?? hex;
};

interface PendingImage {
  file: File;
  previewUrl: string;
  altText: string;
  isPrimary: boolean;
}

interface SavedImage {
  id: string;
  imageUrl: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

interface SavedColor {
  id: string;
  name: string;
  hex?: string;
  hexCode?: string;
}



const ProductDetailsPages = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const editing = !!id;

  const { data: adminProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
    enabled: editing,
  });

  const existingProduct = useMemo(() => {
    if (!editing) return null;
    return (adminProducts ?? []).find((p: any) => p.id === id) ?? null;
  }, [adminProducts, editing, id]);

  // const [newMaterial, setNewMaterial] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [gender, setGender] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [status, setStatus] =
    useState<(typeof STATUS_OPTIONS)[number]>("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHero, setIsHero] = useState(false);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [sizes, setSizes] = useState<number[]>([]);
  const [customSize, setCustomSize] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [newColorHex, setNewColorHex] = useState("#000000");

  const { data: collectionsData, isLoading: collectionLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: getAdminCollection,
    staleTime: 1000 * 60 * 5,
  });

  // collectionsData is undefined while loading, so default to []

  // All measurement types (Chest, Waist, ...) that can be assigned to products
  const { data: measurementsData } = useQuery({
    queryKey: ["measurements"],
    queryFn: getAdminMeasurements,
    staleTime: 1000 * 60 * 5,
  });
  const measurements = measurementsData ?? [];

  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    []
  );

  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [productMeasurements, setProductMeasurements] = useState<
    EditableProductMeasurement[]
  >([]);
  // const [variantSavingId, setVariantSavingId] = useState<string | null>(null);
  useEffect(() => {
    if (!existingProduct) return;

    setName(existingProduct.name ?? "");
    setDescription(existingProduct.description ?? "");
    setCategory(existingProduct.category ?? CATEGORIES[0]);
    setGender(existingProduct.gender ?? "");
    setBasePrice(existingProduct.basePrice ?? 0);
    setStatus(existingProduct.status ?? "draft");
    setIsFeatured(existingProduct.isFeatured ?? false);
    setIsHero(existingProduct.isHero ?? false);
    setIsCustomizable(existingProduct.isCustomizable ?? false);
    setSizes(existingProduct.sizes ?? []);
    setMaterials((existingProduct.materials ?? []).map((m: any) => m.name));
    setSavedColors(existingProduct.colors ?? []);
    setSelectedCollections(
      (existingProduct.collections ?? []).map((c: any) => c.id)
    );
    setSavedImages(existingProduct.images ?? []);
    setSortOrder(existingProduct.sortOrder ?? 0);

    // ASSUMED shape: each item has measurementId + value, and either
    // title/imageUrl directly or nested under `measurement`
    setProductMeasurements(
      (existingProduct.measurements ?? []).map((m: any) => ({
        ...m,
        measurementId: m.measurementId ?? m.measurement?.id ?? m.id,
        title: m.title ?? m.measurement?.title ?? "",
        imageUrl: m.imageUrl ?? m.measurement?.imageUrl ?? "",
        value: m.value ?? "",
      }))
    );
    console.log(existingProduct.measurements,"exitst")

    setVariants(
      (existingProduct.variants ?? []).map((v: any) => ({
        id: v.id,
        sizeLabel: v.sizeLabel ?? "",
        sizeValue: v.sizeValue ?? null,
        sku: v.sku ?? "",
        priceAdjustment: v.priceAdjustment ?? 0,
        colorId: v.colorId ?? null,
        isAvailable: v.isAvailable ?? true,
      }))
    );
  }, [existingProduct]);

  const toggleSize = (size: number) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size].sort((a, b) => a - b)
    );
  };

  const addCustomSize = () => {
    const value = Number(customSize);

    if (
      !customSize.trim() ||
      Number.isNaN(value) ||
      value <= 0 ||
      sizes.includes(value)
    ) {
      return;
    }

    setSizes((prev) => [...prev, value].sort((a, b) => a - b));
    setCustomSize("");
  };

  const addCustomCategory = () => {
    const trimmed = customCategory.trim();

    if (!trimmed) return;

    setCategory(trimmed);
    setCustomCategory("");
  };

  // const addMaterial = () => {
  //   const trimmed = newMaterial.trim();

  //   if (!trimmed || materials.includes(trimmed)) return;

  //   setMaterials((prev) => [...prev, trimmed]);
  //   setNewMaterial("");
  // };

  // const removeMaterial = (name: string) =>
  //   setMaterials((prev) => prev.filter((m) => m !== name));

  const addColor = () => {
    const colorName = getColorName(newColorHex);

    if (colors.some((c) => c.name === colorName)) return;

    setColors((prev) => [
      ...prev,
      { name: colorName, hex: newColorHex },
    ]);

    setNewColorHex("#000000");
  };

  const removeColor = (name: string) =>
    setColors((prev) => prev.filter((c) => c.name !== name));

  const handleImagesSelected = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) return;

    const newImgs: PendingImage[] = files.map((file, i) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      altText: file.name
        .replace(/\.[^.]+$/, "")
        .replace(/-/g, " "),
      isPrimary:
        savedImages.length === 0 &&
        pendingImages.length === 0 &&
        i === 0,
    }));

    setPendingImages((prev) => [...prev, ...newImgs]);
    e.target.value = "";
  };

  const removePendingImage = (index: number) =>
    setPendingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

  const setPendingPrimary = (index: number) =>
    setPendingImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );

  const updatePendingAlt = (index: number, altText: string) =>
    setPendingImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, altText } : img
      )
    );

  // const addVariant = () => {
  //   setVariants((prev) => [
  //     ...prev,
  //     {
  //       sizeLabel: "",
  //       sizeValue: null,
  //       sku: "",
  //       priceAdjustment: 0,
  //       colorId: null,
  //       isAvailable: true,
  //     },
  //   ]);
  // };

  // const updateVariantField = (
  //   index: number,
  //   field: keyof ProductVariant,
  //   value: any
  // ) => {
  //   setVariants((prev) =>
  //     prev.map((v, i) =>
  //       i === index ? { ...v, [field]: value } : v
  //     )
  //   );
  // };

  // Collection toggle (editing only) — loading and errors come from the mutation
  const {
    mutate: toggleCollection,
    // isPending: isTogglingCollection,
    // variables: toggleVariables,
  } = useMutation({
    mutationFn: ({
      collectionId,
      isSelected,
    }: {
      collectionId: string;
      isSelected: boolean;
    }) =>
      isSelected
        ? removeProductFromCollection(id!, collectionId)
        : assignProductToCollection(id!, { collectionId }),

    onSuccess: (_data, { collectionId, isSelected }) => {
      setSelectedCollections((prev) =>
        isSelected
          ? prev.filter((x) => x !== collectionId)
          : [...prev, collectionId]
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
      toast.success("Collection saved");
    },

    onError: () => {
      toast.error("Failed to update collection");
    },
  });


  const handleToggleCollection = (collectionId: string) => {
    const isSelected = selectedCollections.includes(collectionId);

    if (!editing) {
      setSelectedCollections((prev) =>
        isSelected
          ? prev.filter((x) => x !== collectionId)
          : [...prev, collectionId]
      );
      return;
    }

    toggleCollection({ collectionId, isSelected });
  };

  // Delete saved image — loading and errors come from the mutation
  const {
    mutate: deleteImage,
    isPending: isDeletingImage,
    variables: deleteVariables,
  } = useMutation({
    mutationFn: (imageId: string) => deleteProductImage(id!, imageId),

    onSuccess: (_data, imageId) => {
      setSavedImages((prev) =>
        prev.filter((img) => img.id !== imageId)
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
      toast.success("Image deleted");
    },

    onError: () => {
      toast.error("Failed to delete image");
    },
  });

  // Same prop ImagesPanel already uses, now derived from the mutation
  const deletingImageId = isDeletingImage ? deleteVariables ?? null : null;

  const handleDeleteSavedImage = (imageId: string) => {
    if (!editing) return;

    deleteImage(imageId);
  };

  // ---------- Measurements ----------

  // Save (add or update) one measurement value on this product — editing only
  const {
    mutate: saveProductMeasurement,
    isPending: isSavingMeasurement,
    variables: saveMeasurementVariables,
  } = useMutation({
    mutationFn: (pm: EditableProductMeasurement) =>
      pm.isNew
        ? addProductMeasurement(id!, {
            measurementId: pm.measurementId,
            value: pm.value,
            sortOrder:0
          })
        : updateProductMeasurement(id!, pm.measurementId, {
            value: pm.value,
          }),

    onSuccess: (_data, pm) => {
      setProductMeasurements((prev) =>
        prev.map((x) =>
          x.measurementId === pm.measurementId ? { ...x, isNew: false } : x
        )
      );
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Measurement saved");
    },

    onError: () => {
      toast.error("Failed to save measurement");
    },
  });

  const savingMeasurementId = isSavingMeasurement
    ? saveMeasurementVariables?.measurementId ?? null
    : null;

  // Remove a saved measurement from this product — editing only
  const { mutate: removeMeasurementFromProduct } = useMutation({
    mutationFn: (measurementId: string) =>
      deleteProductMeasurement(id!, measurementId),

    onSuccess: (_data, measurementId) => {
      setProductMeasurements((prev) =>
        prev.filter((x) => x.measurementId !== measurementId)
      );
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Measurement removed");
    },

    onError: () => {
      toast.error("Failed to remove measurement");
    },
  });

  // Create a new measurement type (uploads its image first)
  const {
    mutateAsync: createMeasurementType,
    isPending: isCreatingMeasurement,
  } = useMutation({
    mutationFn: async ({
      title,
      imageFile,
    }: {
      title: string;
      imageFile: File;
    }) => {
      const uploaded = await uploadToCloudinary(imageFile);
      return createMeasurement({ title, imageUrl: uploaded.secureUrl });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
      toast.success("Measurement type created");
    },

    onError: () => {
      toast.error("Failed to create measurement type");
    },
  });

  // Update a measurement type (image optional)
  const {
    mutateAsync: updateMeasurementType,
    isPending: isUpdatingMeasurement,
    variables: updateMeasurementVariables,
  } = useMutation({
    mutationFn: async ({
      measurementId,
      title,
      imageFile,
    }: {
      measurementId: string;
      title: string;
      imageFile?: File;
    }) => {
      const imageUrl = imageFile
        ? (await uploadToCloudinary(imageFile)).secureUrl
        : undefined;

      return updateMeasurement({
        id: measurementId,
        payload: { title, imageUrl },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Measurement type updated");
    },

    onError: () => {
      toast.error("Failed to update measurement type");
    },
  });

  // Delete a measurement type
  const {
    mutateAsync: deleteMeasurementType,
    isPending: isDeletingMeasurement,
    variables: deleteMeasurementVariables,
  } = useMutation({
    mutationFn: (measurementId: string) => deleteMeasurement(measurementId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
      toast.success("Measurement type deleted");
    },

    onError: () => {
      toast.error("Failed to delete measurement type");
    },
  });

  const measurementBusyId = isUpdatingMeasurement
    ? updateMeasurementVariables?.measurementId ?? null
    : isDeletingMeasurement
    ? deleteMeasurementVariables ?? null
    : null;

  // Adds the next measurement type not yet on this product
  const handleAddProductMeasurement = () => {
    const next = measurements.find(
      (m) => !productMeasurements.some((pm) => pm.measurementId === m.id)
    );

    if (!next) return;

    setProductMeasurements((prev) => [
      ...prev,
      {
        measurementId: next.id,
        title: next.title,
        imageUrl: next.imageUrl,
        value: "",
        isNew: true,
      } as EditableProductMeasurement,
    ]);
  };

  const handleMeasurementValueChange = (index: number, value: string) =>
    setProductMeasurements((prev) =>
      prev.map((pm, i) => (i === index ? { ...pm, value } : pm))
    );

  const handleSaveProductMeasurement = (index: number) => {
    if (!editing) return;

    saveProductMeasurement(productMeasurements[index]);
  };

  const handleRemoveProductMeasurement = (index: number) => {
    const pm = productMeasurements[index];

    // Saved on the server -> remove there; otherwise just drop it locally
    if (editing && !pm.isNew) {
      removeMeasurementFromProduct(pm.measurementId);
      return;
    }

    setProductMeasurements((prev) => prev.filter((_, i) => i !== index));
  };

  // const handleSaveVariant = async (index: number) => {
  //   if (!editing) return;

  //   const variant = variants[index];

  //   // setVariantSavingId(variant.id ?? `new-${index}`);

  //   try {
  //     const payload = {
  //       sizeLabel: variant.sizeLabel || undefined,
  //       sizeValue: variant.sizeValue,
  //       sku: variant.sku || undefined,
  //       priceAdjustment: variant.priceAdjustment,
  //       colorId: variant.colorId,
  //       isAvailable: variant.isAvailable,
  //     };

  //     if (variant.id) {
  //       await updateProductVariant(id!, variant.id, payload);
  //     } else {
  //       const result = await createProductVariant(id!, payload);
  //       const savedVariant = result

  //       setVariants((prev) =>
  //         prev.map((v, i) =>
  //           i === index
  //             ? { ...v, id: savedVariant?.id }
  //             : v
  //         )
  //       );
  //     }

  //     queryClient.invalidateQueries({
  //       queryKey: ["admin-products"],
  //     });
  //   } finally {
  //     setVariantSavingId(null);
  //   }
  // };

  // const handleRemoveVariant = async (index: number) => {
  //   const variant = variants[index];

  //   if (editing && variant.id) {
  //     await deleteProductVariant(id!, variant.id);

  //     queryClient.invalidateQueries({
  //       queryKey: ["admin-products"],
  //     });
  //   }

  //   setVariants((prev) =>
  //     prev.filter((_, i) => i !== index)
  //   );
  // };

  const { mutate: saveProduct, isPending: isSaving } = useMutation({
    mutationFn: async (nextStatus: typeof status) => {
      const payload = {
        name,
        slug:slugify(),
        description,
        category,
        gender: gender || undefined,
        basePrice: Number(basePrice),
        status: nextStatus,
        isFeatured,
        isHero,
        isCustomizable,
        sortOrder,
        colors: colors.length > 0 ? colors : undefined,
        materials:
          materials.length > 0
            ? materials.map((n) => ({ name: n }))
            : undefined,
        sizes: sizes.length > 0 ? sizes : undefined,
      };
  
      if (editing) {
        const result = await updateProduct(id!, payload);
        return result as Product;
      }
  
      const result = await createProduct(payload);
      return result as Product;
    },

    onSuccess: async (product:Product) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });

      const productId = product?.id ?? id;

      if (pendingImages.length > 0 && productId) {
        for (let i = 0; i < pendingImages.length; i++) {
          const img = pendingImages[i];
          const imageUrl = await uploadToCloudinary(img.file);

          await addProductImage(productId, {
            imageUrl: imageUrl.secureUrl,
            imagePublicId: imageUrl.publicId,
            altText: img.altText,
            sortOrder: savedImages.length + i,
            isPrimary: img.isPrimary,
          });
        }

        setPendingImages([]);
      }

      if (
        !editing &&
        productId &&
        selectedCollections.length > 0
      ) {
        for (const collectionId of selectedCollections) {
          await assignProductToCollection(productId, {
            collectionId,
          });
        }
      }

      if (!editing && productId && variants.length > 0) {
        for (const variant of variants) {
          await createProductVariant(productId, {
            sizeLabel: variant.sizeLabel || undefined,
            sizeValue: variant.sizeValue,
            sku: variant.sku || undefined,
            priceAdjustment: variant.priceAdjustment,
            colorId: variant.colorId,
            isAvailable: variant.isAvailable,
          });
        }
      }

      // New product: attach the measurements that were filled in
      if (!editing && productId && productMeasurements.length > 0) {
        for (const pm of productMeasurements) {
          if (!pm.value.trim()) continue;

          await addProductMeasurement(productId, {
            measurementId: pm.measurementId,
            value: pm.value,
            sortOrder:0
          });
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });

      if (!editing && productId) {
        navigate(`/products-details/${productId}`, {
          replace: true,
        });
      }
      toast.success("Product saved");
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });
  // deployment

  if (editing && productsLoading) {
    return (
      <div className="p-10 text-center text-sm text-gray-500">
        Loading product...
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 border-b bg-white px-8 py-4">
        <button onClick={() => navigate("/products")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-near-brown">
          <ArrowLeft size={16} /> Products
        </button>

        <span className="text-gray-300">/</span>

        <h1 className="flex-1 truncate font-semibold text-lg text-near-brown">
          {name || (editing ? "Edit Product" : "New Product")}
        </h1>

        <div className="flex gap-2">
          <Button variant="outline" disabled={isSaving || !name.trim()} onClick={() => saveProduct("draft")}>
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : "Save Draft"}
          </Button>

          <Button disabled={isSaving || !name.trim()} onClick={() => saveProduct("published")} className="bg-[green] hover:bg-[#b99220]">
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={14} className="mr-1" /> Publish</>}
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 py-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <GeneralInfoSection
            name={name}
            onNameChange={setName}
            slug={slugify()}
            description={description}
            onDescriptionChange={setDescription}
            category={category}
            onCategoryChange={setCategory}
            customCategory={customCategory}
            onCustomCategoryChange={setCustomCategory}
            onAddCustomCategory={addCustomCategory}
            gender={gender}
            onGenderChange={setGender}
          />
<SizesSection
  sizes={sizes}
  onToggle={toggleSize}
  customSize={customSize}
  onCustomSizeChange={setCustomSize}
  onAddCustomSize={addCustomSize}
  sortOrder={sortOrder}
  onSortOrderChange={setSortOrder}
/>

          <ColorsSection
            editing={editing}
            savedColors={savedColors}
            colors={colors}
            onRemoveColor={removeColor}
            newColorHex={newColorHex}
            onNewColorHexChange={setNewColorHex}
            onAddColor={addColor}
            getColorName={getColorName}
          />

          <MeasurementsSection
            editing={editing}
            productMeasurements={productMeasurements}
            measurements={measurements}
            savingMeasurementId={savingMeasurementId}
            measurementBusyId={measurementBusyId}
            uploadingImage={isCreatingMeasurement}
            onAddProductMeasurement={handleAddProductMeasurement}
            onValueChange={handleMeasurementValueChange}
            onSaveProductMeasurement={handleSaveProductMeasurement}
            onRemoveProductMeasurement={handleRemoveProductMeasurement}
            onCreateMeasurement={async (payload) => {
              await createMeasurementType(payload);
            }}
            onUpdateMeasurement={async (measurementId, payload) => {
              await updateMeasurementType({ measurementId, ...payload });
            }}
            onDeleteMeasurement={async (measurementId) => {
              await deleteMeasurementType(measurementId);
            }}
          />

           <PricingSection basePrice={basePrice} onChange={setBasePrice} /> 
          {/* <VariantsSection
            editing={editing}
            variants={variants}
            savedColors={savedColors}
            variantSavingId={variantSavingId}
            onAdd={addVariant}
            onUpdateField={updateVariantField}
            onSave={handleSaveVariant}
            onRemove={handleRemoveVariant}
          /> */}
        </div>

        <div className="w-full space-y-5 lg:w-[360px]">
          <ImagesPanel
            savedImages={savedImages}
            pendingImages={pendingImages}
            deletingImageId={deletingImageId}
            onUpload={handleImagesSelected}
            onDeleteSaved={handleDeleteSavedImage}
            onSetPendingPrimary={setPendingPrimary}
            onUpdatePendingAlt={updatePendingAlt}
            onRemovePending={removePendingImage}
          />

          <StatusPanel status={status} onChange={setStatus} />

          <FlagsPanel
            isFeatured={isFeatured}
            onFeaturedChange={setIsFeatured}
            isHero={isHero}
            onHeroChange={setIsHero}
            isCustomizable={isCustomizable}
            onCustomizableChange={setIsCustomizable}
          />

          {collectionLoading ? (
            <div className="rounded-2xl border bg-white p-5 text-sm text-gray-500">
              Loading collections...
            </div>
          ) : (
            <CollectionsPanel
              collections={collectionsData ?? []}
              selectedCollections={selectedCollections}
              isLoading={collectionLoading}
              onToggle={handleToggleCollection}
            />
          )}

          {editing && existingProduct && <MetadataPanel id={existingProduct.id} />}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPages;
