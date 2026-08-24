import { Input } from "@/components/ui/input";

interface Props {
  basePrice: number;
  onChange: (v: number) => void;
}

const PricingSection = ({ basePrice, onChange }: Props) => (
  <section className="rounded-2xl border bg-white p-6">
    <h2 className="mb-4 font-semibold text-near-brown">Pricing</h2>

    <div className="max-w-xs">
      <label className="mb-1.5 block text-sm font-medium text-gray-700">Base Price (₦)</label>
      <Input type="number" value={basePrice || ""} onChange={(e) => onChange(Number(e.target.value))} placeholder="120000" />
    </div>
  </section>
);

export default PricingSection;