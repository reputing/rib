"use client";

import { useEffect } from "react";
import {
  X, Globe, Eye, Instagram, Twitter, Github, Home, Twitch, Youtube, Music2,
  MessageCircle, UserPlus, Heart, Calendar,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { motion, AnimatePresence } from "framer-motion";
import type { BiolinkConfig, FontFamily } from "@/lib/ribbon/types";

const SOCIAL_ICONS: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  spotify: Music2,
  github: Github,
  website: Home,
  twitch: Twitch,
  youtube: Youtube,
};

const FONT_CSS: Record<FontFamily, string> = {
  quicksand: "'Quicksand', sans-serif",
  inter: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
  serif: "Georgia, serif",
  rounded: "'Nunito', sans-serif",
};

const PARTICLES = [
  { top: "8%", left: "15%", size: 5, delay: 0, char: "✦" },
  { top: "20%", left: "80%", size: 2, delay: 0.6, dot: true },
  { top: "70%", left: "10%", size: 2, delay: 1.1, dot: true },
  { top: "85%", left: "75%", size: 4, delay: 1.6, char: "✦" },
  { top: "30%", left: "5%", size: 2, delay: 2.1, dot: true },
  { top: "50%", left: "90%", size: 4, delay: 0.4, char: "✦" },
  { top: "15%", left: "45%", size: 1, delay: 3.1, dot: true },
  { top: "90%", left: "35%", size: 2, delay: 2.6, dot: true },
];

export function BiolinkView() {
  const {
    biolinkUserId,
    closeBiolink,
    biolinkConfig,
    dms,
    setActiveDM,
    navigate,
    currentUser,
  } = useRibbon();

  const isOwnProfile = biolinkUserId === "you";
  const config = biolinkConfig;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBiolink();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeBiolink]);

  if (!biolinkUserId) return null;

  const fontCss = FONT_CSS[config.fontFamily] || FONT_CSS.quicksand;
  const accentColor = config.accentColor;

  const pageBg = config.bgType === "gradient"
    ? `linear-gradient(${config.bgGradientAngle}deg, ${config.bgGradientFrom}, ${config.bgGradientTo})`
    : config.bgType === "image" && config.bgImageUrl
      ? `url(${config.bgImageUrl}) center/cover`
      : config.pageBg;

  const glowStyle = config.glow
    ? { textShadow: `0 0 ${config.glowIntensity / 3}px ${accentColor}` }
    : {};

  const cardStyle: React.CSSProperties = {
    background: config.cardBg,
    borderRadius: config.borderRadius,
    backdropFilter: config.glassmorphism ? `blur(${config.blurAmount}px)` : "none",
    WebkitBackdropFilter: config.glassmorphism ? `blur(${config.blurAmount}px)` : "none",
    boxShadow: config.cardShadow ? "0 8px 40px rgba(0, 0, 0, 0.5)" : "none",
    width: "100%",
    maxWidth: config.cardWidth,
    fontFamily: fontCss,
    fontSize: config.fontSize,
    overflow: "hidden",
    position: "relative",
  };

  const handleMessage = () => {
    const existing = dms.find((d) => d.otherUserId === "you");
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
          background: config.bgType === "video" ? "#000000" : pageBg,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Video background */}
        {config.bgType === "video" && config.bgVideoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: config.bgOpacity / 100, zIndex: 0 }}
          >
            <source src={config.bgVideoUrl} type="video/mp4" />
          </video>
        )}

        {/* Image background with translucency */}
        {config.bgType === "image" && config.bgImageUrl && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${config.bgImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: config.bgOpacity / 100,
              zIndex: 0,
            }}
          />
        )}

        {/* Gradient/solid background with translucency */}
        {(config.bgType === "gradient" || config.bgType === "solid") && (
          <div
            className="absolute inset-0"
            style={{
              background: pageBg,
              opacity: config.bgOpacity / 100,
              zIndex: 0,
            }}
          />
        )}
        {/* Scanlines overlay */}
        {config.scanlines && (
          <div className="pointer-events-none absolute inset-0" style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
            zIndex: 1,
          }} />
        )}

        {/* Grain texture overlay */}
        {config.grainTexture && (
          <div className="pointer-events-none absolute inset-0" style={{
            opacity: 0.035,
            background: "repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%) 0 0 / 2px 2px",
            zIndex: 1,
          }} />
        )}

        {/* Particles */}
        {config.particles && PARTICLES.map((p, i) => (
          <div
            key={i}
            className="animate-twinkle pointer-events-none absolute"
            style={{
              top: p.top, left: p.left,
              width: p.size, height: p.size,
              fontSize: p.size,
              color: accentColor,
              borderRadius: p.dot ? "50%" : undefined,
              background: p.dot ? accentColor : undefined,
              animationDelay: `${p.delay}s`,
              zIndex: 1,
            }}
          >
            {p.char ?? ""}
          </div>
        ))}

        {/* Close button */}
        <button
          onClick={closeBiolink}
          className="fixed right-5 top-5 z-[120] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition"
          style={{ background: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(8px)" }}
        >
          <X size={16} strokeWidth={2.5} style={{ color: "#FFFFFF" }} />
        </button>

        {/* Custom CSS injection */}
        {config.customCss && (
          <style dangerouslySetInnerHTML={{ __html: config.customCss }} />
        )}

        {/* The biolink card — with cutscene opening animation */}
        <motion.div
          initial={
            config.cutsceneDirection === "vertical"
              ? { y: -200, opacity: 0 }
              : config.cutsceneDirection === "horizontal"
                ? { x: -200, opacity: 0 }
                : { opacity: 0 }
          }
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={
            config.cutsceneDirection === "vertical"
              ? { y: -200, opacity: 0 }
              : config.cutsceneDirection === "horizontal"
                ? { x: -200, opacity: 0 }
                : { opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.8 }}
          className="prey-biolink relative my-10 z-10 mx-4 sm:mx-auto"
          style={cardStyle}
        >
          {/* Top bar */}
          {config.showTopBar && (
            <div className="flex items-center justify-between px-4 py-2" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
              <div className="flex items-center gap-2">
                {config.showOnlineStatus && (
                  <span className="rounded-full" style={{ width: 8, height: 8, background: "#00FF88" }} />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.secondaryTextColor }}>
                  prey.lol/{config.displayName.toLowerCase().replace(/\s+/g, "")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {config.showLikes && (
                  <div className="flex items-center gap-1 text-[11px]" style={{ color: accentColor }}>
                    <Heart size={11} strokeWidth={2} /> 42
                  </div>
                )}
                {config.showViews && (
                  <div className="flex items-center gap-1 text-[11px]" style={{ color: accentColor }}>
                    <Eye size={11} strokeWidth={2} /> 192
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="px-5 py-5" style={{ textAlign: config.layoutStyle as any }}>
            {/* Avatar + name */}
            <div
              className="mb-4 flex items-center gap-3"
              style={{
                justifyContent: config.layoutStyle === "centered" ? "center" : config.layoutStyle === "right" ? "flex-end" : "flex-start",
              }}
            >
              <div
                className="flex items-center justify-center font-bold text-white"
                style={{
                  width: 64, height: 64,
                  borderRadius: config.borderRadius / 1.5,
                  background: config.avatarUrl ? `url(${config.avatarUrl}) center/cover` : accentColor,
                  fontSize: 28,
                  boxShadow: config.glow ? `0 0 ${config.glowIntensity / 2}px ${accentColor}66` : "none",
                }}
              >
                {!config.avatarUrl && (config.displayName || "y").charAt(0).toLowerCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="prey-name text-[20px] font-bold" style={{ color: config.textColor, ...glowStyle }}>
                    {config.displayName || "yourname"}
                  </span>
                  {config.verified && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={accentColor}>
                      <path d="M12 2L14.5 5L18 4L17 7.5L20 10L16.5 11.5L17 15L13.5 14L12 17L10.5 14L7 15L7.5 11.5L4 10L7 7.5L6 4L9.5 5L12 2Z" />
                    </svg>
                  )}
                </div>
                {config.showOnlineStatus && (
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#00FF88" }}>
                    ONLINE
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {config.bio && (
              <div className="prey-bio mb-3 text-[13px] leading-[1.6]" style={{ color: config.secondaryTextColor }}>
                {config.bio}
              </div>
            )}

            {/* Tagline pill */}
            {config.tagline && (
              <div className="mb-4">
                <span
                  className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{ background: "rgba(0, 0, 0, 0.3)", color: accentColor }}
                >
                  {config.tagline}
                </span>
              </div>
            )}

            {/* Now playing */}
            {config.showNowPlaying && config.trackName && (
              <div className="mb-4 flex items-center gap-2.5 rounded-[8px] px-3 py-2.5" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
                <div className="flex items-end gap-0.5" style={{ height: 16 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 2,
                        borderRadius: 1,
                        background: accentColor,
                        animation: `ribbon-eq-bar ${[1.1, 0.9, 1.3, 1, 1.2][i]}s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold" style={{ color: accentColor }}>
                    {config.trackName}
                  </div>
                  <div className="text-[10px]" style={{ color: config.secondaryTextColor }}>
                    {config.artistName}
                  </div>
                </div>
              </div>
            )}

            {/* Social links */}
            {config.socialLinks.length > 0 && (
              <div
                className="prey-links mb-4 flex flex-wrap gap-2"
                style={{
                  justifyContent: config.layoutStyle === "centered" ? "center" : config.layoutStyle === "right" ? "flex-end" : "flex-start",
                }}
              >
                {config.socialLinks.map((link, i) => {
                  const Icon = SOCIAL_ICONS[link.type] || Globe;
                  if (config.linkStyle === "cards") {
                    return (
                      <a
                        key={i}
                        href={link.url}
                        onClick={(e) => e.stopPropagation()}
                        className="flex cursor-pointer items-center gap-2 rounded-[6px] px-3 py-2 transition"
                        style={{ background: "rgba(0, 0, 0, 0.3)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = `${accentColor}20`)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)")}
                        title={link.label}
                      >
                        <Icon size={14} strokeWidth={2} style={{ color: config.textColor }} />
                        <span className="text-[10px] font-semibold" style={{ color: config.textColor }}>
                          {link.label}
                        </span>
                      </a>
                    );
                  }
                  return (
                    <a
                      key={i}
                      href={link.url}
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition"
                      style={{ background: "rgba(0, 0, 0, 0.3)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = `${accentColor}20`)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)")}
                      title={link.label}
                    >
                      <Icon size={15} strokeWidth={2} style={{ color: config.textColor }} />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
              {config.showJoinDate && (
                <div className="flex items-center gap-1 text-[10px]" style={{ color: config.secondaryTextColor }}>
                  <Calendar size={10} strokeWidth={2} />
                  Joined Sep 2025
                </div>
              )}
              {!isOwnProfile && (
                <div className="flex gap-1.5">
                  <button
                    onClick={handleMessage}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[6px] transition"
                    style={{ background: "rgba(0, 0, 0, 0.3)" }}
                    title="Message"
                  >
                    <MessageCircle size={12} strokeWidth={2.5} style={{ color: config.secondaryTextColor }} />
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
