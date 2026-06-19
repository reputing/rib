"use client";

import { create } from "zustand";
import type {
  ViewId,
  NavParams,
  Message,
  DMConversation,
} from "./types";
import {
  dmConversations as initialDms,
  channelMessages as initialChannelMessages,
  friendIds as initialFriendIds,
  friendRequests as initialFriendRequests,
  CURRENT_USER_ID,
} from "./mock-data";

interface RibbonState {
  // ─── Navigation ───
  view: ViewId;
  params: NavParams;
  hasEntered: boolean;          // user clicked past the splash
  navigate: (view: ViewId, params?: NavParams) => void;
  enterApp: () => void;         // mark splash as dismissed
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

  // ─── Events ───
  eventRSVP: Record<string, boolean>;
  toggleRSVP: (eventId: string) => void;

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
  view: "splash",
  params: {},
  hasEntered: false,
  navigate: (view, params = {}) => set({ view, params }),
  enterApp: () => set({ hasEntered: true, view: "dms" }),
  goBack: () =>
    set((s) => ({
      view: s.view === "profile" || s.view === "pinboard" || s.view === "guestbook"
        ? "dms"
        : s.view === "settings"
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

  eventRSVP: { se1: true, se4: true },
  toggleRSVP: (eventId) =>
    set((s) => ({
      eventRSVP: { ...s.eventRSVP, [eventId]: !s.eventRSVP[eventId] },
    })),

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
}));

// ─── Helpers ─────────────────────────────────────────────────────

export const ACCENT_HEX: Record<string, string> = {
  terracotta: "#C4654A",
  amber: "#D4944C",
  sage: "#7BA87A",
  mauve: "#8B7FA0",
};

export const ACCENT_HEX_BRIGHT: Record<string, string> = {
  terracotta: "#B85544",
  amber: "#E0A65A",
  sage: "#8FC18E",
  mauve: "#A095B5",
};

export function randomAccent(): typeof ACCENTS[number] {
  return ACCENTS[Math.floor(Math.random() * ACCENTS.length)];
}
