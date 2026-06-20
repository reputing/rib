"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { getUser, userList, CURRENT_USER_ID } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import { ConversationItem } from "../ConversationItem";
import { UserCard } from "../UserCard";
import { MessageBubble } from "../MessageBubble";
import { MessageInput } from "../MessageInput";
import { TypingIndicator } from "../TypingIndicator";
import { SearchBar, DateDivider } from "../Shared";

export function DMsView() {
  const {
    dms,
    activeDMId,
    setActiveDM,
    sendDM,
    justEnteredApp,
    clearJustEnteredApp,
    openBiolink,
    openProfilePopup,
  } = useRibbon();

  const activeDM = dms.find((d) => d.id === activeDMId) ?? dms[0];
  const other = getUser(activeDM.otherUserId);

  // Online users (small row at the top)
  const onlineUsers = userList.filter(
    (u) => u.status === "online" && u.id !== CURRENT_USER_ID
  );

  const messagesRef = useRef<HTMLDivElement>(null);

  // Clear the one-shot fade-in flag after this render so subsequent DMs visits don't re-fade.
  useEffect(() => {
    if (justEnteredApp) {
      const t = setTimeout(() => clearJustEnteredApp(), 700);
      return () => clearTimeout(t);
    }
  }, [justEnteredApp, clearJustEnteredApp]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [activeDM.messages.length, activeDMId]);

  return (
    <div className={`flex h-full flex-1 min-h-0${justEnteredApp ? " animate-fade-in" : ""}`}>
      {/* ═══ DM LIST SIDEBAR ═══ */}
      <div
        className="hidden sm:flex w-[60px] sm:w-[280px] flex-none flex-col"
        style={{
          background: "var(--ribbon-card)",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 pt-3.5 pb-2">
          <div
            className="text-[15px] font-bold"
            style={{ color: "var(--color-ribbon-text)" }}
          >
            Messages
          </div>
          <button
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[8px] transition"
            style={{ background: "rgba(255, 255, 255, 0.04)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
            }}
            title="New DM"
          >
            <Plus size={13} strokeWidth={2} style={{ color: "var(--color-ribbon-text-dim)" }} />
          </button>
        </div>

        <SearchBar placeholder="Search messages" />

        {/* Online row */}
        <div className="px-3.5 pb-2.5">
          <div
            className="mb-2 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            Online · {onlineUsers.length}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {onlineUsers.slice(0, 6).map((u) => (
              <button
                key={u.id}
                onClick={() => openProfilePopup(u.id)}
                className="relative cursor-pointer"
                title={u.username}
              >
                <Avatar
                  letter={u.avatarLetter}
                  accent={u.accent}
                  size={32}
                  radius={10}
                  status="online"
                />
              </button>
            ))}
          </div>
        </div>

        <div
          className="h-px w-full"
          style={{ background: "var(--color-ribbon-border)" }}
        />

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 py-1.5">
          {dms.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              active={conv.id === activeDMId}
              onClick={() => setActiveDM(conv.id)}
            />
          ))}
        </div>

        <UserCard />
      </div>

      {/* ═══ ACTIVE DM ═══ */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* DM Header */}
        <div
          className="flex h-[52px] flex-none items-center px-5"
          style={{ borderColor: "var(--color-ribbon-border)" }}
        >
          <button
            onClick={() => openProfilePopup(other.id)}
            className="relative mr-2.5 flex-none cursor-pointer"
          >
            <Avatar
              letter={other.avatarLetter}
              accent={other.accent}
              size={28}
              radius={9}
              status={other.status}
            />
          </button>
          <button
            onClick={() => openProfilePopup(other.id)}
            className="cursor-pointer text-left"
          >
            <div
              className="text-[14px] font-semibold"
              style={{ color: "var(--color-ribbon-text)" }}
            >
              {other.username}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "var(--color-ribbon-text-faint)" }}
            >
              {other.status === "online" ? "online" : other.status}
            </div>
          </button>
          <div className="ml-auto flex items-center gap-2.5">
            <button
              onClick={() => openBiolink(other.id)}
              className="cursor-pointer rounded-md px-2 py-1 text-[10px] font-medium"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "var(--color-ribbon-terracotta)",
              }}
            >
              prey.lol/{other.handle}
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
          {activeDM.messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>

        {/* Typing + input */}
        <div className="px-6 pb-3.5">
          <TypingIndicator users={[]} />
          <MessageInput
            placeholder={`Message ${other.username}`}
            onSend={(text) => sendDM(activeDM.id, text)}
          />
        </div>
      </div>
    </div>
  );
}
