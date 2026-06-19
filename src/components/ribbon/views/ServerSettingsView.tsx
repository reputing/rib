"use client";

import { useState } from "react";
import {
  ArrowLeft, Trash2, Upload, Plus, X, Settings as SettingsIcon,
  Hash, Shield, Users, Mail, Flag, Ban,
} from "lucide-react";
import { useRibbon, ACCENT_HEX } from "@/lib/ribbon/store";
import { servers } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import { SectionLabel } from "../Shared";
import type { ServerSettingsTab } from "@/lib/ribbon/types";

const TABS: { id: ServerSettingsTab; label: string; icon: any; section: string }[] = [
  { id: "overview", label: "Overview", icon: SettingsIcon, section: "General" },
  { id: "channels", label: "Channels", icon: Hash, section: "General" },
  { id: "roles", label: "Roles", icon: Shield, section: "General" },
  { id: "members", label: "Members", icon: Users, section: "Community" },
  { id: "invites", label: "Invites", icon: Mail, section: "Community" },
  { id: "moderation", label: "Moderation", icon: Flag, section: "Community" },
  { id: "bans", label: "Bans", icon: Ban, section: "Community" },
];

const TAG_SUGGESTIONS = ["art", "design", "music", "code", "gaming", "social", "creators", "hangout"];

export function ServerSettingsView() {
  const {
    navigate,
    activeServerId,
    serverSettingsTab,
    setServerSettingsTab,
    serverSettings,
    toggleServerSetting,
    addServerTag,
    removeServerTag,
  } = useRibbon();

  const server = servers[activeServerId];
  const tab = serverSettingsTab;
  const settings = serverSettings[activeServerId] ?? {
    listedOnDiscover: false,
    allowInvites: false,
    requireApproval: false,
    tags: [],
  };

  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    const t = newTag.trim().toLowerCase();
    if (t && !settings.tags.includes(t)) {
      addServerTag(activeServerId, t);
    }
    setNewTag("");
    setShowTagInput(false);
  };

  return (
    <div
      className="flex h-full w-full"
      style={{ background: "var(--color-ribbon-bg)", color: "var(--color-ribbon-text)" }}
    >
      {/* ═══ SIDEBAR ═══ */}
      <div
        className="flex w-[240px] flex-none flex-col border-r"
        style={{
          background: "#1A1612",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        {/* Back link */}
        <button
          onClick={() => navigate("chat")}
          className="flex cursor-pointer items-center gap-2 px-3.5 pt-3.5 pb-1.5 text-[13px] font-semibold"
          style={{ color: "var(--color-ribbon-text-dim)" }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to server
        </button>

        {/* Server identity */}
        <div className="px-3.5 pb-3.5">
          <div className="flex items-center gap-2.5">
            <Avatar
              letter={server?.letter ?? "A"}
              accent={server?.accent ?? "terracotta"}
              size={40}
              radius={12}
            />
            <div>
              <div className="text-[14px] font-bold">{server?.name ?? "Art Collective"}</div>
              <div
                className="text-[10px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                server settings
              </div>
            </div>
          </div>
        </div>

        <div
          className="h-px w-full"
          style={{ background: "var(--color-ribbon-border)" }}
        />

        {/* Nav items */}
        <div className="flex flex-1 flex-col gap-px overflow-y-auto p-2">
          {["General", "Community"].map((section) => (
            <div key={section}>
              <SectionLabel>{section}</SectionLabel>
              {TABS.filter((t) => t.section === section).map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setServerSettingsTab(t.id)}
                    className="mb-0.5 flex w-full cursor-pointer items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-[13px] transition"
                    style={{
                      background: active ? "rgba(255, 59, 48, 0.1)" : "transparent",
                      color: active
                        ? "var(--color-ribbon-terracotta)"
                        : "var(--color-ribbon-text-dim)",
                      fontWeight: active ? 500 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Icon size={13} strokeWidth={2.5} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Delete server */}
          <div className="mt-auto p-2.5">
            <button
              onClick={() => navigate("dms")}
              className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-2.5 py-2 text-[12px] transition"
              style={{ color: "var(--color-ribbon-terracotta)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 59, 48, 0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Trash2 size={12} strokeWidth={2} />
              Delete Server
            </button>
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[660px] px-8 py-7">
          {tab === "overview" && (
            <OverviewTab
              server={server}
              settings={settings}
              onToggleSetting={(key) => toggleServerSetting(activeServerId, key)}
              onRemoveTag={(t) => removeServerTag(activeServerId, t)}
              onAddTag={(t) => addServerTag(activeServerId, t)}
              showTagInput={showTagInput}
              setShowTagInput={setShowTagInput}
              newTag={newTag}
              setNewTag={setNewTag}
              handleAddTag={handleAddTag}
            />
          )}

          {tab === "channels" && <PlaceholderTab title="Channels" description="Manage text and voice channels in this server" />}
          {tab === "roles" && <PlaceholderTab title="Roles" description="Configure permissions and role hierarchy" />}
          {tab === "members" && <PlaceholderTab title="Members" description="View and manage server members" />}
          {tab === "invites" && <PlaceholderTab title="Invites" description="Create and manage invite links" />}
          {tab === "moderation" && <PlaceholderTab title="Moderation" description="Audit log, automod rules, and reports" />}
          {tab === "bans" && <PlaceholderTab title="Bans" description="View and manage banned users" />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({
  server,
  settings,
  onToggleSetting,
  onRemoveTag,
  onAddTag,
  showTagInput,
  setShowTagInput,
  newTag,
  setNewTag,
  handleAddTag,
}: {
  server: any;
  settings: { listedOnDiscover: boolean; allowInvites: boolean; requireApproval: boolean; tags: string[] };
  onToggleSetting: (key: "listedOnDiscover" | "allowInvites" | "requireApproval") => void;
  onRemoveTag: (t: string) => void;
  onAddTag: (t: string) => void;
  showTagInput: boolean;
  setShowTagInput: (v: boolean) => void;
  newTag: string;
  setNewTag: (v: string) => void;
  handleAddTag: () => void;
}) {
  return (
    <div>
      <div className="text-[20px] font-bold" style={{ letterSpacing: "-0.3px" }}>
        Overview
      </div>
      <div className="mt-1 text-[12px]" style={{ color: "var(--color-ribbon-text-faint)" }}>
        Manage your server identity and settings
      </div>

      {/* Server icon + name */}
      <div className="mt-6 flex items-start gap-4">
        <div
          className="relative cursor-pointer"
          title="Change icon"
        >
          <Avatar
            letter={server?.letter ?? "A"}
            accent={server?.accent ?? "terracotta"}
            size={80}
            radius={20}
          />
          <div
            className="absolute flex items-center justify-center"
            style={{
              bottom: -4,
              right: -4,
              width: 24,
              height: 24,
              borderRadius: 8,
              background: "#211D17",
              border: "2px solid var(--color-ribbon-bg)",
            }}
          >
            <Upload size={10} strokeWidth={2.5} style={{ color: "var(--color-ribbon-text-dim)" }} />
          </div>
        </div>
        <div className="flex-1">
          <Label>Server Name</Label>
          <div
            className="rounded-[12px] border px-3.5 py-2.5"
            style={{ background: "#1A1612", borderColor: "var(--color-ribbon-border)" }}
          >
            <span className="text-[14px] font-semibold">{server?.name ?? "Art Collective"}</span>
          </div>
          <div className="mt-3">
            <Label>Description</Label>
            <div
              className="min-h-[60px] rounded-[12px] border px-3.5 py-2.5"
              style={{ background: "#1A1612", borderColor: "var(--color-ribbon-border)" }}
            >
              <span
                className="text-[13px] leading-[1.5]"
                style={{ color: "var(--color-ribbon-text-dim)" }}
              >
                {server?.description ?? "the internet's coziest art community. share your work, get feedback, and meet other creators."}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Discovery */}
      <SectionTitle title="Discovery" subtitle="Control how people find your server" />
      <div className="flex flex-col gap-2">
        <ToggleRow
          label="Listed on Discover"
          description="Show in public server browser"
          value={settings.listedOnDiscover}
          onChange={() => onToggleSetting("listedOnDiscover")}
        />
        <ToggleRow
          label="Allow Invites"
          description="Members can create invite links"
          value={settings.allowInvites}
          onChange={() => onToggleSetting("allowInvites")}
        />
        <ToggleRow
          label="Require Approval"
          description="New members need admin approval"
          value={settings.requireApproval}
          onChange={() => onToggleSetting("requireApproval")}
        />
      </div>

      <Divider />

      {/* Tags */}
      <SectionTitle title="Tags" subtitle="Help people find you on Discover" />
      <div className="flex flex-wrap gap-1.5">
        {settings.tags.map((t) => {
          const accent = (["terracotta", "sage", "amber", "mauve"] as const)[
            (t.charCodeAt(0) + t.length) % 4
          ];
          const color = ACCENT_HEX[accent];
          return (
            <div
              key={t}
              className="flex items-center gap-1 rounded-lg border px-3 py-1 text-[12px] font-medium"
              style={{
                background: `${color}1A`,
                borderColor: `${color}26`,
                color,
              }}
            >
              {t}
              <button
                onClick={() => onRemoveTag(t)}
                className="cursor-pointer opacity-60 transition hover:opacity-100"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </div>
          );
        })}
        {showTagInput ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              autoFocus
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTag();
                if (e.key === "Escape") setShowTagInput(false);
              }}
              placeholder="tag name"
              className="rounded-lg border px-2 py-1 text-[12px] outline-none"
              style={{
                background: "#1A1612",
                borderColor: "var(--color-ribbon-terracotta)",
                color: "var(--color-ribbon-text)",
                width: 90,
              }}
            />
            <button
              onClick={handleAddTag}
              className="cursor-pointer text-[11px] font-semibold"
              style={{ color: "var(--color-ribbon-terracotta)" }}
            >
              add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowTagInput(true)}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-dashed px-3 py-1 text-[12px] transition"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "var(--color-ribbon-text-faint)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)")}
          >
            <Plus size={10} strokeWidth={2.5} />
            add tag
          </button>
        )}
      </div>

      {/* Suggested tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {TAG_SUGGESTIONS.filter((t) => !settings.tags.includes(t)).slice(0, 5).map((t) => (
          <button
            key={t}
            onClick={() => onAddTag(t)}
            className="cursor-pointer rounded-md px-2 py-0.5 text-[10px] transition"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              color: "var(--color-ribbon-text-muted)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")}
          >
            + {t}
          </button>
        ))}
      </div>

      <Divider />

      {/* Banner */}
      <SectionTitle title="Server Banner" subtitle="Shown on Discover and invite pages" />
      <div
        className="relative flex h-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-[16px] transition"
        style={{ background: server?.banner ?? "linear-gradient(135deg, #FF3B30 0%, #FFD60A 50%, #00D67D 100%)" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <div
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12px] font-semibold text-white"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Upload size={12} strokeWidth={2} />
          change banner
        </div>
      </div>

      {/* Save */}
      <div className="mt-6 flex justify-end">
        <button
          className="cursor-pointer rounded-[12px] px-7 py-2.5 text-[13px] font-bold text-white transition"
          style={{
            background: "#FF3B30",
            boxShadow: "0 4px 16px rgba(255, 59, 48, 0.25)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#FF3B30")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FF3B30")}
        >
          save changes
        </button>
      </div>
    </div>
  );
}

function PlaceholderTab({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <div className="text-[20px] font-bold" style={{ letterSpacing: "-0.3px" }}>
        {title}
      </div>
      <div className="mt-1 text-[12px]" style={{ color: "var(--color-ribbon-text-faint)" }}>
        {description}
      </div>
      <div
        className="mt-6 flex flex-col items-center justify-center rounded-[16px] border py-16"
        style={{
          background: "#1A1612",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        <SettingsIcon
          size={32}
          strokeWidth={1.5}
          style={{ color: "var(--color-ribbon-text-ghost)" }}
        />
        <div
          className="mt-3 text-[13px] font-semibold"
          style={{ color: "var(--color-ribbon-text-faint)" }}
        >
          coming soon
        </div>
        <div
          className="mt-1 text-[11px]"
          style={{ color: "var(--color-ribbon-text-ghost)" }}
        >
          this panel is part of the mockup — not yet wired up
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-1 text-[11px] font-semibold"
      style={{ color: "var(--color-ribbon-text-faint)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <div className="text-[15px] font-bold">{title}</div>
      <div className="text-[11px]" style={{ color: "var(--color-ribbon-text-faint)" }}>
        {subtitle}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="my-6 h-px w-full"
      style={{ background: "var(--color-ribbon-border)" }}
    />
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-[14px] border px-3.5 py-3"
      style={{
        background: "#1A1612",
        borderColor: "var(--color-ribbon-border)",
      }}
    >
      <div>
        <div className="text-[13px] font-semibold">{label}</div>
        <div
          className="mt-0.5 text-[11px]"
          style={{ color: "var(--color-ribbon-text-faint)" }}
        >
          {description}
        </div>
      </div>
      <button
        onClick={onChange}
        className="relative cursor-pointer rounded-full transition"
        style={{
          width: 40,
          height: 22,
          background: value ? "#00D67D" : "rgba(255, 255, 255, 0.1)",
          padding: 2,
        }}
      >
        <div
          className="absolute rounded-full bg-white transition-all"
          style={{
            width: 18,
            height: 18,
            top: 2,
            left: value ? 20 : 2,
          }}
        />
      </button>
    </div>
  );
}
