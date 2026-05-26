"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/public/brand-logo";

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={null}>
      <AdminLoginForm />
    </React.Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    errorParam === "access_denied"
      ? "Your account does not have access to the admin panel."
      : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setLoading(false);
      if (authError.message.toLowerCase().includes("invalid")) {
        setError("Wrong email or password - please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email address first, then click Forgot password.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setError(null);
    alert("Password reset email sent. Check your inbox.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(201,169,97,0.22),transparent_34%),linear-gradient(180deg,#fffdf8_0%,#f5eddf_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#eadfca] bg-white/92 p-7 shadow-[0_28px_90px_rgba(39,29,12,0.12)] backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex justify-center">
            <BrandLogo height={58} />
          </div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#c9a961]">
            Hilton Euphoria Hotel
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#151515]">Admin sign in</h1>
          <p className="mt-2 text-sm text-[#746b5c]">Access the hotel management workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#7b725f]">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[#eadfca] bg-[#fffdf8] px-4 py-3 text-sm text-[#151515] placeholder:text-[#9f9686] focus:border-[#c9a961]/60 focus:outline-none focus:ring-1 focus:ring-[#c9a961]/30"
              placeholder="you@hotel.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#7b725f]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#eadfca] bg-[#fffdf8] px-4 py-3 pr-10 text-sm text-[#151515] placeholder:text-[#9f9686] focus:border-[#c9a961]/60 focus:outline-none focus:ring-1 focus:ring-[#c9a961]/30"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b725f] hover:text-[#151515]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c9a961] text-xs font-semibold uppercase tracking-[0.18em] text-[#17181a] shadow-[0_16px_35px_rgba(201,169,97,0.28)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
          </button>
        </form>

        <button
          onClick={handleForgotPassword}
          className="mt-4 w-full text-center text-xs text-[#746b5c] hover:text-[#151515]"
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}
