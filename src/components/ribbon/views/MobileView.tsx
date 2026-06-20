"use client";

import { useState } from "react";
import {
  Search, Users, Plus, Mic, Home, MessageCircle, Compass, Grid2x2,
  Wifi, BatteryFull, Signal,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { servers, getUser, CURRENT_USER_ID } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import { MessageCard } from "../MessageCard";
import { MessageInput } from "../MessageInput";
import { DateDivider } from "../Shared";
import type { ViewId } from "@/lib/ribbon/types";

type MobileTab = "home" | "dms" | "discover" | "boards" | "you";

export function MobileView() {
  const { navigate, activeServerId, activeChannelId, channelMessages, sendMessage, setActiveProfile } = useRibbon();
  const [tab, setTab] = useState<MobileTab>("home");

  const server = servers[activeServerId];
  const activeChannel =
    server?.channels?.find((c) => c.id === activeChannelId) ?? server?.channels?.[1];
  const messages = activeChannel ? (channelMessages[activeChannel.id] ?? []) : [];

  return (
    <div
      className="flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: "#e7e5df",
      }}
    >
      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          background: "#121212",
          borderRadius: 48,
          boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 0 8px #1a1a1a",
          color: "#EDE5D8",
          fontFamily: "var(--font-quicksand), Quicksand, sans-serif",
        }}
      >
        {/* Status bar */}
        <div
          className="flex flex-none items-center justify-between"
          style={{ height: 54, padding: "14px 28px 0" }}
        >
          <span className="text-[14px] font-bold">9:41</span>
          {/* Notch */}
          <div
            className="absolute left-1/2 top-3 -translate-x-1/2"
            style={{
              width: 120,
              height: 28,
              background: "#1a1a1a",
              borderRadius: 20,
            }}
          />
          <div className="flex items-center gap-1.5">
            <Signal size={14} strokeWidth={2} />
            <Wifi size={14} strokeWidth={2} />
            <BatteryFull size={20} strokeWidth={1.5} />
          </div>
        </div>

        {/* App header */}
        <div className="flex flex-none items-center" style={{ height: 48, padding: "0 16px" }}>
          <button
            onClick={() => navigate("chat")}
            className="cursor-pointer"
            title="Back to desktop"
          >
            <Avatar
              letter={server?.letter ?? "A"}
              accent={server?.accent ?? "terracotta"}
              size={30}
              radius={9}
            />
          </button>
          <div className="ml-2.5 flex-1">
            <div className="text-[14px] font-bold">{server?.name ?? "Art Collective"}</div>
            <div className="text-[10px]" style={{ color: "var(--color-ribbon-text-faint)" }}>
              #{activeChannel?.name ?? "gallery"}
            </div>
          </div>
          <div className="flex gap-3">
            <button className="cursor-pointer" title="Search">
              <Search size={18} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            </button>
            <button
              onClick={() => navigate("friends")}
              className="cursor-pointer"
              title="Members"
            >
              <Users size={18} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex flex-1 flex-col gap-1.5 overflow-y-auto"
          style={{ padding: "10px 14px", justifyContent: "flex-end", minHeight: 0 }}
        >
          <DateDivider label="Today" />
          {messages.slice(-6).map((m) => (
            <MobileMessageCard key={m.id} message={m} channelId={activeChannel?.id} />
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "6px 14px 8px" }}>
          <div
            className="flex items-center gap-2"
            style={{
              background: "var(--ribbon-card)",
              borderRadius: 20,
              padding: "10px 14px",
              border: "1px solid var(--color-ribbon-border)",
            }}
          >
            <Plus size={18} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            <input
              type="text"
              placeholder="Message"
              className="flex-1 bg-transparent text-[13px] outline-none"
              style={{ color: "var(--color-ribbon-text)" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && activeChannel) {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    sendMessage(activeChannel.id, target.value.trim());
                    target.value = "";
                  }
                }
              }}
            />
            <Mic size={18} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
          </div>
        </div>

        {/* Bottom tab bar */}
        <div
          className="flex flex-none items-center justify-around"
          style={{
            height: 82,
            padding: "0 8px 28px",
            background: "var(--ribbon-bg-deep)",
            borderColor: "var(--color-ribbon-border)",
          }}
        >
          <MobileTabButton
            icon={<Home size={20} strokeWidth={2} />}
            label="home"
            active={tab === "home"}
            onClick={() => setTab("home")}
          />
          <MobileTabButton
            icon={<MessageCircle size={20} strokeWidth={2} />}
            label="dms"
            active={tab === "dms"}
            onClick={() => {
              setTab("dms");
              navigate("dms");
            }}
            hasNotification
          />
          <MobileTabButton
            icon={<Compass size={20} strokeWidth={2} />}
            label="discover"
            active={tab === "discover"}
            onClick={() => {
              setTab("discover");
              navigate("discover");
            }}
          />
          <MobileTabButton
            icon={<Grid2x2 size={20} strokeWidth={2} />}
            label="boards"
            active={tab === "boards"}
            onClick={() => {
              setTab("boards");
              setActiveProfile("sol");
            }}
          />
          <MobileTabButton
            icon={
              <div
                className="h-5 w-5"
                style={{
                  borderRadius: 6,
                  background: "linear-gradient(135deg,#ff7fae,#ff7fae)",
                }}
              />
            }
            label="you"
            active={tab === "you"}
            onClick={() => {
              setTab("you");
              navigate("settings");
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MobileTabButton({
  icon,
  label,
  active,
  onClick,
  hasNotification,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  hasNotification?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex cursor-pointer flex-col items-center gap-1"
      style={{ padding: "4px 12px" }}
    >
      <div style={{ color: active ? "#ff7fae" : "#888888" }}>{icon}</div>
      <span
        className="text-[9px] font-semibold"
        style={{ color: active ? "#ff7fae" : "#888888" }}
      >
        {label}
      </span>
      {hasNotification && (
        <div
          className="absolute"
          style={{
            top: 0,
            right: 8,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#ff7fae",
            border: "2px solid var(--ribbon-bg-deep)",
          }}
        />
      )}
    </button>
  );
}

// Compact mobile message card (smaller padding, no member list, smaller avatars)
import type { Message } from "@/lib/ribbon/types";

function MobileMessageCard({
  message,
  channelId,
}: {
  message: Message;
  channelId?: string;
}) {
  const author = getUser(message.authorId);
  const isOwn = message.authorId === CURRENT_USER_ID;
  const toggleReaction = useRibbon((s) => s.toggleReaction);
  const openProfilePopup = useRibbon((s) => s.openProfilePopup);

  const reactions =
    message.content.kind === "text-with-reactions"
      ? message.content.reactions
      : message.content.kind === "full"
        ? message.content.reactions
        : undefined;

  return (
    <div
      className="rounded-[14px] px-3 py-2.5"
      style={{
        background: "var(--ribbon-card)",
        borderColor: "var(--color-ribbon-border)",
      }}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <button
          onClick={() => openProfilePopup(author.id)}
          className="cursor-pointer"
        >
          <Avatar
            letter={author.avatarLetter}
            accent={author.accent}
            size={22}
            radius={7}
          />
        </button>
        <button
          onClick={() => openProfilePopup(author.id)}
          className="cursor-pointer text-[12px] font-semibold"
          style={{ color: `var(--color-ribbon-${author.accent})` }}
        >
          {author.username}
        </button>
        <span
          className="text-[9px]"
          style={{ color: "var(--color-ribbon-text-faint)" }}
        >
          {message.timestamp}
        </span>
      </div>
      <div
        className="text-[13px] leading-[1.5]"
        style={{ paddingLeft: 28, color: "var(--color-ribbon-text)" }}
      >
        {message.content.text}
      </div>
      {reactions && reactions.length > 0 && (
        <div className="mt-1.5 flex gap-1" style={{ paddingLeft: 28 }}>
          {reactions.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px]"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                borderColor: "transparent",
              }}
            >
              <span>{r.emoji}</span>
              <span
                className="text-[9px] font-semibold"
                style={{ color: "var(--color-ribbon-terracotta)" }}
              >
                {r.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
