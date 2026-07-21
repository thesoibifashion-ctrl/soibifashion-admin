interface InputProps {
  label: string;
  value: string;
  name: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = ({ label, value, name, placeholder, onChange }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-base text-[#404944]">{label}</label>
      <input
        className="bg-[#3A3E3D0D] border border-[#E6E6E8] px-3 h-10 rounded-[10px] placeholder:text-base placeholder:text-[#6B7280]"
        defaultValue={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInput;