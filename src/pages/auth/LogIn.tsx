import { useEffect, useRef, useState } from "react";
import logo from "@/assets/images/soibi.png";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authStorage } from "@/lib/auth-storage";
import { requestCode, verifyCode } from "@/api/requests/auth";

type LoginView = "email" | "code";

const RESEND_SECONDS = 60;

const LogIn = () => {
  const [view, setView] = useState<LoginView>("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const requestCodeMutation = useMutation({
    mutationFn: requestCode,

    onSuccess: () => {
      setView("code");
      setDigits(["", "", "", "", "", ""]);
      setCountdown(RESEND_SECONDS);

      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    },

    onError: (error) => {
      console.error("Failed to send login code:", error);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: verifyCode,

    onSuccess: (response) => {
      const user = response.data.user;

      if (user.role !== "admin" && user.role !== "super_admin") {
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }
console.log(response)
      authStorage.setToken(response.data.accessToken);
      window.location.href = "/";
    },

    onError: (error) => {
      console.error("Code verification failed:", error);

      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  const handleSendCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    requestCodeMutation.mutate({
      email: email.trim(),
    });
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 1);

    const next = [...digits];
    next[index] = cleaned;

    setDigits(next);

    if (cleaned && index < digits.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = next.join("");

    if (fullCode.length === digits.length) {
      verifyCodeMutation.mutate({
        email,
        code: fullCode,
      });
    }
  };

  const handleDigitKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, digits.length);

    if (!pasted) return;

    const next = [...digits];

    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }

    setDigits(next);

    inputRefs.current[
      Math.min(pasted.length, digits.length - 1)
    ]?.focus();

    if (pasted.length === digits.length) {
      verifyCodeMutation.mutate({
        email,
        code: pasted,
      });
    }
  };

  const handleResend = () => {
    if (countdown > 0 || !email.trim()) return;

    requestCodeMutation.mutate({
      email: email.trim(),
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8F6F2]">
      {/* Left — Brand panel */}
      <div className="relative hidden w-[52%] overflow-hidden bg-[#171411] lg:block">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=1600&fit=crop&auto=format&q=85"
            alt="Soibi Fashion"
            className="h-full w-full object-cover opacity-45"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#171411] via-[#171411]/45 to-[#171411]/20" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md bg-white">
              <img
                src={logo}
                alt="Soibi Fashion"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-[15px] font-medium tracking-wide text-white">
                The Soibi Fashion
              </p>

              <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-[#C8A96B]">
                Admin Portal
              </p>
            </div>
          </div>

          <div className="max-w-lg">
            <div className="mb-6 h-px w-12 bg-[#C8A96B]" />

            <h1 className="font-serif text-4xl font-medium leading-[1.15] tracking-tight text-white xl:text-5xl">
              Fashion is not just
              <br />
              what you wear.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/65">
              Manage your collections, products, orders, and everything that
              brings The Soibi Fashion to life.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/40">
            <span>Est. The Soibi Fashion</span>
            <span>Admin Access</span>
          </div>
        </div>
      </div>

      {/* Right — Login */}
      <div className="relative flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-14 flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md bg-[#171411]">
            <img
              src={logo}
              alt="Soibi Fashion"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-[15px] font-medium text-[#171411]">
              The Soibi Fashion
            </p>

            <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-[#A8864F]">
              Admin Portal
            </p>
          </div>
        </div>

        <div className="w-full max-w-[380px]">
          {/* Email */}
          {view === "email" && (
            <>
              <div className="mb-10">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#A8864F]">
                  Welcome back
                </p>

                <h2 className="font-serif text-[2.35rem] font-medium leading-tight tracking-tight text-[#171411]">
                  Sign in to your account
                </h2>

                <p className="mt-4 text-sm leading-6 text-[#78716C]">
                  Enter your authorised email address and we&apos;ll send you
                  a secure login code.
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#29231F]">
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-[52px] w-full rounded-md border border-[#DED8D0] bg-white px-4 text-sm text-[#29231F] outline-none transition focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={requestCodeMutation.isPending}
                  className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-md bg-[#171411] text-sm font-medium text-white transition-all duration-200 hover:bg-[#29231F] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
                >
                  {requestCodeMutation.isPending ? (
                    <Loader2 size={19} className="animate-spin" />
                  ) : (
                    "Send Login Code"
                  )}
                </button>
              </form>

              <div className="my-9 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#E4DED6]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A8A29E]">
                  Secure access
                </span>

                <div className="h-px flex-1 bg-[#E4DED6]" />
              </div>

              <div className="rounded-md border border-[#E7E0D7] bg-[#FDFBF8] px-5 py-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFE7D8]">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="text-[#9A7946]"
                    >
                      <path d="M12 3l8 4v5c0 4.5-3.1 7.7-8 9-4.9-1.3-8-4.5-8-9V7l8-4Z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>

                  <p className="text-xs leading-5 text-[#78716C]">
                    Admin access is restricted to authorised Soibi Fashion
                    team members. A six-digit verification code will be sent
                    to your email.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-center text-[11px] leading-5 text-[#A8A29E]">
                Your verification code expires after a limited time and can
                only be used once.
              </p>
            </>
          )}

          {/* Code */}
          {view === "code" && (
            <>
              <button
                type="button"
                onClick={() => setView("email")}
                className="mb-6 flex items-center gap-2 text-sm text-[#78716C] transition-colors hover:text-[#171411]"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <div className="mb-10">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#A8864F]">
                  Verification
                </p>

                <h2 className="font-serif text-[2.35rem] font-medium leading-tight tracking-tight text-[#171411]">
                  Enter your code
                </h2>

                <p className="mt-4 text-sm leading-6 text-[#78716C]">
                  We sent a 6-digit verification code to{" "}
                  <span className="font-medium text-[#171411]">
                    {email}
                  </span>
                  .
                </p>
              </div>

              <div className="flex justify-between gap-2">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={verifyCodeMutation.isPending}
                    onChange={(event) =>
                      handleDigitChange(index, event.target.value)
                    }
                    onKeyDown={(event) =>
                      handleDigitKeyDown(index, event)
                    }
                    onPaste={handleDigitPaste}
                    className="h-12 w-12 rounded-md border border-[#DED8D0] bg-white text-center text-xl font-semibold text-[#171411] outline-none transition focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/20 disabled:opacity-60"
                  />
                ))}
              </div>

              {verifyCodeMutation.isPending && (
                <div className="mt-5 flex justify-center">
                  <Loader2
                    size={19}
                    className="animate-spin text-[#A8864F]"
                  />
                </div>
              )}

              <div className="mt-7 text-center text-sm text-[#78716C]">
                {countdown > 0 ? (
                  <span>Resend code in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={requestCodeMutation.isPending}
                    className="font-medium text-[#171411] underline underline-offset-4 disabled:opacity-60"
                  >
                    {requestCodeMutation.isPending
                      ? "Sending..."
                      : "Resend code"}
                  </button>
                )}
              </div>

              <div className="mt-9 rounded-md border border-[#E7E0D7] bg-[#FDFBF8] px-5 py-4">
                <p className="text-center text-xs leading-5 text-[#78716C]">
                  The code is valid for a limited time and can only be used
                  once.
                </p>
              </div>
            </>
          )}
        </div>

        <p className="absolute bottom-6 text-[10px] tracking-wide text-[#B5ADA3]">
          © {new Date().getFullYear()} The Soibi Fashion
        </p>
      </div>
    </div>
  );
};

export default LogIn;
