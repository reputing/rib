// ═════════════════════════════════════════════════════════════════
// Ribbon — Type definitions
// ═════════════════════════════════════════════════════════════════

export type UserStatus = "online" | "idle" | "dnd" | "offline";

export type AccentColor =
  | "terracotta" // #E8769A (red)
  | "amber"      // #E8769A (yellow)
  | "sage"       // #CCCCCC (green)
  | "mauve";     // #D4638A (blue)

export interface User {
  id: string;
  username: string;
  handle: string;          // prey.lol/{handle}
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
  viewCount?: number;      // biolink views
  verified?: boolean;      // verification badge
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
  | "voice";

export interface NavParams {
  serverId?: string;
  channelId?: string;
  userId?: string;
  settingsTab?: string;
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

// ═════════════════════════════════════════════════════════════════
// Biolink customization config
// ═════════════════════════════════════════════════════════════════

export type BgType = "solid" | "gradient" | "image" | "video";
export type LayoutStyle = "centered" | "left" | "right";
export type LinkStyle = "cards" | "buttons" | "list";
export type FontFamily = "quicksand" | "inter" | "mono" | "serif" | "rounded";
export type CutsceneDirection = "vertical" | "horizontal" | "fade";

export interface BiolinkConfig {
  // ─── Profile ───
  displayName: string;
  bio: string;
  tagline: string;              // pill text under bio
  avatarUrl: string;            // empty = use letter avatar
  verified: boolean;

  // ─── Colors ───
  accentColor: string;          // name, interactive elements
  textColor: string;            // primary text
  secondaryTextColor: string;   // bio, handle
  cardBg: string;               // card background (can be rgba for glass)
  pageBg: string;               // page background

  // ─── Typography ───
  fontFamily: FontFamily;
  fontSize: number;             // base font size in px
  borderRadius: number;         // card corner radius in px
  cardWidth: number;            // card width in px

  // ─── Effects ───
  glow: boolean;
  glowIntensity: number;        // 0-100
  glassmorphism: boolean;
  blurAmount: number;           // 0-30 px
  scanlines: boolean;
  grainTexture: boolean;
  particles: boolean;
  cardShadow: boolean;

  // ─── Background ───
  bgType: BgType;
  bgGradientFrom: string;
  bgGradientTo: string;
  bgGradientAngle: number;      // 0-360
  bgImageUrl: string;
  bgVideoUrl: string;           // video background URL
  bgOpacity: number;             // 0-100 translucency of the background layer

  // ─── Badges ───
  showViews: boolean;
  showLikes: boolean;
  showJoinDate: boolean;
  showOnlineStatus: boolean;

  // ─── Music ───
  showNowPlaying: boolean;
  trackName: string;
  artistName: string;
  albumArtUrl: string;

  // ─── Social links ───
  socialLinks: SocialLink[];

  // ─── Layout ───
  layoutStyle: LayoutStyle;
  showTopBar: boolean;
  linkStyle: LinkStyle;
  cutsceneDirection: CutsceneDirection;  // opening animation direction
  customCss: string;                      // user's custom CSS injected into the biolink page
}

