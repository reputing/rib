"use client";

import { useRibbon } from "@/lib/ribbon/store";
import { ArrowRight, MessageSquare, Server, Mic } from "lucide-react";

export function LandingView() {
  const navigate = useRibbon((s) => s.navigate);

  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto"
      style={{ background: "var(--ribbon-bg)", color: "var(--ribbon-text)" }}
    >
      {/* Nav bar */}
      <nav className="flex flex-none items-center justify-between px-6 py-4 sm:px-12">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[13px] font-extrabold text-white"
            style={{ background: "var(--color-ribbon-terracotta)" }}
          >
            p
          </div>
          <span className="text-[15px] font-bold">prey</span>
        </div>
        <button
          onClick={() => navigate("onboarding")}
          className="cursor-pointer rounded-[6px] px-4 py-1.5 text-[12px] font-semibold transition"
          style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ribbon-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ribbon-card)")}
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1
          className="max-w-2xl text-[36px] font-bold leading-[1.1] sm:text-[48px]"
          style={{ letterSpacing: "-0.02em" }}
        >
          your community,{" "}
          <span style={{ color: "var(--color-ribbon-terracotta)" }}>
            actually yours
          </span>
        </h1>
        <p
          className="mt-4 max-w-md text-[15px] leading-[1.6] sm:text-[16px]"
          style={{ color: "var(--ribbon-text-dim)" }}
        >
          prey is a chat app for people who make things. servers, dms, voice,
          and a biolink page you can actually customize. no ads, no noise.
        </p>
        <button
          onClick={() => navigate("onboarding")}
          className="mt-8 flex cursor-pointer items-center gap-2 rounded-[8px] px-6 py-3 text-[14px] font-semibold text-white transition"
          style={{ background: "var(--color-ribbon-terracotta)" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          get started
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
        <p className="mt-3 text-[11px]" style={{ color: "var(--ribbon-text-faint)" }}>
          free — no email required
        </p>
      </section>

      {/* Features */}
      <section className="flex flex-none flex-col gap-3 px-6 pb-16 sm:flex-row sm:justify-center sm:gap-4 sm:px-12">
        <FeatureCard
          icon={<MessageSquare size={18} strokeWidth={2} />}
          title="real conversations"
          description="servers and dms that don't feel like a corporate tool"
        />
        <FeatureCard
          icon={<Server size={18} strokeWidth={2} />}
          title="your space"
          description="servers you actually control, with discover that isn't garbage"
        />
        <FeatureCard
          icon={<Mic size={18} strokeWidth={2} />}
          title="voice that works"
          description="hop into voice, mute, deafen, done"
        />
      </section>

      {/* Footer */}
      <footer
        className="flex flex-none items-center justify-between px-6 py-5 sm:px-12"
        style={{ borderTop: "1px solid var(--ribbon-hover)" }}
      >
        <span className="text-[11px]" style={{ color: "var(--ribbon-text-faint)" }}>
          prey.lol — © 2026
        </span>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("onboarding")}
            className="cursor-pointer text-[11px] font-medium"
            style={{ color: "var(--ribbon-text-faint)" }}
          >
            create account
          </button>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="flex-1 rounded-[8px] p-4"
      style={{ background: "var(--ribbon-card)" }}
    >
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-[6px]" style={{ background: "var(--ribbon-hover)" }}>
        <span style={{ color: "var(--color-ribbon-terracotta)" }}>{icon}</span>
      </div>
      <div className="text-[13px] font-semibold">{title}</div>
      <div className="mt-1 text-[11px]" style={{ color: "var(--ribbon-text-faint)" }}>
        {description}
      </div>
    </div>
  );
}
