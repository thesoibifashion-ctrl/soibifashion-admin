import { XCircle } from "lucide-react";

interface formData {
  name: string;
  value?: string;
  placeholder: string;
  label: string;
  type: string;
  defaultValue?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  name,
  value,
  defaultValue = "",
  placeholder,
  label,
  type,
  errorMessage,
  onChange,
}: formData) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <label className="font-medium text-sm text-[#404944] ">{label}</label>
      <input
        className="border border-[#C0C9C3] placeholder:font-normal placeholder:text-sm placeholder:text-[#6B7280] rounded-[8px] px-3 h-10 bg-[#3A3E3D0D]"
        name={name}
        defaultValue={value === undefined ? defaultValue : undefined}
        value={value}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
      />
      {errorMessage && (
        <p className="text-[red] mt-1 flex items-center gap-1">
          <XCircle size={14} />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormInput;