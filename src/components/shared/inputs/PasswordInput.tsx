import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  label: string;
  value?: string;
  name: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({
  label,
  value,
  name,
  placeholder,
  onChange,

}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-sm text-[#404944]">{label}</label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          defaultValue={value}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          className="bg-[#3A3E3D0D] border border-[#E6E6E8] px-3 pr-10 h-10 w-full rounded-[10px] placeholder:text-base placeholder:text-[#6B7280] focus:outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
