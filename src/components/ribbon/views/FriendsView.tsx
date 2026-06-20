"use client";

import { useState } from "react";
import { ArrowLeft, UserPlus, Check, X, Mail, Clock } from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { getUser } from "@/lib/ribbon/mock-data";
import { Avatar } from "../Avatar";
import { SectionLabel } from "../Shared";

export function FriendsView() {
  const {
    navigate,
    friendIds,
    friendRequests,
    acceptFriend,
    declineFriend,
    removeFriend,
    setActiveProfile,
  } = useRibbon();
  const [tab, setTab] = useState<"all" | "online" | "pending" | "add">("all");

  const friends = friendIds.map(getUser);
  const onlineFriends = friends.filter((f) => f.status === "online");
  const offlineFriends = friends.filter((f) => f.status !== "online");

  const incomingReqs = friendRequests.filter((r) => r.direction === "incoming");
  const outgoingReqs = friendRequests.filter((r) => r.direction === "outgoing");

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
        <div className="text-[15px] font-bold">Friends</div>
        <div
          className="ml-auto flex items-center gap-1 rounded-[10px] p-1"
          style={{ background: "rgba(255, 255, 255, 0.04)" }}
        >
          {(["all", "online", "pending", "add"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative cursor-pointer rounded-[8px] px-3 py-1 text-[11px] font-semibold transition"
              style={{
                background: tab === t ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: tab === t
                  ? "var(--color-ribbon-terracotta)"
                  : "var(--color-ribbon-text-muted)",
              }}
            >
              {t === "all" && `all — ${friends.length}`}
              {t === "online" && `online — ${onlineFriends.length}`}
              {t === "pending" && `pending — ${incomingReqs.length}`}
              {t === "add" && "add friend"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* ADD FRIEND TAB */}
        {tab === "add" && (
          <div>
            <SectionLabel>Add Friend</SectionLabel>
            <div
              className="mb-4 rounded-[12px] p-4"
              style={{
                background: "var(--ribbon-card)",
                borderColor: "var(--color-ribbon-border)",
              }}
            >
              <div className="text-[13px] font-semibold">Send a friend request</div>
              <div
                className="mt-1 text-[11px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                Enter a prey.lol username or paste an invite link.
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="prey.lol/username"
                  className="flex-1 rounded-[10px] px-3 py-2 text-[12px] outline-none"
                  style={{
                    background: "var(--ribbon-elevated)",
                    borderColor: "var(--color-ribbon-border)",
                    color: "var(--color-ribbon-text)",
                  }}
                />
                <button
                  className="cursor-pointer rounded-[10px] px-4 py-2 text-[12px] font-semibold"
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    color: "var(--color-ribbon-terracotta)",
                  }}
                >
                  send request
                </button>
              </div>
            </div>

            {outgoingReqs.length > 0 && (
              <>
                <SectionLabel>Pending — Outgoing — {outgoingReqs.length}</SectionLabel>
                <div className="space-y-1">
                  {outgoingReqs.map((r) => {
                    const u = getUser(r.userId);
                    return (
                      <div
                        key={r.id}
                        className="flex items-center gap-3 rounded-[10px] px-3 py-2.5"
                        style={{ background: "var(--ribbon-card)" }}
                      >
                        <Avatar
                          letter={u.avatarLetter}
                          accent={u.accent}
                          size={32}
                          radius={10}
                          status={u.status}
                        />
                        <div className="flex-1">
                          <div className="text-[13px] font-semibold">{u.username}</div>
                          <div
                            className="text-[10px]"
                            style={{ color: "var(--color-ribbon-text-faint)" }}
                          >
                            sent {r.sentAt}
                          </div>
                        </div>
                        <Clock size={12} style={{ color: "var(--color-ribbon-text-faint)" }} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* PENDING TAB */}
        {tab === "pending" && (
          <div>
            <SectionLabel>Incoming — {incomingReqs.length}</SectionLabel>
            {incomingReqs.length === 0 ? (
              <div
                className="py-8 text-center text-[12px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                no pending incoming requests
              </div>
            ) : (
              <div className="space-y-1">
                {incomingReqs.map((r) => {
                  const u = getUser(r.userId);
                  return (
                    <div
                      key={r.id}
                      className="flex items-center gap-3 rounded-[10px] px-3 py-2.5"
                      style={{ background: "var(--ribbon-card)" }}
                    >
                      <Avatar
                        letter={u.avatarLetter}
                        accent={u.accent}
                        size={32}
                        radius={10}
                        status={u.status}
                      />
                      <button
                        onClick={() => openProfilePopup(u.id)}
                        className="flex-1 cursor-pointer text-left"
                      >
                        <div className="text-[13px] font-semibold">{u.username}</div>
                        <div
                          className="text-[10px]"
                          style={{ color: "var(--color-ribbon-text-faint)" }}
                        >
                          {u.customTag} · sent {r.sentAt}
                        </div>
                      </button>
                      <button
                        onClick={() => acceptFriend(r.id)}
                        className="flex cursor-pointer items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-[11px] font-semibold transition"
                        style={{
                          background: "rgba(128, 132, 142, 0.18)",
                          color: "var(--color-ribbon-sage)",
                        }}
                      >
                        <Check size={11} strokeWidth={2.5} />
                        accept
                      </button>
                      <button
                        onClick={() => declineFriend(r.id)}
                        className="cursor-pointer rounded-[8px] px-2.5 py-1.5 text-[11px] font-semibold"
                        style={{
                          background: "rgba(184, 85, 68, 0.15)",
                          color: "#ff7fae",
                        }}
                      >
                        <X size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ALL / ONLINE TAB */}
        {(tab === "all" || tab === "online") && (
          <div>
            {tab === "all" && (
              <>
                <SectionLabel>Online — {onlineFriends.length}</SectionLabel>
                <div className="mb-4 space-y-1">
                  {onlineFriends.map((u) => (
                    <FriendRow
                      key={u.id}
                      userId={u.id}
                      onOpenProfile={() => openProfilePopup(u.id)}
                      onRemove={() => removeFriend(u.id)}
                    />
                  ))}
                </div>
                <SectionLabel>Offline — {offlineFriends.length}</SectionLabel>
                <div className="space-y-1">
                  {offlineFriends.map((u) => (
                    <FriendRow
                      key={u.id}
                      userId={u.id}
                      onOpenProfile={() => openProfilePopup(u.id)}
                      onRemove={() => removeFriend(u.id)}
                      dim
                    />
                  ))}
                </div>
              </>
            )}
            {tab === "online" && (
              <div className="space-y-1">
                <SectionLabel>Online — {onlineFriends.length}</SectionLabel>
                {onlineFriends.map((u) => (
                  <FriendRow
                    key={u.id}
                    userId={u.id}
                    onOpenProfile={() => openProfilePopup(u.id)}
                    onRemove={() => removeFriend(u.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FriendRow({
  userId,
  onOpenProfile,
  onRemove,
  dim,
}: {
  userId: string;
  onOpenProfile: () => void;
  onRemove: () => void;
  dim?: boolean;
}) {
  const u = getUser(userId);
  const { navigate, dms, setActiveDM } = useRibbon();
  return (
    <div
      className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition"
      style={{
        background: "var(--ribbon-card)",
        opacity: dim ? 0.55 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1F1A14";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--ribbon-card)";
      }}
    >
      <Avatar
        letter={u.avatarLetter}
        accent={u.accent}
        size={32}
        radius={10}
        status={u.status}
      />
      <button onClick={onOpenProfile} className="flex-1 cursor-pointer text-left">
        <div className="text-[13px] font-semibold">{u.username}</div>
        <div
          className="text-[10px]"
          style={{ color: "var(--color-ribbon-text-faint)" }}
        >
          {u.customTag} · {u.status}
        </div>
      </button>
      <button
        onClick={() => {
          const dm = dms.find((d) => d.otherUserId === userId);
          if (dm) {
            setActiveDM(dm.id);
            navigate("dms");
          }
        }}
        className="flex cursor-pointer items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-[11px] font-semibold transition"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          color: "var(--color-ribbon-text-dim)",
        }}
      >
        <Mail size={11} strokeWidth={2.5} />
        message
      </button>
      <button
        onClick={onRemove}
        className="cursor-pointer rounded-[8px] px-2 py-1.5 text-[11px] font-semibold"
        style={{
          background: "rgba(184, 85, 68, 0.1)",
          color: "#ff7fae",
        }}
        title="Remove friend"
      >
        <UserPlus size={11} strokeWidth={2.5} style={{ transform: "rotate(45deg)" }} />
      </button>
    </div>
  );
}
