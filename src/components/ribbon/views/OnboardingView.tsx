"use client";

import { useState } from "react";
import {
  Gamepad2, Palette, Music, Code, Star, Smile, Check, Upload, Plus,
  Instagram, Twitter, Github, Home as HomeIcon,
} from "lucide-react";
import { useRibbon, ACCENT_HEX } from "@/lib/ribbon/store";
import { onboardingInterests, onboardingSuggestedServers } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import type { Interest, Server } from "@/lib/ribbon/types";

const INTEREST_ICONS = {
  gamepad: Gamepad2,
  palette: Palette,
  music: Music,
  code: Code,
  star: Star,
  smile: Smile,
};

export function OnboardingView() {
  const {
    onboardingStep,
    nextOnboardingStep,
    prevOnboardingStep,
    onboardingInterests: selectedInterests,
    toggleOnboardingInterest,
    onboardingJoinedServers,
    toggleOnboardingServerJoin,
    onboardingUsername,
    setOnboardingUsername,
    finishOnboarding,
    enterApp,
  } = useRibbon();

  const step = onboardingStep;
  const [isExiting, setIsExiting] = useState(false);

  // "enter prey" from the setup step → go to the "done" screen (step 5)
  const handleFinish = () => {
    finishOnboarding();
  };

  // "start chatting" from the done screen → fade out smoothly, then enter the app.
  // The fade gives a moment of closure before the DMs view appears, instead of an
  // abrupt cut. Total duration ~900ms (matches the ribbon-fade-up animation timing).
  const handleEnterApp = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      enterApp();
    }, 900);
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: "var(--ribbon-bg)",
        color: "var(--ribbon-text)",
        opacity: isExiting ? 0 : 1,
        transition: "opacity 900ms ease",
      }}
    >
      {/* Step content */}
      <div className="relative z-10 w-full max-w-[440px] px-5">
        {step === 0 && <StepWelcome onNext={nextOnboardingStep} />}
        {step === 1 && (
          <StepCreateAccount
            onNext={nextOnboardingStep}
            onPrev={prevOnboardingStep}
            username={onboardingUsername}
            onUsernameChange={setOnboardingUsername}
          />
        )}
        {step === 2 && (
          <StepPickVibe
            interests={onboardingInterests}
            selected={selectedInterests}
            onToggle={toggleOnboardingInterest}
            onNext={nextOnboardingStep}
            onPrev={prevOnboardingStep}
          />
        )}
        {step === 3 && (
          <StepFindPeople
            servers={onboardingSuggestedServers}
            joined={onboardingJoinedServers}
            onToggle={toggleOnboardingServerJoin}
            onNext={nextOnboardingStep}
            onPrev={prevOnboardingStep}
          />
        )}
        {step === 4 && (
          <StepSetUpRibbon
            username={onboardingUsername || "yourname"}
            onFinish={handleFinish}
            onPrev={prevOnboardingStep}
          />
        )}
        {step === 5 && <StepDone onFinish={handleEnterApp} />}
      </div>
    </div>
  );
}

// ═══ STEP 0: WELCOME ═══
function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{ animation: "ribbon-fade-up 0.6s ease" }}
    >
      {/* Logo */}
      <div className="relative mb-6">
        <div
          className="flex items-center justify-center font-extrabold text-white"
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            fontSize: 36,
            background: "var(--color-ribbon-terracotta)",
          }}
        >
          p
        </div>
      </div>
      <div
        className="text-[34px] font-bold"
        style={{ color: "#FFFFFF", letterSpacing: "-0.8px" }}
      >
        welcome to prey
      </div>
      <div
        className="mt-2 max-w-[360px] text-[14px] leading-[1.6]"
        style={{ color: "#CCCCCC" }}
      >
        the place where your community actually feels like home. chat, share, create your space.
      </div>
      <button
        onClick={onNext}
        className="mt-8 cursor-pointer rounded-[14px] px-10 py-3 text-[14px] font-bold text-white transition"
        style={{
          background: "#E8769A",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#E8769A")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#E8769A")}
      >
        get started
      </button>
      <div className="mt-3 text-[11px]" style={{ color: "#666666" }}>
        already have an account?{" "}
        <span
          className="cursor-pointer font-semibold"
          style={{ color: "#E8769A" }}
          onClick={onNext}
        >
          sign in
        </span>
      </div>
    </div>
  );
}

// ═══ STEP 1: CREATE ACCOUNT ═══
function StepCreateAccount({
  onNext,
  onPrev,
  username,
  onUsernameChange,
}: {
  onNext: () => void;
  onPrev: () => void;
  username: string;
  onUsernameChange: (u: string) => void;
}) {
  return (
    <div style={{ animation: "ribbon-fade-up 0.6s ease" }}>
      <ProgressBar step={1} />
      <div className="text-center text-[22px] font-bold" style={{ letterSpacing: "-0.3px" }}>
        claim your ribbon
      </div>
      <div className="mt-1 text-center text-[12px]" style={{ color: "#888888" }}>
        this is your username everywhere
      </div>

      {/* Username */}
      <div
        className="mt-6 flex items-center gap-2.5 rounded-[14px] px-4 py-3.5"
        style={{
          background: "var(--ribbon-card)",
          borderColor: "transparent",
        }}
      >
        <span className="text-[13px] font-semibold" style={{ color: "#888888" }}>
          prey.lol/
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="yourname"
          className="flex-1 bg-transparent text-[14px] font-semibold outline-none"
          style={{ color: "#FFFFFF" }}
        />
        {username && (
          <div
            className="flex h-[18px] w-[18px] items-center justify-center rounded-full"
            style={{ background: "rgba(128, 132, 142, 0.18)" }}
          >
            <Check size={10} strokeWidth={3} style={{ color: "#CCCCCC" }} />
          </div>
        )}
      </div>

      {/* Password */}
      <div
        className="mt-2 rounded-[14px] px-4 py-3.5"
        style={{ background: "var(--ribbon-card)", borderColor: "transparent" }}
      >
        <input
          type="password"
          placeholder="password"
          className="w-full bg-transparent text-[13px] outline-none"
          style={{ color: "#FFFFFF" }}
        />
      </div>

      {/* Or social */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "rgba(255, 255, 255, 0.04)" }} />
        <span className="text-[10px]" style={{ color: "#666666" }}>
          or continue with
        </span>
        <div className="h-px flex-1" style={{ background: "rgba(255, 255, 255, 0.04)" }} />
      </div>
      <div className="mt-3 flex gap-2">
        <SocialButton label="google" />
        <SocialButton label="github" icon={<Github size={14} />} />
      </div>

      <button
        onClick={onNext}
        className="mt-5 w-full cursor-pointer rounded-[14px] py-3 text-center text-[14px] font-bold text-white transition"
        style={{
          background: "#E8769A",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#E8769A")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#E8769A")}
      >
        continue
      </button>
      <BackButton onBack={onPrev} />
    </div>
  );
}

function SocialButton({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <button
      className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[12px] py-2.5 text-[12px] font-semibold transition"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        borderColor: "transparent",
        color: "#B5BAC1",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)")}
    >
      {icon ?? <span className="h-3.5 w-3.5 rounded-full bg-current opacity-60" />}
      {label}
    </button>
  );
}

// ═══ STEP 2: PICK YOUR VIBE ═══
function StepPickVibe({
  interests,
  selected,
  onToggle,
  onNext,
  onPrev,
}: {
  interests: Interest[];
  selected: string[];
  onToggle: (id: any) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div style={{ animation: "ribbon-fade-up 0.6s ease" }}>
      <ProgressBar step={2} />
      <div className="text-center text-[22px] font-bold" style={{ letterSpacing: "-0.3px" }}>
        pick your vibe
      </div>
      <div className="mt-1 text-center text-[12px]" style={{ color: "#888888" }}>
        we&apos;ll find communities that match
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {interests.map((interest) => {
          const Icon = INTEREST_ICONS[interest.icon];
          const isSelected = selected.includes(interest.id);
          const accentColor = ACCENT_HEX[interest.accent];
          return (
            <button
              key={interest.id}
              onClick={() => onToggle(interest.id)}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-[14px] py-4 text-center transition"
              style={{
                background: isSelected ? `${accentColor}1A` : "rgba(255, 255, 255, 0.03)",
                borderColor: isSelected ? accentColor : "transparent",
                boxShadow: isSelected ? `0 0 20px ${accentColor}26` : "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = `${accentColor}66`;
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <Icon size={20} strokeWidth={2} style={{ color: accentColor }} />
              <span
                className="text-[11px] font-semibold"
                style={{ color: accentColor }}
              >
                {interest.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="mt-6 w-full cursor-pointer rounded-[14px] py-3 text-center text-[14px] font-bold text-white transition"
        style={{
          background: "#E8769A",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#E8769A")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#E8769A")}
      >
        continue
      </button>
      <BackButton onBack={onPrev} />
    </div>
  );
}

// ═══ STEP 3: FIND YOUR PEOPLE ═══
function StepFindPeople({
  servers,
  joined,
  onToggle,
  onNext,
  onPrev,
}: {
  servers: Server[];
  joined: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div style={{ animation: "ribbon-fade-up 0.6s ease" }}>
      <ProgressBar step={3} />
      <div className="text-center text-[22px] font-bold" style={{ letterSpacing: "-0.3px" }}>
        find your people
      </div>
      <div className="mt-1 text-center text-[12px]" style={{ color: "#888888" }}>
        based on your vibe — join a few to start
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {servers.map((s) => {
          const isJoined = joined.includes(s.id);
          return (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-[14px] px-3.5 py-3"
              style={{
                background: "var(--ribbon-card)",
                borderColor: isJoined
                  ? "rgba(128, 132, 142, 0.22)"
                  : "rgba(255, 255, 255, 0.04)",
              }}
            >
              <div
                className="flex h-[38px] w-[38px] flex-none items-center justify-center text-[15px] font-bold text-white"
                style={{
                  borderRadius: 11,
                  background: s.banner,
                }}
              >
                {s.letter}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold">{s.name}</div>
                <div className="text-[10px]" style={{ color: "#888888" }}>
                  {s.memberCount.toLocaleString()} members · {s.tags?.join(", ")}
                </div>
              </div>
              <button
                onClick={() => onToggle(s.id)}
                className="flex-none cursor-pointer rounded-lg px-3.5 py-1.5 text-[11px] font-semibold transition"
                style={{
                  background: isJoined
                    ? "rgba(128, 132, 142, 0.18)"
                    : "rgba(255, 255, 255, 0.1)",
                  color: isJoined ? "#CCCCCC" : "#E8769A",
                }}
              >
                {isJoined ? "joined" : "join"}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="mt-6 w-full cursor-pointer rounded-[14px] py-3 text-center text-[14px] font-bold text-white transition"
        style={{
          background: "#E8769A",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#E8769A")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#E8769A")}
      >
        continue
      </button>
      <BackButton onBack={onPrev} />
    </div>
  );
}

// ═══ STEP 4: SET UP YOUR RIBBON ═══
function StepSetUpRibbon({
  username,
  onFinish,
  onPrev,
}: {
  username: string;
  onFinish: () => void;
  onPrev: () => void;
}) {
  const [bio, setBio] = useState("");

  return (
    <div
      className="flex flex-col items-center"
      style={{ animation: "ribbon-fade-up 0.6s ease" }}
    >
      <ProgressBar step={4} />
      <div className="text-center text-[22px] font-bold" style={{ letterSpacing: "-0.3px" }}>
        set up your ribbon
      </div>
      <div className="mt-1 text-center text-[12px]" style={{ color: "#888888" }}>
        your bio page is live at prey.lol/{username}
      </div>

      {/* Mini profile card preview */}
      <div
        className="mt-6 w-full rounded-[20px] p-6"
        style={{
          background: "rgba(14, 12, 10, 0.7)",
          backdropFilter: "blur(16px)",
          borderColor: "transparent",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(181, 186, 193, 0.04)",
        }}
      >
        {/* Avatar upload area */}
        <div className="flex flex-col items-center">
          <button
            className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-[18px] transition"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              borderColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--ribbon-border-strong)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
            }}
          >
            <Upload size={18} strokeWidth={2} style={{ color: "#888888" }} />
            <span className="text-[8px] font-semibold" style={{ color: "#888888" }}>
              avatar
            </span>
          </button>
          <div className="mt-2.5 text-[18px] font-bold">{username}</div>
          <div className="mt-0.5 text-[10px]" style={{ color: "#888888" }}>
            prey.lol/{username}
          </div>
        </div>

        {/* Bio input */}
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="add a bio..."
          className="mt-3 w-full rounded-[10px] px-3.5 py-2.5 text-[12px] outline-none"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "transparent",
            color: "#FFFFFF",
          }}
        />

        {/* Add links */}
        <button
          className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-[10px] px-3.5 py-2.5 transition"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "transparent")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
        >
          <Plus size={14} strokeWidth={2} style={{ color: "#888888" }} />
          <span className="text-[12px]" style={{ color: "#888888" }}>
            add your links
          </span>
        </button>

        {/* Social connect icons */}
        <div className="mt-3 flex justify-center gap-1.5">
          {[Instagram, Twitter, Github, HomeIcon].map((Icon, i) => (
            <button
              key={i}
              className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[8px] transition"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderColor: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")}
            >
              <Icon size={12} strokeWidth={2} style={{ color: "#888888" }} />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onFinish}
        className="mt-6 w-full cursor-pointer rounded-[14px] py-3 text-center text-[14px] font-bold text-white transition"
        style={{
          background: "#E8769A",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#E8769A")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#E8769A")}
      >
        enter prey
      </button>
      <div
        className="mt-2 cursor-pointer text-center text-[11px]"
        style={{ color: "#666666" }}
        onClick={onFinish}
      >
        skip for now
      </div>
      <BackButton onBack={onPrev} />
    </div>
  );
}

// ═══ STEP 5: DONE ═══
function StepDone({ onFinish }: { onFinish: () => void }) {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{ animation: "ribbon-fade-up 0.6s ease" }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "var(--color-ribbon-sage)",
        }}
      >
        <Check size={32} strokeWidth={2.5} style={{ color: "#fff" }} />
      </div>
      <div
        className="mt-5 text-[28px] font-bold"
        style={{ letterSpacing: "-0.5px" }}
      >
        you&apos;re in
      </div>
      <div
        className="mt-1.5 max-w-[320px] text-[14px] leading-[1.6]"
        style={{ color: "#CCCCCC" }}
      >
        your prey is live. go explore, join the conversation, make it yours.
      </div>
      <div className="mt-7 flex gap-2">
        <button
          onClick={onFinish}
          className="cursor-pointer rounded-[14px] px-7 py-3 text-[14px] font-bold text-white transition"
          style={{
            background: "#E8769A",
            boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#E8769A")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#E8769A")}
        >
          start chatting
        </button>
        <button
          onClick={onFinish}
          className="cursor-pointer rounded-[14px] px-7 py-3 text-[14px] font-bold transition"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderColor: "transparent",
            color: "#B5BAC1",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)")}
        >
          customize bio
        </button>
      </div>
    </div>
  );
}

// ═══ Shared bits ═══
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-7 flex justify-center gap-1">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            width: 32,
            height: 3,
            borderRadius: 2,
            background: i <= step ? "#E8769A" : "rgba(255, 255, 255, 0.06)",
          }}
        />
      ))}
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="mt-2 w-full cursor-pointer py-2 text-center text-[12px] font-semibold transition"
      style={{ color: "#888888" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#B5BAC1")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
    >
      back
    </button>
  );
}
