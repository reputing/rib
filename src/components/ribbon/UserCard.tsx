"use client";

import { Settings } from "lucide-react";
import { Avatar } from "./Avatar";
import { useRibbon } from "@/lib/ribbon/store";

export function UserCard({ onEditBio }: { onEditBio?: () => void }) {
  const me = useRibbon((s) => s.currentUser);
  const navigate = useRibbon((s) => s.navigate);
  const joinedVoice = useRibbon((s) => s.joinedVoice);

  return (
    <div className="px-3 pb-3 pt-2">
      <div
        className="rounded-[14px] border px-3 py-2.5"
        style={{
          background: "#211D17",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <Avatar
            letter={me.avatarLetter}
            accent={me.accent}
            size={30}
            radius={10}
            ring
            status="online"
          />
          <div className="min-w-0 flex-1">
            <div
              className="text-[12px] font-semibold"
              style={{ color: "var(--color-ribbon-text)" }}
            >
              you
            </div>
            <div
              className="text-[9px]"
              style={{ color: "var(--color-ribbon-text-faint)" }}
            >
              prey.lol/you
            </div>
          </div>
          <button
            onClick={() => navigate("settings")}
            className="flex-none cursor-pointer"
            style={{ color: "var(--color-ribbon-text-faint)" }}
            title="Settings"
          >
            <Settings size={13} strokeWidth={2} />
          </button>
        </div>
        {onEditBio && (
          <div className="mt-2 flex gap-1.5">
            <button
              onClick={onEditBio}
              className="cursor-pointer rounded-[7px] px-2 py-1 text-[10px] font-medium"
              style={{
                background: "rgba(255, 59, 48, 0.1)",
                color: "var(--color-ribbon-terracotta)",
              }}
            >
              edit bio
            </button>
          </div>
        )}
        {joinedVoice && <VoiceMiniBar />}
      </div>
    </div>
  );
}

function VoiceMiniBar() {
  const { muted, deafened, leaveVoice, toggleMute, toggleDeafen } = useRibbon();
  return (
    <div
      className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5"
      style={{ background: "rgba(0, 214, 125, 0.08)" }}
    >
      <span
        className="text-[9px] font-semibold uppercase"
        style={{ color: "var(--color-ribbon-sage)" }}
      >
        voice
      </span>
      <div className="flex-1" />
      <button
        onClick={toggleMute}
        className="cursor-pointer rounded px-1.5 py-1 text-[10px]"
        style={{
          background: muted ? "rgba(184, 85, 68, 0.15)" : "transparent",
          color: muted ? "#E5484D" : "var(--color-ribbon-text-faint)",
        }}
      >
        {muted ? "unmute" : "mute"}
      </button>
      <button
        onClick={toggleDeafen}
        className="cursor-pointer rounded px-1.5 py-1 text-[10px]"
        style={{
          background: deafened ? "rgba(184, 85, 68, 0.15)" : "transparent",
          color: deafened ? "#E5484D" : "var(--color-ribbon-text-faint)",
        }}
      >
        {deafened ? "undeafen" : "deafen"}
      </button>
      <button
        onClick={leaveVoice}
        className="cursor-pointer rounded px-1.5 py-1 text-[10px]"
        style={{ color: "#E5484D" }}
      >
        leave
      </button>
    </div>
  );
}
