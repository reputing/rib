"use client";

import type { Message } from "@/lib/ribbon/types";
import { getUser, CURRENT_USER_ID } from "@/lib/ribbon/mock-data";
import { useRibbon } from "@/lib/ribbon/store";
import { Avatar, ACCENT_HEX } from "./Avatar";
import { EmbedPreview } from "./EmbedPreview";
import { FileAttachmentChip } from "./FileAttachment";
import { ReactionChip } from "./Reaction";

interface MessageCardProps {
  message: Message;
  channelId?: string;
}

// Channel-style message — full-width card with avatar + name + timestamp + content + optional embed/files/reactions.
export function MessageCard({ message, channelId }: MessageCardProps) {
  const author = getUser(message.authorId);
  const isOwn = message.authorId === CURRENT_USER_ID;
  const toggleReaction = useRibbon((s) => s.toggleReaction);
  const setActiveProfile = useRibbon((s) => s.setActiveProfile);
  const navigate = useRibbon((s) => s.navigate);

  const accentColor = ACCENT_HEX[author.accent];
  const content = message.content;

  const reactions =
    content.kind === "text-with-reactions"
      ? content.reactions
      : content.kind === "full"
        ? content.reactions
        : undefined;

  const embed =
    content.kind === "text-with-embed"
      ? content.embed
      : content.kind === "full"
        ? content.embed
        : undefined;

  const files =
    content.kind === "text-with-files"
      ? content.files
      : content.kind === "full"
        ? content.files
        : undefined;

  return (
    <div
      className="group rounded-[14px] px-4 py-3.5 transition"
      style={{
        background: "var(--ribbon-card)",
        borderColor: "var(--color-ribbon-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "transparent";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-ribbon-border)";
      }}
    >
      {/* Header row */}
      <div className="mb-1.5 flex items-center gap-2">
        <button
          onClick={() => setActiveProfile(author.id)}
          className="cursor-pointer"
        >
          <Avatar
            letter={author.avatarLetter}
            accent={author.accent}
            size={26}
            radius={8}
          />
        </button>
        <button
          onClick={() => setActiveProfile(author.id)}
          className="cursor-pointer text-[13px] font-semibold"
          style={{ color: accentColor }}
        >
          {author.username}
        </button>
        <span
          className="text-[10px]"
          style={{ color: "var(--color-ribbon-text-faint)" }}
        >
          {message.timestamp}
        </span>
        {!isOwn && (
          <button
            onClick={() => navigate("profile", { userId: author.id })}
            className="ml-auto cursor-pointer rounded-md px-1.5 py-0.5 text-[9px] font-medium"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              color: "var(--color-ribbon-terracotta)",
            }}
          >
            prey.lol/{author.handle}
          </button>
        )}
      </div>

      {/* Body */}
      <div
        className="text-[14px] leading-[1.55]"
        style={{ paddingLeft: 34, color: "var(--color-ribbon-text)" }}
      >
        {content.text}

        {embed && (
          <div className="mt-2.5">
            <EmbedPreview embed={embed} />
          </div>
        )}

        {files && files.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {files.map((f) => (
              <FileAttachmentChip key={f.id} file={f} />
            ))}
          </div>
        )}
      </div>

      {/* Reactions */}
      {reactions && reactions.length > 0 && (
        <div className="mt-2 flex gap-1" style={{ paddingLeft: 34 }}>
          {reactions.map((r, i) => (
            <ReactionChip
              key={i}
              reaction={r}
              onClick={() =>
                channelId && toggleReaction(channelId, message.id, r.emoji)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
