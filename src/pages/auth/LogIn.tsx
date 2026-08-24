import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/sarah-logo.jpg";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { authStorage } from "@/lib/auth-storage";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      authStorage.setToken(response.data.accessToken);
  
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAF8]">
      {/* Left — brand panel */}
      <div className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-[#18120E] p-14 lg:flex">
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Editorial photo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=1200&fit=crop&auto=format&q=80"
            alt="Signature by Sarah editorial"
            className="h-full w-full object-cover opacity-30"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#18120E] via-[#18120E]/40 to-transparent" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#8B5E3C]">
              <img
                src={logo}
                alt="Signature by Sarah"
                className="h-full w-full rounded-sm object-cover"
              />
            </div>

            <div>
              <p className="font-display text-base font-semibold leading-none text-white">
                Signature by Sarah
              </p>

              <p className="mt-0.5 text-xs tracking-wide text-[#C9A227]">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="mb-6 font-display text-2xl font-medium leading-relaxed text-white">
            "Every shoe tells a story.
            <br />
            Every step, a signature."
          </blockquote>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-[#8B5E3C]/40">
              <img
                src={logo}
                alt="Sarah"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-white">Sarah</p>

              <p className="text-xs text-[#C9A227]">
                Founder & Creative Director
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5E3C]">
            <img
              src={logo}
              alt="Signature by Sarah"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>

          <div>
            <p className="font-display text-base font-semibold leading-none text-[#1C1917]">
              Signature by Sarah
            </p>

            <p className="mt-0.5 text-xs text-[#C9A227]">
              Admin Portal
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="mb-2 font-display text-[2rem] font-semibold leading-tight text-[#1C1917]">
              Welcome back
            </h1>

            <p className="text-sm leading-relaxed text-[#78716C]">
              Sign in to your admin dashboard to manage products, orders, and
              more.
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#1C1917]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-[#E7E2DC] bg-white px-4 text-sm text-[#1C1917] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#1C1917]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="h-12 w-full rounded-xl border border-[#E7E2DC] bg-white px-4 text-sm text-[#1C1917] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
              />
            </div>

            {/* Error */}
            {loginMutation.isError && (
              <p className="text-sm text-red-600">
                Unable to sign in. Please check your email and password.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#18120E] text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-[#2A211B] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending ? "Signing you in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E7E2DC]" />

            <span className="text-xs font-medium text-[#A8A29E]">
              Authorised access only
            </span>

            <div className="h-px flex-1 bg-[#E7E2DC]" />
          </div>

          {/* Fine print */}
          <p className="text-center text-xs leading-relaxed text-[#A8A29E]">
            Access is restricted to authorised SBS team members.
            <br />
            Unauthorised access attempts are logged.
          </p>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-[10px] text-[#C4BBAF]">
          © {new Date().getFullYear()} Signature by Sarah · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default LogIn;