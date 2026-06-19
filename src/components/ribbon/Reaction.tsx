"use client";

import type { Reaction as ReactionType } from "@/lib/ribbon/types";
import { ACCENT_HEX } from "./Avatar";

interface ReactionProps {
  reaction: ReactionType;
  onClick?: () => void;
}

export function ReactionChip({ reaction, onClick }: ReactionProps) {
  const color = ACCENT_HEX[reaction.accent];
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1 text-[12px] transition"
      style={{
        background: reaction.reactedByMe ? `${color}1A` : `${color}14`,
        borderColor: reaction.reactedByMe ? `${color}26` : `${color}1A`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${color}26`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = reaction.reactedByMe ? `${color}1A` : `${color}14`;
      }}
    >
      <span>{reaction.emoji}</span>
      <span
        className="text-[10px] font-semibold"
        style={{ color }}
      >
        {reaction.count}
      </span>
    </button>
  );
}
