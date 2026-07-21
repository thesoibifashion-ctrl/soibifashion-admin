interface MessageInputProps {
    name: string;
    label: string;
    placeholder: string;
    value?: string;
    defaultValue?: string;
    rows?: number;
  }
  
  const MessageInput = ({
    name,
    label,
    placeholder,
    defaultValue,
    rows = 5,
  }: MessageInputProps) => {
    return (
      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-sm text-[#404944]">
          {label}
        </label>
  
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={rows}
          placeholder={placeholder}
          className="border border-[#C0C9C3] placeholder:font-normal placeholder:text-sm placeholder:text-[#6B7280] rounded-[8px] px-3 py-3 bg-[#3A3E3D0D] resize-none"
        />
      </div>
    );
  };
  
  export default MessageInput;