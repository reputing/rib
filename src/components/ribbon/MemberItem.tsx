"use client";

import { Avatar } from "./Avatar";
import { getUser } from "@/lib/ribbon/mock-data";
import { useRibbon } from "@/lib/ribbon/store";
import type { User } from "@/lib/ribbon/types";

// Online row at the top of the DM sidebar — small avatars with status dots.
export function OnlineRow({ users }: { users: User[] }) {
  return (
    <div className="px-3.5 pb-2.5">
      <div
        className="mb-2 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-ribbon-text-faint)" }}
      >
        Online · {users.length}
      </div>
      <div className="flex gap-1.5">
        {users.map((u) => (
          <OnlineAvatar key={u.id} user={u} />
        ))}
      </div>
    </div>
  );
}

function OnlineAvatar({ user }: { user: User }) {
  const setActiveProfile = useRibbon((s) => s.setActiveProfile);
  return (
    <button
      onClick={() => setActiveProfile(user.id)}
      className="relative cursor-pointer"
      title={user.username}
    >
      <Avatar
        letter={user.avatarLetter}
        accent={user.accent}
        size={32}
        radius={10}
        status="online"
      />
    </button>
  );
}

// Member row in the right-side member list panel.
export function MemberRow({ user, role }: { user: User; role?: string }) {
  const setActiveProfile = useRibbon((s) => s.setActiveProfile);
  return (
    <button
      onClick={() => setActiveProfile(user.id)}
      className="flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 transition"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <Avatar
        letter={user.avatarLetter}
        accent={user.accent}
        size={24}
        radius={7}
        status={user.status}
      />
      <span
        className="text-[12px] font-medium"
        style={{
          color:
            user.status === "offline"
              ? "var(--color-ribbon-text-faint)"
              : "var(--color-ribbon-text-dim)",
        }}
      >
        {user.username}
      </span>
      {role && role !== "member" && (
        <span
          className="ml-auto rounded px-1.5 py-0.5 text-[8px] font-semibold uppercase"
          style={{
            background:
              role === "owner"
                ? "rgba(196, 101, 74, 0.15)"
                : role === "admin"
                  ? "rgba(212, 148, 76, 0.15)"
                  : "rgba(123, 168, 122, 0.15)",
            color:
              role === "owner"
                ? "var(--color-ribbon-terracotta)"
                : role === "admin"
                  ? "var(--color-ribbon-amber)"
                  : "var(--color-ribbon-sage)",
          }}
        >
          {role}
        </span>
      )}
    </button>
  );
}
