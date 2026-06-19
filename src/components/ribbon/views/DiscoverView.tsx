"use client";

import { useState } from "react";
import { ArrowLeft, Search, Users, Plus, Check } from "lucide-react";
import { useRibbon, ACCENT_HEX } from "@/lib/ribbon/store";
import { discoverableServers, featuredCollections } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import { SectionLabel } from "../Shared";

export function DiscoverView() {
  const { navigate, setActiveServer } = useRibbon();
  const [query, setQuery] = useState("");
  const [joined, setJoined] = useState<string[]>([]);

  const filtered = discoverableServers.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description?.toLowerCase().includes(query.toLowerCase()) ||
      s.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const toggleJoin = (id: string) => {
    setJoined((j) => (j.includes(id) ? j.filter((x) => x !== id) : [...j, id]));
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
          onClick={() => navigate("dms")}
          className="mr-3 flex-none cursor-pointer"
          title="Back"
        >
          <ArrowLeft size={16} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
        </button>
        <div className="text-[15px] font-bold">Discover</div>
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
            placeholder="Search communities"
            className="w-56 bg-transparent text-[12px] outline-none"
            style={{ color: "var(--color-ribbon-text)" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!query && (
          <>
            {/* Featured Collections */}
            <SectionLabel>Featured Collections</SectionLabel>
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCollections.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setQuery(c.name.split(" ")[0].toLowerCase())}
                  className="cursor-pointer rounded-[14px] border p-4 text-left transition"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT_HEX[c.accent]}1F 0%, #1A1612 100%)`,
                    borderColor: `${ACCENT_HEX[c.accent]}26`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${ACCENT_HEX[c.accent]}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${ACCENT_HEX[c.accent]}26`;
                  }}
                >
                  <div
                    className="mb-2 h-8 w-8 rounded-[10px]"
                    style={{
                      background: ACCENT_HEX[c.accent],
                    }}
                  />
                  <div className="text-[13px] font-semibold">{c.name}</div>
                  <div
                    className="mt-1 text-[11px]"
                    style={{ color: "var(--color-ribbon-text-faint)" }}
                  >
                    {c.description}
                  </div>
                  <div
                    className="mt-2 text-[10px] font-medium"
                    style={{ color: ACCENT_HEX[c.accent] }}
                  >
                    {c.serverIds.length} servers →
                  </div>
                </button>
              ))}
            </div>

            <SectionLabel>Trending Communities</SectionLabel>
          </>
        )}

        {/* Server grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const isJoined = joined.includes(s.id);
            return (
              <div
                key={s.id}
                className="overflow-hidden rounded-[14px] border"
                style={{
                  background: "#1A1612",
                  borderColor: "var(--color-ribbon-border)",
                }}
              >
                <div
                  className="relative h-16"
                  style={{ background: s.banner }}
                >
                  <div className="absolute -bottom-4 left-4">
                    <Avatar
                      letter={s.letter}
                      accent={s.accent}
                      size={36}
                      radius={11}
                    />
                  </div>
                  <div
                    className="absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase"
                    style={{
                      background: "rgba(0, 0, 0, 0.4)",
                      color: "#fff",
                    }}
                  >
                    {s.category}
                  </div>
                </div>
                <div className="px-4 pb-4 pt-6">
                  <div className="text-[13px] font-semibold">{s.name}</div>
                  <div
                    className="mt-0.5 line-clamp-2 text-[11px]"
                    style={{ color: "var(--color-ribbon-text-faint)" }}
                  >
                    {s.description}
                  </div>
                  {s.tags && s.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.tags.map((t, i) => (
                        <span
                          key={i}
                          className="rounded-md px-1.5 py-0.5 text-[9px] font-medium"
                          style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            color: "var(--color-ribbon-text-muted)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div
                    className="mt-3 flex items-center justify-between"
                  >
                    <div
                      className="flex items-center gap-1.5 text-[10px]"
                      style={{ color: "var(--color-ribbon-text-muted)" }}
                    >
                      <Users size={11} strokeWidth={2.5} />
                      {s.memberCount} · {s.onlineCount} online
                    </div>
                    <button
                      onClick={() => (isJoined ? setActiveServer(s.id) : toggleJoin(s.id))}
                      className="flex cursor-pointer items-center gap-1 rounded-[8px] px-2.5 py-1 text-[11px] font-semibold transition"
                      style={{
                        background: isJoined
                          ? "rgba(123, 168, 122, 0.15)"
                          : "rgba(196, 101, 74, 0.15)",
                        color: isJoined
                          ? "var(--color-ribbon-sage)"
                          : "var(--color-ribbon-terracotta)",
                      }}
                    >
                      {isJoined ? (
                        <>
                          <Check size={11} strokeWidth={2.5} />
                          open
                        </>
                      ) : (
                        <>
                          <Plus size={11} strokeWidth={2.5} />
                          join
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div
            className="py-12 text-center text-[12px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            no servers match "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
