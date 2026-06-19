// ═════════════════════════════════════════════════════════════════
// Ribbon — Type definitions
// ═════════════════════════════════════════════════════════════════

export type UserStatus = "online" | "idle" | "dnd" | "offline";

export type AccentColor =
  | "terracotta" // #C4654A
  | "amber"      // #D4944C
  | "sage"       // #7BA87A
  | "mauve";     // #8B7FA0

export interface User {
  id: string;
  username: string;
  handle: string;          // ribbon.lol/{handle}
  avatarLetter: string;
  accent: AccentColor;
  status: UserStatus;
  customTag?: string;      // e.g. "digital alchemist"
  bio?: string;
  uid?: number;            // numeric UID
  socialLinks?: SocialLink[];
  nowPlaying?: { track: string; artist: string };
  pronouns?: string;
  location?: string;
  joinedAt?: string;       // ISO date
}

export interface SocialLink {
  type: "instagram" | "twitter" | "spotify" | "github" | "website" | "twitch" | "youtube";
  label: string;
  url: string;
}

export interface Server {
  id: string;
  name: string;
  letter: string;
  accent: AccentColor;
  description?: string;
  memberCount: number;
  onlineCount: number;
  isPublic: boolean;
  category?: string;
  tags?: string[];
  banner?: string;         // CSS gradient string
  joined?: boolean;
  channels?: Channel[];
  members?: ServerMember[];
}

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  topic?: string;
  unread?: number;
  mentions?: number;
  active?: boolean;
  voiceMembers?: string[]; // user IDs
}

export interface ServerMember {
  userId: string;
  role: "owner" | "admin" | "mod" | "member";
  nickname?: string;
}

export type MessageContent =
  | { kind: "text"; text: string }
  | { kind: "text-with-embed"; text: string; embed: EmbedPreview }
  | { kind: "text-with-files"; text: string; files: FileAttachment[] }
  | { kind: "text-with-reactions"; text: string; reactions: Reaction[] }
  | {
      kind: "full";
      text: string;
      embed?: EmbedPreview;
      files?: FileAttachment[];
      reactions?: Reaction[];
    };

export interface EmbedPreview {
  type: "profile" | "pinboard" | "playlist" | "file" | "link";
  title: string;
  subtitle?: string;
  banner?: string;          // CSS gradient for the top strip
  avatarLetter?: string;
  avatarAccent?: AccentColor;
  meta?: string;            // e.g. "digital artist · 3 boards · 12 links"
  tiles?: AccentColor[];    // for the small grid at the bottom of embeds
}

export interface FileAttachment {
  id: string;
  name: string;
  size: string;             // "14.2 MB"
  type: "zip" | "image" | "audio" | "video" | "doc" | "model" | "code";
  uploadedBy: string;       // user ID
  uploadedAt: string;       // ISO date
}

export interface Reaction {
  emoji: string;
  count: number;
  reactedByMe?: boolean;
  accent: AccentColor;
}

export interface Message {
  id: string;
  authorId: string;          // user ID — "you" for the current user
  timestamp: string;         // "5:42 PM" or ISO
  content: MessageContent;
  isOwn?: boolean;           // whether this is the current user's message
}

export interface DMConversation {
  id: string;
  otherUserId: string;
  messages: Message[];
  unread: number;
  lastMessageAt: string;
  pinned?: boolean;
}

export interface PinItem {
  id: string;
  ownerId: string;          // user whose pinboard this belongs to
  title: string;
  description?: string;
  gradient: string;         // CSS gradient
  pinnedAt: string;
  likes: number;
  comments: number;
  tag?: string;
}

export interface GuestbookEntry {
  id: string;
  authorId: string;
  ownerId: string;          // user whose guestbook this belongs to
  text: string;
  signedAt: string;
  color: AccentColor;
}

export interface ServerEvent {
  id: string;
  serverId: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  hostId: string;
  attendees: string[];      // user IDs
  going: boolean;
  category: "voice" | "stream" | "irl" | "release" | "critique";
}

export interface FriendRequest {
  id: string;
  userId: string;           // the other person
  direction: "incoming" | "outgoing";
  sentAt: string;
}

// ═════════════════════════════════════════════════════════════════
// View routing (single-page app — switch views via Zustand)
// ═════════════════════════════════════════════════════════════════

export type ViewId =
  | "splash"
  | "onboarding"
  | "dms"
  | "chat"
  | "mobile"
  | "profile"
  | "servers"
  | "discover"
  | "friends"
  | "settings"
  | "server-settings"
  | "pinboard"
  | "guestbook"
  | "voice"
  | "events"
  | "files";

export interface NavParams {
  // For "chat" — which server & channel
  serverId?: string;
  channelId?: string;
  // For "profile" / "pinboard" / "guestbook" — which user
  userId?: string;
  // For "settings" — which tab
  settingsTab?: string;
  // For "server-settings" — which server + which tab
  serverSettingsTab?: string;
}

// ═════════════════════════════════════════════════════════════════
// Onboarding
// ═════════════════════════════════════════════════════════════════

export type InterestId =
  | "gaming"
  | "art"
  | "music"
  | "code"
  | "creators"
  | "social";

export interface Interest {
  id: InterestId;
  label: string;
  accent: AccentColor;
  icon: "gamepad" | "palette" | "music" | "code" | "star" | "smile";
}

// ═════════════════════════════════════════════════════════════════
// Discover (extended)
// ═════════════════════════════════════════════════════════════════

export type DiscoverCategory =
  | "all"
  | "gaming"
  | "art"
  | "music"
  | "tech"
  | "social"
  | "creators"
  | "hangout";

// ═════════════════════════════════════════════════════════════════
// Server settings
// ═════════════════════════════════════════════════════════════════

export type ServerSettingsTab =
  | "overview"
  | "channels"
  | "roles"
  | "members"
  | "invites"
  | "moderation"
  | "bans";

export interface ServerSettings {
  listedOnDiscover: boolean;
  allowInvites: boolean;
  requireApproval: boolean;
  tags: string[];
}

