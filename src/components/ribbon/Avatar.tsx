"use client";

import { ACCENT_HEX, ACCENT_HEX_BRIGHT } from "@/lib/ribbon/store";
import type { AccentColor, UserStatus } from "@/lib/ribbon/types";

interface AvatarProps {
  letter: string;
  accent: AccentColor;
  size?: number;            // px
  radius?: number;          // px border radius
  status?: UserStatus;      // show status dot if provided
  ring?: boolean;           // gradient ring for current user
  className?: string;
}

const STATUS_COLORS: Record<UserStatus, string> = {
  online: "#00D67D",
  idle: "#FFD60A",
  dnd: "#FF3B30",
  offline: "#5C5045",
};

export function Avatar({
  letter,
  accent,
  size = 36,
  radius = 10,
  status,
  ring = false,
  className = "",
}: AvatarProps) {
  const bg = ring
    ? `linear-gradient(135deg, ${ACCENT_HEX.terracotta}, ${ACCENT_HEX.amber})`
    : ACCENT_HEX[accent];

  const dotSize = Math.max(8, Math.round(size * 0.28));
  const dotRadius = Math.round(dotSize / 2);

  return (
    <div
      className={`relative flex-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="flex h-full w-full items-center justify-center font-bold text-white"
        style={{
          background: bg,
          borderRadius: radius,
          fontSize: Math.round(size * 0.42),
          boxShadow: ring ? "0 4px 16px rgba(255, 59, 48, 0.35)" : undefined,
        }}
      >
        {letter.toLowerCase()}
      </div>
      {status && (
        <div
          className="absolute"
          style={{
            bottom: -1,
            right: -1,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: STATUS_COLORS[status],
            border: `${Math.max(2, Math.round(size * 0.07))}px solid var(--color-ribbon-sidebar)`,
          }}
        />
      )}
    </div>
  );
}

export function StatusDot({
  status,
  size = 8,
  borderBg = "#1A1612",
}: {
  status: UserStatus;
  size?: number;
  borderBg?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: STATUS_COLORS[status],
        border: `2px solid ${borderBg}`,
      }}
    />
  );
}

export { STATUS_COLORS, ACCENT_HEX, ACCENT_HEX_BRIGHT };
