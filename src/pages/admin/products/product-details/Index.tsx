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
  updateProductVariant,
  deleteProductVariant,
} from "@/api/requests/products";
import { getCollections } from "@/api/Collections";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import CollectionsPanel from "./CollectionsPanel";
import ColorsSection from "./ColorsSection";
import FlagsPanel from "./FlagsPanel";
import GeneralInfoSection, { CATEGORIES } from "./GeneralInfoSection";
import ImagesPanel from "./ImagesPanel";
import MetadataPanel from "./MetadataPanel";
import SizesSection from "./SizesSection";
import StatusPanel, { STATUS_OPTIONS } from "./StatusPanel";
import VariantsSection from "./VariantsSection";
import type { Product, ProductVariant } from "@/types";


const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

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

  const { data: collectionsData } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
    staleTime: 1000 * 60 * 5,
  });

  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    []
  );
  const [collectionLoadingId, setCollectionLoadingId] = useState<string | null>(
    null
  );

  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantSavingId, setVariantSavingId] = useState<string | null>(null);

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

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        sizeLabel: "",
        sizeValue: null,
        sku: "",
        priceAdjustment: 0,
        colorId: null,
        isAvailable: true,
      },
    ]);
  };

  const updateVariantField = (
    index: number,
    field: keyof ProductVariant,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    );
  };

  const handleToggleCollection = async (collectionId: string) => {
    const isSelected = selectedCollections.includes(collectionId);

    if (!editing) {
      setSelectedCollections((prev) =>
        isSelected
          ? prev.filter((x) => x !== collectionId)
          : [...prev, collectionId]
      );
      return;
    }

    setCollectionLoadingId(collectionId);

    try {
      if (isSelected) {
        await removeProductFromCollection(id!, collectionId);

        setSelectedCollections((prev) =>
          prev.filter((x) => x !== collectionId)
        );
      } else {
        await assignProductToCollection(id!, { collectionId });

        setSelectedCollections((prev) => [
          ...prev,
          collectionId,
        ]);
      }

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    } finally {
      setCollectionLoadingId(null);
    }
  };

  const handleDeleteSavedImage = async (imageId: string) => {
    if (!editing) return;

    setDeletingImageId(imageId);

    try {
      await deleteProductImage(id!, imageId);

      setSavedImages((prev) =>
        prev.filter((img) => img.id !== imageId)
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleSaveVariant = async (index: number) => {
    if (!editing) return;

    const variant = variants[index];

    setVariantSavingId(variant.id ?? `new-${index}`);

    try {
      const payload = {
        sizeLabel: variant.sizeLabel || undefined,
        sizeValue: variant.sizeValue,
        sku: variant.sku || undefined,
        priceAdjustment: variant.priceAdjustment,
        colorId: variant.colorId,
        isAvailable: variant.isAvailable,
      };

      if (variant.id) {
        await updateProductVariant(id!, variant.id, payload);
      } else {
        const result = await createProductVariant(id!, payload);
        const savedVariant = result

        setVariants((prev) =>
          prev.map((v, i) =>
            i === index
              ? { ...v, id: savedVariant?.id }
              : v
          )
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    } finally {
      setVariantSavingId(null);
    }
  };

  const handleRemoveVariant = async (index: number) => {
    const variant = variants[index];

    if (editing && variant.id) {
      await deleteProductVariant(id!, variant.id);

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    }

    setVariants((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const { mutate: saveProduct, isPending: isSaving } = useMutation({
    mutationFn: async (nextStatus: typeof status) => {
      const payload = {
        name,
        slug: slugify(name),
        description: "leather",
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
            imageUrl,
            imagePublicId: imageUrl,
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

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });

      if (!editing && productId) {
        navigate(`/products-details/${productId}`, {
          replace: true,
        });
      }
    },
  });

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
            slug={slugify(name)}
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
{/* 
          <MaterialsSection
            materials={materials}
            onRemove={removeMaterial}
            newMaterial={newMaterial}
            onNewMaterialChange={setNewMaterial}
            onAdd={addMaterial}
          /> */}

          {/* <PricingSection basePrice={basePrice} onChange={setBasePrice} /> */}

          <VariantsSection
            editing={editing}
            variants={variants}
            savedColors={savedColors}
            variantSavingId={variantSavingId}
            onAdd={addVariant}
            onUpdateField={updateVariantField}
            onSave={handleSaveVariant}
            onRemove={handleRemoveVariant}
          />
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

          <CollectionsPanel
            collections={collectionsData?.data ?? []}
            selectedCollections={selectedCollections}
            loadingId={collectionLoadingId}
            onToggle={handleToggleCollection}
          />

          {editing && existingProduct && <MetadataPanel id={existingProduct.id} />}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPages;