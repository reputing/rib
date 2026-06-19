"use client";

import { Hash, Volume2, ChevronDown, Users } from "lucide-react";
import type { Channel } from "@/lib/ribbon/types";
import { Avatar } from "./Avatar";
import { getUser } from "@/lib/ribbon/mock-data";
import { useRibbon } from "@/lib/ribbon/store";

interface ChannelItemProps {
  channel: Channel;
  active?: boolean;
  onClick?: () => void;
}

export function ChannelItem({ channel, active, onClick }: ChannelItemProps) {
  const Icon = channel.type === "voice" ? Volume2 : Hash;
  const setActiveChannel = useRibbon((s) => s.setActiveChannel);
  const navigate = useRibbon((s) => s.navigate);

  return (
    <button
      onClick={() => {
        if (channel.type === "voice") {
          // Voice channels open the voice view
          navigate("voice");
        } else {
          setActiveChannel(channel.id);
          onClick?.();
        }
      }}
      className="flex w-full cursor-pointer items-center justify-between rounded-[10px] px-2.5 py-1.5 text-[13px] transition"
      style={{
        background: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
        color: active
          ? "var(--color-ribbon-terracotta)"
          : "var(--color-ribbon-text-dim)",
        fontWeight: active ? 500 : 400,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <span className="flex items-center gap-1.5">
        <Icon size={12} strokeWidth={2.5} />
        {channel.name}
      </span>
      {channel.unread ? (
        <span
          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            background: "rgba(255, 255, 255, 0.12)",
            color: "var(--color-ribbon-terracotta)",
          }}
        >
          {channel.unread}
        </span>
      ) : active ? (
        <span
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            background: "var(--color-ribbon-terracotta)",
          }}
        />
      ) : null}
    </button>
  );
}

export function VoiceChannelItem({
  channel,
  active,
}: {
  channel: Channel;
  active?: boolean;
}) {
  const navigate = useRibbon((s) => s.navigate);
  const joinVoice = useRibbon((s) => s.joinVoice);
  const voiceMembers = channel.voiceMembers ?? [];

  return (
    <div>
      <button
        onClick={() => {
          joinVoice();
        }}
        className="flex w-full cursor-pointer items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-[13px] transition"
        style={{
          background: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
          color: active
            ? "var(--color-ribbon-terracotta)"
            : "var(--color-ribbon-text-dim)",
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
      >
        <Volume2 size={11} strokeWidth={2.5} />
        {channel.name}
      </button>
      {voiceMembers.length > 0 && (
        <div className="ml-7 flex items-center gap-1 py-0.5">
          {voiceMembers.map((uid) => {
            const u = getUser(uid);
            return (
              <Avatar
                key={uid}
                letter={u.avatarLetter}
                accent={u.accent}
                size={14}
                radius={5}
              />
            );
          })}
          <span
            className="ml-0.5 text-[10px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            {voiceMembers.map((uid) => getUser(uid).username).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}

export function ServerSelector({
  serverName,
  letter,
  accent,
  memberCount,
  onlineCount,
  onClick,
}: {
  serverName: string;
  letter: string;
  accent: "terracotta" | "amber" | "sage" | "mauve";
  memberCount: number;
  onlineCount: number;
  onClick?: () => void;
}) {
  return (
    <div className="px-3.5 pb-2.5 pt-3.5">
      <button
        onClick={onClick}
        className="flex w-full cursor-pointer items-center gap-2 rounded-[12px] px-2.5 py-2 transition"
        style={{ background: "#211D17" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#282319";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#211D17";
        }}
      >
        <Avatar letter={letter} accent={accent} size={26} radius={9} />
        <div className="min-w-0 flex-1">
          <div
            className="text-[13px] font-semibold"
            style={{ color: "var(--color-ribbon-text)" }}
          >
            {serverName}
          </div>
          <div
            className="text-[10px]"
            style={{ color: "var(--color-ribbon-text-muted)" }}
          >
            {memberCount} members · {onlineCount} online
          </div>
        </div>
        <ChevronDown
          size={12}
          strokeWidth={2.5}
          style={{ color: "var(--color-ribbon-text-muted)" }}
        />
      </button>
    </div>
  );
}

export function MembersHeader({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider"
      style={{ color: "var(--color-ribbon-text-faint)" }}
    >
      <Users size={11} strokeWidth={2.5} />
      Members · {count}
    </div>
  );
}
