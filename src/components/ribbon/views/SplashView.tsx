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
      className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden"
      style={{
        background: "var(--ribbon-bg)",
        color: "var(--ribbon-text)",
        opacity: entered ? 0 : 1,
        transition: "opacity 600ms ease",
      }}
    >
      {/* ambient accent drift */}
      <div
        className="animate-prey-drift pointer-events-none absolute"
        style={{
          inset: "-10%",
          background: "radial-gradient(42% 38% at 50% 42%, var(--acg, rgba(255,127,174,.5)), transparent 62%)",
          opacity: 0.4,
        }}
      />
      {/* scanlines + vignette */}
      <div className="prey-scanlines pointer-events-none absolute inset-0" style={{ opacity: 0.35 }} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(125% 85% at 50% 50%, transparent 38%, rgba(3,3,5,.92) 100%)" }}
      />

      {/* gradient-ring avatar */}
      <div
        className="relative"
        style={{
          padding: 2.5,
          borderRadius: 22,
          background: "linear-gradient(150deg, var(--ac, #ff7fae), rgba(120,116,124,.5))",
          boxShadow: "0 0 0 1px rgba(0,0,0,.4), 0 22px 50px -18px var(--acg, rgba(255,127,174,.55))",
        }}
      >
        <div
          className="flex items-center justify-center font-bold text-white"
          style={{
            width: 96,
            height: 96,
            borderRadius: 18,
            border: "3px solid #100f14",
            fontSize: 38,
            background: "var(--color-ribbon-pink)",
          }}
        >
          {me.avatarLetter}
        </div>
      </div>

      {/* name with subtle glitch */}
      <div
        className="animate-glitch mt-7 font-bold"
        style={{ fontSize: 56, letterSpacing: "-.045em" }}
      >
        {me.username}
      </div>

      {/* mono prompt */}
      <div
        className="prey-label animate-enter-pulse mt-4 text-[12px] font-medium"
        style={{ letterSpacing: "0.42em", color: "var(--ac, #ff7fae)" }}
      >
        click to enter
      </div>

      {/* footer branding */}
      <div className="absolute bottom-[26px] flex items-center gap-2">
        <span className="prey-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ac, #ff7fae)" }} />
        <span className="prey-label text-[11px] font-medium" style={{ color: "var(--ribbon-text-faint)" }}>
          {me.customTag} · prey.lol
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            useRibbon.getState().enterApp();
            useRibbon.getState().navigate("mobile");
          }}
          className="prey-chip ml-2 cursor-pointer rounded-[8px] px-2.5 py-1 text-[10px] font-semibold"
          style={{ color: "var(--ribbon-text-dim)" }}
          title="View mobile"
        >
          mobile
        </button>
      </div>
    </div>
  );
}
