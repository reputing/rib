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

const PARTICLES = [
  { top: "8%", left: "15%", size: 5, color: "#B5BAC1", delay: 0, char: "✦" },
  { top: "20%", left: "80%", size: 2, color: "#E8E0D6", delay: 0.6, dot: true },
  { top: "70%", left: "10%", size: 2, color: "#9497A0", delay: 1.1, dot: true },
  { top: "85%", left: "75%", size: 4, color: "#B5BAC1", delay: 1.6, char: "✦" },
  { top: "30%", left: "5%", size: 2, color: "#B5BAC1", delay: 2.1, dot: true },
  { top: "50%", left: "90%", size: 4, color: "#E8E0D6", delay: 0.4, char: "✦" },
  { top: "15%", left: "45%", size: 1, color: "#B5BAC1", delay: 3.1, dot: true },
  { top: "90%", left: "35%", size: 2, color: "#9497A0", delay: 2.6, dot: true },
];

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
        background: "#060504",
        color: "#EDE5D6",
        opacity: isExiting ? 0 : 1,
        transition: "opacity 900ms ease",
      }}
    >
      {/* Background gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(180,70,55,0.08) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 25% 65%, rgba(123,168,122,0.04) 0%, transparent 35%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 75% 60%, rgba(212,148,76,0.03) 0%, transparent 30%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.03,
          background:
            "repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%) 0 0 / 2px 2px",
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
      {/* Logo with pulse rings */}
      <div className="relative mb-6">
        <div
          className="animate-ring-pulse-slow pointer-events-none absolute inset-0"
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            border: "1px solid transparent",
          }}
        />
        <div
          className="animate-ring-pulse-slow pointer-events-none absolute inset-0"
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            border: "1px solid transparent",
            animationDelay: "1s",
          }}
        />
        <div
          className="animate-drift flex items-center justify-center font-extrabold text-white"
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            fontSize: 36,
            background: "linear-gradient(135deg, #B5BAC1, #B5BAC1)",
            boxShadow: "0 8px 40px rgba(255, 255, 255, 0.24)",
          }}
        >
          p
        </div>
      </div>
      <div
        className="text-[34px] font-bold"
        style={{ color: "#EDE5D6", letterSpacing: "-0.8px" }}
      >
        welcome to prey
      </div>
      <div
        className="mt-2 max-w-[360px] text-[14px] leading-[1.6]"
        style={{ color: "#6B5F52" }}
      >
        the place where your community actually feels like home. chat, share, create your space.
      </div>
      <button
        onClick={onNext}
        className="mt-8 cursor-pointer rounded-[14px] px-10 py-3 text-[14px] font-bold text-white transition"
        style={{
          background: "#B5BAC1",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#B5BAC1")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#B5BAC1")}
      >
        get started
      </button>
      <div className="mt-3 text-[11px]" style={{ color: "#4A4038" }}>
        already have an account?{" "}
        <span
          className="cursor-pointer font-semibold"
          style={{ color: "#B5BAC1" }}
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
      <div className="mt-1 text-center text-[12px]" style={{ color: "#5C5045" }}>
        this is your username everywhere
      </div>

      {/* Username */}
      <div
        className="mt-6 flex items-center gap-2.5 rounded-[14px] border px-4 py-3.5"
        style={{
          background: "#1A1612",
          borderColor: "transparent",
        }}
      >
        <span className="text-[13px] font-semibold" style={{ color: "#5C5045" }}>
          prey.lol/
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="yourname"
          className="flex-1 bg-transparent text-[14px] font-semibold outline-none"
          style={{ color: "#EDE5D6" }}
        />
        {username && (
          <div
            className="flex h-[18px] w-[18px] items-center justify-center rounded-full"
            style={{ background: "rgba(128, 132, 142, 0.18)" }}
          >
            <Check size={10} strokeWidth={3} style={{ color: "#80848E" }} />
          </div>
        )}
      </div>

      {/* Password */}
      <div
        className="mt-2 rounded-[14px] border px-4 py-3.5"
        style={{ background: "#1A1612", borderColor: "transparent" }}
      >
        <input
          type="password"
          placeholder="password"
          className="w-full bg-transparent text-[13px] outline-none"
          style={{ color: "#EDE5D6" }}
        />
      </div>

      {/* Or social */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "rgba(255, 255, 255, 0.04)" }} />
        <span className="text-[10px]" style={{ color: "#4A4038" }}>
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
          background: "#B5BAC1",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#B5BAC1")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#B5BAC1")}
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
      className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[12px] border py-2.5 text-[12px] font-semibold transition"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        borderColor: "transparent",
        color: "#A89A88",
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
      <div className="mt-1 text-center text-[12px]" style={{ color: "#5C5045" }}>
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
              className="flex cursor-pointer flex-col items-center gap-2 rounded-[14px] border-2 py-4 text-center transition"
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
          background: "#B5BAC1",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#B5BAC1")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#B5BAC1")}
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
      <div className="mt-1 text-center text-[12px]" style={{ color: "#5C5045" }}>
        based on your vibe — join a few to start
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {servers.map((s) => {
          const isJoined = joined.includes(s.id);
          return (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-[14px] border px-3.5 py-3"
              style={{
                background: "#1A1612",
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
                <div className="text-[10px]" style={{ color: "#5C5045" }}>
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
                  color: isJoined ? "#80848E" : "#B5BAC1",
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
          background: "#B5BAC1",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#B5BAC1")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#B5BAC1")}
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
      <div className="mt-1 text-center text-[12px]" style={{ color: "#5C5045" }}>
        your bio page is live at prey.lol/{username}
      </div>

      {/* Mini profile card preview */}
      <div
        className="mt-6 w-full rounded-[20px] border p-6"
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
            className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-[18px] border-2 border-dashed transition"
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
            <Upload size={18} strokeWidth={2} style={{ color: "#5C5045" }} />
            <span className="text-[8px] font-semibold" style={{ color: "#5C5045" }}>
              avatar
            </span>
          </button>
          <div className="mt-2.5 text-[18px] font-bold">{username}</div>
          <div className="mt-0.5 text-[10px]" style={{ color: "#5C5045" }}>
            prey.lol/{username}
          </div>
        </div>

        {/* Bio input */}
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="add a bio..."
          className="mt-3 w-full rounded-[10px] border px-3.5 py-2.5 text-[12px] outline-none"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "transparent",
            color: "#EDE5D6",
          }}
        />

        {/* Add links */}
        <button
          className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-[10px] border px-3.5 py-2.5 transition"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "transparent")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
        >
          <Plus size={14} strokeWidth={2} style={{ color: "#5C5045" }} />
          <span className="text-[12px]" style={{ color: "#5C5045" }}>
            add your links
          </span>
        </button>

        {/* Social connect icons */}
        <div className="mt-3 flex justify-center gap-1.5">
          {[Instagram, Twitter, Github, HomeIcon].map((Icon, i) => (
            <button
              key={i}
              className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[8px] border transition"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderColor: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")}
            >
              <Icon size={12} strokeWidth={2} style={{ color: "#5C5045" }} />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onFinish}
        className="mt-6 w-full cursor-pointer rounded-[14px] py-3 text-center text-[14px] font-bold text-white transition"
        style={{
          background: "#B5BAC1",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#B5BAC1")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#B5BAC1")}
      >
        enter prey
      </button>
      <div
        className="mt-2 cursor-pointer text-center text-[11px]"
        style={{ color: "#4A4038" }}
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
        className="animate-drift flex items-center justify-center"
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "linear-gradient(135deg, #80848E, #00B85C)",
          boxShadow: "0 8px 30px rgba(128, 132, 142, 0.3)",
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
        style={{ color: "#6B5F52" }}
      >
        your prey is live. go explore, join the conversation, make it yours.
      </div>
      <div className="mt-7 flex gap-2">
        <button
          onClick={onFinish}
          className="cursor-pointer rounded-[14px] px-7 py-3 text-[14px] font-bold text-white transition"
          style={{
            background: "#B5BAC1",
            boxShadow: "0 4px 20px rgba(255, 255, 255, 0.24)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#B5BAC1")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#B5BAC1")}
        >
          start chatting
        </button>
        <button
          onClick={onFinish}
          className="cursor-pointer rounded-[14px] border px-7 py-3 text-[14px] font-bold transition"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderColor: "transparent",
            color: "#A89A88",
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
            background: i <= step ? "#B5BAC1" : "rgba(255, 255, 255, 0.06)",
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
      style={{ color: "#5C5045" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#A89A88")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#5C5045")}
    >
      back
    </button>
  );
}
