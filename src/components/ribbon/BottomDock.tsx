"use client";

import {
  MessageCircle,
  Compass,
  Plus,
  Grid2x2,
  Pencil,
  FileText,
  Users,
  Volume2,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { servers, dockServerIds, getUser, CURRENT_USER_ID } from "@/lib/ribbon/mock-data";
import { Avatar } from "./Avatar";
import { useState } from "react";

export function BottomDock() {
  const {
    view,
    navigate,
    activeServerId,
    setActiveServer,
  } = useRibbon();

  const [showAddMenu, setShowAddMenu] = useState(false);

  const dockServers = dockServerIds.map((id) => servers[id]).filter(Boolean);
  const me = getUser(CURRENT_USER_ID);
  const activeServerLetter = servers[activeServerId]?.letter ?? "A";

  return (
    <div
      className="flex h-[54px] flex-none items-center justify-center border-t px-4"
      style={{
        background: "#151210",
        borderColor: "var(--color-ribbon-border)",
      }}
    >
      <div
        className="flex items-center gap-1.5 rounded-[14px] px-2 py-1.5"
        style={{ background: "rgba(255, 255, 255, 0.02)" }}
      >
        {/* Home */}
        <DockButton
          active={view === "dms" || view === "splash"}
          onClick={() => navigate("dms")}
          title="Home"
          accent
        >
          <div
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-[15px] font-extrabold text-white"
            style={{ background: "#C4654A" }}
          >
            r
          </div>
        </DockButton>

        <Divider />

        {/* DMs */}
        <DockButton
          active={view === "dms"}
          onClick={() => navigate("dms")}
          title="Direct Messages"
          hasNotification
        >
          <MessageCircle size={15} strokeWidth={2} />
        </DockButton>

        <Divider />

        {/* Servers — A is active in chat view */}
        {dockServers.map((s) => {
          const isActive = view === "chat" && activeServerId === s.id;
          return (
            <DockButton
              key={s.id}
              active={isActive}
              onClick={() => setActiveServer(s.id)}
              title={s.name}
              isLetter
            >
              <span className="text-[12px] font-bold">{s.letter}</span>
            </DockButton>
          );
        })}

        <Divider />

        {/* Discover */}
        <DockButton
          active={view === "discover"}
          onClick={() => navigate("discover")}
          title="Discover"
        >
          <Compass size={15} strokeWidth={2} />
        </DockButton>

        {/* Add */}
        <div className="relative">
          <DockButton
            onClick={() => setShowAddMenu((v) => !v)}
            title="Add"
            dashed
          >
            <Plus size={16} />
          </DockButton>
          {showAddMenu && (
            <div
              className="absolute bottom-[44px] left-1/2 z-50 w-40 -translate-x-1/2 rounded-xl border p-1"
              style={{
                background: "#211D17",
                borderColor: "var(--color-ribbon-border)",
              }}
            >
              {[
                { label: "Create server", view: "settings" as const },
                { label: "Join server", view: "discover" as const },
                { label: "Add friend", view: "friends" as const },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.view);
                    setShowAddMenu(false);
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-[11px] font-medium transition hover:bg-white/5"
                  style={{ color: "var(--color-ribbon-text-dim)" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* Ribbon features — Pinboard, Guestbook, Files */}
        <DockButton
          active={view === "pinboard"}
          onClick={() => navigate("pinboard", { userId: "sol" })}
          title="Pinboard"
        >
          <Grid2x2 size={14} strokeWidth={2} />
        </DockButton>
        <DockButton
          active={view === "guestbook"}
          onClick={() => navigate("guestbook", { userId: "sol" })}
          title="Guestbook"
        >
          <Pencil size={14} strokeWidth={2} />
        </DockButton>
        <DockButton
          active={view === "files"}
          onClick={() => navigate("files")}
          title="Files"
        >
          <FileText size={14} strokeWidth={2} />
        </DockButton>

        {/* Hidden until wider screens — Friends + Voice on the right */}
        <Divider />
        <DockButton
          active={view === "friends"}
          onClick={() => navigate("friends")}
          title="Friends"
        >
          <Users size={14} strokeWidth={2} />
        </DockButton>
        <DockButton
          active={view === "voice"}
          onClick={() => navigate("voice")}
          title="Voice"
        >
          <Volume2 size={14} strokeWidth={2} />
        </DockButton>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="mx-1 h-5 w-px"
      style={{ background: "rgba(255, 255, 255, 0.06)" }}
    />
  );
}

interface DockButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
  accent?: boolean;       // home button (filled)
  isLetter?: boolean;     // server letter
  dashed?: boolean;       // add button
  hasNotification?: boolean;
}

function DockButton({
  children,
  active,
  onClick,
  title,
  accent,
  isLetter,
  dashed,
  hasNotification,
}: DockButtonProps) {
  if (accent) {
    return (
      <button onClick={onClick} title={title} className="cursor-pointer">
        {children}
      </button>
    );
  }

  const baseStyle: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s ease",
    position: "relative",
    color: active ? "#C4654A" : "var(--color-ribbon-text-dim)",
    background: active
      ? "rgba(196, 101, 74, 0.12)"
      : "rgba(255, 255, 255, 0.05)",
    outline: active ? "2px solid rgba(196, 101, 74, 0.3)" : undefined,
    outlineOffset: active ? 1 : undefined,
    border: dashed ? "1.5px dashed rgba(255, 255, 255, 0.1)" : undefined,
  };

  return (
    <button
      onClick={onClick}
      title={title}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = dashed
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(255, 255, 255, 0.08)";
          if (dashed) e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = dashed
            ? "transparent"
            : "rgba(255, 255, 255, 0.05)";
          if (dashed) e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }
      }}
    >
      {children}
      {hasNotification && (
        <span
          className="absolute"
          style={{
            top: 2,
            right: 2,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#C4654A",
            border: "2px solid #151210",
          }}
        />
      )}
    </button>
  );
}
