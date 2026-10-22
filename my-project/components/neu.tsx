"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@iconify/react";

export function NeuInput({
  icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  icon: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative mb-[18px]">
      <Icon
        icon={icon}
        className={`absolute left-[18px] top-1/2 -translate-y-1/2 text-[15px] z-[2] transition-colors duration-[350ms] ${focused ? "text-[#a10f0f]" : "text-[#909090]"}`}
      />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        className="w-full h-[46px] pl-[45px] pr-[18px] border-none outline-none rounded-[12px] bg-[#e8e8e8] text-[#4a4a4a] text-[14.5px] font-medium tracking-[0.2px] placeholder-[#a3a3a3] transition-all duration-[400ms]"
        style={{
          boxShadow: focused
            ? "inset 3px 3px 6px rgba(120,10,10,0.35), inset -3px -3px 6px rgba(212,55,55,0.25)"
            : "inset -6px -6px 10px rgba(255,255,255,0.95), inset 6px 6px 10px rgba(184,190,204,0.45)",
          transform: focused ? "translateY(-2px)" : "translateY(0)",
          fontFamily: "Poppins, sans-serif",
        }}
      />
    </div>
  );
}

export function NeuButton({
  children,
  type = "button",
  loading = false,
}: {
  children: ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      type={type}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      className="relative w-[290px] h-[40px] flex items-center justify-center mx-auto overflow-hidden border-none outline-none rounded-[12px] cursor-pointer text-[15.5px] font-semibold tracking-[1px] uppercase transition-all duration-[400ms] disabled:opacity-70 disabled:cursor-not-allowed"
      style={{
        fontFamily: "Poppins, sans-serif",
        color: hovered ? "#f5e9c8" : "#838383",
        background: hovered
          ? "linear-gradient(155deg, #b21414 0%, #7c0d0d 100%)"
          : "#e8e8e8",
        boxShadow: active
          ? "inset 5px 5px 10px rgba(60,5,5,0.4), inset -5px -5px 10px rgba(212,175,55,0.2)"
          : hovered
            ? "0 10px 22px rgba(120,10,10,0.35), -5px -5px 15px rgba(255,255,255,0.6), inset 0 1px 1px rgba(255,255,255,0.25)"
            : "-7px -7px 12px #f8f8f8, 7px 7px 12px #c8c8c8",
        transform: active
          ? "translateY(0) scale(0.97)"
          : hovered
            ? "translateY(-2px)"
            : "translateY(0)",
      }}
    >
      <span
        className="absolute top-0 w-[40%] h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent, rgba(255,255,255,0.55), transparent)",
          transform: "skewX(-20deg)",
          left: hovered ? "130%" : "-60%",
          transition: "left 0.6s ease",
        }}
      />
      {children}
    </button>
  );
}
