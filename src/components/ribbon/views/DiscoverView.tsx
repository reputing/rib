"use client";

import {
  Compass, Gamepad2, Palette, Music, Code, Users, Star, Smile,
  Search, Plus,
} from "lucide-react";
import { useRibbon, ACCENT_HEX } from "@/lib/ribbon/store";
import {
  discoverableServers,
  discoverCategories,
  featuredServerCards,
  friendsInServers,
  getUser,
} from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import { SectionLabel } from "../Shared";
import { UserCard } from "../UserCard";

const CATEGORY_ICONS = {
  compass: Compass,
  gamepad: Gamepad2,
  palette: Palette,
  music: Music,
  code: Code,
  users: Users,
  star: Star,
  smile: Smile,
};

export function DiscoverView() {
  const {
    navigate,
    discoverCategory,
    setDiscoverCategory,
    discoverQuery,
    setDiscoverQuery,
    joinedDiscoverServers,
    joinDiscoverServer,
    setActiveServer,
  } = useRibbon();

  const filtered = discoverableServers.filter((s) => {
    if (discoverCategory !== "all" && s.category !== discoverCategory) return false;
    if (discoverQuery) {
      const q = discoverQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div
      className="flex h-full w-full"
      style={{ background: "var(--color-ribbon-bg)", color: "var(--color-ribbon-text)" }}
    >
      {/* ═══ SIDEBAR ═══ */}
      <div
        className="flex w-[256px] flex-none flex-col"
        style={{
          background: "var(--ribbon-card)",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3.5 pt-3.5 pb-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-[9px] text-[14px] font-extrabold text-white"
            style={{ background: "#E8769A" }}
          >
            r
          </div>
          <div
            className="text-[15px] font-bold"
            style={{ letterSpacing: "-0.3px" }}
          >
            Discover
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-1 flex-col gap-px overflow-y-auto px-2.5 py-1.5">
          <SectionLabel>Browse</SectionLabel>
          {discoverCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon];
            const active = discoverCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setDiscoverCategory(cat.id)}
                className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-[13px] transition"
                style={{
                  background: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  color: active
                    ? "var(--color-ribbon-terracotta)"
                    : "var(--color-ribbon-text-dim)",
                  fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={12} strokeWidth={2.5} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <UserCard />
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
        {/* Search bar */}
        <div className="px-7 pt-4">
          <div
            className="flex items-center gap-2.5 rounded-[14px] px-4 py-2.5"
            style={{
              background: "var(--ribbon-card)",
              borderColor: "var(--color-ribbon-border)",
            }}
          >
            <Search size={15} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
            <input
              type="text"
              value={discoverQuery}
              onChange={(e) => setDiscoverQuery(e.target.value)}
              placeholder="Search communities..."
              className="flex-1 bg-transparent text-[14px] outline-none"
              style={{ color: "var(--color-ribbon-text)" }}
            />
          </div>
        </div>

        {/* Featured (only when no query + category = all) */}
        {!discoverQuery && discoverCategory === "all" && (
          <div className="px-7 pt-5">
            <SectionLabel>Featured</SectionLabel>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {featuredServerCards.map((s) => (
                <FeaturedServerCard
                  key={s.id}
                  server={s}
                  onJoin={() => joinDiscoverServer(s.id)}
                  onOpen={() => setActiveServer(s.id)}
                  joined={joinedDiscoverServers.includes(s.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Trending */}
        <div className="px-7 pt-5">
          <div
            className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            <span>Trending</span>
            <span
              className="cursor-pointer text-[10px] font-semibold normal-case tracking-normal"
              style={{ color: "var(--color-ribbon-terracotta)" }}
            >
              see all
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {filtered.slice(0, 8).map((s) => {
              const isJoined = joinedDiscoverServers.includes(s.id);
              return (
                <div
                  key={s.id}
                  className="flex cursor-pointer items-center gap-3 rounded-[14px] px-3.5 py-3 transition"
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
                  onClick={() => !isJoined && joinDiscoverServer(s.id)}
                >
                  <div
                    className="flex h-10 w-10 flex-none items-center justify-center text-[16px] font-bold text-white"
                    style={{
                      borderRadius: 12,
                      background: s.banner,
                    }}
                  >
                    {s.letter}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold">{s.name}</div>
                    <div
                      className="truncate text-[11px]"
                      style={{ color: "var(--color-ribbon-text-faint)" }}
                    >
                      {s.description}
                    </div>
                  </div>
                  <div className="flex-none text-right">
                    <div
                      className="text-[11px] font-semibold"
                      style={{ color: "var(--color-ribbon-text-dim)" }}
                    >
                      {s.memberCount >= 1000
                        ? `${(s.memberCount / 1000).toFixed(1)}k`
                        : s.memberCount}
                    </div>
                    <div
                      className="text-[9px]"
                      style={{ color: "var(--color-ribbon-text-faint)" }}
                    >
                      members
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isJoined) { setActiveServer(s.id); } else { joinDiscoverServer(s.id); }
                    }}
                    className="flex-none cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-semibold transition"
                    style={{
                      background: isJoined
                        ? "rgba(128, 132, 142, 0.14)"
                        : "rgba(255, 255, 255, 0.1)",
                      color: isJoined
                        ? "var(--color-ribbon-sage)"
                        : "var(--color-ribbon-terracotta)",
                    }}
                  >
                    {isJoined ? "open" : "join"}
                  </button>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div
              className="py-8 text-center text-[12px]"
              style={{ color: "var(--color-ribbon-text-faint)" }}
            >
              no servers match &quot;{discoverQuery}&quot;
            </div>
          )}
        </div>

        {/* Your friends are in */}
        {!discoverQuery && discoverCategory === "all" && (
          <div className="px-7 pt-5 pb-7">
            <SectionLabel>Your friends are in</SectionLabel>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {friendsInServers.map(({ server, friendIds }) => (
                <div
                  key={server.id}
                  onClick={() => joinDiscoverServer(server.id)}
                  className="flex cursor-pointer flex-col items-center rounded-[14px] px-3.5 py-3.5 text-center transition"
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
                    className="flex h-9 w-9 items-center justify-center text-[14px] font-bold text-white"
                    style={{
                      borderRadius: 11,
                      background: server.banner,
                    }}
                  >
                    {server.letter}
                  </div>
                  <div
                    className="mt-2 text-[12px] font-semibold"
                    style={{ color: "var(--color-ribbon-text)" }}
                  >
                    {server.name}
                  </div>
                  <div
                    className="mt-0.5 text-[10px]"
                    style={{ color: "var(--color-ribbon-text-faint)" }}
                  >
                    {server.memberCount} members
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-0.5">
                    {friendIds.slice(0, 2).map((uid) => {
                      const u = getUser(uid);
                      return (
                        <Avatar
                          key={uid}
                          letter={u.avatarLetter}
                          accent={u.accent}
                          size={16}
                          radius={5}
                        />
                      );
                    })}
                    {friendIds.length > 2 && (
                      <span
                        className="ml-0.5 text-[9px]"
                        style={{ color: "var(--color-ribbon-text-faint)" }}
                      >
                        +{friendIds.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedServerCard({
  server,
  onJoin,
  onOpen,
  joined,
}: {
  server: typeof featuredServerCards[number];
  onJoin: () => void;
  onOpen: () => void;
  joined: boolean;
}) {
  return (
    <div
      className="cursor-pointer overflow-hidden rounded-[16px] transition"
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
      {/* Banner */}
      <div
        className="relative"
        style={{
          height: 100,
          background: server.banner,
        }}
      >
        <div
          className="absolute bottom-2.5 left-3 flex items-center gap-1.5"
        >
          <div
            className="rounded-md px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
            }}
          >
            {server.memberCount >= 1000
              ? `${(server.memberCount / 1000).toFixed(1)}k members`
              : `${server.memberCount} members`}
          </div>
          <div
            className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              color: "#CCCCCC",
            }}
          >
            {server.onlineCount} online
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="px-3.5 pb-3 pt-3">
        <div className="flex items-center gap-2">
          <div
            className="-mt-6 flex h-8 w-8 flex-none items-center justify-center rounded-[10px] text-[13px] font-bold text-white"
            style={{
              background: ACCENT_HEX[server.accent],
              borderColor: "var(--ribbon-card)",
            }}
          >
            {server.letter}
          </div>
          <div>
            <div className="text-[14px] font-bold">{server.name}</div>
            <div
              className="text-[11px]"
              style={{ color: "var(--color-ribbon-text-faint)" }}
            >
              {server.description}
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {server.tags?.map((t, i) => {
            const accent = (["terracotta", "sage", "amber"] as const)[i % 3];
            return (
              <span
                key={t}
                className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background: `${ACCENT_HEX[accent]}14`,
                  color: ACCENT_HEX[accent],
                }}
              >
                {t}
              </span>
            );
          })}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (joined) { onOpen(); } else { onJoin(); }
          }}
          className="mt-3 w-full cursor-pointer rounded-[10px] py-2 text-[12px] font-semibold transition"
          style={{
            background: joined
              ? "rgba(128, 132, 142, 0.18)"
              : "rgba(255, 255, 255, 0.12)",
            color: joined
              ? "var(--color-ribbon-sage)"
              : "var(--color-ribbon-terracotta)",
          }}
        >
          {joined ? "✓ joined — open" : "+ join server"}
        </button>
      </div>
    </div>
  );
}
