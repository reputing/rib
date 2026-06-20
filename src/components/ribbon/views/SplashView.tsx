"use client";

import { useState } from "react";
import { useRibbon } from "@/lib/ribbon/store";
import { getUser } from "@/lib/ribbon/mock-data";

export function SplashView() {
  const enterApp = useRibbon((s) => s.enterApp);
  const me = getUser("sol");
  const [entered, setEntered] = useState(false);

  const handleEnter = () => {
    if (entered) return;
    setEntered(true);
    setTimeout(() => enterApp(), 600);
  };

  return (
    <div
      onClick={handleEnter}
      className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
      style={{
        background: "var(--ribbon-bg)",
        color: "var(--ribbon-text)",
        opacity: entered ? 0 : 1,
        transition: "opacity 600ms ease",
      }}
    >
      {/* Avatar */}
      <div
        className="flex items-center justify-center font-bold text-white"
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          fontSize: 26,
          background: "var(--color-ribbon-terracotta)",
        }}
      >
        {me.avatarLetter}
      </div>

      {/* Name */}
      <div className="mt-4 text-[28px] font-bold" style={{ letterSpacing: "-0.5px" }}>
        {me.username}
      </div>

      {/* Tag */}
      <div className="mt-1 text-[11px]" style={{ color: "var(--ribbon-text-faint)" }}>
        {me.customTag}
      </div>

      {/* Enter prompt */}
      <div className="mt-6 text-[10px] uppercase" style={{ color: "var(--ribbon-text-ghost)", letterSpacing: "2px" }}>
        click to enter
      </div>

      {/* Branding */}
      <div
        className="absolute bottom-[18px] left-1/2 flex -translate-x-1/2 items-center gap-1.5"
      >
        <div
          className="flex items-center justify-center text-[8px] font-extrabold text-white"
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            background: "var(--color-ribbon-terracotta)",
          }}
        >
          p
        </div>
        <span className="text-[10px] font-semibold" style={{ color: "var(--ribbon-text-faint)" }}>
          prey.lol
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            useRibbon.getState().enterApp();
            useRibbon.getState().navigate("mobile");
          }}
          className="ml-2 cursor-pointer rounded-[6px] px-2 py-1 text-[10px] font-semibold"
          style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text-faint)" }}
          title="View mobile"
        >
          mobile
        </button>
      </div>
    </div>
  );
}
