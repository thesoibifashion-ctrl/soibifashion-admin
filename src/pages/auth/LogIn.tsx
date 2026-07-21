"use client";
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "../../components/shared/inputs/AuthButton";
import TextInput from "../../components/shared/inputs/TextInput";
import AuthLayout from "../../components/layouts/AuthLayout";
import PasswordInput from "../../components/shared/inputs/PasswordInput";
import { useMutation } from "@tanstack/react-query";
import { authLogin } from "@/api/requests/auth";
import { useState } from "react";
import RequestPassword from "./RequestPassword";
import { ArrowLeft } from "lucide-react";
import Countdown from "@/components/shared/CountDown";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: loginMutation, isPending } = useMutation({
    mutationFn: authLogin,
    onSuccess: (result) => {
      localStorage.setItem("accessToken", result?.accessToken);
      navigate("/");
    },
  });

  const { mutate: resendEmail, isPending: isResending } = useMutation({
    mutationFn: () => Promise.resolve(), 
    onSuccess: () => {
      setEmailSent(true);
    },
  });

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginMutation({ email, password });
      console.log(result.accessToken, result.user);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Invalid email or password. Please try again.");
    }
  };

  if (emailSent) {
    return (
      <div>
        <AuthLayout title="Email has been sent">
          <div className="p-4 mt-8 rounded-[16px] bg-[#FAFAFA]">
            <p className="font-normal text-sm text-[#0D0D0D99]">
              Thanks Admin! we've sent you an email containing further
              instructions for resetting your password.
              <br />
              <br />
              If you haven't received an email in 5 minutes, check your spam or
              <Countdown
                seconds={10}
                isResending={isResending}
                onResend={() => resendEmail()}
              />
            </p>
          </div>
          <div className="mt-10">
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
  }

  return (
    <div className="">
      <AuthLayout title="Welcome Back CEPHF">
        <form onSubmit={handleSubmit} className="mt-13">
          <div className="flex flex-col gap-6">
            <TextInput
              label={"Email"}
              value={email}
              name={"email"}
              placeholder={"cf@gmail.com"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              label={"Password"}
              value={password}
              name={"password"}
              placeholder={"Enter password"}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-13.5">
            <AuthButton text={"Log in"} loading={isPending} />
          </div>
        </form>
        <RequestPassword text="Forgot Password?" />
      </AuthLayout>
    </div>
  );
};

export default LogIn;
