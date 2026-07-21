import { Loader2 } from "lucide-react";

interface AuthButtonProps {
  text: string;
  loading?:boolean
}
const AuthButton = ({ text,loading }: AuthButtonProps) => {
  return (
    <button 
    className="py-3 w-full text-[#FFFFFF] bg-[#186D0F] rounded-[16px]">
      {loading ? <Loader2 className="animate-spin mx-auto" /> : text}
    </button>
  );
};

export default AuthButton;
