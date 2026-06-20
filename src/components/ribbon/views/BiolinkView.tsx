"use client";

import { useEffect, useRef } from "react";
import {
  X, Globe, Eye, Instagram, Twitter, Github, Home, Twitch, Youtube, Music2,
  MessageCircle, UserPlus, Heart, Calendar, Pause, Play, SkipBack, SkipForward,
  BadgeCheck,
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
  quicksand: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
  inter: "'Inter', sans-serif",
  mono: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
  serif: "Georgia, serif",
  rounded: "'Nunito', sans-serif",
};

const MONO = "var(--font-jetbrains-mono), 'JetBrains Mono', monospace";

export function BiolinkView() {
  const {
    biolinkUserId,
    closeBiolink,
    biolinkConfig,
    dms,
    setActiveDM,
    navigate,
  } = useRibbon();

  const isOwnProfile = biolinkUserId === "you";
  const config = biolinkConfig;

  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

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
  // translucent accent glow derived from the accent color
  const accentGlow = `${accentColor}80`;

  const pageBg = config.bgType === "gradient"
    ? `linear-gradient(${config.bgGradientAngle}deg, ${config.bgGradientFrom}, ${config.bgGradientTo})`
    : config.bgType === "image" && config.bgImageUrl
      ? `url(${config.bgImageUrl}) center/cover`
      : config.pageBg;

  const glowStyle = config.glow
    ? { textShadow: `0 0 ${config.glowIntensity / 3}px ${accentColor}` }
    : {};

  // 3D tilt on pointer move (mirrors prey_dc card behaviour)
  const onMove = (e: React.PointerEvent) => {
    const c = cardRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    c.style.transform = `rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`;
    const g = glareRef.current;
    if (g) {
      g.style.opacity = "1";
      g.style.background = `radial-gradient(circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, rgba(255,255,255,.14), transparent 55%)`;
    }
  };
  const onLeave = () => {
    const c = cardRef.current;
    if (c) c.style.transform = "rotateX(0deg) rotateY(0deg)";
    const g = glareRef.current;
    if (g) g.style.opacity = "0";
  };

  const cardStyle: React.CSSProperties = {
    background: config.cardBg || "rgba(15,14,19,.55)",
    borderRadius: config.borderRadius,
    border: "1px solid rgba(255,255,255,.1)",
    backdropFilter: config.glassmorphism ? `blur(${config.blurAmount}px) saturate(1.2)` : "none",
    WebkitBackdropFilter: config.glassmorphism ? `blur(${config.blurAmount}px) saturate(1.2)` : "none",
    boxShadow: config.cardShadow
      ? "0 44px 96px -34px rgba(0,0,0,.88), inset 0 1px 0 rgba(255,255,255,.07)"
      : "none",
    width: "100%",
    maxWidth: config.cardWidth,
    fontFamily: fontCss,
    fontSize: config.fontSize,
    overflow: "hidden",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform .14s ease-out",
  };

  const handleMessage = () => {
    const existing = dms.find((d) => d.otherUserId === "you");
    if (existing) {
      setActiveDM(existing.id);
      navigate("dms");
      closeBiolink();
    }
  };

  const alignItems =
    config.layoutStyle === "centered" ? "center" :
    config.layoutStyle === "right" ? "flex-end" : "flex-start";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto"
        style={{
          background: config.bgType === "video" ? "#070709" : pageBg,
          backgroundSize: "cover",
          backgroundPosition: "center",
          perspective: "1100px",
        }}
      >
        {/* Video background */}
        {config.bgType === "video" && config.bgVideoUrl && (
          <video
            autoPlay loop muted playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: config.bgOpacity / 100, zIndex: 0 }}
          >
            <source src={config.bgVideoUrl} type="video/mp4" />
          </video>
        )}

        {/* Image background with translucency */}
        {config.bgType === "image" && config.bgImageUrl && (
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${config.bgImageUrl})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: config.bgOpacity / 100, zIndex: 0,
          }} />
        )}

        {/* Gradient/solid background with translucency */}
        {(config.bgType === "gradient" || config.bgType === "solid") && (
          <div className="absolute inset-0" style={{
            background: pageBg, opacity: config.bgOpacity / 100, zIndex: 0,
          }} />
        )}

        {/* Ambient accent drift + vignette */}
        <div className="animate-prey-drift pointer-events-none absolute" style={{
          inset: "-10%",
          background: `radial-gradient(42% 38% at 30% 34%, ${accentGlow}, transparent 62%)`,
          opacity: 0.5, zIndex: 0,
        }} />
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(125% 85% at 50% 50%, transparent 40%, rgba(3,3,5,.9) 100%)",
          zIndex: 0,
        }} />

        {/* Scanlines overlay */}
        {config.scanlines && (
          <div className="prey-scanlines pointer-events-none absolute inset-0" style={{ opacity: 0.4, zIndex: 1 }} />
        )}

        {/* Grain texture overlay */}
        {config.grainTexture && (
          <div className="prey-grain pointer-events-none absolute inset-0" style={{ opacity: 0.09, zIndex: 1 }} />
        )}

        {/* Close button */}
        <button
          onClick={closeBiolink}
          className="prey-glass-soft fixed right-5 top-5 z-[120] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition"
        >
          <X size={16} strokeWidth={2.5} style={{ color: "#FFFFFF" }} />
        </button>

        {/* Custom CSS injection */}
        {config.customCss && (
          <style dangerouslySetInnerHTML={{ __html: config.customCss }} />
        )}

        {/* Card wrapper with aura */}
        <motion.div
          initial={
            config.cutsceneDirection === "vertical" ? { y: -200, opacity: 0 }
            : config.cutsceneDirection === "horizontal" ? { x: -200, opacity: 0 }
            : { opacity: 0, y: 18 }
          }
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={
            config.cutsceneDirection === "vertical" ? { y: -200, opacity: 0 }
            : config.cutsceneDirection === "horizontal" ? { x: -200, opacity: 0 }
            : { opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.8 }}
          className="relative z-10 my-10 mx-4 sm:mx-auto"
          style={{ width: "100%", maxWidth: config.cardWidth }}
        >
          {/* aura behind card */}
          {config.glow && (
            <div className="pointer-events-none absolute" style={{
              inset: -26, borderRadius: config.borderRadius + 20,
              background: `radial-gradient(50% 50% at 50% 45%, ${accentGlow}, transparent 70%)`,
              filter: "blur(34px)", opacity: config.glowIntensity / 220, zIndex: 0,
            }} />
          )}

          {/* The biolink card */}
          <div ref={cardRef} className="prey-biolink relative z-[1]" style={cardStyle}>
            {/* glare layer for tilt */}
            <div ref={glareRef} className="pointer-events-none absolute inset-0" style={{
              opacity: 0, transition: "opacity .3s ease", mixBlendMode: "screen", zIndex: 5,
              borderRadius: config.borderRadius,
            }} />

            {/* Top bar */}
            {config.showTopBar && (
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "rgba(0,0,0,.25)" }}>
                <div className="flex items-center gap-2">
                  {config.showOnlineStatus && (
                    <span className="prey-pulse-dot rounded-full" style={{ width: 7, height: 7, background: accentColor }} />
                  )}
                  <span className="prey-label text-[10px] font-semibold" style={{ color: config.secondaryTextColor, fontFamily: MONO }}>
                    prey.lol/{config.displayName.toLowerCase().replace(/\s+/g, "")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {config.showLikes && (
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: accentColor, fontFamily: MONO }}>
                      <Heart size={11} strokeWidth={2} /> 42
                    </div>
                  )}
                  {config.showViews && (
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: accentColor, fontFamily: MONO }}>
                      <Eye size={11} strokeWidth={2} /> 192
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="px-7 py-6" style={{ transform: "translateZ(20px)" }}>
              {/* identity + avatar */}
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0 pt-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold leading-none" style={{ fontSize: 40, letterSpacing: "-.045em", color: config.textColor, ...glowStyle }}>
                      {config.displayName || "yourname"}
                    </span>
                    {config.verified && (
                      <BadgeCheck size={22} style={{ color: accentColor }} />
                    )}
                  </div>
                  {config.showOnlineStatus && (
                    <div className="prey-label mt-3 flex items-center gap-2 text-[11px] font-semibold" style={{ color: config.secondaryTextColor, fontFamily: MONO }}>
                      <span className="prey-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: accentColor }} />
                      online
                    </div>
                  )}
                </div>

                {/* gradient-ring avatar */}
                <div className="relative flex-none">
                  <div style={{
                    padding: 2.5, borderRadius: config.borderRadius / 1.2,
                    background: `linear-gradient(150deg, ${accentColor}, rgba(120,116,124,.5))`,
                    boxShadow: `0 0 0 1px rgba(0,0,0,.4), 0 18px 40px -16px ${accentGlow}`,
                  }}>
                    <div className="flex items-center justify-center font-bold text-white" style={{
                      width: 104, height: 104,
                      borderRadius: config.borderRadius / 1.5,
                      border: "3px solid #100f14",
                      background: config.avatarUrl ? `url(${config.avatarUrl}) center/cover` : accentColor,
                      fontSize: 40,
                    }}>
                      {!config.avatarUrl && (config.displayName || "y").charAt(0).toLowerCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {config.bio && (
                <div className="mt-5 text-[14px] leading-[1.6]" style={{ color: config.secondaryTextColor }}>
                  {config.bio}
                </div>
              )}

              {/* Tagline pill */}
              {config.tagline && (
                <div className="mt-4" style={{ textAlign: config.layoutStyle as any }}>
                  <span className="prey-chip prey-label inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
                    style={{ color: accentColor, fontFamily: MONO }}>
                    {config.tagline}
                  </span>
                </div>
              )}

              {/* Social links */}
              {config.socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2.5" style={{ justifyContent: alignItems }}>
                  {config.socialLinks.map((link, i) => {
                    const Icon = SOCIAL_ICONS[link.type] || Globe;
                    const cards = config.linkStyle === "cards";
                    return (
                      <a
                        key={i}
                        href={link.url}
                        onClick={(e) => e.stopPropagation()}
                        className="prey-chip flex cursor-pointer items-center justify-center transition"
                        style={{
                          gap: cards ? 8 : 0,
                          width: cards ? "auto" : 48,
                          height: 48,
                          padding: cards ? "0 14px" : 0,
                          borderRadius: 14,
                          color: config.textColor,
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${accentColor}24`;
                          e.currentTarget.style.borderColor = accentColor;
                          e.currentTarget.style.color = accentColor;
                          e.currentTarget.style.transform = "translateY(-3px)";
                          e.currentTarget.style.boxShadow = `0 8px 22px -8px ${accentGlow}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,.035)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,.09)";
                          e.currentTarget.style.color = config.textColor;
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        title={link.label}
                      >
                        <Icon size={20} strokeWidth={2} />
                        {cards && (
                          <span className="text-[11px] font-semibold">{link.label}</span>
                        )}
                      </a>
                    );
                  })}
                </div>
              )}

              {/* divider */}
              {config.showNowPlaying && config.trackName && (
                <div className="my-5" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent)" }} />
              )}

              {/* Now playing */}
              {config.showNowPlaying && config.trackName && (
                <div className="flex items-center gap-3.5">
                  <div className="flex-none" style={{
                    width: 46, height: 46, borderRadius: 11,
                    background: config.albumArtUrl ? `url(${config.albumArtUrl}) center/cover` : "rgba(255,255,255,.06)",
                  }} />
                  <div className="min-w-0 flex-1">
                    <div className="prey-label text-[10px] font-semibold" style={{ color: config.secondaryTextColor, fontFamily: MONO }}>
                      now playing
                    </div>
                    <div className="mt-1 flex items-baseline gap-2 overflow-hidden whitespace-nowrap">
                      <span className="text-[16px] font-semibold" style={{ color: config.textColor }}>{config.trackName}</span>
                      <span className="text-[13px]" style={{ color: config.secondaryTextColor, fontFamily: MONO }}>— {config.artistName}</span>
                    </div>
                  </div>
                  {/* EQ */}
                  <div className="flex items-end gap-[2.5px]" style={{ height: 15 }}>
                    {[0, 0.16, 0.32, 0.48].map((d, i) => (
                      <span key={i} className="prey-eq-bar" style={{
                        width: 2.5, height: "100%", borderRadius: 2, background: accentColor, animationDelay: `${d}s`,
                      }} />
                    ))}
                  </div>
                  {/* transport */}
                  <div className="flex items-center gap-0.5">
                    <button title="prev" className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "transparent", border: "none", color: config.secondaryTextColor, cursor: "pointer" }}>
                      <SkipBack size={18} />
                    </button>
                    <button title="play" className="flex items-center justify-center rounded-full" style={{
                      width: 40, height: 40, border: `1px solid ${accentColor}`, background: `${accentColor}1f`, color: accentColor, cursor: "pointer",
                    }}>
                      <Play size={18} />
                    </button>
                    <button title="next" className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "transparent", border: "none", color: config.secondaryTextColor, cursor: "pointer" }}>
                      <SkipForward size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
                {config.showJoinDate ? (
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ color: config.secondaryTextColor, fontFamily: MONO }}>
                    <Calendar size={11} strokeWidth={2} />
                    joined sep 2025
                  </div>
                ) : <span />}
                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleMessage}
                      className="prey-chip flex h-8 w-8 cursor-pointer items-center justify-center rounded-[10px] transition"
                      title="Message"
                    >
                      <MessageCircle size={13} strokeWidth={2.5} style={{ color: config.secondaryTextColor }} />
                    </button>
                    <button
                      className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3.5 py-1 text-[12px] font-semibold transition"
                      style={{ background: `${accentColor}24`, color: accentColor, border: `1px solid ${accentColor}` }}
                    >
                      <UserPlus size={12} strokeWidth={2.5} />
                      add friend
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
