"use client";

import { useState } from "react";
import {
  ArrowLeft,
  User,
  Palette,
  Bell,
  Volume2,
  Lock,
  Save,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRibbon, ACCENT_HEX } from "@/lib/ribbon/store";
import { Avatar } from "../Avatar";
import { SectionLabel } from "../Shared";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "audio", label: "Audio", icon: Volume2 },
  { id: "privacy", label: "Privacy", icon: Lock },
];

export function SettingsView() {
  const {
    navigate,
    activeSettingsTab,
    setActiveSettingsTab,
    settings,
    updateSetting,
    currentUser,
    updateCurrentUser,
  } = useRibbon();
  const me = currentUser;
  const tab = activeSettingsTab || "profile";

  return (
    <div
      className="flex h-full w-full"
      style={{ background: "var(--color-ribbon-bg)", color: "var(--color-ribbon-text)" }}
    >
      {/* Settings sidebar */}
      <div
        className="flex w-[240px] flex-none flex-col"
        style={{
          background: "var(--ribbon-card)",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        <div className="flex h-[52px] flex-none items-center px-5" style={{ borderColor: "var(--color-ribbon-border)" }}>
          <button
            onClick={() => navigate("dms")}
            className="mr-3 cursor-pointer"
            title="Back"
          >
            <ArrowLeft size={16} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
          </button>
          <div className="text-[15px] font-bold">Settings</div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSettingsTab(t.id)}
                className="mb-0.5 flex w-full cursor-pointer items-center gap-2 rounded-[10px] px-3 py-2 text-[12px] font-medium transition"
                style={{
                  background: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  color: active
                    ? "var(--color-ribbon-terracotta)"
                    : "var(--color-ribbon-text-dim)",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={14} strokeWidth={2.5} />
                {t.label}
              </button>
            );
          })}
        </div>
        {/* User card mini */}
        <div className="p-3">
          <div
            className="flex items-center gap-2 rounded-[12px] p-3"
            style={{
              background: "var(--ribbon-elevated)",
              borderColor: "var(--color-ribbon-border)",
            }}
          >
            <Avatar
              letter={me.avatarLetter}
              accent={me.accent}
              size={28}
              radius={9}
              ring
              status="online"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold">you</div>
              <div
                className="text-[9px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                prey.lol/you
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          {/* Profile */}
          {tab === "profile" && (
            <div>
              <h2 className="mb-1 text-[18px] font-bold">Profile</h2>
              <p
                className="mb-6 text-[12px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                how you appear to everyone on prey
              </p>

              {/* Avatar preview */}
              <div
                className="mb-6 flex items-center gap-4 rounded-[12px] p-4"
                style={{
                  background: "var(--ribbon-card)",
                  borderColor: "var(--color-ribbon-border)",
                }}
              >
                <Avatar
                  letter={me.avatarLetter}
                  accent={me.accent}
                  size={56}
                  radius={14}
                  ring
                />
                <div>
                  <div className="text-[13px] font-semibold">{me.username}</div>
                  <div
                    className="text-[11px]"
                    style={{ color: "var(--color-ribbon-text-faint)" }}
                  >
                    UID {me.uid?.toLocaleString()}
                  </div>
                </div>
              </div>

              <ProfileEditForm
                user={me}
                onSave={(updates) => updateCurrentUser(updates)}
              />
            </div>
          )}

          {/* Appearance */}
          {tab === "appearance" && (
            <div>
              <h2 className="mb-1 text-[18px] font-bold">Appearance</h2>
              <p
                className="mb-6 text-[12px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                customize the look of ribbon
              </p>

              <Field label="Accent color">
                <div className="flex gap-2">
                  {(["terracotta", "amber", "sage", "mauve"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => updateSetting("accent", c)}
                      className="cursor-pointer rounded-full transition"
                      style={{
                        width: 32,
                        height: 32,
                        background: ACCENT_HEX[c],
                        borderColor:
                          settings.accent === c
                            ? "var(--color-ribbon-text)"
                            : "transparent",
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </Field>

              <ToggleRow
                label="Reduce motion"
                description="Turn off breathing, glitch, and ring-pulse animations"
                value={settings.reduceMotion}
                onChange={(v) => updateSetting("reduceMotion", v)}
              />

              <ThemeField />
            </div>
          )}

          {/* Notifications */}
          {tab === "notifications" && (
            <div>
              <h2 className="mb-1 text-[18px] font-bold">Notifications</h2>
              <p
                className="mb-6 text-[12px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                when ribbon should ping you
              </p>

              <Field label="DM notifications">
                <div className="flex gap-1">
                  {(["all", "mentions", "none"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateSetting("dmNotifications", opt)}
                      className="cursor-pointer rounded-[10px] px-3 py-2 text-[12px] font-medium transition"
                      style={{
                        background:
                          settings.dmNotifications === opt
                            ? "rgba(255, 255, 255, 0.12)"
                            : "var(--ribbon-elevated)",
                        color:
                          settings.dmNotifications === opt
                            ? "var(--color-ribbon-terracotta)"
                            : "var(--color-ribbon-text-dim)",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Field>

              <ToggleRow
                label="Sound effects"
                description="Play a soft chime on mentions and new messages"
                value={settings.soundEffects}
                onChange={(v) => updateSetting("soundEffects", v)}
              />
            </div>
          )}

          {/* Audio */}
          {tab === "audio" && (
            <div>
              <h2 className="mb-1 text-[18px] font-bold">Audio</h2>
              <p
                className="mb-6 text-[12px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                voice input settings
              </p>

              <ToggleRow
                label="Voice activity"
                description="Auto-transmit when you speak (vs push-to-talk)"
                value={settings.voiceActivity}
                onChange={(v) => updateSetting("voiceActivity", v)}
              />

              {!settings.voiceActivity && (
                <Field label="Push-to-talk key">
                  <input
                    defaultValue={settings.pushToTalkKey}
                    className="w-full rounded-[10px] px-3 py-2 text-[12px] outline-none"
                    style={{
                      background: "var(--ribbon-elevated)",
                      borderColor: "var(--color-ribbon-border)",
                      color: "var(--color-ribbon-text)",
                    }}
                  />
                </Field>
              )}

              <Field label="Input volume">
                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={75}
                  className="w-full accent-terracotta"
                  style={{ accentColor: "var(--color-ribbon-terracotta)" }}
                />
              </Field>

              <Field label="Output volume">
                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={85}
                  className="w-full"
                  style={{ accentColor: "var(--color-ribbon-terracotta)" }}
                />
              </Field>
            </div>
          )}

          {/* Privacy */}
          {tab === "privacy" && (
            <div>
              <h2 className="mb-1 text-[18px] font-bold">Privacy</h2>
              <p
                className="mb-6 text-[12px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                who can see what
              </p>

              <ToggleRow
                label="Show online status"
                description="Let friends see when you're online"
                value={settings.showOnlineStatus}
                onChange={(v) => updateSetting("showOnlineStatus", v)}
              />

              <Field label="Who can DM you">
                <select
                  className="w-full rounded-[10px] px-3 py-2 text-[12px] outline-none"
                  style={{
                    background: "var(--ribbon-elevated)",
                    borderColor: "var(--color-ribbon-border)",
                    color: "var(--color-ribbon-text)",
                  }}
                  defaultValue="friends"
                >
                  <option value="everyone">Everyone</option>
                  <option value="friends">Friends of friends</option>
                  <option value="mutuals">Mutual friends only</option>
                </select>
              </Field>

              <Field label="Who can sign your guestbook">
                <select
                  className="w-full rounded-[10px] px-3 py-2 text-[12px] outline-none"
                  style={{
                    background: "var(--ribbon-elevated)",
                    borderColor: "var(--color-ribbon-border)",
                    color: "var(--color-ribbon-text)",
                  }}
                  defaultValue="everyone"
                >
                  <option value="everyone">Everyone</option>
                  <option value="friends">Friends only</option>
                </select>
              </Field>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-ribbon-text-faint)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="mb-3 flex items-center justify-between rounded-[12px] p-3"
      style={{
        background: "var(--ribbon-card)",
        borderColor: "var(--color-ribbon-border)",
      }}
    >
      <div>
        <div className="text-[12px] font-semibold">{label}</div>
        {description && (
          <div
            className="mt-0.5 text-[10px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative cursor-pointer rounded-full transition"
        style={{
          width: 36,
          height: 20,
          background: value
            ? "var(--color-ribbon-terracotta)"
            : "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          className="absolute top-0.5 rounded-full bg-white transition"
          style={{
            width: 16,
            height: 16,
            left: value ? 18 : 2,
          }}
        />
      </button>
    </div>
  );
}

function ThemeField() {
  const { theme, setTheme } = useTheme();
  // theme is undefined on first client render (before next-themes hydrates).
  // Default to "system" for the active-state comparison.
  const currentTheme = theme || "system";

  const options = [
    { id: "system", label: "System", icon: Monitor },
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <Field label="Theme">
      <div className="flex gap-1.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = currentTheme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] px-3 py-2.5 text-[12px] font-semibold transition"
              style={{
                background: isActive
                  ? "rgba(255, 255, 255, 0.1)"
                  : "var(--ribbon-card)",
                borderColor: isActive
                  ? "rgba(255, 255, 255, 0.24)"
                  : "var(--ribbon-border)",
                color: isActive
                  ? "var(--color-ribbon-terracotta)"
                  : "var(--ribbon-text-dim)",
              }}
            >
              <Icon size={13} strokeWidth={2.5} />
              {opt.label}
            </button>
          );
        })}
      </div>
      <div
        className="mt-1.5 text-[10px]"
        style={{ color: "var(--ribbon-text-faint)" }}
      >
        Auto-adapts to your device setting. Try switching your phone to light mode.
      </div>
    </Field>
  );
}

function ProfileEditForm({
  user,
  onSave,
}: {
  user: any;
  onSave: (updates: any) => void;
}) {
  const [displayName, setDisplayName] = useState(user.username ?? "");
  const [customTag, setCustomTag] = useState(user.customTag ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [pronouns, setPronouns] = useState(user.pronouns ?? "");
  const [socialLinks, setSocialLinks] = useState(user.socialLinks ?? []);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({
      username: displayName,
      customTag,
      bio,
      pronouns,
      socialLinks,
      handle: displayName.toLowerCase().replace(/\s+/g, ""),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { type: "website", label: "new link", url: "" }]);
  };

  const updateSocialLink = (index: number, field: "type" | "label" | "url", value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* LEFT: Edit fields */}
      <div>
        <Field label="Display name">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-[6px] px-3 py-2 text-[12px] outline-none"
            style={{
              background: "var(--ribbon-card)",
              color: "var(--ribbon-text)",
            }}
          />
        </Field>

        <Field label="Custom tag">
          <input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="e.g. digital alchemist"
            className="w-full rounded-[6px] px-3 py-2 text-[12px] outline-none"
            style={{
              background: "var(--ribbon-card)",
              color: "var(--ribbon-text)",
            }}
          />
        </Field>

        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="say something about yourself..."
            className="w-full resize-none rounded-[6px] px-3 py-2 text-[12px] outline-none"
            style={{
              background: "var(--ribbon-card)",
              color: "var(--ribbon-text)",
            }}
          />
        </Field>

        <Field label="Pronouns">
          <input
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            placeholder="they/them"
            className="w-full rounded-[6px] px-3 py-2 text-[12px] outline-none"
            style={{
              background: "var(--ribbon-card)",
              color: "var(--ribbon-text)",
            }}
          />
        </Field>

        {/* Social links editor */}
        <Field label="Social links">
          <div className="space-y-2">
            {socialLinks.map((link: any, i: number) => (
              <div key={i} className="flex gap-1.5">
                <select
                  value={link.type}
                  onChange={(e) => updateSocialLink(i, "type", e.target.value)}
                  className="rounded-[6px] px-2 py-2 text-[11px] outline-none"
                  style={{
                    background: "var(--ribbon-card)",
                    color: "var(--ribbon-text)",
                  }}
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
                  onChange={(e) => updateSocialLink(i, "label", e.target.value)}
                  placeholder="label"
                  className="w-20 rounded-[6px] px-2 py-2 text-[11px] outline-none"
                  style={{
                    background: "var(--ribbon-card)",
                    color: "var(--ribbon-text)",
                  }}
                />
                <input
                  value={link.url}
                  onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-[6px] px-2 py-2 text-[11px] outline-none"
                  style={{
                    background: "var(--ribbon-card)",
                    color: "var(--ribbon-text)",
                  }}
                />
                <button
                  onClick={() => removeSocialLink(i)}
                  className="cursor-pointer rounded-[6px] px-2 text-[12px]"
                  style={{ color: "var(--color-ribbon-rust)" }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addSocialLink}
              className="cursor-pointer rounded-[6px] px-3 py-1.5 text-[11px] font-semibold"
              style={{ background: "var(--ribbon-elevated)", color: "var(--ribbon-text-dim)" }}
            >
              + add link
            </button>
          </div>
        </Field>

        <div className="mt-5 flex items-center justify-end gap-2">
          {saved && (
            <span className="text-[11px] font-semibold" style={{ color: "#00FF88" }}>
              ✓ saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex cursor-pointer items-center gap-2 rounded-[6px] px-4 py-2 text-[12px] font-semibold transition"
            style={{
              background: "var(--color-ribbon-terracotta)",
              color: "#FFFFFF",
            }}
          >
            <Save size={12} strokeWidth={2.5} />
            save changes
          </button>
        </div>
      </div>

      {/* RIGHT: Live preview (mini biolink card) */}
      <div>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ribbon-text-faint)" }}>
          Live Preview
        </div>
        <div
          className="overflow-hidden rounded-[12px]"
          style={{ background: "var(--ribbon-card)" }}
        >
          {/* Banner */}
          <div
            className="h-[60px]"
            style={{
              background: `linear-gradient(135deg, var(--color-ribbon-terracotta) 0%, var(--color-ribbon-mauve) 100%)`,
            }}
          />
          {/* Body */}
          <div className="px-4 pb-4">
            <div className="-mt-8 mb-3 flex items-end justify-between">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-[12px] text-[24px] font-bold text-white"
                style={{ background: "var(--color-ribbon-terracotta)" }}
              >
                {(displayName || "y").charAt(0).toLowerCase()}
              </div>
            </div>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-[16px] font-bold" style={{ color: "var(--ribbon-text)" }}>
                {displayName || "yourname"}
              </span>
            </div>
            <div className="mb-2 text-[11px]" style={{ color: "var(--ribbon-text-dim)" }}>
              {customTag || "prey user"}
            </div>
            <div className="mb-3 flex items-center gap-1.5 text-[10px]" style={{ color: "var(--ribbon-text-faint)" }}>
              <span
                className="rounded-full"
                style={{ width: 7, height: 7, background: "#00FF88" }}
              />
              ONLINE
            </div>
            {bio && (
              <div className="mb-3 text-[11px] leading-[1.5]" style={{ color: "var(--ribbon-text-dim)" }}>
                {bio}
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {socialLinks.slice(0, 6).map((link: any, i: number) => (
                  <div
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold"
                    style={{ background: "var(--ribbon-elevated)", color: "var(--ribbon-text-dim)" }}
                  >
                    {link.type.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
