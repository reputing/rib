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
      style={{ background: "var(--ribbon-bg)", color: "var(--ribbon-text)" }}
    >
      {/* Header */}
      <div
        className="flex h-[48px] flex-none items-center px-5"
      >
        <button
          onClick={() => navigate("dms")}
          className="mr-3 flex-none cursor-pointer"
          title="Back"
        >
          <ArrowLeft size={16} strokeWidth={2} style={{ color: "var(--ribbon-text-faint)" }} />
        </button>
        <div className="text-[15px] font-bold">Your Servers</div>
        <div
          className="ml-auto flex items-center gap-2 rounded-[8px] px-2.5 py-1.5"
          style={{ background: "var(--ribbon-card)" }}
        >
          <Search size={12} strokeWidth={2} style={{ color: "var(--ribbon-text-faint)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter"
            className="w-32 bg-transparent text-[12px] outline-none"
            style={{ color: "var(--ribbon-text)" }}
          />
        </div>
        <button
          onClick={() => navigate("discover")}
          className="ml-2 flex cursor-pointer items-center gap-1 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold"
          style={{ background: "var(--color-ribbon-terracotta)", color: "#FFFFFF" }}
        >
          <Plus size={12} strokeWidth={2.5} />
          discover
        </button>
      </div>

      {/* Compact server list — horizontal rows */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <SectionLabel>Joined — {filtered.length}</SectionLabel>
        <div className="space-y-1">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveServer(s.id)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2.5 text-left transition"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ribbon-card)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Avatar
                letter={s.letter}
                accent={s.accent}
                size={36}
                radius={10}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold">{s.name}</div>
                <div className="truncate text-[11px]" style={{ color: "var(--ribbon-text-faint)" }}>
                  {s.description}
                </div>
              </div>
              <div className="flex flex-none items-center gap-1 text-[11px]" style={{ color: "var(--ribbon-text-faint)" }}>
                <Users size={11} strokeWidth={2.5} />
                {s.memberCount >= 1000 ? `${(s.memberCount / 1000).toFixed(1)}k` : s.memberCount}
              </div>
            </button>
          ))}
        </div>

        {/* Suggested — compact */}
        <SectionLabel>Suggested</SectionLabel>
        <div className="space-y-1">
          {discoverableServers.slice(0, 4).map((s) => (
            <button
              key={s.id}
              onClick={() => navigate("discover")}
              className="flex w-full cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2.5 text-left transition"
              style={{ background: "transparent", opacity: 0.7 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--ribbon-card)";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.opacity = "0.7";
              }}
            >
              <Avatar
                letter={s.letter}
                accent={s.accent}
                size={32}
                radius={9}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold">{s.name}</div>
                <div className="truncate text-[10px]" style={{ color: "var(--ribbon-text-faint)" }}>
                  {s.description}
                </div>
              </div>
              <Plus size={12} strokeWidth={2.5} style={{ color: "var(--ribbon-text-faint)" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
