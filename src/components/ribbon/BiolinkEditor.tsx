"use client";

import { useState } from "react";
import {
  User, Palette, Sparkles, Image as ImageIcon, BadgeCheck, Music, Link2,
  Eye, Heart, Calendar, Activity, RotateCcw, Plus, X, Code,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import type { BiolinkConfig, FontFamily, BgType, LayoutStyle, LinkStyle, CutsceneDirection } from "@/lib/ribbon/types";
import type { SocialLink } from "@/lib/ribbon/types";

const EDITOR_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "effects", label: "Effects", icon: Sparkles },
  { id: "background", label: "Background", icon: ImageIcon },
  { id: "badges", label: "Badges", icon: BadgeCheck },
  { id: "music", label: "Music", icon: Music },
  { id: "links", label: "Links", icon: Link2 },
  { id: "css", label: "CSS", icon: Code },
] as const;

type EditorTab = typeof EDITOR_TABS[number]["id"];

const FONT_OPTIONS: { value: FontFamily; label: string; css: string }[] = [
  { value: "quicksand", label: "Quicksand", css: "'Quicksand', sans-serif" },
  { value: "inter", label: "Inter", css: "'Inter', sans-serif" },
  { value: "mono", label: "Mono", css: "'JetBrains Mono', monospace" },
  { value: "serif", label: "Serif", css: "Georgia, serif" },
  { value: "rounded", label: "Rounded", css: "'Nunito', sans-serif" },
];

export function BiolinkEditor() {
  const { biolinkConfig, updateBiolinkConfig, resetBiolinkConfig } = useRibbon();
  const [tab, setTab] = useState<EditorTab>("profile");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold">Biolink Editor</h2>
          <p className="text-[12px]" style={{ color: "var(--ribbon-text-faint)" }}>
            customize your public profile page
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Reset all biolink settings to defaults?")) resetBiolinkConfig();
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[11px] font-semibold"
          style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text-dim)" }}
        >
          <RotateCcw size={11} strokeWidth={2.5} />
          reset
        </button>
      </div>

      {/* Tab bar */}
      <div className="mb-5 flex flex-wrap gap-1">
        {EDITOR_TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex cursor-pointer items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[11px] font-semibold transition"
              style={{
                background: active ? "var(--color-ribbon-terracotta)" : "var(--ribbon-card)",
                color: active ? "#FFFFFF" : "var(--ribbon-text-dim)",
              }}
            >
              <Icon size={12} strokeWidth={2.5} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "profile" && <ProfileTab config={biolinkConfig} update={updateBiolinkConfig} />}
      {tab === "colors" && <ColorsTab config={biolinkConfig} update={updateBiolinkConfig} />}
      {tab === "effects" && <EffectsTab config={biolinkConfig} update={updateBiolinkConfig} />}
      {tab === "background" && <BackgroundTab config={biolinkConfig} update={updateBiolinkConfig} />}
      {tab === "badges" && <BadgesTab config={biolinkConfig} update={updateBiolinkConfig} />}
      {tab === "music" && <MusicTab config={biolinkConfig} update={updateBiolinkConfig} />}
      {tab === "links" && <LinksTab config={biolinkConfig} update={updateBiolinkConfig} />}
      {tab === "css" && <CssTab config={biolinkConfig} update={updateBiolinkConfig} />}
    </div>
  );
}

// ═══ Reusable controls ═══

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ribbon-text-faint)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[6px] px-3 py-2 text-[12px] outline-none"
      style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text)" }}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-[6px] px-3 py-2 text-[12px] outline-none"
      style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text)" }}
    />
  );
}

function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value.startsWith("#") ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded-[4px]"
        style={{ background: "transparent" }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-[6px] px-2 py-1.5 text-[11px] outline-none"
        style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text)" }}
      />
    </div>
  );
}

function Slider({ value, min, max, onChange, label, unit }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string; unit?: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ribbon-text-faint)" }}>{label}</span>
        <span className="text-[10px] font-semibold" style={{ color: "var(--ribbon-text-dim)" }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: "var(--color-ribbon-terracotta)" }}
      />
    </div>
  );
}

function Toggle({ value, onChange, label, description }: { value: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="mb-2 flex items-center justify-between rounded-[6px] px-3 py-2" style={{ background: "var(--ribbon-card)" }}>
      <div>
        <div className="text-[12px] font-semibold">{label}</div>
        {description && <div className="text-[10px]" style={{ color: "var(--ribbon-text-faint)" }}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative cursor-pointer rounded-full transition"
        style={{
          width: 36, height: 20,
          background: value ? "var(--color-ribbon-terracotta)" : "var(--ribbon-hover)",
        }}
      >
        <div
          className="absolute rounded-full bg-white transition-all"
          style={{ width: 16, height: 16, top: 2, left: value ? 18 : 2 }}
        />
      </button>
    </div>
  );
}

function Select<T extends string>({ value, onChange, label, options }: { value: T; onChange: (v: T) => void; label: string; options: { value: T; label: string }[] }) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-[6px] px-3 py-2 text-[12px] outline-none"
        style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text)" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

// ═══ Tab implementations ═══

type TabProps = { config: BiolinkConfig; update: (u: Partial<BiolinkConfig>) => void };

function ProfileTab({ config, update }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <Field label="Display name"><TextInput value={config.displayName} onChange={(v) => update({ displayName: v })} /></Field>
        <Field label="Bio"><TextArea value={config.bio} onChange={(v) => update({ bio: v })} placeholder="say something about yourself..." /></Field>
        <Field label="Tagline (pill text)"><TextInput value={config.tagline} onChange={(v) => update({ tagline: v })} placeholder="e.g. digital alchemist" /></Field>
        <Field label="Avatar URL (optional)"><TextInput value={config.avatarUrl} onChange={(v) => update({ avatarUrl: v })} placeholder="https://..." /></Field>
        <Toggle label="Verified badge" description="show the checkmark next to your name" value={config.verified} onChange={(v) => update({ verified: v })} />
      </div>
      <BiolinkPreview config={config} />
    </div>
  );
}

function ColorsTab({ config, update }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <Field label="Accent color"><ColorInput value={config.accentColor} onChange={(v) => update({ accentColor: v })} label="" /></Field>
        <Field label="Primary text color"><ColorInput value={config.textColor} onChange={(v) => update({ textColor: v })} label="" /></Field>
        <Field label="Secondary text color"><ColorInput value={config.secondaryTextColor} onChange={(v) => update({ secondaryTextColor: v })} label="" /></Field>
        <Field label="Card background"><ColorInput value={config.cardBg} onChange={(v) => update({ cardBg: v })} label="" /></Field>
        <Field label="Page background"><ColorInput value={config.pageBg} onChange={(v) => update({ pageBg: v })} label="" /></Field>

        <Select<FontFamily>
          label="Font family"
          value={config.fontFamily}
          onChange={(v) => update({ fontFamily: v })}
          options={FONT_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
        />
        <Slider label="Font size" value={config.fontSize} min={10} max={20} onChange={(v) => update({ fontSize: v })} unit="px" />
        <Slider label="Card radius" value={config.borderRadius} min={0} max={30} onChange={(v) => update({ borderRadius: v })} unit="px" />
        <Slider label="Card width" value={config.cardWidth} min={280} max={500} onChange={(v) => update({ cardWidth: v })} unit="px" />
      </div>
      <BiolinkPreview config={config} />
    </div>
  );
}

function EffectsTab({ config, update }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <Toggle label="Glow effect" description="soft glow on name and interactive elements" value={config.glow} onChange={(v) => update({ glow: v })} />
        {config.glow && <Slider label="Glow intensity" value={config.glowIntensity} min={0} max={100} onChange={(v) => update({ glowIntensity: v })} unit="%" />}
        <Toggle label="Glassmorphism" description="frosted glass blur effect on card" value={config.glassmorphism} onChange={(v) => update({ glassmorphism: v })} />
        {config.glassmorphism && <Slider label="Blur amount" value={config.blurAmount} min={0} max={30} onChange={(v) => update({ blurAmount: v })} unit="px" />}
        <Toggle label="Card shadow" description="drop shadow under the card" value={config.cardShadow} onChange={(v) => update({ cardShadow: v })} />
        <Toggle label="Scanlines" description="retro CRT horizontal lines" value={config.scanlines} onChange={(v) => update({ scanlines: v })} />
        <Toggle label="Grain texture" description="film grain noise overlay" value={config.grainTexture} onChange={(v) => update({ grainTexture: v })} />
        <Toggle label="Particles" description="floating sparkle particles" value={config.particles} onChange={(v) => update({ particles: v })} />
      </div>
      <BiolinkPreview config={config} />
    </div>
  );
}

function BackgroundTab({ config, update }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <Select<BgType>
          label="Background type"
          value={config.bgType}
          onChange={(v) => update({ bgType: v })}
          options={[
            { value: "solid", label: "Solid color" },
            { value: "gradient", label: "Gradient" },
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
          ]}
        />
        {config.bgType === "solid" && (
          <Field label="Background color"><ColorInput value={config.pageBg} onChange={(v) => update({ pageBg: v })} label="" /></Field>
        )}
        {config.bgType === "gradient" && (
          <>
            <Field label="Gradient from"><ColorInput value={config.bgGradientFrom} onChange={(v) => update({ bgGradientFrom: v })} label="" /></Field>
            <Field label="Gradient to"><ColorInput value={config.bgGradientTo} onChange={(v) => update({ bgGradientTo: v })} label="" /></Field>
            <Slider label="Gradient angle" value={config.bgGradientAngle} min={0} max={360} onChange={(v) => update({ bgGradientAngle: v })} unit="°" />
          </>
        )}
        {config.bgType === "image" && (
          <Field label="Image URL"><TextInput value={config.bgImageUrl} onChange={(v) => update({ bgImageUrl: v })} placeholder="https://..." /></Field>
        )}
        {config.bgType === "video" && (
          <Field label="Video URL"><TextInput value={config.bgVideoUrl} onChange={(v) => update({ bgVideoUrl: v })} placeholder="https://...mp4" /></Field>
        )}
        <Slider label="Background translucency" value={config.bgOpacity} min={0} max={100} onChange={(v) => update({ bgOpacity: v })} unit="%" />
        <div className="mb-3 text-[10px]" style={{ color: "var(--ribbon-text-faint)" }}>
          Controls how transparent the background layer is. Lower = more see-through.
        </div>
      </div>
      <BiolinkPreview config={config} />
    </div>
  );
}

function BadgesTab({ config, update }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <Toggle label="Show views" description="display view count on top bar" value={config.showViews} onChange={(v) => update({ showViews: v })} />
        <Toggle label="Show likes" description="display like count" value={config.showLikes} onChange={(v) => update({ showLikes: v })} />
        <Toggle label="Show join date" description="display when you joined" value={config.showJoinDate} onChange={(v) => update({ showJoinDate: v })} />
        <Toggle label="Show online status" description="green dot + ONLINE text" value={config.showOnlineStatus} onChange={(v) => update({ showOnlineStatus: v })} />
        <Toggle label="Show top bar" description="the bar with views/likes at top of card" value={config.showTopBar} onChange={(v) => update({ showTopBar: v })} />

        <Select<LayoutStyle>
          label="Layout style"
          value={config.layoutStyle}
          onChange={(v) => update({ layoutStyle: v })}
          options={[
            { value: "centered", label: "Centered" },
            { value: "left", label: "Left-aligned" },
            { value: "right", label: "Right-aligned" },
          ]}
        />
        <Select<LinkStyle>
          label="Link style"
          value={config.linkStyle}
          onChange={(v) => update({ linkStyle: v })}
          options={[
            { value: "cards", label: "Cards" },
            { value: "buttons", label: "Buttons" },
            { value: "list", label: "List" },
          ]}
        />
        <Select<CutsceneDirection>
          label="Opening cutscene"
          value={config.cutsceneDirection}
          onChange={(v) => update({ cutsceneDirection: v })}
          options={[
            { value: "vertical", label: "Vertical (top to bottom)" },
            { value: "horizontal", label: "Horizontal (side to side)" },
            { value: "fade", label: "Fade in" },
          ]}
        />
        <div className="mb-3 text-[10px]" style={{ color: "var(--ribbon-text-faint)" }}>
          How the biolink opens when someone visits it — like a cinematic cutscene.
        </div>
      </div>
      <BiolinkPreview config={config} />
    </div>
  );
}

function MusicTab({ config, update }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <Toggle label="Show now playing" description="music player widget on your biolink" value={config.showNowPlaying} onChange={(v) => update({ showNowPlaying: v })} />
        {config.showNowPlaying && (
          <>
            <Field label="Track name"><TextInput value={config.trackName} onChange={(v) => update({ trackName: v })} placeholder="song name" /></Field>
            <Field label="Artist name"><TextInput value={config.artistName} onChange={(v) => update({ artistName: v })} placeholder="artist" /></Field>
            <Field label="Album art URL (optional)"><TextInput value={config.albumArtUrl} onChange={(v) => update({ albumArtUrl: v })} placeholder="https://..." /></Field>
          </>
        )}
      </div>
      <BiolinkPreview config={config} />
    </div>
  );
}

function LinksTab({ config, update }: TabProps) {
  const addLink = () => {
    update({ socialLinks: [...config.socialLinks, { type: "website", label: "new link", url: "" }] });
  };
  const updateLink = (i: number, field: keyof SocialLink, value: string) => {
    const links = [...config.socialLinks];
    links[i] = { ...links[i], [field]: value };
    update({ socialLinks: links });
  };
  const removeLink = (i: number) => {
    update({ socialLinks: config.socialLinks.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <Field label="Social links">
          <div className="space-y-2">
            {config.socialLinks.map((link, i) => (
              <div key={i} className="flex gap-1.5">
                <select
                  value={link.type}
                  onChange={(e) => updateLink(i, "type", e.target.value)}
                  className="rounded-[6px] px-2 py-2 text-[11px] outline-none"
                  style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text)" }}
                >
                  <option value="website">Website</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="github">GitHub</option>
                  <option value="spotify">Spotify</option>
                  <option value="twitch">Twitch</option>
                  <option value="youtube">YouTube</option>
                </select>
                <input
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  placeholder="label"
                  className="w-20 rounded-[6px] px-2 py-2 text-[11px] outline-none"
                  style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text)" }}
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-[6px] px-2 py-2 text-[11px] outline-none"
                  style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text)" }}
                />
                <button onClick={() => removeLink(i)} className="cursor-pointer px-2 text-[14px]" style={{ color: "var(--color-ribbon-rust)" }}>×</button>
              </div>
            ))}
            <button onClick={addLink} className="flex cursor-pointer items-center gap-1 rounded-[6px] px-3 py-1.5 text-[11px] font-semibold" style={{ background: "var(--ribbon-card)", color: "var(--ribbon-text-dim)" }}>
              <Plus size={11} strokeWidth={2.5} /> add link
            </button>
          </div>
        </Field>
      </div>
      <BiolinkPreview config={config} />
    </div>
  );
}

// ═══ Preset themes ═══

const PRESET_THEMES: { name: string; description: string; config: Partial<BiolinkConfig> }[] = [
  {
    name: "Minimal Dark",
    description: "clean black card, no effects",
    config: {
      cardBg: "rgba(15, 15, 15, 0.95)",
      accentColor: "#E8769A",
      textColor: "#FFFFFF",
      secondaryTextColor: "#9499A2",
      glow: false,
      glassmorphism: false,
      scanlines: false,
      grainTexture: false,
      particles: false,
      cardShadow: true,
      bgType: "gradient",
      bgGradientFrom: "#0F0F0F",
      bgGradientTo: "#1A1A1A",
      bgGradientAngle: 135,
      bgOpacity: 100,
      fontFamily: "inter",
      borderRadius: 12,
    },
  },
  {
    name: "Glassmorphism",
    description: "frosted glass blur, subtle glow",
    config: {
      cardBg: "rgba(0, 0, 0, 0.6)",
      accentColor: "#E8769A",
      textColor: "#FFFFFF",
      secondaryTextColor: "#D1D5DB",
      glow: true,
      glowIntensity: 30,
      glassmorphism: true,
      blurAmount: 16,
      scanlines: false,
      grainTexture: false,
      particles: true,
      cardShadow: true,
      bgType: "gradient",
      bgGradientFrom: "#0A0A0A",
      bgGradientTo: "#1A0A1A",
      bgGradientAngle: 135,
      bgOpacity: 100,
      fontFamily: "inter",
      borderRadius: 16,
    },
  },
  {
    name: "Retro CRT",
    description: "scanlines, grain, glow — cyberpunk vibe",
    config: {
      cardBg: "rgba(10, 14, 23, 0.85)",
      accentColor: "#64FFDA",
      textColor: "#FFFFFF",
      secondaryTextColor: "#9CA3AF",
      glow: true,
      glowIntensity: 60,
      glassmorphism: true,
      blurAmount: 8,
      scanlines: true,
      grainTexture: true,
      particles: true,
      cardShadow: true,
      bgType: "gradient",
      bgGradientFrom: "#0A0E17",
      bgGradientTo: "#06080C",
      bgGradientAngle: 180,
      bgOpacity: 100,
      fontFamily: "mono",
      borderRadius: 8,
    },
  },
  {
    name: "Soft Pink",
    description: "warm, approachable, pink-tinted",
    config: {
      cardBg: "rgba(26, 10, 26, 0.8)",
      accentColor: "#EC4899",
      textColor: "#FFFFFF",
      secondaryTextColor: "#D1D5DB",
      glow: true,
      glowIntensity: 35,
      glassmorphism: true,
      blurAmount: 12,
      scanlines: false,
      grainTexture: false,
      particles: true,
      cardShadow: true,
      bgType: "gradient",
      bgGradientFrom: "#1A0A1A",
      bgGradientTo: "#0A0A0A",
      bgGradientAngle: 160,
      bgOpacity: 100,
      fontFamily: "rounded",
      borderRadius: 16,
    },
  },
  {
    name: "Clean Light",
    description: "bright, minimal, white card",
    config: {
      cardBg: "rgba(255, 255, 255, 0.95)",
      accentColor: "#D4638A",
      textColor: "#1A1B1E",
      secondaryTextColor: "#5D6067",
      glow: false,
      glassmorphism: false,
      scanlines: false,
      grainTexture: false,
      particles: false,
      cardShadow: true,
      bgType: "gradient",
      bgGradientFrom: "#F5F2ED",
      bgGradientTo: "#E8DFE3",
      bgGradientAngle: 135,
      bgOpacity: 100,
      fontFamily: "inter",
      borderRadius: 12,
    },
  },
];

function CssTab({ config, update }: TabProps) {
  const applyPreset = (preset: typeof PRESET_THEMES[number]) => {
    update(preset.config);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        {/* Preset themes */}
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ribbon-text-faint)" }}>
          Preset Themes
        </div>
        <div className="mb-5 space-y-1.5">
          {PRESET_THEMES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex w-full cursor-pointer items-center justify-between rounded-[6px] px-3 py-2.5 text-left transition"
              style={{ background: "var(--ribbon-card)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ribbon-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ribbon-card)")}
            >
              <div>
                <div className="text-[12px] font-semibold">{preset.name}</div>
                <div className="text-[10px]" style={{ color: "var(--ribbon-text-faint)" }}>{preset.description}</div>
              </div>
              <div
                className="h-8 w-8 flex-none rounded-[4px]"
                style={{
                  background: preset.config.cardBg as string,
                  boxShadow: `inset 0 0 0 1px ${preset.config.accentColor as string}40`,
                }}
              />
            </button>
          ))}
        </div>

        {/* Custom CSS */}
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ribbon-text-faint)" }}>
          Custom CSS
        </div>
        <div className="text-[10px] mb-2" style={{ color: "var(--ribbon-text-faint)" }}>
          Inject your own CSS into the biolink page. Use <code style={{ color: "var(--color-ribbon-terracotta)" }}>prey-biolink</code> as the card class, <code style={{ color: "var(--color-ribbon-terracotta)" }}>prey-name</code> for the name, <code style={{ color: "var(--color-ribbon-terracotta)" }}>prey-bio</code> for bio, <code style={{ color: "var(--color-ribbon-terracotta)" }}>prey-links</code> for social links.
        </div>
        <textarea
          value={config.customCss}
          onChange={(e) => update({ customCss: e.target.value })}
          rows={10}
          placeholder={"/* custom CSS for your biolink */\n.prey-biolink {\n  /* your styles here */\n}\n\n.prey-name {\n  letter-spacing: -0.5px;\n}"}
          className="w-full resize-none rounded-[6px] px-3 py-2 font-mono text-[11px] outline-none"
          style={{
            background: "var(--ribbon-card)",
            color: "var(--ribbon-text)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        <div className="mt-1 text-[10px]" style={{ color: "var(--ribbon-text-faint)" }}>
          This CSS is injected directly into the biolink page head. Be careful — invalid CSS may break the layout.
        </div>
      </div>
      <BiolinkPreview config={config} />
    </div>
  );
}

// ═══ Live preview (mini biolink card) ═══

function BiolinkPreview({ config }: { config: BiolinkConfig }) {
  const fontCss = FONT_OPTIONS.find((f) => f.value === config.fontFamily)?.css || "'Quicksand', sans-serif";

  const pageBg = config.bgType === "gradient"
    ? `linear-gradient(${config.bgGradientAngle}deg, ${config.bgGradientFrom}, ${config.bgGradientTo})`
    : config.bgType === "image" && config.bgImageUrl
      ? `url(${config.bgImageUrl}) center/cover`
      : config.pageBg;

  const glowStyle = config.glow
    ? { textShadow: `0 0 ${config.glowIntensity / 4}px ${config.accentColor}` }
    : {};

  const cardStyle: React.CSSProperties = {
    background: config.cardBg,
    borderRadius: config.borderRadius,
    backdropFilter: config.glassmorphism ? `blur(${config.blurAmount}px)` : "none",
    boxShadow: config.cardShadow ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "none",
    width: "100%",
    maxWidth: config.cardWidth,
    fontFamily: fontCss,
    fontSize: config.fontSize,
    overflow: "hidden",
    position: "relative",
  };

  return (
    <div>
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ribbon-text-faint)" }}>
        Live Preview
      </div>
      <div
        className="overflow-hidden rounded-[8px] p-4"
        style={{
          background: "#000000",
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Background layer with translucency */}
        {config.bgType === "video" && config.bgVideoUrl && (
          <div className="absolute inset-0 overflow-hidden" style={{ opacity: config.bgOpacity / 100 }}>
            <video autoPlay loop muted playsInline className="h-full w-full object-cover">
              <source src={config.bgVideoUrl} type="video/mp4" />
            </video>
          </div>
        )}
        {config.bgType === "image" && config.bgImageUrl && (
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${config.bgImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: config.bgOpacity / 100,
          }} />
        )}
        {(config.bgType === "gradient" || config.bgType === "solid") && (
          <div className="absolute inset-0" style={{
            background: pageBg,
            opacity: config.bgOpacity / 100,
          }} />
        )}
        {/* Scanlines */}
        {config.scanlines && (
          <div className="pointer-events-none absolute inset-0" style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
          }} />
        )}
        {/* Grain */}
        {config.grainTexture && (
          <div className="pointer-events-none absolute inset-0" style={{
            opacity: 0.04,
            background: "repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%) 0 0 / 2px 2px",
          }} />
        )}
        {/* Particles */}
        {config.particles && (
          <>
            <div className="animate-twinkle pointer-events-none absolute" style={{ top: "10%", left: "15%", fontSize: 4, color: config.accentColor }}>✦</div>
            <div className="animate-twinkle pointer-events-none absolute" style={{ top: "70%", left: "80%", width: 2, height: 2, borderRadius: "50%", background: config.accentColor, animationDelay: "1s" }} />
            <div className="animate-twinkle pointer-events-none absolute" style={{ top: "30%", left: "85%", fontSize: 3, color: config.accentColor, animationDelay: "2s" }}>✦</div>
          </>
        )}

        {/* The card */}
        <div style={cardStyle}>
          {/* Top bar */}
          {config.showTopBar && (
            <div className="flex items-center justify-between px-3 py-1.5" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="flex items-center gap-2">
                {config.showOnlineStatus && (
                  <span className="rounded-full" style={{ width: 7, height: 7, background: "#00FF88" }} />
                )}
                <span className="text-[9px] font-bold uppercase" style={{ color: config.secondaryTextColor }}>prey.lol/{config.displayName}</span>
              </div>
              {config.showViews && (
                <div className="flex items-center gap-1 text-[9px]" style={{ color: config.accentColor }}>
                  <Eye size={9} /> 192
                </div>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-4 py-4" style={{ textAlign: config.layoutStyle as any }}>
            {/* Avatar + name */}
            <div className="mb-3 flex items-center gap-3" style={{ justifyContent: config.layoutStyle === "centered" ? "center" : config.layoutStyle === "right" ? "flex-end" : "flex-start" }}>
              <div
                className="flex items-center justify-center font-bold text-white"
                style={{
                  width: 48, height: 48, borderRadius: config.borderRadius / 2,
                  background: config.accentColor,
                  fontSize: 22,
                }}
              >
                {(config.displayName || "y").charAt(0).toLowerCase()}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-bold" style={{ color: config.textColor, ...glowStyle }}>
                    {config.displayName || "yourname"}
                  </span>
                  {config.verified && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={config.accentColor}>
                      <path d="M12 2L14.5 5L18 4L17 7.5L20 10L16.5 11.5L17 15L13.5 14L12 17L10.5 14L7 15L7.5 11.5L4 10L7 7.5L6 4L9.5 5L12 2Z" />
                    </svg>
                  )}
                </div>
                {config.showOnlineStatus && (
                  <div className="text-[9px] font-bold uppercase" style={{ color: "#00FF88" }}>ONLINE</div>
                )}
              </div>
            </div>

            {/* Bio */}
            {config.bio && (
              <div className="mb-2 text-[11px] leading-[1.5]" style={{ color: config.secondaryTextColor }}>
                {config.bio}
              </div>
            )}

            {/* Tagline pill */}
            {config.tagline && (
              <div className="mb-3">
                <span className="inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: "rgba(0,0,0,0.3)", color: config.accentColor }}>
                  {config.tagline}
                </span>
              </div>
            )}

            {/* Now playing */}
            {config.showNowPlaying && config.trackName && (
              <div className="mb-3 flex items-center gap-2 rounded-[6px] px-2.5 py-2" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div className="flex items-end gap-0.5" style={{ height: 14 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ width: 2, borderRadius: 1, background: config.accentColor, animation: `ribbon-eq-bar ${[1.1, 0.9, 1.3, 1][i]}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-semibold" style={{ color: config.accentColor }}>{config.trackName}</div>
                  <div className="text-[9px]" style={{ color: config.secondaryTextColor }}>{config.artistName}</div>
                </div>
              </div>
            )}

            {/* Social links */}
            {config.socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-1.5" style={{ justifyContent: config.layoutStyle === "centered" ? "center" : config.layoutStyle === "right" ? "flex-end" : "flex-start" }}>
                {config.socialLinks.slice(0, 6).map((link, i) => (
                  <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full text-[8px] font-bold" style={{ background: "rgba(0,0,0,0.3)", color: config.textColor }}>
                    {link.type.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {config.showJoinDate && (
                <div className="text-[9px]" style={{ color: config.secondaryTextColor }}>Joined Sep 2025</div>
              )}
              {config.showLikes && (
                <div className="flex items-center gap-1 text-[9px]" style={{ color: config.accentColor }}>
                  <Heart size={9} /> 42
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
