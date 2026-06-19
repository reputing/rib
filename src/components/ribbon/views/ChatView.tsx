"use client";

import { useEffect, useRef } from "react";
import {
  Grid2x2,
  Share,
  Search,
  Users,
  Hash,
  Volume2,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { servers, getUser } from "@/lib/ribbon/mock-data";
import {
  ChannelItem,
  VoiceChannelItem,
  ServerSelector,
  MembersHeader,
} from "../ChannelItem";
import { MemberRow } from "../MemberItem";
import { UserCard } from "../UserCard";
import { MessageCard } from "../MessageCard";
import { MessageInput } from "../MessageInput";
import { TypingIndicator } from "../TypingIndicator";
import { DateDivider, SectionLabel } from "../Shared";

export function ChatView() {
  const {
    activeServerId,
    activeChannelId,
    setActiveChannel,
    setActiveServer,
    channelMessages,
    sendMessage,
    navigate,
    params,
  } = useRibbon();

  // Allow deep-linking via params
  const server = servers[params.serverId ?? activeServerId] ?? servers[activeServerId];
  const channels = server?.channels ?? [];
  const activeChannel =
    channels.find((c) => c.id === (params.channelId ?? activeChannelId)) ?? channels[0];
  const messages = channelMessages[activeChannel?.id ?? ""] ?? [];

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages.length, activeChannel?.id]);

  // Group members by role
  const memberEntries = (server?.members ?? [])
    .map((m) => ({ ...m, user: getUser(m.userId) }))
    .sort((a, b) => {
      // online first, then by role
      const aOnline = a.user.status !== "offline" ? 0 : 1;
      const bOnline = b.user.status !== "offline" ? 0 : 1;
      if (aOnline !== bOnline) return aOnline - bOnline;
      const roleRank: Record<string, number> = {
        owner: 0, admin: 1, mod: 2, member: 3,
      };
      return (roleRank[a.role] ?? 3) - (roleRank[b.role] ?? 3);
    });

  const onlineMembers = memberEntries.filter((m) => m.user.status !== "offline");
  const offlineMembers = memberEntries.filter((m) => m.user.status === "offline");

  return (
    <div className="flex h-full flex-1 min-h-0">
      {/* ═══ SIDEBAR ═══ */}
      <div
        className="flex w-[256px] flex-none flex-col border-r"
        style={{
          background: "#1A1612",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        <ServerSelector
          serverName={server.name}
          letter={server.letter}
          accent={server.accent}
          memberCount={server.memberCount}
          onlineCount={server.onlineCount}
          onClick={() => navigate("servers")}
        />

        {/* Channels */}
        <div className="flex flex-1 flex-col gap-px overflow-y-auto px-2.5">
          <SectionLabel>Channels</SectionLabel>
          {channels
            .filter((c) => c.type === "text")
            .map((c) => (
              <ChannelItem
                key={c.id}
                channel={c}
                active={c.id === activeChannel?.id}
                onClick={() => setActiveChannel(c.id)}
              />
            ))}

          <SectionLabel>Voice</SectionLabel>
          {channels
            .filter((c) => c.type === "voice")
            .map((c) => (
              <VoiceChannelItem
                key={c.id}
                channel={c}
                active={false}
              />
            ))}
        </div>

        <UserCard onEditBio={() => navigate("settings")} />
      </div>

      {/* ═══ CHAT AREA ═══ */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div
          className="flex h-12 flex-none items-center px-5 border-b"
          style={{ borderColor: "var(--color-ribbon-border)" }}
        >
          <Hash size={14} strokeWidth={2.5} style={{ color: "var(--color-ribbon-text-faint)" }} />
          <span
            className="ml-1.5 text-[14px] font-semibold"
            style={{ color: "var(--color-ribbon-text)" }}
          >
            {activeChannel?.name}
          </span>
          {activeChannel?.topic && (
            <>
              <div
                className="mx-3 h-3.5 w-px"
                style={{ background: "rgba(255, 255, 255, 0.06)" }}
              />
              <span
                className="text-[12px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                {activeChannel.topic}
              </span>
            </>
          )}
          <div className="ml-auto flex items-center gap-2.5">
            <button
              onClick={() => navigate("files")}
              className="cursor-pointer"
              title="Files"
            >
              <Grid2x2 size={15} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            </button>
            <button
              onClick={() => navigate("events")}
              className="cursor-pointer"
              title="Events"
            >
              <Share size={15} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            </button>
            <button className="cursor-pointer" title="Search">
              <Search size={15} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            </button>
            <button
              onClick={() => navigate("friends")}
              className="cursor-pointer"
              title="Members"
            >
              <Users size={15} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesRef}
          className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-4"
          style={{ justifyContent: "flex-end" }}
        >
          <DateDivider label="Today" />
          {messages.map((m) => (
            <MessageCard
              key={m.id}
              message={m}
              channelId={activeChannel?.id}
            />
          ))}
        </div>

        {/* Typing + input */}
        <div className="px-6 pb-3.5">
          <TypingIndicator users={["elm"]} />
          <MessageInput
            placeholder={`Message #${activeChannel?.name ?? "channel"}`}
            onSend={(text) => activeChannel && sendMessage(activeChannel.id, text)}
          />
        </div>
      </div>

      {/* ═══ MEMBER LIST PANEL ═══ */}
      <div
        className="hidden w-[220px] flex-none flex-col border-l lg:flex"
        style={{
          background: "#1A1612",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        <MembersHeader count={memberEntries.length} />
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {onlineMembers.length > 0 && (
            <SectionLabel>Online — {onlineMembers.length}</SectionLabel>
          )}
          {onlineMembers.map((m) => (
            <MemberRow
              key={m.userId}
              user={m.user}
              role={m.role}
            />
          ))}
          {offlineMembers.length > 0 && (
            <SectionLabel>Offline — {offlineMembers.length}</SectionLabel>
          )}
          {offlineMembers.map((m) => (
            <MemberRow
              key={m.userId}
              user={m.user}
              role={m.role}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
