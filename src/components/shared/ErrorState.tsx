import emptyfile from "@/assets/images/error.png";
import { RefreshCwIcon } from "lucide-react";

interface ErrorProps {
  text?: string;
  children?: React.ReactNode;
}
const ErrorState = ({ children }: ErrorProps) => {
  return (
    <div className="flex justify-center flex-col items-center">
      <img className="w-60" src={emptyfile} />

      <h1 className="text-[100px] leading-26 font-bold">OOPS!</h1>
      <p className="text-sm">Something went wrong</p>
      <p
        onClick={() => window.location.reload()}
        className="mt-3  text-[green] cursor-pointer flex items-center gap-1 rounded-[16px]"
      >
        <RefreshCwIcon size={14} /> Reload page
      </p>
      {children}
    </div>
  );
};

export default ErrorState;
