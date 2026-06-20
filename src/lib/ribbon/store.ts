"use client";

import { create } from "zustand";
import type {
  ViewId,
  NavParams,
  Message,
  DMConversation,
  InterestId,
  ServerSettingsTab,
  User,
  BiolinkConfig,
} from "./types";
import {
  dmConversations as initialDms,
  channelMessages as initialChannelMessages,
  friendIds as initialFriendIds,
  friendRequests as initialFriendRequests,
  CURRENT_USER_ID,
  users as mockUsers,
} from "./mock-data";

interface RibbonState {
  // ─── Navigation ───
  view: ViewId;
  params: NavParams;
  hasEntered: boolean;          // user clicked past the splash
  justEnteredApp: boolean;      // true for one render after enterApp() — used by DMsView to fade in
  navigate: (view: ViewId, params?: NavParams) => void;
  enterApp: () => void;         // mark splash as dismissed
  clearJustEnteredApp: () => void;  // reset the one-shot fade-in flag
  goBack: () => void;

  // ─── Active selection ───
  activeServerId: string;
  activeChannelId: string;
  activeDMId: string;           // DM conversation id
  activeProfileUserId: string;
  activeSettingsTab: string;
  joinedVoice: boolean;
  muted: boolean;
  deafened: boolean;

  // ─── Profile popup (Discord-style compact modal) ───
  profilePopupUserId: string | null;   // null = popup closed
  openProfilePopup: (userId: string) => void;
  closeProfilePopup: () => void;

  // ─── Biolink view (public profile page) ───
  biolinkUserId: string | null;        // null = biolink closed
  openBiolink: (userId: string) => void;
  closeBiolink: () => void;

  setActiveServer: (serverId: string) => void;
  setActiveChannel: (channelId: string) => void;
  setActiveDM: (dmId: string) => void;
  setActiveProfile: (userId: string) => void;
  setActiveSettingsTab: (tab: string) => void;
  joinVoice: () => void;
  leaveVoice: () => void;
  toggleMute: () => void;
  toggleDeafen: () => void;

  // ─── Messages (channel) ───
  channelMessages: Record<string, Message[]>;
  sendMessage: (channelId: string, text: string) => void;
  toggleReaction: (channelId: string, messageId: string, emoji: string) => void;

  // ─── DMs ───
  dms: DMConversation[];
  sendDM: (dmId: string, text: string) => void;
  markDMRead: (dmId: string) => void;

  // ─── Friends ───
  friendIds: string[];
  friendRequests: typeof initialFriendRequests;
  acceptFriend: (requestId: string) => void;
  declineFriend: (requestId: string) => void;
  removeFriend: (userId: string) => void;

  // ─── Current user (editable) ───
  currentUser: User;
  updateCurrentUser: (updates: Partial<User>) => void;

  // ─── Biolink config (highly customizable) ───
  biolinkConfig: BiolinkConfig;
  updateBiolinkConfig: (updates: Partial<BiolinkConfig>) => void;
  resetBiolinkConfig: () => void;

  // ─── Settings ───
  settings: {
    reduceMotion: boolean;
    showOnlineStatus: boolean;
    dmNotifications: "all" | "mentions" | "none";
    soundEffects: boolean;
    voiceActivity: boolean;
    pushToTalkKey: string;
    accent: "terracotta" | "amber" | "sage" | "mauve";
  };
  updateSetting: <K extends keyof RibbonState["settings"]>(
    key: K,
    value: RibbonState["settings"][K]
  ) => void;

  // ─── Onboarding ───
  onboardingStep: number;            // 0 = welcome, 1 = account, 2 = vibe, 3 = find people, 4 = set up, 5 = done
  onboardingInterests: InterestId[];
  onboardingJoinedServers: string[];
  onboardingUsername: string;
  setOnboardingStep: (step: number) => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  toggleOnboardingInterest: (id: InterestId) => void;
  toggleOnboardingServerJoin: (serverId: string) => void;
  setOnboardingUsername: (username: string) => void;
  finishOnboarding: () => void;

  // ─── Discover ───
  discoverCategory: string;          // matches DiscoverCategory
  discoverQuery: string;
  setDiscoverCategory: (cat: string) => void;
  setDiscoverQuery: (q: string) => void;
  joinedDiscoverServers: string[];   // server IDs joined from Discover
  joinDiscoverServer: (serverId: string) => void;

  // ─── Server settings ───
  serverSettingsTab: ServerSettingsTab;
  serverSettings: Record<string, {
    listedOnDiscover: boolean;
    allowInvites: boolean;
    requireApproval: boolean;
    tags: string[];
  }>;
  setServerSettingsTab: (tab: ServerSettingsTab) => void;
  toggleServerSetting: (serverId: string, key: "listedOnDiscover" | "allowInvites" | "requireApproval") => void;
  addServerTag: (serverId: string, tag: string) => void;
  removeServerTag: (serverId: string, tag: string) => void;
}

const ACCENTS = ["terracotta", "amber", "sage", "mauve"] as const;

let msgIdCounter = 1000;
const nextId = () => `m-${++msgIdCounter}`;

function now(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export const useRibbon = create<RibbonState>((set, get) => ({
  // Start at onboarding — every new visitor goes through the welcome flow first.
  // The splash screen is still reachable via the "Back" button on the onboarding view.
  view: "onboarding",
  params: {},
  hasEntered: false,
  justEnteredApp: false,
  navigate: (view, params = {}) => set({ view, params }),
  enterApp: () => set({ hasEntered: true, view: "dms", justEnteredApp: true }),
  clearJustEnteredApp: () => set({ justEnteredApp: false }),
  goBack: () =>
    set((s) => ({
      view: s.view === "profile"
        ? "dms"
        : s.view === "settings" || s.view === "server-settings"
          ? "dms"
          : s.view === "voice"
            ? s.activeServerId
              ? "chat"
              : "dms"
            : "dms",
    })),

  activeServerId: "art-collective",
  activeChannelId: "ac-gallery",
  activeDMId: "dm-maya",
  activeProfileUserId: "sol",
  activeSettingsTab: "profile",
  joinedVoice: false,
  muted: false,
  deafened: false,

  setActiveServer: (serverId) => {
    const state = get();
    // pick the first text channel of the new server
    const serverChannels = state.channelMessages
      ? Object.keys(state.channelMessages).filter((c) => c.startsWith(serverId.slice(0, 2)))
      : [];
    set({
      activeServerId: serverId,
      activeChannelId: serverChannels[0] ?? state.activeChannelId,
      view: "chat",
    });
  },
  setActiveChannel: (channelId) => set({ activeChannelId: channelId }),
  setActiveDM: (dmId) =>
    set((s) => ({
      activeDMId: dmId,
      dms: s.dms.map((d) => (d.id === dmId ? { ...d, unread: 0 } : d)),
    })),
  setActiveProfile: (userId) =>
    set({ activeProfileUserId: userId, view: "profile" }),

  // ─── Profile popup ───
  profilePopupUserId: null,
  openProfilePopup: (userId) => set({ profilePopupUserId: userId }),
  closeProfilePopup: () => set({ profilePopupUserId: null }),

  // ─── Biolink view ───
  biolinkUserId: null,
  openBiolink: (userId) => set({ biolinkUserId: userId }),
  closeBiolink: () => set({ biolinkUserId: null }),

  setActiveSettingsTab: (tab) => set({ activeSettingsTab: tab }),
  joinVoice: () => set({ joinedVoice: true, view: "voice" }),
  leaveVoice: () => set({ joinedVoice: false, muted: false, deafened: false }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  toggleDeafen: () => set((s) => ({ deafened: !s.deafened, muted: !s.deafened ? true : s.muted })),

  channelMessages: initialChannelMessages,
  sendMessage: (channelId, text) =>
    set((s) => {
      const newMsg: Message = {
        id: nextId(),
        authorId: CURRENT_USER_ID,
        timestamp: now(),
        isOwn: true,
        content: { kind: "text", text },
      };
      return {
        channelMessages: {
          ...s.channelMessages,
          [channelId]: [...(s.channelMessages[channelId] ?? []), newMsg],
        },
      };
    }),
  toggleReaction: (channelId, messageId, emoji) =>
    set((s) => {
      const msgs = s.channelMessages[channelId] ?? [];
      const updated = msgs.map((m) => {
        if (m.id !== messageId) return m;
        if (m.content.kind === "text-with-reactions") {
          const reactions = m.content.reactions.map((r) =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: r.reactedByMe ? r.count - 1 : r.count + 1,
                  reactedByMe: !r.reactedByMe,
                }
              : r
          );
          return { ...m, content: { ...m.content, reactions } };
        }
        if (m.content.kind === "full" && m.content.reactions) {
          const reactions = m.content.reactions.map((r) =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: r.reactedByMe ? r.count - 1 : r.count + 1,
                  reactedByMe: !r.reactedByMe,
                }
              : r
          );
          return { ...m, content: { ...m.content, reactions } };
        }
        return m;
      });
      return {
        channelMessages: { ...s.channelMessages, [channelId]: updated },
      };
    }),

  dms: initialDms,
  sendDM: (dmId, text) =>
    set((s) => {
      const newMsg: Message = {
        id: nextId(),
        authorId: CURRENT_USER_ID,
        timestamp: now(),
        isOwn: true,
        content: { kind: "text", text },
      };
      return {
        dms: s.dms.map((d) =>
          d.id === dmId
            ? { ...d, messages: [...d.messages, newMsg], lastMessageAt: "now" }
            : d
        ),
      };
    }),
  markDMRead: (dmId) =>
    set((s) => ({
      dms: s.dms.map((d) => (d.id === dmId ? { ...d, unread: 0 } : d)),
    })),

  friendIds: initialFriendIds,
  friendRequests: initialFriendRequests,
  acceptFriend: (requestId) =>
    set((s) => {
      const req = s.friendRequests.find((r) => r.id === requestId);
      if (!req) return s;
      return {
        friendIds: [...s.friendIds, req.userId],
        friendRequests: s.friendRequests.filter((r) => r.id !== requestId),
      };
    }),
  declineFriend: (requestId) =>
    set((s) => ({
      friendRequests: s.friendRequests.filter((r) => r.id !== requestId),
    })),
  removeFriend: (userId) =>
    set((s) => ({
      friendIds: s.friendIds.filter((id) => id !== userId),
    })),

  // ─── Current user (editable) ───
  currentUser: { ...mockUsers.you },
  updateCurrentUser: (updates) =>
    set((s) => ({ currentUser: { ...s.currentUser, ...updates } })),

  // ─── Biolink config (highly customizable) ───
  biolinkConfig: {
    displayName: "you",
    bio: "just here making things",
    tagline: "prey user",
    avatarUrl: "",
    verified: false,

    accentColor: "#E8769A",
    textColor: "#FFFFFF",
    secondaryTextColor: "#9499A2",
    cardBg: "rgba(30, 30, 30, 0.8)",
    pageBg: "#121212",

    fontFamily: "quicksand",
    fontSize: 14,
    borderRadius: 12,
    cardWidth: 380,

    glow: true,
    glowIntensity: 40,
    glassmorphism: true,
    blurAmount: 16,
    scanlines: false,
    grainTexture: false,
    particles: true,
    cardShadow: true,

    bgType: "gradient",
    bgGradientFrom: "#1A1B1E",
    bgGradientTo: "#0A0E17",
    bgGradientAngle: 135,
    bgImageUrl: "",
    bgVideoUrl: "",
    bgOpacity: 100,

    showViews: true,
    showLikes: false,
    showJoinDate: true,
    showOnlineStatus: true,

    showNowPlaying: true,
    trackName: "When You Sleep",
    artistName: "My Bloody Valentine",
    albumArtUrl: "",

    socialLinks: [
      { type: "instagram", label: "@you", url: "#" },
      { type: "twitter", label: "@you", url: "#" },
      { type: "github", label: "you-dev", url: "#" },
      { type: "website", label: "prey.lol/you", url: "#" },
    ],

    layoutStyle: "centered",
    showTopBar: true,
    linkStyle: "cards",
    cutsceneDirection: "vertical",
    customCss: "",
  } as BiolinkConfig,
  updateBiolinkConfig: (updates) =>
    set((s) => ({ biolinkConfig: { ...s.biolinkConfig, ...updates } })),
  resetBiolinkConfig: () =>
    set({
      biolinkConfig: {
        displayName: "you",
        bio: "just here making things",
        tagline: "prey user",
        avatarUrl: "",
        verified: false,
        accentColor: "#E8769A",
        textColor: "#FFFFFF",
        secondaryTextColor: "#9499A2",
        cardBg: "rgba(30, 30, 30, 0.8)",
        pageBg: "#121212",
        fontFamily: "quicksand",
        fontSize: 14,
        borderRadius: 12,
        cardWidth: 380,
        glow: true,
        glowIntensity: 40,
        glassmorphism: true,
        blurAmount: 16,
        scanlines: false,
        grainTexture: false,
        particles: true,
        cardShadow: true,
        bgType: "gradient",
        bgGradientFrom: "#1A1B1E",
        bgGradientTo: "#0A0E17",
        bgGradientAngle: 135,
        bgImageUrl: "",
    bgVideoUrl: "",
    bgOpacity: 100,
        showViews: true,
        showLikes: false,
        showJoinDate: true,
        showOnlineStatus: true,
        showNowPlaying: true,
        trackName: "When You Sleep",
        artistName: "My Bloody Valentine",
        albumArtUrl: "",
        socialLinks: [
          { type: "instagram", label: "@you", url: "#" },
          { type: "twitter", label: "@you", url: "#" },
          { type: "github", label: "you-dev", url: "#" },
          { type: "website", label: "prey.lol/you", url: "#" },
        ],
        layoutStyle: "centered",
        showTopBar: true,
        linkStyle: "cards",
    cutsceneDirection: "vertical",
    customCss: "",
      } as BiolinkConfig,
    }),

  settings: {
    reduceMotion: false,
    showOnlineStatus: true,
    dmNotifications: "all",
    soundEffects: true,
    voiceActivity: true,
    pushToTalkKey: "Space",
    accent: "terracotta",
  },
  updateSetting: (key, value) =>
    set((s) => ({ settings: { ...s.settings, [key]: value } })),

  // ─── Onboarding ───
  onboardingStep: 0,
  onboardingInterests: [],
  onboardingJoinedServers: [],
  onboardingUsername: "",
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  nextOnboardingStep: () =>
    set((s) => ({ onboardingStep: Math.min(s.onboardingStep + 1, 5) })),
  prevOnboardingStep: () =>
    set((s) => ({ onboardingStep: Math.max(s.onboardingStep - 1, 0) })),
  toggleOnboardingInterest: (id) =>
    set((s) => ({
      onboardingInterests: s.onboardingInterests.includes(id)
        ? s.onboardingInterests.filter((i) => i !== id)
        : [...s.onboardingInterests, id],
    })),
  toggleOnboardingServerJoin: (serverId) =>
    set((s) => ({
      onboardingJoinedServers: s.onboardingJoinedServers.includes(serverId)
        ? s.onboardingJoinedServers.filter((x) => x !== serverId)
        : [...s.onboardingJoinedServers, serverId],
    })),
  setOnboardingUsername: (username) => set({ onboardingUsername: username }),
  finishOnboarding: () => set({ onboardingStep: 5 }),

  // ─── Discover ───
  discoverCategory: "all",
  discoverQuery: "",
  setDiscoverCategory: (cat) => set({ discoverCategory: cat }),
  setDiscoverQuery: (q) => set({ discoverQuery: q }),
  joinedDiscoverServers: [],
  joinDiscoverServer: (serverId) =>
    set((s) => ({
      joinedDiscoverServers: s.joinedDiscoverServers.includes(serverId)
        ? s.joinedDiscoverServers
        : [...s.joinedDiscoverServers, serverId],
    })),

  // ─── Server settings ───
  serverSettingsTab: "overview",
  serverSettings: {
    "art-collective": {
      listedOnDiscover: true,
      allowInvites: true,
      requireApproval: false,
      tags: ["art", "design", "critique"],
    },
    "dead": {
      listedOnDiscover: false,
      allowInvites: true,
      requireApproval: true,
      tags: ["tech", "email"],
    },
    "gallery-space": {
      listedOnDiscover: true,
      allowInvites: true,
      requireApproval: false,
      tags: ["art", "gallery"],
    },
    "music-makers": {
      listedOnDiscover: true,
      allowInvites: true,
      requireApproval: false,
      tags: ["music", "production"],
    },
  },
  setServerSettingsTab: (tab) => set({ serverSettingsTab: tab }),
  toggleServerSetting: (serverId, key) =>
    set((s) => {
      const current = s.serverSettings[serverId] ?? {
        listedOnDiscover: false,
        allowInvites: false,
        requireApproval: false,
        tags: [],
      };
      return {
        serverSettings: {
          ...s.serverSettings,
          [serverId]: { ...current, [key]: !current[key] },
        },
      };
    }),
  addServerTag: (serverId, tag) =>
    set((s) => {
      const current = s.serverSettings[serverId] ?? {
        listedOnDiscover: false,
        allowInvites: false,
        requireApproval: false,
        tags: [],
      };
      if (current.tags.includes(tag)) return s;
      return {
        serverSettings: {
          ...s.serverSettings,
          [serverId]: { ...current, tags: [...current.tags, tag] },
        },
      };
    }),
  removeServerTag: (serverId, tag) =>
    set((s) => {
      const current = s.serverSettings[serverId] ?? {
        listedOnDiscover: false,
        allowInvites: false,
        requireApproval: false,
        tags: [],
      };
      return {
        serverSettings: {
          ...s.serverSettings,
          [serverId]: { ...current, tags: current.tags.filter((t) => t !== tag) },
        },
      };
    }),
}));

// ─── Helpers ─────────────────────────────────────────────────────

// Accent colors — grey + pink palette:
//   terracotta → pink #E8769A, amber → pink #E8769A, sage → grey #CCCCCC, mauve → deep pink #D4638A
export const ACCENT_HEX: Record<string, string> = {
  terracotta: "#E8769A",
  amber: "#E8769A",
  sage: "#CCCCCC",
  mauve: "#D4638A",
};

export const ACCENT_HEX_BRIGHT: Record<string, string> = {
  terracotta: "#F088AA",
  amber: "#F088AA",
  sage: "#E076A0",
  mauve: "#E076A0",
};

export function randomAccent(): typeof ACCENTS[number] {
  return ACCENTS[Math.floor(Math.random() * ACCENTS.length)];
}
