"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Star, Trash2, Upload, X, ArrowLeft, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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
} from "@/api/products";
import { getCollections } from "@/api/Collections";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

const CATEGORIES = ["Shoes", "Bags", "Belts", "Wallets", "Accessories"];
const GENDERS = ["male", "female", "unisex"];
const STATUS_OPTIONS = ["draft", "published", "archived"] as const;
const EU_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

interface Collection {
  id: string;
  name: string;
}

interface Variant {
  id?: string;
  sizeLabel: string;
  sizeValue: number | null;
  sku: string;
  priceAdjustment: number;
  colorId: string | null;
  isAvailable: boolean;
}

const ProductFormPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const editing = !!id;

  // ── Load existing product (edit mode) ─────────────────────────────
  const { data: adminProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
    enabled: editing,
  });

  const existingProduct = useMemo(() => {
    if (!editing) return null;
    return (adminProducts?.data ?? []).find((p: any) => p.id === id) ?? null;
  }, [adminProducts, editing, id]);

  // ── General info ────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [gender, setGender] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHero, setIsHero] = useState(false);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [sizes, setSizes] = useState<number[]>([]);
  const [customSize, setCustomSize] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [newColorHex, setNewColorHex] = useState("#000000");

  // ── Collections ─────────────────────────────────────────────────
  const { data: collectionsData } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
    staleTime: 1000 * 60 * 5,
  });

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [collectionLoadingId, setCollectionLoadingId] = useState<string | null>(null);

  // ── Images ──────────────────────────────────────────────────────
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  // ── Variants ────────────────────────────────────────────────────
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantSavingId, setVariantSavingId] = useState<string | null>(null);

  // ── Prefill from existing product ──────────────────────────────
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
    setSelectedCollections((existingProduct.collections ?? []).map((c: any) => c.id));
    setSavedImages(existingProduct.images ?? []);
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

  // ── Toggles ─────────────────────────────────────────────────────
  const toggleSize = (size: number) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)));
  };

  const addCustomSize = () => {
    const value = Number(customSize);
    if (!customSize.trim() || Number.isNaN(value) || value <= 0 || sizes.includes(value)) return;
    setSizes((prev) => [...prev, value].sort((a, b) => a - b));
    setCustomSize("");
  };

  const addCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) return;
    setCategory(trimmed);
    setCustomCategory("");
  };

  const addMaterial = () => {
    const trimmed = newMaterial.trim();
    if (!trimmed || materials.includes(trimmed)) return;
    setMaterials((prev) => [...prev, trimmed]);
    setNewMaterial("");
  };

  const removeMaterial = (name: string) => setMaterials((prev) => prev.filter((m) => m !== name));

  const addColor = () => {
    const colorName = getColorName(newColorHex);
    if (colors.some((c) => c.name === colorName)) return;
    setColors((prev) => [...prev, { name: colorName, hex: newColorHex }]);
    setNewColorHex("#000000");
  };

  const removeColor = (name: string) => setColors((prev) => prev.filter((c) => c.name !== name));

  const handleImagesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newImgs: PendingImage[] = files.map((file, i) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      altText: file.name.replace(/\.[^.]+$/, "").replace(/-/g, " "),
      isPrimary: savedImages.length === 0 && pendingImages.length === 0 && i === 0,
    }));

    setPendingImages((prev) => [...prev, ...newImgs]);
    e.target.value = "";
  };

  const removePendingImage = (index: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setPendingPrimary = (index: number) => {
    setPendingImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const updatePendingAlt = (index: number, altText: string) => {
    setPendingImages((prev) => prev.map((img, i) => (i === index ? { ...img, altText } : img)));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { sizeLabel: "", sizeValue: null, sku: "", priceAdjustment: 0, colorId: null, isAvailable: true },
    ]);
  };

  const updateVariantField = (index: number, field: keyof Variant, value: any) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  // ── Collection toggle (immediate when editing, staged when creating) ──
  const handleToggleCollection = async (collectionId: string) => {
    const isSelected = selectedCollections.includes(collectionId);

    if (!editing) {
      setSelectedCollections((prev) =>
        isSelected ? prev.filter((x) => x !== collectionId) : [...prev, collectionId]
      );
      return;
    }

    setCollectionLoadingId(collectionId);

    try {
      if (isSelected) {
        await removeProductFromCollection(id!, collectionId);
        setSelectedCollections((prev) => prev.filter((x) => x !== collectionId));
      } else {
        await assignProductToCollection(id!, { collectionId });
        setSelectedCollections((prev) => [...prev, collectionId]);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } finally {
      setCollectionLoadingId(null);
    }
  };

  // ── Image delete (only for already-saved images) ──────────────
  const handleDeleteSavedImage = async (imageId: string) => {
    if (!editing) return;
    setDeletingImageId(imageId);
    try {
      await deleteProductImage(id!, imageId);
      setSavedImages((prev) => prev.filter((img) => img.id !== imageId));
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } finally {
      setDeletingImageId(null);
    }
  };

  // ── Variant save/delete (immediate when editing) ───────────────
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
        const savedVariant = result?.data ?? result;
        setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, id: savedVariant?.id } : v)));
      }
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } finally {
      setVariantSavingId(null);
    }
  };

  const handleRemoveVariant = async (index: number) => {
    const variant = variants[index];

    if (editing && variant.id) {
      await deleteProductVariant(id!, variant.id);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    }

    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Save (create or update the product itself) ─────────────────
  const { mutate: saveProduct, isPending: isSaving } = useMutation({
    mutationFn: async (nextStatus: typeof status) => {
      const payload = {
        name,
        slug: slugify(name),
        description,
        category,
        gender: gender || undefined,
        basePrice: Number(basePrice),
        status: nextStatus,
        isFeatured,
        isHero,
        isCustomizable,
        colors: colors.length > 0 ? colors : undefined,
        materials: materials.length > 0 ? materials.map((n) => ({ name: n })) : undefined,
        sizes: sizes.length > 0 ? sizes : undefined,
      };

      if (editing) {
        const result = await updateProduct(id!, payload);
        return result?.data ?? result;
      }

      const result = await createProduct(payload);
      return result?.data ?? result;
    },

    onSuccess: async (product) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });

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

      if (!editing && productId && selectedCollections.length > 0) {
        for (const collectionId of selectedCollections) {
          await assignProductToCollection(productId, { collectionId });
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

      queryClient.invalidateQueries({ queryKey: ["admin-products"] });

      if (!editing && productId) {
        navigate(`/products-details/${productId}`, { replace: true });
      }
    },
  });

  if (editing && productsLoading) {
    return <div className="p-10 text-center text-sm text-gray-500">Loading product...</div>;
  }

  const allSizes = Array.from(new Set([...EU_SIZES, ...sizes])).sort((a, b) => a - b);
  const showCurrentCategoryAsExtra = category && !CATEGORIES.includes(category);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b bg-white px-8 py-4">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-near-brown"
        >
          <ArrowLeft size={16} /> Products
        </button>

        <span className="text-gray-300">/</span>

        <h1 className="flex-1 truncate font-semibold text-lg text-near-brown">
          {name || (editing ? "Edit Product" : "New Product")}
        </h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isSaving || !name.trim()}
            onClick={() => saveProduct("draft")}
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : "Save Draft"}
          </Button>

          <Button
            disabled={isSaving || !name.trim()}
            onClick={() => saveProduct("published")}
            className="bg-[green] hover:bg-[#b99220]"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={14} className="mr-1" /> Publish</>}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 py-8 lg:flex-row">
        {/* LEFT — main form */}
        <div className="flex-1 space-y-6">
          {/* General Info */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 font-semibold text-near-brown">General Information</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Product Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Classic Brown Leather Loafer" />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug</label>
                  <Input value={slugify(name)} disabled className="bg-gray-50 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this product..."
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>

                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={`rounded-xl border px-3.5 py-2 text-sm font-medium ${
                          category === c ? "border-near-brown bg-near-brown text-white" : "hover:border-[#C9A227]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}

                    {showCurrentCategoryAsExtra && (
                      <button
                        type="button"
                        className="rounded-xl border border-near-brown bg-near-brown px-3.5 py-2 text-sm font-medium text-white"
                      >
                        {category}
                      </button>
                    )}
                  </div>

                  <div className="mt-2 flex gap-2">
                    <Input
                      placeholder="Add new category"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomCategory();
                        }
                      }}
                      className="h-9"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addCustomCategory}>
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender</label>
                  <div className="flex flex-wrap gap-2">
                    {GENDERS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(gender === g ? "" : g)}
                        className={`rounded-xl border px-3.5 py-2 text-sm font-medium capitalize ${
                          gender === g ? "border-near-brown bg-near-brown text-white" : "hover:border-[#C9A227]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sizes */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 font-semibold text-near-brown">Available Sizes (EU)</h2>

            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => {
                const active = sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`h-12 w-12 rounded-xl border text-sm font-semibold ${
                      active ? "border-near-brown bg-near-brown text-white" : "hover:border-[#C9A227]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex max-w-xs gap-2">
              <Input
                type="number"
                placeholder="Add new size"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomSize();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addCustomSize}>
                <Plus size={14} />
              </Button>
            </div>
          </section>

          {/* Colors */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 font-semibold text-near-brown">Colors</h2>

            {editing && savedColors.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {savedColors.map((c) => (
                  <span key={c.id} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
                    <span className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: c.hex ?? c.hexCode }} />
                    {c.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <span key={c.name} className="flex items-center gap-2 rounded-full border border-[#C9A227] bg-[#C9A227]/10 px-3 py-1.5 text-sm">
                  <span className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: c.hex }} />
                  {c.name}
                  <button type="button" onClick={() => removeColor(c.name)} className="text-[#C9A227] hover:text-red-600">
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-md border p-1"
              />
              <span className="flex-1 text-sm text-gray-500">{getColorName(newColorHex)}</span>
              <Button type="button" onClick={addColor} variant="outline">
                <Plus size={16} /> Add Color
              </Button>
            </div>
          </section>

          {/* Materials */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 font-semibold text-near-brown">Materials</h2>

            <div className="mb-4 flex flex-wrap gap-2">
              {materials.map((m) => (
                <span key={m} className="flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm">
                  {m}
                  <button type="button" onClick={() => removeMaterial(m)} className="text-gray-400 hover:text-red-600">
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add material"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addMaterial();
                  }
                }}
              />
              <Button type="button" onClick={addMaterial} className="bg-[#C9A227] hover:bg-[#b99220]">
                <Plus size={18} />
              </Button>
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 font-semibold text-near-brown">Pricing</h2>

            <div className="max-w-xs">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Base Price (₦)</label>
              <Input
                type="number"
                value={basePrice || ""}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                placeholder="120000"
              />
            </div>
          </section>

          {/* Variants */}
          <section className="rounded-2xl border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-near-brown">Variants</h2>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus size={14} /> Add Variant
              </Button>
            </div>

            {variants.length === 0 ? (
              <p className="text-sm text-gray-500">No variants yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      {["Size Label", "Size", "SKU", "Color", "Price Adj.", "Available", ""].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {variants.map((v, i) => (
                      <tr key={v.id ?? `new-${i}`} className="border-b last:border-b-0">
                        <td className="px-3 py-2">
                          <Input
                            value={v.sizeLabel}
                            onChange={(e) => updateVariantField(i, "sizeLabel", e.target.value)}
                            className="h-8 w-20"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            value={v.sizeValue ?? ""}
                            onChange={(e) => updateVariantField(i, "sizeValue", e.target.value ? Number(e.target.value) : null)}
                            className="h-8 w-16"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={v.sku}
                            onChange={(e) => updateVariantField(i, "sku", e.target.value)}
                            className="h-8 w-28"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={v.colorId ?? ""}
                            onChange={(e) => updateVariantField(i, "colorId", e.target.value || null)}
                            className="h-8 rounded-lg border px-2 text-sm"
                          >
                            <option value="">—</option>
                            {savedColors.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            value={v.priceAdjustment}
                            onChange={(e) => updateVariantField(i, "priceAdjustment", Number(e.target.value))}
                            className="h-8 w-24"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => updateVariantField(i, "isAvailable", !v.isAvailable)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                              v.isAvailable ? "border-green-300 bg-green-50 text-green-600" : "border-gray-200 bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Check size={14} />
                          </button>
                        </td>
                        <td className="flex items-center gap-2 px-3 py-2">
                          {editing && (
                            <button
                              type="button"
                              onClick={() => handleSaveVariant(i)}
                              disabled={variantSavingId === (v.id ?? `new-${i}`)}
                              className="text-xs font-semibold text-[#C9A227] hover:underline"
                            >
                              {variantSavingId === (v.id ?? `new-${i}`) ? <Loader2 size={14} className="animate-spin" /> : "Save"}
                            </button>
                          )}
                          <button type="button" onClick={() => handleRemoveVariant(i)} className="text-gray-400 hover:text-red-500">
                            <X size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!editing && variants.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">Variants will be created once you save the product.</p>
            )}
          </section>
        </div>

        {/* RIGHT — side panel */}
        <div className="w-full space-y-5 lg:w-[360px]">
          {/* Images */}
          <div className="rounded-2xl border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-near-brown">Images</h3>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#C9A227] hover:underline">
                <Upload size={12} /> Upload
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImagesSelected} />
              </label>
            </div>

            <div className="space-y-2">
              {savedImages.map((img) => (
                <div key={img.id} className="flex items-center gap-2.5 rounded-xl border p-2">
                  <img src={img.imageUrl} alt={img.altText ?? ""} className="h-9 w-9 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs text-gray-600">{img.altText || "No alt text"}</p>
                    {img.isPrimary && <span className="text-[10px] font-semibold text-[#C9A227]">Primary</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSavedImage(img.id)}
                    disabled={deletingImageId === img.id}
                    className="text-gray-400 hover:text-red-500"
                  >
                    {deletingImageId === img.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              ))}

              {pendingImages.map((img, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl border border-dashed p-2">
                  <img src={img.previewUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <input
                      value={img.altText}
                      onChange={(e) => updatePendingAlt(i, e.target.value)}
                      placeholder="Alt text"
                      className="w-full border-none bg-transparent text-xs outline-none"
                    />
                    {img.isPrimary && <span className="text-[10px] font-semibold text-[#C9A227]">Primary (pending)</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingPrimary(i)}
                    title="Set primary"
                    className={`h-6 w-6 rounded-md text-xs ${img.isPrimary ? "bg-[#C9A227] text-white" : "text-gray-300 hover:text-[#C9A227]"}`}
                  >
                    <Star size={13} className="mx-auto" />
                  </button>
                  <button type="button" onClick={() => removePendingImage(i)} className="text-gray-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}

              {savedImages.length === 0 && pendingImages.length === 0 && (
                <p className="text-xs text-gray-500">No images yet.</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="mb-3 font-semibold text-near-brown">Status</h3>

            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium capitalize ${
                    status === s ? "border-near-brown bg-near-brown text-white" : "hover:border-[#C9A227]"
                  }`}
                >
                  {/* <span
                    className={`h-2 w-2 rounded-full ${
                      s === "published" ? "bg-emerald-400" : s === "draft" ? "bg-gray-400" : "bg-orange-400"
                    } ${status === s ? "bg-white" : ""}`}
                  /> */}
                  {s}
                  {status === s && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="mb-4 font-semibold text-near-brown">Product Flags</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Featured</p>
                  <p className="text-xs text-gray-500">Shown in featured sections</p>
                </div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Hero</p>
                  <p className="text-xs text-gray-500">Used as homepage hero</p>
                </div>
                <Switch checked={isHero} onCheckedChange={setIsHero} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Customizable</p>
                  <p className="text-xs text-gray-500">Customers can request a bespoke quote</p>
                </div>
                <Switch checked={isCustomizable} onCheckedChange={setIsCustomizable} />
              </div>
            </div>
          </div>

          {/* Collections */}
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="mb-3 font-semibold text-near-brown">Collections</h3>

            {!collectionsData?.data || collectionsData.data.length === 0 ? (
              <p className="text-sm text-gray-500">No collections yet.</p>
            ) : (
              <div className="space-y-1.5">
                {collectionsData.data.map((col: Collection) => {
                  const active = selectedCollections.includes(col.id);
                  const loading = collectionLoadingId === col.id;

                  return (
                    <label
                      key={col.id}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 ${active ? "bg-[#C9A227]/10" : "hover:bg-gray-50"}`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        disabled={loading}
                        onChange={() => handleToggleCollection(col.id)}
                        className="h-3.5 w-3.5 accent-[#C9A227]"
                      />
                      <span className="flex-1 text-sm">{col.name}</span>
                      {loading && <Loader2 size={14} className="animate-spin text-[#C9A227]" />}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Metadata */}
          {editing && existingProduct && (
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="mb-3 font-semibold text-near-brown">Metadata</h3>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>ID</span>
                  <span className="font-mono text-[10px] text-gray-700">{existingProduct.id}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;