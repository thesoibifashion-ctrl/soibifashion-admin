// import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { requestPassword } from "@/api/requests/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const EmailConfirm = () => {
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
    <div className="">
      <AuthLayout title="Email has been sent">
        <div className="p-4 mt-8 rounded-[16px] bg-[#FAFAFA]">
          <p className="font-normal text-sm text-[#0D0D0D99]">
            Thanks Admin! we've sent you an email containing further
            instructions for resetting your password. <br />
            <br /> If you haven't received an email in 5 minutes, check your
            spam or
            <span
              onClick={handleClick}
              className="text-[#186D0F] ml-1 cursor-pointer"
            >
              {isPending ? "resending" : "resend"}
            </span>
          </p>
        </div>
        <div className=" mt-10">
          <Link
            to={"/auth/login"}
            className="flex items-center gap-1 justify-center font-normal text-sm text-[#186D0F]"
          >
            <ArrowLeft size={14} />
            Return to login
          </Link>
        </div>
      </AuthLayout>
    </div>
  );
};

export default EmailConfirm;
