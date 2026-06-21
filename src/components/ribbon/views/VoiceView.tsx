"use client";

import {
  Mic, MicOff, Headphones, PhoneOff, Video, Monitor, MoreHorizontal,
  Volume2, Phone, Settings as SettingsIcon,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { servers, getUser, CURRENT_USER_ID } from "@/lib/ribbon/mock-data";
import { Avatar, ACCENT_HEX } from "../Avatar";
import { SectionLabel } from "../Shared";

export function VoiceView() {
  const {
    activeServerId,
    activeChannelId,
    navigate,
    muted,
    deafened,
    toggleMute,
    toggleDeafen,
    leaveVoice,
    joinedVoice,
  } = useRibbon();

  const server = servers[activeServerId];
  const voiceChannel =
    server?.channels?.find((c) => c.type === "voice") ??
    server?.channels?.find((c) => c.id === activeChannelId);

  // Participants — combine voiceMembers + "you" (when joined)
  const voiceMemberIds = voiceChannel?.voiceMembers ?? ["sol", "wren", "elm"];
  const participantIds = joinedVoice
    ? [...voiceMemberIds.filter((id) => id !== CURRENT_USER_ID), CURRENT_USER_ID]
    : voiceMemberIds;

  return (
    <div
      className="flex h-full w-full"
      style={{ background: "var(--color-ribbon-bg)", color: "var(--color-ribbon-text)" }}
    >
      {/* ═══ SIDEBAR ═══ */}
      <div
        className="hidden sm:flex w-[60px] sm:w-[256px] flex-none flex-col"
        style={{
          background: "var(--ribbon-card)",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        {/* Server selector */}
        <div className="px-3.5 pt-3.5 pb-2.5">
          <div
            className="flex items-center gap-2 rounded-[12px] px-2.5 py-2"
            style={{ background: "var(--ribbon-elevated)" }}
          >
            <Avatar
              letter={server?.letter ?? "A"}
              accent={server?.accent ?? "terracotta"}
              size={26}
              radius={9}
            />
            <div className="flex-1">
              <div className="text-[13px] font-semibold">
                {server?.name ?? "Art Collective"}
              </div>
              <div
                className="text-[10px]"
                style={{ color: "var(--color-ribbon-text-muted)" }}
              >
                {server?.memberCount ?? 48} members
              </div>
            </div>
          </div>
        </div>

        {/* Channels list */}
        <div className="flex flex-1 flex-col gap-px overflow-y-auto px-2.5">
          <SectionLabel>Channels</SectionLabel>
          {(server?.channels ?? [])
            .filter((c) => c.type === "text")
            .map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  navigate("chat");
                }}
                className="rounded-[10px] px-2.5 py-1.5 text-left text-[13px] transition"
                style={{ color: "var(--color-ribbon-text-dim)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                #{c.name}
              </button>
            ))}

          <SectionLabel>Voice</SectionLabel>
          {(server?.channels ?? [])
            .filter((c) => c.type === "voice")
            .map((c, idx) => {
              const isActive = idx === 0;
              return (
                <div key={c.id}>
                  <button
                    onClick={() => useRibbon.getState().joinVoice()}
                    className="flex w-full cursor-pointer items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-[13px] transition"
                    style={{
                      background: isActive
                        ? "rgba(128, 132, 142, 0.12)"
                        : "transparent",
                      color: isActive
                        ? "var(--color-ribbon-sage)"
                        : "var(--color-ribbon-text-dim)",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    <Volume2 size={11} strokeWidth={2.5} />
                    {c.name}
                  </button>
                  {/* Users in voice */}
                  {isActive && (
                    <div className="flex flex-col gap-1 py-1 pl-[30px]">
                      {participantIds.map((uid) => {
                        const u = getUser(uid);
                        const isMe = uid === CURRENT_USER_ID;
                        return (
                          <div
                            key={uid}
                            className="flex items-center gap-1.5"
                          >
                            {isMe ? (
                              <div
                                className="h-3.5 w-3.5"
                                style={{
                                  borderRadius: 5,
                                  background: "linear-gradient(135deg,#ff7fae,#ff7fae)",
                                }}
                              />
                            ) : (
                              <Avatar
                                letter={u.avatarLetter}
                                accent={u.accent}
                                size={14}
                                radius={5}
                              />
                            )}
                            <span
                              className="text-[10px] font-semibold"
                              style={{ color: "var(--color-ribbon-sage)" }}
                            >
                              {isMe ? "you" : u.username}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Voice connected card */}
        {joinedVoice && (
          <div className="px-3 pb-3 pt-2">
            <div
              className="rounded-[12px] px-2.5 py-2"
              style={{
                background: "rgba(128, 132, 142, 0.1)",
                borderColor: "rgba(128, 132, 142, 0.14)",
              }}
            >
              <div className="mb-1.5 flex items-center gap-1.5">
                <div className="flex items-end gap-0.5" style={{ height: 12 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 2,
                        borderRadius: 1,
                        background: "#CCCCCC",
                        animation: `ribbon-eq-bar 0.8s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: "var(--color-ribbon-sage)" }}
                >
                  Connected
                </span>
                <span
                  className="ml-auto text-[10px]"
                  style={{ color: "var(--color-ribbon-text-faint)" }}
                >
                  {voiceChannel?.name ?? "studio"}
                </span>
              </div>
              <div className="flex gap-1.5">
                <VoiceSidebarButton
                  active={!muted}
                  onClick={toggleMute}
                  icon={muted ? <MicOff size={14} /> : <Mic size={14} />}
                  color={muted ? "#ff7fae" : "var(--color-ribbon-text-dim)"}
                />
                <VoiceSidebarButton
                  active={!deafened}
                  onClick={toggleDeafen}
                  icon={<Headphones size={14} />}
                  color={deafened ? "#ff7fae" : "var(--color-ribbon-text-dim)"}
                />
                <VoiceSidebarButton
                  onClick={() => {
                    leaveVoice();
                    navigate("dms");
                  }}
                  icon={<PhoneOff size={14} />}
                  color="#ff7fae"
                  danger
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ MAIN AREA ═══ */}
      <div
        className="flex flex-1 flex-col min-w-0"
        style={{ background: "var(--color-ribbon-bg)" }}
      >
        {/* Header */}
        <div
          className="flex h-12 flex-none items-center px-5"
          style={{ borderColor: "var(--color-ribbon-border)" }}
        >
          <Volume2
            size={14}
            strokeWidth={2.5}
            style={{ color: "var(--color-ribbon-sage)" }}
          />
          <div
            className="ml-2 text-[14px] font-semibold"
          >
            {voiceChannel?.name ?? "studio"}
          </div>
          <div
            className="mx-3 h-3.5 w-px"
            style={{ background: "rgba(255, 255, 255, 0.06)" }}
          />
          <div
            className="text-[12px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            {participantIds.length} connected
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <button className="cursor-pointer" title="Screen share">
              <Monitor size={15} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            </button>
            <button className="cursor-pointer" title="More">
              <MoreHorizontal size={15} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            </button>
          </div>
        </div>

        {/* User grid */}
        <div
          className="flex flex-1 items-center justify-center p-8"
        >
          <div
            className="grid max-w-[500px] gap-6"
            style={{
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            {participantIds.map((uid, idx) => (
              <VoiceUserTile
                key={uid}
                userId={uid}
                speaking={idx === 0 && !muted}
                muted={uid === CURRENT_USER_ID ? muted : idx === 2}
                isMe={uid === CURRENT_USER_ID}
              />
            ))}
          </div>
        </div>

        {/* Controls bar */}
        <div
          className="flex flex-none items-center justify-center gap-2.5 px-6 pb-5 pt-3"
        >
          <VoiceControlButton
            onClick={toggleMute}
            icon={muted ? <MicOff size={18} /> : <Mic size={18} />}
            label={muted ? "muted" : "mic"}
            active={!muted}
            color={muted ? "#ff7fae" : "var(--color-ribbon-text-dim)"}
          />
          <VoiceControlButton
            onClick={toggleDeafen}
            icon={<Headphones size={18} />}
            label="audio"
            active={!deafened}
            color={deafened ? "#ff7fae" : "var(--color-ribbon-text-dim)"}
          />
          <VoiceControlButton
            onClick={() => navigate("settings", { settingsTab: "audio" })}
            icon={<Video size={18} />}
            label="video"
            color="var(--color-ribbon-text-dim)"
          />
          <VoiceControlButton
            onClick={() => navigate("settings")}
            icon={<SettingsIcon size={18} />}
            label="settings"
            color="var(--color-ribbon-text-dim)"
          />
          <div style={{ width: 8 }} />
          <VoiceControlButton
            onClick={() => {
              leaveVoice();
              navigate("dms");
            }}
            icon={<PhoneOff size={18} />}
            label="disconnect"
            color="#ff7fae"
            danger
          />
        </div>
      </div>
    </div>
  );
}

function VoiceUserTile({
  userId,
  speaking,
  muted,
  isMe,
}: {
  userId: string;
  speaking: boolean;
  muted: boolean;
  isMe: boolean;
}) {
  const user = getUser(userId);
  const accentColor = ACCENT_HEX[user.accent];

  return (
    <div
      className="flex flex-col items-center gap-2.5 rounded-[20px] px-5 py-6 transition"
      style={{
        background: "var(--ribbon-card)",
        borderColor: speaking
          ? "rgba(128, 132, 142, 0.18)"
          : "var(--color-ribbon-border)",
      }}
    >
      {/* Avatar */}
      <div className="relative">
        <div
          className="flex items-center justify-center font-bold text-white"
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            fontSize: 28,
            background: isMe
              ? "linear-gradient(135deg, #ff7fae, #ff7fae)"
              : accentColor,
            animation: speaking ? "ribbon-breathe 1.5s ease-in-out infinite" : "none",
            boxShadow: speaking
              ? "0 0 0 0 rgba(128, 132, 142, 0.3)"
              : "none",
          }}
        >
          {user.avatarLetter}
        </div>
        {/* Muted badge */}
        {muted && (
          <div
            className="absolute"
            style={{
              bottom: 4,
              right: 4,
              width: 18,
              height: 18,
              borderRadius: 6,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MicOff size={9} strokeWidth={3} style={{ color: "#ff7fae" }} />
          </div>
        )}
      </div>
      {/* Name + status */}
      <div className="text-center">
        <div className="text-[14px] font-semibold">
          {isMe ? "you" : user.username}
        </div>
        {speaking ? (
          <div
            className="mt-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold"
            style={{ color: "var(--color-ribbon-sage)" }}
          >
            <div
              className="rounded-full"
              style={{
                width: 5,
                height: 5,
                background: "var(--color-ribbon-sage)",
              }}
            />
            speaking
          </div>
        ) : muted ? (
          <div
            className="mt-0.5 text-[10px]"
            style={{ color: "var(--color-ribbon-terracotta)" }}
          >
            muted
          </div>
        ) : (
          <div
            className="mt-0.5 text-[10px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            listening
          </div>
        )}
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
      className="flex h-11 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[14px] transition"
      style={{
        width: 44,
        height: 44,
        background: danger
          ? "rgba(255, 255, 255, 0.12)"
          : active
            ? "rgba(255, 255, 255, 0.04)"
            : "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(255, 255, 255, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = danger
          ? "rgba(255, 255, 255, 0.12)"
          : active
            ? "rgba(255, 255, 255, 0.04)"
            : "transparent";
      }}
      title={label}
    >
      <div style={{ color }}>{icon}</div>
    </button>
  );
}

function VoiceSidebarButton({
  onClick,
  icon,
  color,
  active = true,
  danger = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  color: string;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 cursor-pointer items-center justify-center rounded-lg py-1.5 transition"
      style={{
        background: danger
          ? "rgba(255, 255, 255, 0.12)"
          : active
            ? "rgba(255, 255, 255, 0.04)"
            : "transparent",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = danger ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = danger ? "rgba(255, 255, 255, 0.12)" : active ? "rgba(255, 255, 255, 0.04)" : "transparent")}
    >
      <div style={{ color }}>{icon}</div>
    </button>
  );
}
