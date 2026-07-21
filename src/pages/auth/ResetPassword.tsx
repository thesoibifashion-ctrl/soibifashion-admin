// import AuthButton from "../../components/shared/inputs/AuthButton";
// import AuthLayout from "../../components/layouts/AuthLayout";
// import PasswordInput from "../../components/shared/inputs/PasswordInput";
// import { useState } from "react";

// const ResetPassword = () => {
//   const [errorMessage, setErrorMessage] = useState("");

//   function handleSubmit(formData: FormData) {
//     const data = Object.fromEntries(formData);

//     if (data.password !== data.newpassword) {
//       setErrorMessage("Password and confirm password must match");
//     }
//   }

//   return (
//     <div className="">
//       <AuthLayout title="Reset your password">
//         <form action={handleSubmit} className="mt-13">
//           <div className="flex flex-col gap-6">
//             <PasswordInput
//               label={"Password"}
//               value={""}
//               name={"password"}
//               placeholder={"Enter password"}
//             />
//             <PasswordInput
//               label={"Re-type new password"}
//               value={""}
//               name={"newpassword"}
//               placeholder={"Enter password"}
//             />
//           </div>
//           <p className="mt-2 text-[red] text-sm font-normal">{errorMessage}</p>
//           <div className="mt-13.5">
//             <AuthButton text={"Log in"} />
//           </div>
//         </form>
//       </AuthLayout>
//     </div>
//   );
// };

// export default ResetPassword;
import AuthButton from "../../components/shared/inputs/AuthButton";
import AuthLayout from "../../components/layouts/AuthLayout";
import PasswordInput from "../../components/shared/inputs/PasswordInput";
import SuccessModal from "@/components/shared/modals/SuccessModal";
import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/api/mutation";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  function resetPasswordRequest(payload: Record<string, any>) {
    return apiPost("/user/reset-password", payload);
  }

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      setShowModal(true);
    },
    onError: (err: any) => {
      setErrorMessage(
        err?.message || "Something went wrong. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and confirm password must match");
      return;
    }

    if (!token) {
      setErrorMessage("Reset link is invalid or has expired");
      return;
    }

    resetPassword({ token, password });
  };

  return (
    <div className="">
      <AuthLayout title="Reset your password">
        <form onSubmit={handleSubmit} className="mt-13">
          <div className="flex flex-col gap-6">
            <PasswordInput
              label={"Password"}
              value={password}
              name={"password"}
              placeholder={"Enter password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordInput
              label={"Re-type new password"}
              value={confirmPassword}
              name={"newpassword"}
              placeholder={"Enter password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <p className="mt-2 text-[red] text-sm font-normal">{errorMessage}</p>
          <div className="mt-13.5">
            <AuthButton text={"Reset password"} loading={isPending} />
          </div>
        </form>
      </AuthLayout>

      <SuccessModal
        open={showModal}
        onOpenChange={setShowModal}
        title="Password reset successful"
        description="You can now log in with your new password."
        // footer={
        //   <button
        //     onClick={() => navigate("/auth/login")}
        //     className="w-full py-2 bg-[#186D0F] text-white rounded-full text-sm font-medium"
        //   >
        //     Go to login
        //   </button>
        // }
      >
        <button
          onClick={() => navigate("/auth/login")}
          className="w-full mt-2 py-2 bg-[#186D0F] text-white rounded-full text-sm font-medium"
        >
          Go to login
        </button>
      </SuccessModal>
    </div>
  );
};

export default ResetPassword;
