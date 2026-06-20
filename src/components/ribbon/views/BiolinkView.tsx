"use client";

import { useEffect } from "react";
import {
  X, Globe, Eye, Instagram, Twitter, Github, Home, Twitch, Youtube, Music2,
  MessageCircle, UserPlus, Check, ExternalLink,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { getUser } from "@/lib/ribbon/mock-data";
import { Avatar, ACCENT_HEX } from "../Avatar";
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

export function BiolinkView() {
  const {
    biolinkUserId,
    closeBiolink,
    dms,
    setActiveDM,
    navigate,
    friendIds,
    currentUser,
  } = useRibbon();

  const isOwnProfile = biolinkUserId === "you";
  const user = biolinkUserId ? (isOwnProfile ? currentUser : getUser(biolinkUserId)) : null;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBiolink();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeBiolink]);

  if (!biolinkUserId || !user) return null;

  const accentColor = ACCENT_HEX[user.accent];

  const handleMessage = () => {
    const existing = dms.find((d) => d.otherUserId === user.id);
    if (existing) {
      setActiveDM(existing.id);
      navigate("dms");
      closeBiolink();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${accentColor}18 0%, var(--ribbon-bg) 60%)`,
        }}
      >
        {/* Close button */}
        <button
          onClick={closeBiolink}
          className="fixed right-5 top-5 z-[120] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition"
          style={{ background: "var(--ribbon-elevated)" }}
        >
          <X size={16} strokeWidth={2.5} style={{ color: "var(--ribbon-text-dim)" }} />
        </button>

        {/* Card */}
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative my-10 w-[380px] max-w-[90vw] overflow-hidden rounded-[16px]"
          style={{ background: "var(--ribbon-card)" }}
        >
          {/* Banner strip */}
          <div
            className="h-[80px] w-full"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}66 50%, var(--ribbon-hover) 100%)`,
            }}
          />

          {/* Top section: name + avatar */}
          <div className="px-6 pb-5">
            <div className="-mt-12 mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[22px] font-bold" style={{ color: "var(--ribbon-text)" }}>
                    {user.username}
                  </span>
                  {user.verified && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={accentColor}>
                      <path d="M12 2L14.5 5L18 4L17 7.5L20 10L16.5 11.5L17 15L13.5 14L12 17L10.5 14L7 15L7.5 11.5L4 10L7 7.5L6 4L9.5 5L12 2Z" />
                    </svg>
                  )}
                </div>
                {/* Handle with globe icon */}
                <div className="flex items-center gap-1.5">
                  <Globe size={12} strokeWidth={2} style={{ color: "var(--ribbon-text-faint)" }} />
                  <span className="text-[13px]" style={{ color: "var(--ribbon-text-dim)" }}>
                    prey.lol/{user.handle}
                  </span>
                </div>
                {/* Status */}
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    className="rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      background: user.status === "online" ? "#00FF88" : "var(--ribbon-text-faint)",
                    }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: user.status === "online" ? "#00FF88" : "var(--ribbon-text-faint)" }}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
              {/* Avatar */}
              <div className="flex-none">
                <Avatar
                  letter={user.avatarLetter}
                  accent={user.accent}
                  size={64}
                  radius={14}
                  ring
                />
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-4 text-[13px] leading-[1.6]" style={{ color: "var(--ribbon-text-dim)" }}>
                {user.bio}
              </div>
            )}

            {/* Social links — circular icons */}
            {user.socialLinks && user.socialLinks.length > 0 && (
              <div className="mb-4 flex justify-center gap-2">
                {user.socialLinks.map((link, i) => {
                  const Icon = SOCIAL_ICONS[link.type] || Globe;
                  return (
                    <a
                      key={i}
                      href={link.url}
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition"
                      style={{ background: "var(--ribbon-elevated)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${accentColor}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--ribbon-elevated)";
                      }}
                      title={link.label}
                    >
                      <Icon size={16} strokeWidth={2} style={{ color: "var(--ribbon-text)" }} />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Now playing */}
            {user.nowPlaying && (
              <div
                className="mb-4 flex items-center gap-2.5 rounded-[8px] px-3 py-2"
                style={{ background: "var(--ribbon-elevated)" }}
              >
                <div className="flex items-end gap-0.5" style={{ height: 16 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 2,
                        borderRadius: 1,
                        background: accentColor,
                        animation: `ribbon-eq-bar ${[1.1, 0.9, 1.3, 1][i]}s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold" style={{ color: "var(--ribbon-text)" }}>
                    {user.nowPlaying.track}
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--ribbon-text-faint)" }}>
                    {user.nowPlaying.artist}
                  </div>
                </div>
              </div>
            )}

            {/* Footer: views + actions */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--ribbon-hover)" }}>
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ribbon-text-faint)" }}>
                <Eye size={12} strokeWidth={2} />
                {user.viewCount || 0} views
              </div>
              {!isOwnProfile && (
                <div className="flex gap-1.5">
                  <button
                    onClick={handleMessage}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[6px] transition"
                    style={{ background: "var(--ribbon-elevated)" }}
                    title="Message"
                  >
                    <MessageCircle size={12} strokeWidth={2.5} style={{ color: "var(--ribbon-text-dim)" }} />
                  </button>
                  <button
                    className="flex cursor-pointer items-center gap-1 rounded-[6px] px-3 py-1 text-[11px] font-semibold transition"
                    style={{ background: `${accentColor}20`, color: accentColor }}
                  >
                    <UserPlus size={11} strokeWidth={2.5} />
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
