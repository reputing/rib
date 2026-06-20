"use client";

import { useEffect, useState } from "react";
import { useRibbon } from "@/lib/ribbon/store";
import { getUser } from "@/lib/ribbon/mock-data";

const PARTICLES = [
  { top: "7%", left: "14%", size: 6, color: "#E8769A", delay: 0, char: "✦" },
  { top: "18%", left: "76%", size: 2, color: "#FFFFFF", delay: 0.6, dot: true },
  { top: "28%", left: "22%", size: 2, color: "#D4638A", delay: 1.1, dot: true },
  { top: "38%", left: "88%", size: 5, color: "#E8769A", delay: 1.6, char: "✦" },
  { top: "58%", left: "6%", size: 2, color: "#E8769A", delay: 2.1, dot: true },
  { top: "72%", left: "62%", size: 4, color: "#FFFFFF", delay: 0.4, char: "✦" },
  { top: "82%", left: "32%", size: 2, color: "#D4638A", delay: 2.6, dot: true },
  { top: "14%", left: "52%", size: 1, color: "#FFFFFF", delay: 3.1, dot: true },
  { top: "48%", left: "94%", size: 2, color: "#E8769A", delay: 1.3, dot: true },
  { top: "66%", left: "16%", size: 5, color: "#E8769A", delay: 0.9, char: "✦" },
  { top: "92%", left: "74%", size: 2, color: "#FFFFFF", delay: 1.9, dot: true },
  { top: "5%", left: "40%", size: 4, color: "#D4638A", delay: 2.3, char: "✦" },
  { top: "52%", left: "44%", size: 1, color: "#FFFFFF", delay: 3.6, dot: true },
  { top: "34%", left: "4%", size: 2, color: "#E8769A", delay: 0.2, dot: true },
  { top: "78%", left: "86%", size: 6, color: "#FFFFFF", delay: 1.7, char: "✦" },
  { top: "22%", left: "66%", size: 2, color: "#E8769A", delay: 2.9, dot: true },
  { top: "88%", left: "10%", size: 4, color: "#E8769A", delay: 3.3, char: "✦" },
  { top: "42%", left: "36%", size: 1, color: "#D4638A", delay: 0.7, dot: true },
];

export function SplashView() {
  const enterApp = useRibbon((s) => s.enterApp);
  const me = getUser("sol"); // splash features sol per the mockup
  const [entered, setEntered] = useState(false);

  const handleEnter = () => {
    if (entered) return;
    setEntered(true);
    // Wait for the fade-out animation, then transition to DMs
    setTimeout(() => enterApp(), 1200);
  };

  return (
    <div
      onClick={handleEnter}
      className="relative flex h-screen w-screen cursor-default flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#151515",
        color: "#FFFFFF",
      }}
    >
      {/* Background gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 25% 70%, rgba(100, 60, 120, 0.05) 0%, transparent 35%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 75% 65%, rgba(180, 120, 60, 0.04) 0%, transparent 30%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.035,
          background:
            "repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%) 0 0 / 2px 2px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)",
          zIndex: 50,
        }}
      />

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="animate-twinkle pointer-events-none absolute"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            fontSize: p.size,
            color: p.color,
            borderRadius: p.dot ? "50%" : undefined,
            background: p.dot ? p.color : undefined,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.char ?? ""}
        </div>
      ))}

      {/* Splash screen (click to enter) */}
      <div
        className="absolute inset-0 z-40 flex flex-col items-center justify-center"
        style={{
          background: "rgba(6, 5, 4, 0.92)",
          backdropFilter: "blur(20px)",
          transition: "opacity 1.2s ease, visibility 1.2s",
          opacity: entered ? 0 : 1,
          visibility: entered ? "hidden" : "visible",
          pointerEvents: entered ? "none" : "auto",
          cursor: "pointer",
        }}
      >
        {/* Ring pulse effects behind avatar */}
        <div
          className="animate-ring-pulse-slow pointer-events-none absolute"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "1px solid rgba(181, 186, 193, 0.2)",
          }}
        />
        <div
          className="animate-ring-pulse-slow pointer-events-none absolute"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "1px solid transparent",
            animationDelay: "1s",
          }}
        />
        <div
          className="animate-ring-pulse-slow pointer-events-none absolute"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "1px solid transparent",
            animationDelay: "2s",
          }}
        />

        {/* Avatar */}
        <div
          className="animate-breathe relative flex items-center justify-center font-bold text-white"
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            fontSize: 28,
            background: "linear-gradient(135deg, #E8769A 0%, #E8769A 50%, #D4638A 100%)",
          }}
        >
          {me.avatarLetter}
        </div>

        {/* Username */}
        <div
          className="animate-glitch mt-4 text-[32px] font-bold"
          style={{
            color: "#FFFFFF",
            letterSpacing: "-1px",
            textShadow: "0 0 30px rgba(181, 186, 193, 0.25)",
          }}
        >
          {me.username}
        </div>

        {/* Tag */}
        <div
          className="mt-1.5 text-[11px] uppercase"
          style={{
            color: "#CCCCCC",
            letterSpacing: "1px",
          }}
        >
          {me.customTag}
        </div>

        {/* Enter prompt */}
        <div
          className="relative mt-8 flex items-center justify-center"
        >
          <div
            className="animate-ring-pulse pointer-events-none absolute"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid rgba(181, 186, 193, 0.25)",
            }}
          />
          <div
            className="animate-ring-pulse pointer-events-none absolute"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid rgba(181, 186, 193, 0.2)",
              animationDelay: "0.7s",
            }}
          />
          <div
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(181, 186, 193, 0.2)",
            }}
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="#E8769A"
              stroke="none"
            >
              <polygon points="8 5 19 12 8 19 8 5" />
            </svg>
          </div>
        </div>
        <div
          className="animate-enter-pulse mt-3 text-[10px] uppercase"
          style={{
            color: "#666666",
            letterSpacing: "2px",
          }}
        >
          click to enter
        </div>
      </div>

      {/* Branding at the bottom + mobile mockup entry */}
      <div className="absolute bottom-[18px] left-1/2 z-50 flex -translate-x-1/2 items-center gap-2">
        <div
          className="flex items-center gap-1.5 rounded-[10px] px-3 py-1.5"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "var(--color-ribbon-border)",
          }}
        >
          <div
            className="flex items-center justify-center text-[8px] font-extrabold text-white"
            style={{
              width: 16,
              height: 16,
              borderRadius: 5,
              background: "#E8769A",
            }}
          >
            p
          </div>
          <span
            className="text-[10px] font-semibold"
            style={{ color: "#666666" }}
          >
            prey.lol
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Enter the app (set hasEntered) so navigation from mobile works
            useRibbon.getState().enterApp();
            useRibbon.getState().navigate("mobile");
          }}
          className="cursor-pointer rounded-[10px] px-3 py-1.5 text-[10px] font-semibold transition"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "var(--color-ribbon-border)",
            color: "#CCCCCC",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.color = "#B5BAC1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
            e.currentTarget.style.color = "#CCCCCC";
          }}
          title="View the mobile mockup"
        >
          mobile
        </button>
      </div>
    </div>
  );
}
