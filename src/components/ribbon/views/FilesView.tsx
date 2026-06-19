"use client";

import { useState } from "react";
import { ArrowLeft, Grid2x2, List, Upload, Search } from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { serverFiles, getUser, servers } from "@/lib/ribbon/mock-data";
import { FileRow } from "../FileAttachment";
import { Avatar } from "../Avatar";
import { SectionLabel } from "../Shared";

const TYPE_FILTERS = ["all", "image", "audio", "video", "doc", "zip", "code", "model"];

export function FilesView() {
  const { navigate, activeServerId } = useRibbon();
  const server = servers[activeServerId];
  const [view, setView] = useState<"grid" | "list">("list");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = serverFiles.filter((f) => {
    if (typeFilter !== "all" && f.type !== typeFilter) return false;
    if (query && !f.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const totalSize = serverFiles.reduce((sum, f) => {
    const m = parseFloat(f.size);
    if (isNaN(m)) return sum;
    return sum + m;
  }, 0);

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
          onClick={() => navigate("chat")}
          className="mr-3 flex-none cursor-pointer"
          title="Back"
        >
          <ArrowLeft size={16} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
        </button>
        <div className="text-[15px] font-bold">Files</div>
        {server && (
          <span
            className="ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              background: "rgba(196, 101, 74, 0.08)",
              color: "var(--color-ribbon-terracotta)",
            }}
          >
            {server.name}
          </span>
        )}
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
            placeholder="Search files"
            className="w-44 bg-transparent text-[12px] outline-none"
            style={{ color: "var(--color-ribbon-text)" }}
          />
        </div>
        {/* View toggle */}
        <div
          className="ml-2 flex items-center gap-0.5 rounded-[10px] p-1"
          style={{ background: "rgba(255, 255, 255, 0.04)" }}
        >
          <button
            onClick={() => setView("list")}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition"
            style={{
              background: view === "list" ? "rgba(196, 101, 74, 0.15)" : "transparent",
              color: view === "list" ? "var(--color-ribbon-terracotta)" : "var(--color-ribbon-text-muted)",
            }}
            title="List view"
          >
            <List size={13} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setView("grid")}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition"
            style={{
              background: view === "grid" ? "rgba(196, 101, 74, 0.15)" : "transparent",
              color: view === "grid" ? "var(--color-ribbon-terracotta)" : "var(--color-ribbon-text-muted)",
            }}
            title="Grid view"
          >
            <Grid2x2 size={13} strokeWidth={2.5} />
          </button>
        </div>
        <button
          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[12px] font-medium"
          style={{
            background: "rgba(196, 101, 74, 0.12)",
            color: "var(--color-ribbon-terracotta)",
          }}
        >
          <Upload size={12} strokeWidth={2.5} />
          upload
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Type filter pills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition"
              style={{
                background:
                  typeFilter === t
                    ? "rgba(196, 101, 74, 0.15)"
                    : "rgba(255, 255, 255, 0.04)",
                color: typeFilter === t
                  ? "var(--color-ribbon-terracotta)"
                  : "var(--color-ribbon-text-muted)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div
          className="mb-4 flex items-center justify-between rounded-[12px] border p-3"
          style={{
            background: "#1A1612",
            borderColor: "var(--color-ribbon-border)",
          }}
        >
          <div
            className="text-[11px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            <span style={{ color: "var(--color-ribbon-text)", fontWeight: 600 }}>{filtered.length}</span> files · ~{totalSize.toFixed(1)} MB total
          </div>
        </div>

        <SectionLabel>
          {view === "list" ? "List view" : "Grid view"} — {filtered.length} files
        </SectionLabel>

        {view === "list" ? (
          <div className="space-y-1.5">
            {filtered.map((f) => {
              const uploader = getUser(f.uploadedBy);
              return (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-[12px] border px-3 py-2.5"
                  style={{
                    background: "#1A1612",
                    borderColor: "var(--color-ribbon-border)",
                  }}
                >
                  <FileRow file={f} />
                  <button
                    onClick={() => {
                      const u = getUser(f.uploadedBy);
                      // Just demo: would actually navigate
                      void u;
                    }}
                    className="flex flex-none cursor-pointer items-center gap-1.5"
                    title={`Uploaded by ${uploader.username}`}
                  >
                    <Avatar
                      letter={uploader.avatarLetter}
                      accent={uploader.accent}
                      size={22}
                      radius={7}
                    />
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--color-ribbon-text-faint)" }}
                    >
                      {uploader.username}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((f) => {
              const uploader = getUser(f.uploadedBy);
              return (
                <button
                  key={f.id}
                  className="cursor-pointer overflow-hidden rounded-[12px] border text-left transition"
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
                  {/* File icon area */}
                  <div
                    className="flex aspect-square items-center justify-center"
                    style={{
                      background:
                        f.type === "image"
                          ? "linear-gradient(135deg, rgba(123, 168, 122, 0.15), rgba(196, 101, 74, 0.1))"
                          : "#211D17",
                    }}
                  >
                    <FileGridIcon type={f.type} />
                  </div>
                  <div className="p-2.5">
                    <div className="truncate text-[11px] font-semibold">{f.name}</div>
                    <div
                      className="mt-0.5 text-[9px]"
                      style={{ color: "var(--color-ribbon-text-faint)" }}
                    >
                      {f.size} · {uploader.username}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div
            className="py-12 text-center text-[12px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            no files match your filters
          </div>
        )}
      </div>
    </div>
  );
}

function FileGridIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    zip: "#C4654A", image: "#7BA87A", audio: "#D4944C",
    video: "#8B7FA0", doc: "#C4654A", model: "#D4944C", code: "#7BA87A",
  };
  const c = colors[type] ?? "#C4654A";
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-[10px] text-[18px] font-bold uppercase"
      style={{
        background: `${c}1A`,
        color: c,
      }}
    >
      {type === "image" ? "🖼" : type === "audio" ? "🎵" : type === "video" ? "🎬" : type === "code" ? "{}" : type === "model" ? "◆" : type === "doc" ? "📄" : "📦"}
    </div>
  );
}
