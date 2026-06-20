"use client";

import { useState } from "react";
import {
  X, MessageCircle, UserPlus, Globe, ExternalLink, Check, Eye,
  Instagram, Twitter, Github, Home, Twitch, Youtube, Music2,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { getUser } from "@/lib/ribbon/mock-data";
import { Avatar, ACCENT_HEX } from "./Avatar";
import { motion, AnimatePresence } from "framer-motion";

const SOCIAL_ICONS: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  spotify: Music2,
  github: Github,
  website: Home,
  twitch: Twitch,
  youtube: Youtube,
};

export function ProfilePopup() {
  const {
    profilePopupUserId,
    closeProfilePopup,
    openBiolink,
    dms,
    setActiveDM,
    navigate,
    friendIds,
    currentUser,
  } = useRibbon();

  const [isFriend, setIsFriend] = useState(false);
  const [friendRequested, setFriendRequested] = useState(false);

  // Check if this user is already a friend on mount
  useState(() => {
    if (profilePopupUserId) {
      setIsFriend(friendIds.includes(profilePopupUserId));
    }
  });

  if (!profilePopupUserId) return null;

  const isOwnProfile = profilePopupUserId === "you";
  const user = isOwnProfile ? currentUser : getUser(profilePopupUserId);
  if (!user) return null;

  const accentColor = ACCENT_HEX[user.accent];

  const handleMessage = () => {
    const existing = dms.find((d) => d.otherUserId === user.id);
    if (existing) {
      setActiveDM(existing.id);
      navigate("dms");
      closeProfilePopup();
    }
  };

  const handleAddFriend = () => {
    if (isFriend || friendRequested) return;
    setFriendRequested(true);
  };

  const handleOpenBiolink = () => {
    openBiolink(user.id);
    closeProfilePopup();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)" }}
        onClick={closeProfilePopup}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-[340px] overflow-hidden rounded-[12px]"
          style={{ background: "var(--ribbon-card)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Banner */}
          <div
            className="h-[68px] w-full"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}88 50%, var(--ribbon-hover) 100%)`,
            }}
          />

          {/* Close button */}
          <button
            onClick={closeProfilePopup}
            className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition"
            style={{ background: "rgba(0, 0, 0, 0.4)" }}
          >
            <X size={14} strokeWidth={2.5} style={{ color: "#FFFFFF" }} />
          </button>

          {/* Avatar + name section */}
          <div className="px-4 pb-4">
            <div className="-mt-10 mb-3 flex items-end justify-between">
              <div className="relative">
                <Avatar
                  letter={user.avatarLetter}
                  accent={user.accent}
                  size={80}
                  radius={16}
                  ring
                  status={user.status}
                />
              </div>
              {/* Action buttons */}
              <div className="mb-1 flex gap-1.5">
                {isOwnProfile ? (
                  <button
                    onClick={() => {
                      navigate("settings");
                      closeProfilePopup();
                    }}
                    className="flex h-8 cursor-pointer items-center gap-1.5 rounded-[6px] px-3 text-[11px] font-semibold transition"
                    style={{ background: "var(--ribbon-hover)", color: "var(--ribbon-text)" }}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleMessage}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[6px] transition"
                      style={{ background: "var(--ribbon-hover)", color: "var(--ribbon-text-dim)" }}
                      title="Message"
                    >
                      <MessageCircle size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={handleAddFriend}
                      disabled={isFriend || friendRequested}
                      className="flex h-8 cursor-pointer items-center gap-1.5 rounded-[6px] px-3 text-[11px] font-semibold transition disabled:opacity-60"
                      style={{
                        background: isFriend
                          ? "rgba(0, 255, 136, 0.12)"
                          : friendRequested
                            ? "rgba(255, 255, 255, 0.08)"
                            : `${accentColor}20`,
                        color: isFriend
                          ? "#00FF88"
                          : friendRequested
                            ? "var(--ribbon-text-dim)"
                            : accentColor,
                      }}
                    >
                      {isFriend ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        <UserPlus size={12} strokeWidth={2.5} />
                      )}
                      {isFriend ? "Friends" : friendRequested ? "Sent" : "Add"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name + tag */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[18px] font-bold" style={{ color: "var(--ribbon-text)" }}>
                  {user.username}
                </span>
                {user.verified && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={accentColor}>
                    <path d="M12 2L14.5 5L18 4L17 7.5L20 10L16.5 11.5L17 15L13.5 14L12 17L10.5 14L7 15L7.5 11.5L4 10L7 7.5L6 4L9.5 5L12 2Z" />
                  </svg>
                )}
              </div>
              <div className="text-[12px]" style={{ color: "var(--ribbon-text-dim)" }}>
                {user.customTag || "prey user"}
              </div>
            </div>

            {/* Biolink URL — clickable */}
            <button
              onClick={handleOpenBiolink}
              className="mb-3 flex w-full cursor-pointer items-center gap-2 rounded-[6px] px-3 py-2 text-left transition"
              style={{ background: "var(--ribbon-elevated)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ribbon-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ribbon-elevated)")}
            >
              <Globe size={13} strokeWidth={2} style={{ color: accentColor }} />
              <span className="flex-1 text-[12px] font-medium" style={{ color: "var(--ribbon-text)" }}>
                prey.lol/{user.handle}
              </span>
              <ExternalLink size={12} strokeWidth={2} style={{ color: "var(--ribbon-text-faint)" }} />
            </button>

            {/* Bio */}
            {user.bio && (
              <div className="mb-3">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ribbon-text-faint)" }}>
                  About Me
                </div>
                <div className="text-[12px] leading-[1.5]" style={{ color: "var(--ribbon-text-dim)" }}>
                  {user.bio}
                </div>
              </div>
            )}

            {/* Social links */}
            {user.socialLinks && user.socialLinks.length > 0 && (
              <div className="mb-3">
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ribbon-text-faint)" }}>
                  Links
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {user.socialLinks.map((link, i) => {
                    const Icon = SOCIAL_ICONS[link.type] || Globe;
                    return (
                      <a
                        key={i}
                        href={link.url}
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition"
                        style={{ background: "var(--ribbon-elevated)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ribbon-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ribbon-elevated)")}
                        title={link.label}
                      >
                        <Icon size={14} strokeWidth={2} style={{ color: "var(--ribbon-text-dim)" }} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer: views + member since */}
            <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--ribbon-hover)" }}>
              <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--ribbon-text-faint)" }}>
                <Eye size={11} strokeWidth={2} />
                {user.viewCount || 0} views
              </div>
              {user.joinedAt && (
                <div className="text-[11px]" style={{ color: "var(--ribbon-text-faint)" }}>
                  Joined {new Date(user.joinedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
