import { requestPassword } from "@/api/requests/auth";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  text?: string;
}

const RequestPassword = ({ text }: Props) => {
  const email = "pearlodi7@gmail.com";
  const navigate = useNavigate();

  const { mutate: requestPasswordMutation, isPending } = useMutation({
    mutationFn: requestPassword,
    onSuccess: () => {
      navigate("/auth/email-confirm");
    },
    onError: (error) => {
      toast.error(error?.message || "Request failed");
    },
  });

  const handleClick = () => {
    requestPasswordMutation({ email });
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="font-normal text-sm text-[#186D0F]"
      >
        {isPending ? (
          <span className="flex items-center gap-1">
            <Loader2 className="animate-spin" />
            {text}
          </span>
        ) : (
          text
        )}
      </button>
    </div>
  );
};

export default RequestPassword;
