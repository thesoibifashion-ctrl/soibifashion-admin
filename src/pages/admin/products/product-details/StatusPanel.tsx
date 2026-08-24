import { Check } from "lucide-react";

const STATUS_OPTIONS = ["draft", "published", "archived"] as const;

interface Props {
  status: (typeof STATUS_OPTIONS)[number];
  onChange: (s: (typeof STATUS_OPTIONS)[number]) => void;
}

const StatusPanel = ({ status, onChange }: Props) => (
  <div className="rounded-2xl border bg-white p-5">
    <h3 className="mb-3 font-semibold text-near-brown">Status</h3>

    <div className="space-y-2">
      {STATUS_OPTIONS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium capitalize ${
            status === s ? "border-near-brown bg-near-brown text-white" : "hover:border-[#C9A227]"
          }`}
        >
          {s}
          {status === s && <Check size={14} className="ml-auto" />}
        </button>
      ))}
    </div>
  </div>
);

export default StatusPanel;
export { STATUS_OPTIONS };