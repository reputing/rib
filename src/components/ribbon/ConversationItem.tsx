"use client";

import type { DMConversation } from "@/lib/ribbon/types";
import { getUser } from "@/lib/ribbon/mock-data";
import { Avatar } from "./Avatar";
import { useRibbon } from "@/lib/ribbon/store";

interface ConversationItemProps {
  conversation: DMConversation;
  active?: boolean;
  onClick?: () => void;
}

export function ConversationItem({
  conversation,
  active,
  onClick,
}: ConversationItemProps) {
  const other = getUser(conversation.otherUserId);
  const lastMsg = conversation.messages[conversation.messages.length - 1];
  const setActiveDM = useRibbon((s) => s.setActiveDM);

  const previewText = lastMsg
    ? lastMsg.content.kind === "text"
      ? lastMsg.content.text
      : lastMsg.content.text
    : "";

  return (
    <button
      onClick={() => {
        setActiveDM(conversation.id);
        onClick?.();
      }}
      className="mb-0.5 flex w-full cursor-pointer items-center gap-2.5 rounded-[12px] px-2.5 py-2.5 transition"
      style={{
        background: active ? "rgba(255, 255, 255, 0.06)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <Avatar
        letter={other.avatarLetter}
        accent={other.accent}
        size={36}
        radius={10}
        status={other.status}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--color-ribbon-text)" }}
          >
            {other.username}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--color-ribbon-text-muted)" }}
          >
            {conversation.lastMessageAt}
          </span>
        </div>
        <div
          className="mt-0.5 truncate text-[11px]"
          style={{
            color: conversation.unread
              ? "var(--color-ribbon-text-dim)"
              : "var(--color-ribbon-text-muted)",
          }}
        >
          {previewText}
        </div>
      </div>
      {conversation.unread > 0 && (
        <div
          className="flex-none rounded-full"
          style={{
            width: 8,
            height: 8,
            background: "var(--color-ribbon-terracotta)",
          }}
        />
      )}
    </button>
  );
}
