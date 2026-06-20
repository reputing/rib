"use client";

import { FileText, Image as ImageIcon, Music, Video, Box, Code, Archive } from "lucide-react";
import type { FileAttachment as FileAttachmentType } from "@/lib/ribbon/types";
import { ACCENT_HEX } from "@/lib/ribbon/store";

const TYPE_CONFIG = {
  zip: { icon: Archive, color: ACCENT_HEX.terracotta },
  image: { icon: ImageIcon, color: ACCENT_HEX.sage },
  audio: { icon: Music, color: ACCENT_HEX.amber },
  video: { icon: Video, color: ACCENT_HEX.mauve },
  doc: { icon: FileText, color: ACCENT_HEX.terracotta },
  model: { icon: Box, color: ACCENT_HEX.amber },
  code: { icon: Code, color: ACCENT_HEX.sage },
};

export function FileAttachmentChip({ file }: { file: FileAttachmentType }) {
  const cfg = TYPE_CONFIG[file.type];
  const Icon = cfg.icon;
  return (
    <button
      className="flex cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-2 transition"
      style={{
        background: "var(--ribbon-elevated)",
        borderColor: "var(--color-ribbon-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "transparent";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-ribbon-border)";
      }}
    >
      <div
        className="flex h-7 w-7 flex-none items-center justify-center rounded-[7px]"
        style={{ background: `${cfg.color}1A` }}
      >
        <Icon size={13} color={cfg.color} strokeWidth={2} />
      </div>
      <div>
        <div
          className="text-[11px] font-semibold"
          style={{ color: "var(--color-ribbon-text)" }}
        >
          {file.name}
        </div>
        <div
          className="text-[9px]"
          style={{ color: "var(--color-ribbon-text-faint)" }}
        >
          {file.size}
        </div>
      </div>
    </button>
  );
}

export function FileRow({ file, onOpen }: { file: FileAttachmentType; onOpen?: () => void }) {
  const cfg = TYPE_CONFIG[file.type];
  const Icon = cfg.icon;
  return (
    <button
      onClick={onOpen}
      className="flex w-full cursor-pointer items-center gap-3 rounded-[12px] border px-3 py-3 text-left transition"
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
      <div
        className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px]"
        style={{ background: `${cfg.color}1A` }}
      >
        <Icon size={18} color={cfg.color} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="truncate text-[12px] font-semibold"
          style={{ color: "var(--color-ribbon-text)" }}
        >
          {file.name}
        </div>
        <div
          className="text-[10px]"
          style={{ color: "var(--color-ribbon-text-faint)" }}
        >
          {file.size}
        </div>
      </div>
      <div
        className="flex-none text-[10px]"
        style={{ color: "var(--color-ribbon-text-ghost)" }}
      >
        {new Date(file.uploadedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </div>
    </button>
  );
}
