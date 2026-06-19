"use client";

import { useState } from "react";
import {
  Instagram,
  Twitter,
  Music2 as Spotify,
  Github,
  Home,
  Twitch,
  Youtube,
  ArrowLeft,
  Eye,
  Volume2,
  MessageCircle,
  Pencil,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { getUser } from "@/lib/ribbon/mock-data";
import { Avatar, ACCENT_HEX } from "../Avatar";

const SOCIAL_ICONS = {
  instagram: Instagram,
  twitter: Twitter,
  spotify: Spotify,
  github: Github,
  website: Home,
  twitch: Twitch,
  youtube: Youtube,
};

export function ProfileView() {
  const { activeProfileUserId, params, navigate, dms, setActiveDM, friendIds, currentUser, setActiveSettingsTab } = useRibbon();
  const userId = params.userId ?? activeProfileUserId;
  // If viewing your own profile, use the editable currentUser from the store
  const user = userId === "you" ? currentUser : getUser(userId);
  const isOwnProfile = userId === "you";
  const [entered, setEntered] = useState(false);
  const [isFriend, setIsFriend] = useState(friendIds.includes(userId));
  const [friendRequested, setFriendRequested] = useState(false);

  const handleEnter = () => {
    if (entered) return;
    setEntered(true);
  };

  const handleMessage = () => {
    // Find or create DM with this user
    const existing = dms.find((d) => d.otherUserId === userId);
    if (existing) {
      setActiveDM(existing.id);
      navigate("dms");
    } else {
      // Just go to DMs view
      navigate("dms");
    }
  };

  const handleAddFriend = () => {
    if (isFriend || friendRequested) return;
    setFriendRequested(true);
  };

  const accentColor = ACCENT_HEX[user.accent];

  return (
    <div
      onClick={handleEnter}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#060504",
        color: "#E8E0D6",
        cursor: entered ? "default" : "pointer",
      }}
    >
      {/* Back button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate("dms");
        }}
        className="absolute left-5 top-5 z-30 flex cursor-pointer items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-[11px] font-medium transition"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          borderColor: "var(--color-ribbon-border)",
          color: "var(--color-ribbon-text-dim)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
        }}
      >
        <ArrowLeft size={12} strokeWidth={2.5} />
        Back
      </button>

      {/* Audio toggle (top-left) */}
      <button
        className="absolute left-5 top-20 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border transition"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderColor: "var(--color-ribbon-border)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        }}
        title="Toggle ambient audio"
      >
        <Volume2 size={14} strokeWidth={2} style={{ color: "#6B5F52" }} />
      </button>

      {/* View count (top-right) */}
      <div className="absolute right-5 top-[26px] z-20 flex items-center gap-1.5">
        <Eye size={12} strokeWidth={2} style={{ color: "#4A4038" }} />
        <span
          className="text-[11px] font-semibold"
          style={{ color: "#4A4038" }}
        >
          192
        </span>
      </div>

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

      {/* Splash (click-to-enter) */}
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
        {/* Ring pulse */}
        <div
          className="animate-ring-pulse-slow pointer-events-none absolute"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `1px solid ${accentColor}4D`,
          }}
        />
        <div
          className="animate-ring-pulse-slow pointer-events-none absolute"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `1px solid ${accentColor}33`,
            animationDelay: "1s",
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
            background: `linear-gradient(135deg, ${accentColor}, #B5BAC1)`,
          }}
        >
          {user.avatarLetter}
        </div>
        <div
          className="animate-glitch mt-4 text-[32px] font-bold"
          style={{
            color: "#E8E0D6",
            letterSpacing: "-1px",
            textShadow: "0 0 30px rgba(181, 186, 193, 0.25)",
          }}
        >
          {user.username}
        </div>
        <div
          className="mt-1.5 text-[11px] uppercase"
          style={{
            color: "#6B5F52",
            letterSpacing: "1px",
          }}
        >
          {user.customTag}
        </div>

        {/* Enter prompt */}
        <div className="relative mt-8 flex items-center justify-center">
          <div
            className="animate-ring-pulse pointer-events-none absolute"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: `1px solid ${accentColor}66`,
            }}
          />
          <div
            className="animate-ring-pulse pointer-events-none absolute"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: `1px solid ${accentColor}4D`,
              animationDelay: "0.7s",
            }}
          />
          <div
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: `${accentColor}26`,
              border: `1px solid ${accentColor}4D`,
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill={accentColor} stroke="none">
              <polygon points="8 5 19 12 8 19 8 5" />
            </svg>
          </div>
        </div>
        <div
          className="animate-enter-pulse mt-3 text-[10px] uppercase"
          style={{
            color: "#4A4038",
            letterSpacing: "2px",
          }}
        >
          click to enter
        </div>
      </div>

      {/* Profile content */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 1.8s ease 0.4s",
          pointerEvents: entered ? "auto" : "none",
        }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
          }}
        />

        {/* Avatar */}
        <div
          className="animate-drift relative flex items-center justify-center font-bold text-white"
          style={{
            width: 88,
            height: 88,
            borderRadius: 24,
            fontSize: 34,
            background: `linear-gradient(135deg, ${accentColor}, #B5BAC1)`,
            boxShadow: "0 8px 40px rgba(181, 186, 193, 0.2)",
          }}
        >
          {user.avatarLetter}
          <div
            className="absolute"
            style={{
              bottom: -3,
              right: -3,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#80848E",
              border: "3px solid #060504",
            }}
          />
        </div>

        {/* UID */}
        {user.uid && (
          <div
            className="mt-2.5 rounded-md border px-2 py-0.5"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              borderColor: "var(--color-ribbon-border)",
            }}
          >
            <span
              className="text-[9px] font-semibold"
              style={{ color: "#4A4038", letterSpacing: "0.8px" }}
            >
              UID {user.uid.toLocaleString()}
            </span>
          </div>
        )}

        {/* Name */}
        <div
          className="animate-glitch mt-1.5 text-[30px] font-bold"
          style={{
            color: "#E8E0D6",
            letterSpacing: "-0.5px",
            textShadow: "0 2px 24px rgba(0, 0, 0, 0.6)",
          }}
        >
          {user.username}
        </div>

        {/* Custom tag */}
        {user.customTag && (
          <div
            className="mt-0.5 rounded-md border px-2.5 py-0.5"
            style={{
              background: `${accentColor}1F`,
              borderColor: `${accentColor}26`,
            }}
          >
            <span
              className="text-[10px] font-semibold"
              style={{ color: accentColor, letterSpacing: "0.5px" }}
            >
              {user.customTag}
            </span>
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <div
            className="mt-2 max-w-[300px] text-center text-[12px] leading-[1.6]"
            style={{ color: "#6B5F52" }}
          >
            {user.bio}
          </div>
        )}

        {/* Pronouns / Location */}
        {(user.pronouns || user.location) && (
          <div
            className="mt-1.5 flex items-center gap-2 text-[10px]"
            style={{ color: "#4A4038" }}
          >
            {user.pronouns && <span>{user.pronouns}</span>}
            {user.pronouns && user.location && (
              <span style={{ color: "#2A2118" }}>·</span>
            )}
            {user.location && <span>{user.location}</span>}
          </div>
        )}

        {/* Social links */}
        {user.socialLinks && user.socialLinks.length > 0 && (
          <div className="mt-4 flex gap-1.5">
            {user.socialLinks.map((s, i) => {
              const Icon = SOCIAL_ICONS[s.type] ?? Home;
              return (
                <a
                  key={i}
                  href={s.url}
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[9px] border transition"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    borderColor: "var(--color-ribbon-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    e.currentTarget.style.borderColor = "var(--color-ribbon-border)";
                  }}
                  title={s.label}
                >
                  <Icon size={13} strokeWidth={2} style={{ color: "#6B5F52" }} />
                </a>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-3 flex gap-1.5">
          {isOwnProfile ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveSettingsTab("profile");
                navigate("settings");
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-4 py-1.5 text-[11px] font-semibold transition"
              style={{
                background: `${accentColor}2E`,
                borderColor: `${accentColor}33`,
                color: accentColor,
              }}
            >
              <Pencil size={11} strokeWidth={2.5} />
              edit profile
            </button>
          ) : (
            <>
              <button
                onClick={(e) => {
              e.stopPropagation();
              handleAddFriend();
            }}
            className="cursor-pointer rounded-[10px] border px-4 py-1.5 text-[11px] font-semibold transition"
            style={{
              background: isFriend
                ? "rgba(128, 132, 142, 0.2)"
                : friendRequested
                  ? "rgba(59, 91, 255, 0.18)"
                  : `${accentColor}2E`,
              borderColor: isFriend
                ? "rgba(128, 132, 142, 0.22)"
                : friendRequested
                  ? "rgba(59, 91, 255, 0.2)"
                  : `${accentColor}33`,
              color: isFriend
                ? "var(--color-ribbon-sage)"
                : friendRequested
                  ? "var(--color-ribbon-mauve)"
                  : accentColor,
            }}
          >
            {isFriend
              ? "✓ friends"
              : friendRequested
                ? "request sent"
                : "add friend"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMessage();
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border px-4 py-1.5 text-[11px] font-semibold transition"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              borderColor: "var(--color-ribbon-border)",
              color: "#6B5F52",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
            }}
          >
            <MessageCircle size={11} strokeWidth={2.5} />
            message
          </button>
            </>
          )}
        </div>

        {/* Now playing */}
        {user.nowPlaying && (
          <div
            className="mt-4 flex items-center gap-2 rounded-lg border px-3 py-1.5"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderColor: "var(--color-ribbon-border)",
            }}
          >
            <div className="flex items-end gap-0.5" style={{ height: 16 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 2,
                    borderRadius: 1,
                    background: accentColor,
                    animation: `ribbon-eq-bar ${[1.1, 0.9, 1.3, 1, 1.2][i]}s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
            <div>
              <div
                className="text-[10px] font-semibold"
                style={{ color: "#6B5F52" }}
              >
                {user.nowPlaying.track}
              </div>
              <div
                className="text-[8px]"
                style={{ color: "#4A4038" }}
              >
                {user.nowPlaying.artist}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom branding */}
      <div
        className="absolute bottom-[18px] left-1/2 z-20 flex items-center gap-1.5 rounded-[10px] border px-3 py-1.5"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          borderColor: "var(--color-ribbon-border)",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="flex items-center justify-center text-[8px] font-extrabold text-white"
          style={{
            width: 16,
            height: 16,
            borderRadius: 5,
            background: accentColor,
          }}
        >
          r
        </div>
        <span
          className="text-[10px] font-semibold"
          style={{ color: "#4A4038" }}
        >
          prey.lol/{user.handle}
        </span>
      </div>
    </div>
  );
}
