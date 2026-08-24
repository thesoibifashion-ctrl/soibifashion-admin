import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Building2,
  Image as ImageIcon,
  Mail,
  Phone,
  Save,
  Settings,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { getAdminSettings, updateAdminSetting } from "@/api/settings";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonTable } from "@/components/shared/skeleton";
import SettingsSkeleton from "./Skeleton";

type SettingValue = string | boolean | null;

type Setting = {
  key: string;
  value?: SettingValue;
  valueJson?: unknown;
};

type SettingsForm = {
  business_name: string;
  contact_email: string;
  notification_email: string;
  phone_number: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  logo_url: string;
  favicon_url: string;
  notify_customer_on_quote: boolean;
  notify_customer_on_cart: boolean;
};

const defaultSettings: SettingsForm = {
  business_name: "Signature by Sarah",
  contact_email: "",
  notification_email: "",
  phone_number: "",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  logo_url: "",
  favicon_url: "",
  notify_customer_on_quote: true,
  notify_customer_on_cart: true,
};

const getSettingsObject = (data: unknown): SettingsForm => {
  if (!data) {
    return defaultSettings;
  }

  if (!Array.isArray(data)) {
    return {
      ...defaultSettings,
      ...(data as Partial<SettingsForm>),
    };
  }

  const settings = data as Setting[];

  const getValue = (key: string) => {
    const setting = settings.find((item) => item.key === key);

    if (!setting) {
      return undefined;
    }

    return setting.value !== undefined
      ? setting.value
      : setting.valueJson;
  };

  const getString = (key: string, fallback: string) => {
    const value = getValue(key);

    return typeof value === "string" ? value : fallback;
  };

  const getBoolean = (key: string, fallback: boolean) => {
    const value = getValue(key);

    return typeof value === "boolean" ? value : fallback;
  };

  return {
    business_name: getString(
      "business_name",
      defaultSettings.business_name
    ),
    contact_email: getString(
      "contact_email",
      defaultSettings.contact_email
    ),
    notification_email: getString(
      "notification_email",
      defaultSettings.notification_email
    ),
    phone_number: getString(
      "phone_number",
      defaultSettings.phone_number
    ),
    instagram_url: getString(
      "instagram_url",
      defaultSettings.instagram_url
    ),
    facebook_url: getString(
      "facebook_url",
      defaultSettings.facebook_url
    ),
    tiktok_url: getString(
      "tiktok_url",
      defaultSettings.tiktok_url
    ),
    logo_url: getString(
      "logo_url",
      defaultSettings.logo_url
    ),
    favicon_url: getString(
      "favicon_url",
      defaultSettings.favicon_url
    ),
    notify_customer_on_quote: getBoolean(
      "notify_customer_on_quote",
      defaultSettings.notify_customer_on_quote
    ),
    notify_customer_on_cart: getBoolean(
      "notify_customer_on_cart",
      defaultSettings.notify_customer_on_cart
    ),
  };
};

const SettingsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: getAdminSettings,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <SettingsSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-[#F1CCCC] bg-[#FFF7F7] p-5 text-sm text-[#DE0D0D]">
          Failed to load settings.
        </div>
      </div>
    );
  }

  return (
    <SettingsForm data={data.data} />
  );
};

const SettingsForm = ({ data }: { data: unknown }) => {
  const queryClient = useQueryClient();

  const initialSettings = useMemo(
    () => getSettingsObject(data),
    [data]
  );

  const [form, setForm] = useState<SettingsForm>(initialSettings);

  const updateMutation = useMutation({
    mutationFn: async (settings: SettingsForm) => {
      await Promise.all(
        Object.entries(settings).map(([key, value]) =>
          updateAdminSetting(key, { value })
        )
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-settings"],
      });

      toast.success("Settings saved successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const updateField = <K extends keyof SettingsForm>(
    key: K,
    value: SettingsForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSave = () => {
    updateMutation.mutate(form);
  };

  return (
    <div className="min-h-full bg-[#F8F6F2] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <PageHeader
            title="Settings"
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 rounded-full bg-[#C9A227] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#A98218] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />

            {updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>

        <div className="space-y-6">
          {/* General Information */}
          <SettingsCard
            icon={<Building2 size={19} />}
            title="General Information"
            description="Basic information about your business."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SettingInput
                label="Business Name"
                value={form.business_name}
                placeholder="Signature by Sarah"
                onChange={(value) =>
                  updateField("business_name", value)
                }
              />

              <SettingInput
                label="Contact Email"
                type="email"
                icon={<Mail size={16} />}
                value={form.contact_email}
                placeholder="hello@signaturebysarah.com"
                onChange={(value) =>
                  updateField("contact_email", value)
                }
              />

              <SettingInput
                label="Notification Email"
                type="email"
                icon={<Mail size={16} />}
                value={form.notification_email}
                placeholder="signaturebysarah1@gmail.com"
                onChange={(value) =>
                  updateField("notification_email", value)
                }
              />

              <SettingInput
                label="Phone Number"
                icon={<Phone size={16} />}
                value={form.phone_number}
                placeholder="+234 803 000 0000"
                onChange={(value) =>
                  updateField("phone_number", value)
                }
              />
            </div>
          </SettingsCard>

          {/* Social Links */}
          <SettingsCard
            icon={<Settings size={19} />}
            title="Social Links"
            description="Connect your social media profiles."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SettingInput
                label="Instagram"
                value={form.instagram_url}
                placeholder="https://instagram.com/signaturebysarah"
                onChange={(value) =>
                  updateField("instagram_url", value)
                }
              />

              <SettingInput
                label="Facebook"
                value={form.facebook_url}
                placeholder="https://facebook.com/signaturebysarah"
                onChange={(value) =>
                  updateField("facebook_url", value)
                }
              />

              <SettingInput
                label="TikTok"
                value={form.tiktok_url}
                placeholder="https://tiktok.com/@signaturebysarah"
                onChange={(value) =>
                  updateField("tiktok_url", value)
                }
              />
            </div>
          </SettingsCard>

          {/* Brand Assets */}
          <SettingsCard
            icon={<ImageIcon size={19} />}
            title="Brand Assets"
            description="Manage the visual assets used across the platform."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <AssetInput
                title="Logo"
                description="Main brand logo."
                value={form.logo_url}
                onChange={(value) =>
                  updateField("logo_url", value)
                }
              />

              <AssetInput
                title="Favicon"
                description="Browser tab icon."
                value={form.favicon_url}
                onChange={(value) =>
                  updateField("favicon_url", value)
                }
              />
            </div>
          </SettingsCard>

          {/* Notifications */}
          <SettingsCard
            icon={<Bell size={19} />}
            title="Email Notifications"
            description="Control customer notification emails."
          >
            <div className="divide-y divide-[#EEEAE4]">
              <ToggleSetting
                title="Customer Quote Emails"
                description="Send customers a confirmation email after they submit a quote."
                checked={form.notify_customer_on_quote}
                onChange={(value) =>
                  updateField("notify_customer_on_quote", value)
                }
              />

              <ToggleSetting
                title="Customer Order Emails"
                description="Send customers a confirmation email after they submit a cart order."
                checked={form.notify_customer_on_cart}
                onChange={(value) =>
                  updateField("notify_customer_on_cart", value)
                }
              />
            </div>
          </SettingsCard>

          <div className="flex justify-end pb-8">
            <button
              type="button"
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 rounded-full bg-[#18120E] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2A211B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />

              {updateMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsCard = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F1DC] text-[#A98218]">
          {icon}
        </div>

        <div>
          <h2 className="text-base font-semibold text-[#18120E]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-[#77716B]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
};

const SettingInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#302A25]">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A39C94]">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-[#E3DED6] bg-[#FCFBF9] text-sm text-[#18120E] outline-none transition placeholder:text-[#A7A09A] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 ${
            icon ? "pl-10 pr-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
};

const AssetInput = ({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="rounded-xl border border-dashed border-[#DCD5CC] bg-[#FCFBF9] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[#302A25]">
            {title}
          </h3>

          <p className="mt-1 text-xs text-[#8A837C]">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#A98218] shadow-sm">
          <Upload size={16} />
        </div>
      </div>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste image URL"
        className="h-10 w-full rounded-lg border border-[#E3DED6] bg-white px-3 text-sm text-[#18120E] outline-none placeholder:text-[#A7A09A] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
      />

      <p className="mt-2 text-[11px] text-[#99918A]">
        PNG, SVG or WebP
      </p>
    </div>
  );
};

const ToggleSetting = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <h3 className="text-sm font-medium text-[#302A25]">
          {title}
        </h3>

        <p className="mt-1 max-w-2xl text-xs text-[#8A837C]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#C9A227]" : "bg-[#D8D3CC]"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

export default SettingsPage;
