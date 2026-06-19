"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen, Send } from "lucide-react";
import { useRibbon, ACCENT_HEX } from "@/lib/ribbon/store";
import { guestbookEntries, getUser } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import { SectionLabel } from "../Shared";
import type { AccentColor, GuestbookEntry } from "@/lib/ribbon/types";

export function GuestbookView() {
  const { navigate, params, activeProfileUserId, setActiveProfile, dms, setActiveDM } = useRibbon();
  const userId = params.userId ?? activeProfileUserId;
  const user = getUser(userId);
  const [entries, setEntries] = useState<GuestbookEntry[]>(
    guestbookEntries.filter((e) => e.ownerId === userId)
  );
  const [draft, setDraft] = useState("");

  const sign = () => {
    if (!draft.trim()) return;
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      authorId: "you",
      ownerId: userId,
      text: draft.trim(),
      signedAt: "just now",
      color: "terracotta" as AccentColor,
    };
    setEntries((e) => [newEntry, ...e]);
    setDraft("");
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
          <BookOpen size={16} style={{ color: "var(--color-ribbon-mauve)" }} />
          <div className="text-[15px] font-bold">{user.username}'s guestbook</div>
          <span
            className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              background: "rgba(139, 127, 160, 0.1)",
              color: "var(--color-ribbon-mauve)",
            }}
          >
            {entries.length} entries
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mx-auto max-w-2xl">
          {/* Sign form */}
          <div
            className="mb-5 rounded-[14px] border p-4"
            style={{
              background: "#1A1612",
              borderColor: "var(--color-ribbon-border)",
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Avatar
                letter="y"
                accent="terracotta"
                size={28}
                radius={9}
                ring
              />
              <div>
                <div className="text-[12px] font-semibold">Sign the guestbook</div>
                <div
                  className="text-[10px]"
                  style={{ color: "var(--color-ribbon-text-faint)" }}
                >
                  leave a note for {user.username}
                </div>
              </div>
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder={`say something nice to ${user.username}...`}
              className="mb-2 w-full resize-none rounded-[10px] border px-3 py-2 text-[12px] outline-none"
              style={{
                background: "#211D17",
                borderColor: "var(--color-ribbon-border)",
                color: "var(--color-ribbon-text)",
              }}
            />
            <div className="flex justify-end">
              <button
                onClick={sign}
                disabled={!draft.trim()}
                className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[11px] font-semibold transition disabled:opacity-50"
                style={{
                  background: "rgba(139, 127, 160, 0.15)",
                  color: "var(--color-ribbon-mauve)",
                }}
              >
                <Send size={11} strokeWidth={2.5} />
                sign
              </button>
            </div>
          </div>

          <SectionLabel>{entries.length} entries</SectionLabel>

          {/* Entries */}
          <div className="space-y-2">
            {entries.map((e) => {
              const author = getUser(e.authorId);
              const accentColor = ACCENT_HEX[e.color];
              return (
                <div
                  key={e.id}
                  className="rounded-[14px] border p-4"
                  style={{
                    background: "#1A1612",
                    borderColor: `${accentColor}1A`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                        setActiveProfile(e.authorId);
                        navigate("profile", { userId: e.authorId });
                      }}
                      className="cursor-pointer"
                    >
                      <Avatar
                        letter={author.avatarLetter}
                        accent={author.accent}
                        size={32}
                        radius={10}
                        status={author.status}
                      />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveProfile(e.authorId);
                            navigate("profile", { userId: e.authorId });
                          }}
                          className="cursor-pointer text-[12px] font-semibold"
                          style={{ color: accentColor }}
                        >
                          {author.username}
                        </button>
                        <span
                          className="text-[10px]"
                          style={{ color: "var(--color-ribbon-text-faint)" }}
                        >
                          {e.signedAt}
                        </span>
                      </div>
                      {author.customTag && (
                        <div
                          className="mb-1.5 text-[10px]"
                          style={{ color: "var(--color-ribbon-text-faint)" }}
                        >
                          {author.customTag}
                        </div>
                      )}
                      <div
                        className="text-[13px] leading-[1.55]"
                        style={{ color: "var(--color-ribbon-text)" }}
                      >
                        {e.text}
                      </div>
                      {e.authorId !== "you" && (
                        <button
                          onClick={() => {
                            const dm = dms.find((d) => d.otherUserId === e.authorId);
                            if (dm) {
                              setActiveDM(dm.id);
                              navigate("dms");
                            }
                          }}
                          className="mt-2 cursor-pointer text-[10px] font-medium"
                          style={{ color: "var(--color-ribbon-text-muted)" }}
                        >
                          → message {author.username}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
