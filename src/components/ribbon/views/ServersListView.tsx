"use client";

import { useState } from "react";
import { ArrowLeft, Search, Plus, Users } from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { serverList, discoverableServers } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import { SectionLabel } from "../Shared";

export function ServersListView() {
  const { navigate, setActiveServer } = useRibbon();
  const [query, setQuery] = useState("");

  const myServers = serverList;
  const filtered = myServers.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{ background: "var(--color-ribbon-bg)", color: "var(--color-ribbon-text)" }}
    >
      {/* Header */}
      <div
        className="flex h-[52px] flex-none items-center px-5"
        style={{ borderColor: "var(--color-ribbon-border)" }}
      >
        <button
          onClick={() => navigate("dms")}
          className="mr-3 flex-none cursor-pointer"
          title="Back"
        >
          <ArrowLeft size={16} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
        </button>
        <div className="text-[15px] font-bold">Your Servers</div>
        <div
          className="ml-auto flex items-center gap-2 rounded-[10px] px-2.5 py-1.5"
          style={{
            background: "var(--ribbon-elevated)",
            borderColor: "var(--color-ribbon-border)",
          }}
        >
          <Search size={12} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter servers"
            className="w-40 bg-transparent text-[12px] outline-none"
            style={{ color: "var(--color-ribbon-text)" }}
          />
        </div>
        <button
          onClick={() => navigate("discover")}
          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[12px] font-medium"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "var(--color-ribbon-terracotta)",
          }}
        >
          <Plus size={12} strokeWidth={2.5} />
          discover
        </button>
      </div>

      {/* Server grid */}
      <div className="flex-1 overflow-y-auto p-5">
        <SectionLabel>Joined — {filtered.length}</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveServer(s.id)}
              className="group cursor-pointer overflow-hidden rounded-[14px] text-left transition"
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
                className="relative h-14"
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
              </div>
              {/* Body */}
              <div className="px-4 pb-4 pt-6">
                <div className="text-[13px] font-semibold">{s.name}</div>
                <div
                  className="mt-0.5 line-clamp-2 text-[11px]"
                  style={{ color: "var(--color-ribbon-text-faint)" }}
                >
                  {s.description}
                </div>
                <div
                  className="mt-3 flex items-center gap-1.5 text-[10px]"
                  style={{ color: "var(--color-ribbon-text-muted)" }}
                >
                  <Users size={11} strokeWidth={2.5} />
                  {s.memberCount} members · {s.onlineCount} online
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Discover suggestions */}
        <SectionLabel>Suggested for you</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {discoverableServers.slice(0, 3).map((s) => (
            <button
              key={s.id}
              onClick={() => navigate("discover")}
              className="cursor-pointer overflow-hidden rounded-[14px] text-left transition"
              style={{
                background: "var(--ribbon-card)",
                borderColor: "var(--color-ribbon-border)",
                opacity: 0.7,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-ribbon-border)";
                e.currentTarget.style.opacity = "0.7";
              }}
            >
              <div className="relative h-12" style={{ background: s.banner }}>
                <div className="absolute -bottom-3 left-3">
                  <Avatar letter={s.letter} accent={s.accent} size={28} radius={9} />
                </div>
              </div>
              <div className="px-3 pb-3 pt-5">
                <div className="text-[12px] font-semibold">{s.name}</div>
                <div className="mt-0.5 truncate text-[10px]" style={{ color: "var(--color-ribbon-text-faint)" }}>
                  {s.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
