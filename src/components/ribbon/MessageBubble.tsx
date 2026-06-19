"use client";

import type { Message } from "@/lib/ribbon/types";
import { getUser } from "@/lib/ribbon/mock-data";
import { Avatar } from "./Avatar";

interface MessageBubbleProps {
  message: Message;
}

// DM-style message — left-aligned for others, right-aligned for you.
// Compact bubble with tail (asymmetric border radius).
export function MessageBubble({ message }: MessageBubbleProps) {
  const author = getUser(message.authorId);
  const isOwn = message.isOwn || message.authorId === "you";

  if (isOwn) {
    return (
      <div
        className="flex max-w-[75%] gap-2.5 self-end"
        style={{ flexDirection: "row-reverse" }}
      >
        <Avatar
          letter={author.avatarLetter}
          accent={author.accent}
          size={26}
          radius={8}
          ring
          className="self-end"
        />
        <div className="flex flex-col items-end">
          <div
            className="bubble-self border px-3.5 py-2.5 text-[14px] leading-[1.5]"
            style={{
              background: "#2A2118",
              borderColor: "rgba(255, 59, 48, 0.1)",
            }}
          >
            {getText(message)}
          </div>
          <div
            className="mt-0.5 pr-1 text-[9px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[75%] gap-2.5">
      <Avatar
        letter={author.avatarLetter}
        accent={author.accent}
        size={26}
        radius={8}
        className="self-end"
      />
      <div>
        <div
          className="bubble-maya border px-3.5 py-2.5 text-[14px] leading-[1.5]"
          style={{
            background: "#1A1612",
            borderColor: "var(--color-ribbon-border)",
          }}
        >
          {getText(message)}
        </div>
        <div
          className="mt-0.5 pl-1 text-[9px]"
          style={{ color: "var(--color-ribbon-text-faint)" }}
        >
          {message.timestamp}
        </div>
      </div>
    </div>
  );
}

function getText(message: Message): string {
  return message.content.text;
}
