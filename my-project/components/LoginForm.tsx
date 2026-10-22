"use client";

import { useState } from "react";
import { NeuButton, NeuInput } from "@/components/neu";

type View = "login" | "signup" | "forgot";

export default function LoginForm() {
  const [view, setView] = useState<View>("login");
  const [isFlipped, setIsFlipped] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
        rememberMe,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginError(data.error || "Login failed");
      setLoginLoading(false);
      return;
    }
    setLoginLoading(false);
    window.location.href = "/dashboard";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setSignupError(data.error || "Sign up failed");
      setSignupLoading(false);
      return;
    }
    setSignupLoading(false);
    window.location.href = "/dashboard";
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });
    const data = await res.json();
    if (!res.ok) {
      setForgotError(data.error || "Something went wrong");
      setForgotLoading(false);
      return;
    }
    setForgotLoading(false);
    setForgotSuccess(true);
  };

  const goToLogin = () => {
    setView("login");
    setIsFlipped(false);
  };

  const goToSignup = () => {
    setView("signup");
    setIsFlipped(true);
  };

  const goToForgot = () => {
    setForgotError("");
    setForgotSuccess(false);
    setView("forgot");
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8] overflow-hidden font-[Poppins,sans-serif]">
      <div
        className="relative"
        style={{ width: 520, height: 520, perspective: 1800 }}
      >
        <div
          className="relative w-full h-full transition-transform duration-[900ms]"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
          }}
        >
          <Face>
            {view === "forgot" ? (
              <form
                onSubmit={handleForgot}
                noValidate
                className="relative z-10 w-[290px]"
              >
                <h1
                  className="text-center text-[40px] font-bold tracking-[0.5px] text-[#4a4a4a] mb-1"
                  style={{
                    textShadow:
                      "1px 1px 1px rgba(255,255,255,0.9), -2px -2px 1px rgba(163,163,163,0.25)",
                  }}
                >
                  Forgot Password
                </h1>
                <p className="text-center text-[12.5px] font-medium tracking-[0.3px] text-[#9a9a9a] mb-7">
                  Enter your email to reset your password
                </p>

                {forgotError && (
                  <p className="mb-4 text-center text-xs text-red-500">
                    {forgotError}
                  </p>
                )}

                {!forgotSuccess && (
                  <>
                    <NeuInput
                      icon="mdi:email"
                      type="email"
                      placeholder="Email"
                      value={forgotEmail}
                      onChange={setForgotEmail}
                      autoComplete="email"
                    />
                    <div className="mb-[30px]" />
                    <NeuButton type="submit" loading={forgotLoading}>
                      {forgotLoading ? "Sending…" : "Send reset link"}
                    </NeuButton>
                  </>
                )}

                {forgotSuccess && (
                  <div className="mb-6 text-center text-[12.5px] text-[#17a34a]">
                    ✓ Reset link sent to {forgotEmail}
                  </div>
                )}

                <p className="text-center mt-[22px] text-[12px] text-[#9a9a9a]">
                  <button
                    type="button"
                    onClick={goToLogin}
                    className="text-[#a10f0f] font-semibold cursor-pointer bg-transparent border-none p-0"
                  >
                    ← Back to login
                  </button>
                </p>
              </form>
            ) : (
              <form
                onSubmit={handleLogin}
                noValidate
                className="relative z-10 w-[290px]"
              >
                <h1
                  className="text-center text-[40px] font-bold tracking-[0.5px] text-[#4a4a4a] mb-1"
                  style={{
                    textShadow:
                      "1px 1px 1px rgba(255,255,255,0.9), -2px -2px 1px rgba(163,163,163,0.25)",
                  }}
                >
                  Login
                </h1>
                <p className="text-center text-[12.5px] font-medium tracking-[0.3px] text-[#9a9a9a] mb-7">
                  Sign in to your account
                </p>

                {loginError && (
                  <p className="mb-4 text-center text-xs text-red-500">
                    {loginError}
                  </p>
                )}

                <NeuInput
                  icon="mdi:account"
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={setLoginEmail}
                  autoComplete="email"
                />
                <NeuInput
                  icon="mdi:lock"
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  autoComplete="current-password"
                />

                <div className="flex items-center justify-between mt-[-1px] mb-[30px]">
                  <div className="flex items-center gap-[10px] text-[12px] text-[#929191]">
                    <Switch
                      on={rememberMe}
                      onToggle={() => setRememberMe((v) => !v)}
                    />
                    Remember me
                  </div>
                  <button
                    type="button"
                    onClick={goToForgot}
                    className="text-[12px] text-[#929191] hover:text-[#a10f0f] transition-colors duration-300 bg-transparent border-none cursor-pointer p-0"
                  >
                    Forgot password?
                  </button>
                </div>

                <NeuButton type="submit" loading={loginLoading}>
                  {loginLoading ? "Signing in…" : "Sign In"}
                </NeuButton>

                <p className="text-center mt-[22px] text-[12px] text-[#9a9a9a]">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={goToSignup}
                    className="text-[#a10f0f] font-semibold cursor-pointer bg-transparent border-none p-0"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )}
          </Face>

          {/* BACK: SIGN UP */}
          <Face back>
            <form
              onSubmit={handleSignup}
              noValidate
              className="relative z-10 w-[290px]"
            >
              <h1
                className="text-center text-[40px] font-bold tracking-[0.5px] text-[#4a4a4a] mb-1"
                style={{
                  textShadow:
                    "1px 1px 1px rgba(255,255,255,0.9), -2px -2px 1px rgba(163,163,163,0.25)",
                }}
              >
                Sign Up
              </h1>
              <p className="text-center text-[12.5px] font-medium tracking-[0.3px] text-[#9a9a9a] mb-7">
                Create your account
              </p>

              {signupError && (
                <p className="mb-4 text-center text-xs text-red-500">
                  {signupError}
                </p>
              )}

              <NeuInput
                icon="mdi:account"
                type="text"
                placeholder="Full name"
                value={signupName}
                onChange={setSignupName}
                autoComplete="name"
              />
              <NeuInput
                icon="mdi:email"
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={setSignupEmail}
                autoComplete="email"
              />
              <div className="mb-[30px]">
                <NeuInput
                  icon="mdi:lock"
                  type="password"
                  placeholder="Password"
                  value={signupPassword}
                  onChange={setSignupPassword}
                  autoComplete="new-password"
                />
              </div>

              <NeuButton type="submit" loading={signupLoading}>
                {signupLoading ? "Creating…" : "Create Account"}
              </NeuButton>

              <p className="text-center mt-[22px] text-[12px] text-[#9a9a9a]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={goToLogin}
                  className="text-[#a10f0f] font-semibold cursor-pointer bg-transparent border-none p-0"
                >
                  Login
                </button>
              </p>
            </form>
          </Face>
        </div>
      </div>
    </div>
  );
}

/* ─── Neumorphic circle face ─── */
function Face({
  children,
  back = false,
}: {
  children: React.ReactNode;
  back?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-full"
      style={{
        width: 520,
        height: 520,
        background: "#e8e8e8",
        boxShadow:
          "-22px -22px 44px #ffffff, 22px 22px 50px #c3c3c3, -1px -1px 1px rgba(255,255,255,0.5) inset",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
        zIndex: 5,
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: 12,
          border: "1px solid rgba(255,255,255,0.65)",
          boxShadow:
            "inset 3px 3px 9px rgba(163,163,163,0.18), inset -3px -3px 9px rgba(255,255,255,0.7)",
        }}
      />
      {children}
    </div>
  );
}

/* ─── Neumorphic toggle switch ─── */
function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="relative cursor-pointer flex-shrink-0"
      style={{
        width: 32,
        height: 18,
        borderRadius: 20,
        background: "#e8e8e8",
        boxShadow: on
          ? "inset 3px 3px 6px rgba(120,10,10,0.35), inset -3px -3px 6px rgba(212,175,55,0.25)"
          : "inset 3px 3px 6px rgba(184,190,204,0.5), inset -3px -3px 6px rgba(255,255,255,0.9)",
        transition: "box-shadow 0.25s ease",
      }}
    >
      <div
        className="absolute top-[2px] rounded-full"
        style={{
          width: 14,
          height: 14,
          background: on ? "#a10f0f" : "#e8e8e8",
          boxShadow: "1px 1px 3px rgba(0,0,0,0.25)",
          left: on ? 16 : 2,
          transition: "left 0.25s ease, background 0.25s ease",
        }}
      />
    </div>
  );
}
