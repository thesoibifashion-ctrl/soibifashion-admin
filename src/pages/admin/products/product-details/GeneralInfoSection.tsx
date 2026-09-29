import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/requests/products";
import type { Product } from "@/types";

const CATEGORIES = ["Clothes", "Bags", "Shoes", "Earrings"];
const GENDERS = ["Skirts", "gowns", "palazzo","skort","kimono","blouses"];


interface Props {
  name: string;
  onNameChange: (v: string) => void;
  slug: string;
  description: string;
  onDescriptionChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  customCategory: string;
  onCustomCategoryChange: (v: string) => void;
  onAddCustomCategory: () => void;
  gender: string;
  onGenderChange: (v: string) => void;
}

const GeneralInfoSection = ({
  name,
  onNameChange,
  slug,
  description,
  onDescriptionChange,
  category,
  onCategoryChange,
  customCategory,
  onCustomCategoryChange,
  onAddCustomCategory,
  gender,
  onGenderChange,
}: Props) => {
  const [showProductList, setShowProductList] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const showCurrentCategoryAsExtra =
    category && !CATEGORIES.includes(category);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });

  const products = (productsData ?? []) as Product[];

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(productSearch.toLowerCase())
  );


  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    // Open product picker when "/" is typed
    if (value.endsWith("/")) {
      setShowProductList(true);
      setProductSearch("");
    }

    onDescriptionChange(value);
  };


  const handleProductSelect = (product: Product) => {
    if (!product.id) return;

      // Remove the "/" that opened the product picker.
    const descriptionWithoutSlash = description.endsWith("/")
      ? description.slice(0, -1)
      : description;

    const productReference = `{{product:${product.slug}}}`;

    const newDescription =
      descriptionWithoutSlash + productReference;

    onDescriptionChange(newDescription);

    setShowProductList(false);
    setProductSearch("");
  };

  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 font-semibold text-near-brown">
        General Information
      </h2>

      <div className="space-y-4">
        {/* Product Name + Slug */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Product Name
            </label>

            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Classic Brown Leather Loafer"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Slug
            </label>

            <Input
              value={slug}
              disabled
              className="bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        {/* Description */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>

          <div className="relative">
            <textarea
              rows={7}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe this product..."
              className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:border-[#C9A227]"
            />

            {/* Product Picker */}

            {showProductList && (
              <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow-xl">
                <div className="border-b p-2">
                  <Input
                    autoFocus
                    value={productSearch}
                    onChange={(e) =>
                      setProductSearch(e.target.value)
                    }
                    placeholder="Search products..."
                    className="h-9"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto p-1">
                  {productsLoading ? (
                    <div className="px-3 py-4 text-center text-sm text-gray-500">
                      Loading products...
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="px-3 py-4 text-center text-sm text-gray-500">
                      No products found.
                    </div>
                  ) : (
                    filteredProducts.map((product) => {
                      const imageUrl =
                        product.images?.[0]?.imageUrl;

                      return (
                        <button
                          key={product.id}
                          type="button"
                          disabled={!product.id}
                          onClick={() =>
                            handleProductSelect(product)
                          }
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-gray-50 disabled:opacity-40"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-100" />
                          )}

                          <span className="text-sm font-medium text-gray-700">
                            {product.name}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="mt-1.5 text-xs text-gray-400">
            Type <span className="font-medium">/</span> to insert a
            product.
          </p>
        </div>

        {/* Category + Gender */}

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category
            </label>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCategoryChange(c)}
                  className={`rounded-xl border px-3.5 py-2 text-sm font-medium ${
                    category === c
                      ? "border-near-brown bg-near-brown text-white"
                      : "hover:border-[#C9A227]"
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
                onChange={(e) =>
                  onCustomCategoryChange(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddCustomCategory();
                  }
                }}
                className="h-9"
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAddCustomCategory}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>

          {/* Gender */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Styles
            </label>

            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() =>
                    onGenderChange(gender === g ? "" : g)
                  }
                  className={`rounded-xl border px-3.5 py-2 text-sm font-medium capitalize ${
                    gender === g
                      ? "border-near-brown bg-near-brown text-white"
                      : "hover:border-[#C9A227]"
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
  );
};

export default GeneralInfoSection;
export { CATEGORIES };