import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CATEGORIES = ["Shoes", "Bags", "Belts", "Wallets", "Accessories"];
const GENDERS = ["male", "female", "unisex"];

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
  const showCurrentCategoryAsExtra = category && !CATEGORIES.includes(category);

  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 font-semibold text-near-brown">General Information</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Product Name</label>
            <Input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Classic Brown Leather Loafer" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug</label>
            <Input value={slug} disabled className="bg-gray-50 text-gray-500" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
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
                  onClick={() => onCategoryChange(c)}
                  className={`rounded-xl border px-3.5 py-2 text-sm font-medium ${
                    category === c ? "border-near-brown bg-near-brown text-white" : "hover:border-[#C9A227]"
                  }`}
                >
                  {c}
                </button>
              ))}

              {showCurrentCategoryAsExtra && (
                <button type="button" className="rounded-xl border border-near-brown bg-near-brown px-3.5 py-2 text-sm font-medium text-white">
                  {category}
                </button>
              )}
            </div>

            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Add new category"
                value={customCategory}
                onChange={(e) => onCustomCategoryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddCustomCategory();
                  }
                }}
                className="h-9"
              />
              <Button type="button" variant="outline" size="sm" onClick={onAddCustomCategory}>
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
                  onClick={() => onGenderChange(gender === g ? "" : g)}
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
  );
};

export default GeneralInfoSection;
export { CATEGORIES };