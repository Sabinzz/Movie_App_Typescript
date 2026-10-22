"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NeuButton, NeuInput } from "@/components/neu";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8]">
          <p className="text-[#9a9a9a]">Loading reset form...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8]">
        <p className="text-[#a10f0f] font-semibold">Invalid reset link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8] font-[Poppins,sans-serif]">
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 520,
          height: 520,
          background: "#e8e8e8",
          boxShadow:
            "-22px -22px 44px #ffffff, 22px 22px 50px #c3c3c3, -1px -1px 1px rgba(255,255,255,0.5) inset",
        }}
      >
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 496,
            height: 496,
            border: "1px solid rgba(255,255,255,0.65)",
            boxShadow:
              "inset 3px 3px 9px rgba(163,163,163,0.18), inset -3px -3px 9px rgba(255,255,255,0.7)",
          }}
        />
        <form
          onSubmit={handleSubmit}
          noValidate
          className="relative z-10 w-[290px]"
        >
          <h1
            className="text-center text-[36px] font-bold tracking-[0.5px] text-[#4a4a4a] mb-1"
            style={{
              textShadow:
                "1px 1px 1px rgba(255,255,255,0.9), -2px -2px 1px rgba(163,163,163,0.25)",
            }}
          >
            Reset
          </h1>
          <p className="text-center text-[12.5px] font-medium text-[#9a9a9a] mb-7">
            {success
              ? "Password updated! Redirecting…"
              : "Enter your new password"}
          </p>

          {error && (
            <p className="mb-4 text-center text-xs text-red-500">{error}</p>
          )}

          {!success && (
            <>
              <NeuInput
                icon="mdi:lock"
                type="password"
                placeholder="New password"
                value={password}
                onChange={setPassword}
              />
              <NeuInput
                icon="mdi:lock"
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={setConfirm}
              />
              <div className="mb-[30px]" />
              <NeuButton type="submit" loading={loading}>
                {loading ? "Saving…" : "Reset Password"}
              </NeuButton>
            </>
          )}

          {success && (
            <p className="text-center text-[13px] text-[#17a34a] font-semibold">
              ✓ Password updated successfully
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
