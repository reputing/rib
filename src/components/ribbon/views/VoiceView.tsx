"use client";

import {
  Mic, MicOff, Headphones, PhoneOff, ScreenShare, Settings, Volume2,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { servers, getUser } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";

export function VoiceView() {
  const {
    activeServerId,
    muted,
    deafened,
    toggleMute,
    toggleDeafen,
    leaveVoice,
    navigate,
  } = useRibbon();

  const server = servers[activeServerId];
  const voiceChannel = server?.channels?.find((c) => c.type === "voice");
  const voiceMembers = (voiceChannel?.voiceMembers ?? ["elm", "wren", "you"])
    .map(getUser);

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{
        background: "linear-gradient(180deg, #0E0B09 0%, #131010 100%)",
        color: "var(--color-ribbon-text)",
      }}
    >
      {/* Header */}
      <div
        className="flex h-[52px] flex-none items-center px-5 border-b"
        style={{ borderColor: "var(--color-ribbon-border)" }}
      >
        <Volume2 size={16} style={{ color: "var(--color-ribbon-sage)" }} />
        <div className="ml-2 text-[15px] font-bold">
          {server?.name ?? "ribbon"} · {voiceChannel?.name ?? "studio"}
        </div>
        <div
          className="ml-2 flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase"
          style={{
            background: "rgba(123, 168, 122, 0.15)",
            color: "var(--color-ribbon-sage)",
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{
              width: 5, height: 5,
              background: "var(--color-ribbon-sage)",
              animation: "ribbon-enter-pulse 1.5s ease-in-out infinite",
            }}
          />
          connected
        </div>
      </div>

      {/* Participant tiles */}
      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="mb-4 text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-ribbon-text-faint)" }}
        >
          In voice — {voiceMembers.length}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {voiceMembers.map((u, i) => {
            const isMe = u.id === "you";
            const isMuted = isMe ? muted : (i % 3 === 0);
            const isSpeaking = !isMuted && (i === 0 || i === 1);
            return (
              <div
                key={u.id}
                className="relative overflow-hidden rounded-[14px] border p-5 transition"
                style={{
                  background: "#1A1612",
                  borderColor: isSpeaking
                    ? "rgba(123, 168, 122, 0.4)"
                    : "var(--color-ribbon-border)",
                  boxShadow: isSpeaking
                    ? "0 0 24px rgba(123, 168, 122, 0.15)"
                    : "none",
                }}
              >
                {/* Centered avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar
                      letter={u.avatarLetter}
                      accent={u.accent}
                      size={72}
                      radius={20}
                      ring={isMe}
                    />
                    {isSpeaking && (
                      <div
                        className="absolute inset-0 rounded-[20px]"
                        style={{
                          border: "2px solid rgba(123, 168, 122, 0.6)",
                          animation: "ribbon-ring-pulse 1.5s ease-out infinite",
                        }}
                      />
                    )}
                  </div>
                  <div className="mt-3 text-[13px] font-semibold">
                    {isMe ? "you" : u.username}
                    {isMe && (
                      <span
                        className="ml-1.5 rounded px-1 py-0.5 text-[8px] font-bold uppercase"
                        style={{
                          background: "rgba(196, 101, 74, 0.15)",
                          color: "var(--color-ribbon-terracotta)",
                        }}
                      >
                        you
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-0.5 text-[10px]"
                    style={{ color: "var(--color-ribbon-text-faint)" }}
                  >
                    {u.customTag}
                  </div>
                  {/* Speaking indicator */}
                  <div className="mt-3 flex items-end gap-0.5" style={{ height: 14 }}>
                    {!isMuted && isSpeaking ? (
                      [0, 1, 2, 3, 4].map((j) => (
                        <div
                          key={j}
                          style={{
                            width: 2,
                            borderRadius: 1,
                            background: "var(--color-ribbon-sage)",
                            animation: `ribbon-eq-bar ${[1.1, 0.9, 1.3, 1, 1.2][j]}s ease-in-out infinite`,
                            animationDelay: `${j * 0.15}s`,
                          }}
                        />
                      ))
                    ) : (
                      <div
                        className="text-[10px]"
                        style={{ color: "var(--color-ribbon-text-faint)" }}
                      >
                        {isMuted ? "muted" : "silent"}
                      </div>
                    )}
                  </div>
                </div>
                {/* Muted badge */}
                {isMuted && (
                  <div
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full"
                    style={{
                      background: "rgba(184, 85, 68, 0.2)",
                    }}
                  >
                    <MicOff size={11} strokeWidth={2.5} style={{ color: "#B85544" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Channel info */}
        <div
          className="mt-6 rounded-[12px] border p-4"
          style={{
            background: "#1A1612",
            borderColor: "var(--color-ribbon-border)",
          }}
        >
          <div className="text-[12px] font-semibold">Voice channel info</div>
          <div
            className="mt-2 grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            <div>
              <div className="text-[9px] uppercase tracking-wider">Region</div>
              <div className="mt-0.5" style={{ color: "var(--color-ribbon-text-dim)" }}>Auto</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider">Ping</div>
              <div className="mt-0.5" style={{ color: "var(--color-ribbon-sage)" }}>24ms</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider">Bitrate</div>
              <div className="mt-0.5" style={{ color: "var(--color-ribbon-text-dim)" }}>96 kbps</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider">Duration</div>
              <div className="mt-0.5" style={{ color: "var(--color-ribbon-text-dim)" }}>12:47</div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice controls */}
      <div
        className="flex h-[68px] flex-none items-center justify-center gap-2 border-t"
        style={{
          background: "#151210",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        <VoiceControlButton
          active={!muted}
          onClick={toggleMute}
          icon={muted ? <MicOff size={16} /> : <Mic size={16} />}
          label={muted ? "unmute" : "mute"}
          color={muted ? "#B85544" : "var(--color-ribbon-sage)"}
        />
        <VoiceControlButton
          active={!deafened}
          onClick={toggleDeafen}
          icon={<Headphones size={16} />}
          label={deafened ? "undeafen" : "deafen"}
          color={deafened ? "#B85544" : "var(--color-ribbon-text-dim)"}
        />
        <VoiceControlButton
          onClick={() => navigate("files")}
          icon={<ScreenShare size={16} />}
          label="share"
          color="var(--color-ribbon-text-dim)"
        />
        <VoiceControlButton
          onClick={() => navigate("settings", { settingsTab: "audio" })}
          icon={<Settings size={16} />}
          label="settings"
          color="var(--color-ribbon-text-dim)"
        />
        <div
          className="mx-1 h-6 w-px"
          style={{ background: "rgba(255, 255, 255, 0.06)" }}
        />
        <VoiceControlButton
          onClick={() => {
            leaveVoice();
            navigate("dms");
          }}
          icon={<PhoneOff size={16} />}
          label="disconnect"
          color="#B85544"
          danger
        />
      </div>
    </div>
  );
}

function VoiceControlButton({
  onClick,
  icon,
  label,
  color,
  active = true,
  danger = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-11 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[12px] px-3 transition"
      style={{
        background: danger
          ? "rgba(184, 85, 68, 0.15)"
          : active
            ? "rgba(255, 255, 255, 0.05)"
            : "transparent",
        minWidth: 64,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger
          ? "rgba(184, 85, 68, 0.25)"
          : "rgba(255, 255, 255, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = danger
          ? "rgba(184, 85, 68, 0.15)"
          : active
            ? "rgba(255, 255, 255, 0.05)"
            : "transparent";
      }}
    >
      <div style={{ color }}>{icon}</div>
      <div
        className="text-[9px] font-medium uppercase tracking-wider"
        style={{ color }}
      >
        {label}
      </div>
    </button>
  );
}
