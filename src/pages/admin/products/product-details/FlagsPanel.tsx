import { Switch } from "@/components/ui/switch";

interface Props {
  isFeatured: boolean;
  onFeaturedChange: (v: boolean) => void;
  isHero: boolean;
  onHeroChange: (v: boolean) => void;
  isCustomizable: boolean;
  onCustomizableChange: (v: boolean) => void;
}

const FlagsPanel = ({ isFeatured, onFeaturedChange, isHero, onHeroChange, isCustomizable, onCustomizableChange }: Props) => (
  <div className="rounded-2xl border bg-white p-5">
    <h3 className="mb-4 font-semibold text-near-brown">Product Flags</h3>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Featured</p>
          <p className="text-xs text-gray-500">Shown in featured sections</p>
        </div>
        <Switch checked={isFeatured} onCheckedChange={onFeaturedChange} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Hero</p>
          <p className="text-xs text-gray-500">Used as homepage hero</p>
        </div>
        <Switch checked={isHero} onCheckedChange={onHeroChange} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Customizable</p>
          <p className="text-xs text-gray-500">Customers can request a bespoke quote</p>
        </div>
        <Switch checked={isCustomizable} onCheckedChange={onCustomizableChange} />
      </div>
    </div>
  </div>
);

export default FlagsPanel;