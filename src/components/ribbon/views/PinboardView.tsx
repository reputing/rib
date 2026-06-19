"use client";

import { useState } from "react";
import { ArrowLeft, Heart, MessageSquare, Plus, Search } from "lucide-react";
import { useRibbon, ACCENT_HEX } from "@/lib/ribbon/store";
import { pinboardItems, getUser } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import { SectionLabel } from "../Shared";

export function PinboardView() {
  const { navigate, params, activeProfileUserId, setActiveProfile } = useRibbon();
  const userId = params.userId ?? activeProfileUserId;
  const user = getUser(userId);
  const [query, setQuery] = useState("");
  const [liked, setLiked] = useState<string[]>([]);

  const items = pinboardItems.filter((p) => p.ownerId === userId);
  const filtered = items.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.tag?.toLowerCase().includes(query.toLowerCase())
  );

  const toggleLike = (id: string) => {
    setLiked((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  };

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{ background: "var(--color-ribbon-bg)", color: "var(--color-ribbon-text)" }}
    >
      {/* Header */}
      <div
        className="flex h-[52px] flex-none items-center px-5 border-b"
        style={{ borderColor: "var(--color-ribbon-border)" }}
      >
        <button
          onClick={() => navigate("profile", { userId })}
          className="mr-3 flex-none cursor-pointer"
          title="Back"
        >
          <ArrowLeft size={16} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
        </button>
        <div className="flex items-center gap-2">
          <Avatar
            letter={user.avatarLetter}
            accent={user.accent}
            size={26}
            radius={9}
          />
          <div className="text-[15px] font-bold">{user.username}'s pinboard</div>
          <span
            className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              background: "rgba(196, 101, 74, 0.08)",
              color: "var(--color-ribbon-terracotta)",
            }}
          >
            {items.length} pins
          </span>
        </div>
        <div
          className="ml-auto flex items-center gap-2 rounded-[10px] border px-2.5 py-1.5"
          style={{
            background: "#211D17",
            borderColor: "var(--color-ribbon-border)",
          }}
        >
          <Search size={12} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pins"
            className="w-40 bg-transparent text-[12px] outline-none"
            style={{ color: "var(--color-ribbon-text)" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <SectionLabel>{filtered.length} pins</SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => {
            const isLiked = liked.includes(p.id);
            return (
              <div
                key={p.id}
                className="group overflow-hidden rounded-[12px] border transition"
                style={{
                  background: "#1A1612",
                  borderColor: "var(--color-ribbon-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-ribbon-border)";
                }}
              >
                {/* Gradient preview */}
                <div
                  className="relative aspect-square"
                  style={{ background: p.gradient }}
                >
                  {p.tag && (
                    <span
                      className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase"
                      style={{
                        background: "rgba(0, 0, 0, 0.4)",
                        color: "#fff",
                      }}
                    >
                      {p.tag}
                    </span>
                  )}
                  <div
                    className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent)",
                    }}
                  />
                </div>
                {/* Body */}
                <div className="p-2.5">
                  <div className="truncate text-[12px] font-semibold">{p.title}</div>
                  {p.description && (
                    <div
                      className="mt-0.5 truncate text-[10px]"
                      style={{ color: "var(--color-ribbon-text-faint)" }}
                    >
                      {p.description}
                    </div>
                  )}
                  <div
                    className="mt-2 flex items-center justify-between text-[10px]"
                    style={{ color: "var(--color-ribbon-text-muted)" }}
                  >
                    <span>{p.pinnedAt}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLike(p.id)}
                        className="flex cursor-pointer items-center gap-0.5 transition"
                        style={{ color: isLiked ? "#B85544" : "var(--color-ribbon-text-muted)" }}
                      >
                        <Heart
                          size={10}
                          strokeWidth={2.5}
                          fill={isLiked ? "#B85544" : "none"}
                        />
                        {p.likes + (isLiked ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-0.5">
                        <MessageSquare size={10} strokeWidth={2.5} />
                        {p.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add pin tile */}
          <button
            className="flex aspect-square cursor-pointer items-center justify-center rounded-[12px] border border-dashed transition"
            style={{
              background: "transparent",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Plus size={20} style={{ color: "rgba(255, 255, 255, 0.2)" }} />
          </button>
        </div>

        {/* Other pinboards to explore */}
        <SectionLabel>Other pinboards</SectionLabel>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["sol", "maya", "elm", "lena", "wren"].map((uid) => {
            const u = getUser(uid);
            const count = pinboardItems.filter((p) => p.ownerId === uid).length;
            return (
              <button
                key={uid}
                onClick={() => {
                  setActiveProfile(uid);
                  navigate("pinboard", { userId: uid });
                }}
                className="flex flex-none cursor-pointer items-center gap-2 rounded-[12px] border px-3 py-2 transition"
                style={{
                  background: "#1A1612",
                  borderColor: "var(--color-ribbon-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-ribbon-border)";
                }}
              >
                <Avatar
                  letter={u.avatarLetter}
                  accent={u.accent}
                  size={26}
                  radius={9}
                />
                <div>
                  <div className="text-[12px] font-semibold">{u.username}</div>
                  <div
                    className="text-[9px]"
                    style={{ color: "var(--color-ribbon-text-faint)" }}
                  >
                    {count} pins
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
