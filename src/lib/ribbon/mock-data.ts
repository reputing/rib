import type {
  User,
  Server,
  Channel,
  Message,
  DMConversation,
  PinItem,
  GuestbookEntry,
  ServerEvent,
  FriendRequest,
  FileAttachment,
} from "./types";

// ═════════════════════════════════════════════════════════════════
// USERS
// ═════════════════════════════════════════════════════════════════

export const CURRENT_USER_ID = "you";

export const users: Record<string, User> = {
  you: {
    id: "you",
    username: "you",
    handle: "you",
    avatarLetter: "y",
    accent: "terracotta",
    status: "online",
    customTag: "ribbon user",
    bio: "just here making things",
    uid: 12846,
    socialLinks: [
      { type: "website", label: "ribbon.lol/you", url: "#" },
    ],
  },
  maya: {
    id: "maya",
    username: "maya",
    handle: "maya",
    avatarLetter: "m",
    accent: "terracotta",
    status: "online",
    customTag: "3d artist",
    bio: "making worlds out of polygons",
    uid: 12847,
    socialLinks: [
      { type: "instagram", label: "@maya.make", url: "#" },
      { type: "twitter", label: "@maya_draws", url: "#" },
    ],
    nowPlaying: { track: "Glue", artist: "Bibio" },
  },
  kai: {
    id: "kai",
    username: "kai",
    handle: "kai",
    avatarLetter: "k",
    accent: "amber",
    status: "online",
    customTag: "music producer",
    bio: "lo-fi forever",
    uid: 12901,
    socialLinks: [
      { type: "spotify", label: "Kai", url: "#" },
    ],
    nowPlaying: { track: "Snowman", artist: "Washed Out" },
  },
  lena: {
    id: "lena",
    username: "lena",
    handle: "lena",
    avatarLetter: "l",
    accent: "sage",
    status: "online",
    customTag: "photographer",
    bio: "shooting on 35mm",
    uid: 13044,
    socialLinks: [
      { type: "instagram", label: "@lena.frames", url: "#" },
    ],
  },
  river: {
    id: "river",
    username: "river",
    handle: "river",
    avatarLetter: "r",
    accent: "mauve",
    status: "online",
    customTag: "writer",
    bio: "novels, short stories, zines",
    uid: 13220,
    socialLinks: [
      { type: "website", label: "riverwrites.com", url: "#" },
    ],
  },
  sol: {
    id: "sol",
    username: "sol",
    handle: "sol",
    avatarLetter: "s",
    accent: "terracotta",
    status: "online",
    customTag: "digital alchemist",
    bio: "creating worlds that don't exist yet",
    uid: 12847,
    socialLinks: [
      { type: "instagram", label: "@sol.alchemy", url: "#" },
      { type: "twitter", label: "@sol_pixel", url: "#" },
      { type: "spotify", label: "sol's studio", url: "#" },
      { type: "github", label: "sol-dev", url: "#" },
      { type: "website", label: "ribbon.lol/sol", url: "#" },
    ],
    nowPlaying: { track: "When You Sleep", artist: "My Bloody Valentine" },
    pronouns: "they/them",
    location: "somewhere coastal",
    joinedAt: "2025-09-14",
  },
  elm: {
    id: "elm",
    username: "elm",
    handle: "elm",
    avatarLetter: "e",
    accent: "amber",
    status: "online",
    customTag: "sound designer",
    bio: "field recordings & synth pads",
    uid: 13112,
    socialLinks: [
      { type: "spotify", label: "elm", url: "#" },
      { type: "twitch", label: "elm_streams", url: "#" },
    ],
    nowPlaying: { track: "An Ending (Ascent)", artist: "Brian Eno" },
  },
  wren: {
    id: "wren",
    username: "wren",
    handle: "wren",
    avatarLetter: "w",
    accent: "sage",
    status: "online",
    customTag: "indie game dev",
    bio: "making cozy games in godot",
    uid: 12999,
    socialLinks: [
      { type: "twitter", label: "@wren_makes", url: "#" },
      { type: "github", label: "wren-dev", url: "#" },
    ],
  },
  // Offline / idle users for the friends list
  juno: {
    id: "juno",
    username: "juno",
    handle: "juno",
    avatarLetter: "j",
    accent: "mauve",
    status: "idle",
    customTag: "animator",
    bio: "frame by frame",
    uid: 13330,
  },
  ash: {
    id: "ash",
    username: "ash",
    handle: "ash",
    avatarLetter: "a",
    accent: "terracotta",
    status: "dnd",
    customTag: "creative coder",
    bio: "shaders all day",
    uid: 12778,
  },
  pax: {
    id: "pax",
    username: "pax",
    handle: "pax",
    avatarLetter: "p",
    accent: "amber",
    status: "offline",
    customTag: "comic artist",
    bio: "in the ink mines",
    uid: 12654,
  },
  noor: {
    id: "noor",
    username: "noor",
    handle: "noor",
    avatarLetter: "n",
    accent: "sage",
    status: "offline",
    customTag: "typographer",
    bio: "kerning since 2014",
    uid: 12988,
  },
  vega: {
    id: "vega",
    username: "vega",
    handle: "vega",
    avatarLetter: "v",
    accent: "mauve",
    status: "online",
    customTag: "vj",
    bio: "live visuals & projections",
    uid: 13456,
  },
};

export const userList = Object.values(users);

export function getUser(id: string): User {
  return users[id] ?? users.you;
}

// ═════════════════════════════════════════════════════════════════
// SERVERS
// ═════════════════════════════════════════════════════════════════

export const servers: Record<string, Server> = {
  "art-collective": {
    id: "art-collective",
    name: "Art Collective",
    letter: "A",
    accent: "terracotta",
    description: "share your latest work, get critique, find collabs",
    memberCount: 48,
    onlineCount: 12,
    isPublic: true,
    category: "Creative",
    tags: ["art", "design", " critique", "collab"],
    banner: "linear-gradient(135deg, #C4654A 0%, #D4944C 50%, #7BA87A 100%)",
    joined: true,
    channels: [
      { id: "ac-general", name: "general", type: "text", topic: "general chitchat" },
      { id: "ac-gallery", name: "gallery", type: "text", topic: "share your latest work", active: true },
      { id: "ac-critique", name: "critique", type: "text", topic: "constructive feedback only" },
      { id: "ac-inspiration", name: "inspiration", type: "text", topic: "mood boards & references", unread: 3 },
      { id: "ac-events", name: "events", type: "text", topic: "upcoming meetups & streams" },
      { id: "ac-studio", name: "studio", type: "voice", voiceMembers: ["elm", "wren"] },
    ],
    members: [
      { userId: "sol", role: "owner" },
      { userId: "wren", role: "admin" },
      { userId: "elm", role: "mod" },
      { userId: "maya", role: "member" },
      { userId: "kai", role: "member" },
      { userId: "lena", role: "member" },
      { userId: "river", role: "member" },
      { userId: "vega", role: "member" },
      { userId: "juno", role: "member" },
      { userId: "ash", role: "member" },
    ],
  },
  "dead": {
    id: "dead",
    name: "dead.onl",
    letter: "D",
    accent: "amber",
    description: "the email service for dead.onl — invite only",
    memberCount: 14,
    onlineCount: 3,
    isPublic: false,
    category: "Tech",
    banner: "linear-gradient(135deg, #D4944C 0%, #8B7FA0 100%)",
    joined: true,
    channels: [
      { id: "d-general", name: "general", type: "text", topic: "service status & chitchat" },
      { id: "d-incidents", name: "incidents", type: "text", topic: "post-mortems only" },
      { id: "d-ops", name: "ops", type: "voice" },
    ],
  },
  "gallery-space": {
    id: "gallery-space",
    name: "Gallery Space",
    letter: "G",
    accent: "sage",
    description: "curated drops, monthly shows, monthly themes",
    memberCount: 240,
    onlineCount: 38,
    isPublic: true,
    category: "Creative",
    banner: "linear-gradient(135deg, #7BA87A 0%, #C4654A 100%)",
    joined: true,
    channels: [
      { id: "g-general", name: "general", type: "text" },
      { id: "g-current-show", name: "current-show", type: "text", topic: "may: warm tones", unread: 7 },
      { id: "g-submissions", name: "submissions", type: "text" },
      { id: "g-voice", name: "lounge", type: "voice" },
    ],
  },
  "music-makers": {
    id: "music-makers",
    name: "Music Makers",
    letter: "M",
    accent: "mauve",
    description: "produce, share, remix. weekly beat battles.",
    memberCount: 312,
    onlineCount: 41,
    isPublic: true,
    category: "Music",
    banner: "linear-gradient(135deg, #8B7FA0 0%, #D4944C 100%)",
    joined: true,
    channels: [
      { id: "m-general", name: "general", type: "text", mentions: 2 },
      { id: "m-feedback", name: "feedback", type: "text" },
      { id: "m-collabs", name: "collabs", type: "text" },
      { id: "m-studio", name: "studio", type: "voice", voiceMembers: ["kai"] },
    ],
  },
};

export const serverList = Object.values(servers);

// Discoverable (not yet joined) servers
export const discoverableServers: Server[] = [
  {
    id: "lofi-lounge",
    name: "Lo-fi Lounge",
    letter: "L",
    accent: "mauve",
    description: "24/7 lo-fi stream + chill chat. beats to relax/study to.",
    memberCount: 1240,
    onlineCount: 312,
    isPublic: true,
    category: "Music",
    tags: ["lofi", "chill", "study", "beats"],
    banner: "linear-gradient(135deg, #8B7FA0 0%, #7BA87A 100%)",
  },
  {
    id: "pixel-pushers",
    name: "Pixel Pushers",
    letter: "P",
    accent: "terracotta",
    description: "pixel art, sprite animation, game art. daily challenges.",
    memberCount: 890,
    onlineCount: 124,
    isPublic: true,
    category: "Creative",
    tags: ["pixel art", "sprites", "games", "animation"],
    banner: "linear-gradient(135deg, #C4654A 0%, #8B7FA0 100%)",
  },
  {
    id: "code-cave",
    name: "Code Cave",
    letter: "C",
    accent: "sage",
    description: "creative coding, shaders, generative art, weird scripts.",
    memberCount: 567,
    onlineCount: 88,
    isPublic: true,
    category: "Tech",
    tags: ["code", "shaders", "generative", "webgl"],
    banner: "linear-gradient(135deg, #7BA87A 0%, #D4944C 100%)",
  },
  {
    id: "writers-block",
    name: "Writer's Block",
    letter: "W",
    accent: "amber",
    description: "for novelists, poets, screenwriters. weekly prompts & critique.",
    memberCount: 423,
    onlineCount: 47,
    isPublic: true,
    category: "Writing",
    tags: ["writing", "novels", "poetry", "critique"],
    banner: "linear-gradient(135deg, #D4944C 0%, #C4654A 100%)",
  },
  {
    id: "synth-wave",
    name: "Synth Wave",
    letter: "S",
    accent: "mauve",
    description: "synthwave producers & fans. retrowave, outrun, vapornoise.",
    memberCount: 678,
    onlineCount: 91,
    isPublic: true,
    category: "Music",
    tags: ["synthwave", "retrowave", "analog", "synths"],
    banner: "linear-gradient(135deg, #8B7FA0 0%, #C4654A 100%)",
  },
  {
    id: "photo-lab",
    name: "Photo Lab",
    letter: "P",
    accent: "sage",
    description: "film & digital photographers. weekly themes & critiques.",
    memberCount: 1102,
    onlineCount: 167,
    isPublic: true,
    category: "Creative",
    tags: ["photography", "film", "analog", "critique"],
    banner: "linear-gradient(135deg, #7BA87A 0%, #8B7FA0 100%)",
  },
];

export const featuredCollections = [
  {
    name: "Creative Spaces",
    description: "servers for makers, artists, and designers",
    accent: "terracotta" as const,
    serverIds: ["art-collective", "pixel-pushers", "photo-lab"],
  },
  {
    name: "Sound & Vision",
    description: "music producers, vjs, sound designers",
    accent: "mauve" as const,
    serverIds: ["music-makers", "lofi-lounge", "synth-wave"],
  },
  {
    name: "Quiet Corners",
    description: "small, invite-only, slow-paced communities",
    accent: "sage" as const,
    serverIds: ["dead", "writers-block"],
  },
];

// ═════════════════════════════════════════════════════════════════
// MESSAGES — Art Collective #gallery
// ═════════════════════════════════════════════════════════════════

export const galleryMessages: Message[] = [
  {
    id: "g1",
    authorId: "sol",
    timestamp: "6:20 PM",
    content: {
      kind: "text-with-embed",
      text: "just redesigned my bio page, thoughts?",
      embed: {
        type: "profile",
        title: "sol",
        subtitle: "digital alchemist",
        banner: "linear-gradient(135deg, #C4654A 0%, #D4944C 50%, #7BA87A 100%)",
        avatarLetter: "s",
        avatarAccent: "terracotta",
        meta: "digital artist · 3 boards · 12 links",
        tiles: ["terracotta", "sage", "amber"],
      },
    },
  },
  {
    id: "g2",
    authorId: "wren",
    timestamp: "6:21 PM",
    content: { kind: "text", text: "oh this is clean. love the pinboard section — the grid layout is perfect" },
  },
  {
    id: "g3",
    authorId: "sol",
    timestamp: "6:22 PM",
    content: {
      kind: "text-with-files",
      text: "ty!! took forever to get the grid right. also dropped some new files in the shared drive if anyone needs textures",
      files: [
        { id: "f1", name: "textures_v3.zip", size: "14.2 MB", type: "zip", uploadedBy: "sol", uploadedAt: "2026-06-18T18:22" },
        { id: "f2", name: "preview.png", size: "2.1 MB", type: "image", uploadedBy: "sol", uploadedAt: "2026-06-18T18:22" },
      ],
    },
  },
  {
    id: "g4",
    authorId: "elm",
    timestamp: "6:23 PM",
    content: { kind: "text", text: "the way you can embed playlists on your bio too. i added my studio playlist and people actually listen to it lol" },
  },
  {
    id: "g5",
    authorId: "wren",
    timestamp: "6:24 PM",
    content: {
      kind: "text-with-reactions",
      text: "ribbon really said \"we're not just a chat app\"",
      reactions: [
        { emoji: "🔥", count: 4, accent: "terracotta" },
        { emoji: "👌", count: 2, accent: "sage" },
      ],
    },
  },
  {
    id: "g6",
    authorId: "sol",
    timestamp: "6:25 PM",
    content: { kind: "text", text: "fr. also left something in your guestbook wren, go check it" },
  },
];

export const generalMessages: Message[] = [
  {
    id: "gen1",
    authorId: "maya",
    timestamp: "5:14 PM",
    content: { kind: "text", text: "anyone else having trouble with the studio voice channel today?" },
  },
  {
    id: "gen2",
    authorId: "wren",
    timestamp: "5:15 PM",
    content: { kind: "text", text: "yeah it was laggy earlier, seems fine now tho" },
  },
  {
    id: "gen3",
    authorId: "kai",
    timestamp: "5:18 PM",
    content: {
      kind: "text-with-reactions",
      text: "drop a beat i made last night if anyone wants to listen 🎧",
      reactions: [
        { emoji: "🔥", count: 5, accent: "terracotta" },
        { emoji: "❤️", count: 3, accent: "mauve" },
      ],
    },
  },
  {
    id: "gen4",
    authorId: "lena",
    timestamp: "5:30 PM",
    content: { kind: "text", text: "just got my film developed! will scan some tonight" },
  },
  {
    id: "gen5",
    authorId: "you",
    timestamp: "5:33 PM",
    isOwn: true,
    content: { kind: "text", text: "lena yes please drop them in #gallery when you do" },
  },
];

export const critiqueMessages: Message[] = [
  {
    id: "cr1",
    authorId: "river",
    timestamp: "4:02 PM",
    content: { kind: "text", text: "looking for feedback on this opening passage — feels off but i can't pin it down" },
  },
  {
    id: "cr2",
    authorId: "sol",
    timestamp: "4:15 PM",
    content: { kind: "text", text: "the second sentence is doing too much. break it up?" },
  },
  {
    id: "cr3",
    authorId: "river",
    timestamp: "4:17 PM",
    content: { kind: "text", text: "ugh yeah you're right. ty" },
  },
];

export const inspirationMessages: Message[] = [
  {
    id: "in1",
    authorId: "vega",
    timestamp: "3:45 PM",
    content: { kind: "text", text: "this color palette has been living in my head rent free" },
  },
  {
    id: "in2",
    authorId: "juno",
    timestamp: "3:50 PM",
    content: { kind: "text", text: "the way the warm tones bleed into the cool is *chef's kiss*" },
  },
  {
    id: "in3",
    authorId: "ash",
    timestamp: "4:00 PM",
    content: { kind: "text", text: "i made a shader based on this exact vibe, link in #general" },
  },
];

export const eventsChannelMessages: Message[] = [
  {
    id: "ev1",
    authorId: "sol",
    timestamp: "2:00 PM",
    content: { kind: "text", text: "📅 Studio collab session this Saturday — voice call in #studio, bring your WIPs" },
  },
  {
    id: "ev2",
    authorId: "maya",
    timestamp: "2:05 PM",
    content: { kind: "text", text: "in! i'll bring my texture pack" },
  },
  {
    id: "ev3",
    authorId: "wren",
    timestamp: "2:12 PM",
    content: { kind: "text", text: "counting on it 🙏" },
  },
];

export const channelMessages: Record<string, Message[]> = {
  "ac-general": generalMessages,
  "ac-gallery": galleryMessages,
  "ac-critique": critiqueMessages,
  "ac-inspiration": inspirationMessages,
  "ac-events": eventsChannelMessages,
};

// ═════════════════════════════════════════════════════════════════
// DM CONVERSATIONS
// ═════════════════════════════════════════════════════════════════

export const dmConversations: DMConversation[] = [
  {
    id: "dm-maya",
    otherUserId: "maya",
    unread: 1,
    lastMessageAt: "2m",
    pinned: true,
    messages: [
      { id: "dm-m-1", authorId: "maya", timestamp: "5:42 PM", content: { kind: "text", text: "omg you need to see what sol just posted on their pinboard" } },
      { id: "dm-m-2", authorId: "you", timestamp: "5:43 PM", isOwn: true, content: { kind: "text", text: "just saw it!! the new texture pack is insane" } },
      { id: "dm-m-3", authorId: "maya", timestamp: "5:43 PM", content: { kind: "text", text: "right?? i already downloaded it from the files section" } },
      { id: "dm-m-4", authorId: "you", timestamp: "5:44 PM", isOwn: true, content: { kind: "text", text: "we should do a collab and post it to the gallery" } },
      { id: "dm-m-5", authorId: "maya", timestamp: "5:44 PM", content: { kind: "text", text: "yesss are you free this weekend?" } },
      { id: "dm-m-6", authorId: "you", timestamp: "5:45 PM", isOwn: true, content: { kind: "text", text: "saturday works! voice call in studio?" } },
      { id: "dm-m-7", authorId: "maya", timestamp: "5:46 PM", content: { kind: "text", text: "perfect i'll set up an event for it" } },
    ],
  },
  {
    id: "dm-kai",
    otherUserId: "kai",
    unread: 0,
    lastMessageAt: "15m",
    messages: [
      { id: "dm-k-1", authorId: "kai", timestamp: "5:30 PM", content: { kind: "text", text: "you free to listen to a rough mix later?" } },
      { id: "dm-k-2", authorId: "you", timestamp: "5:32 PM", isOwn: true, content: { kind: "text", text: "yeah send it whenever" } },
      { id: "dm-k-3", authorId: "kai", timestamp: "5:33 PM", content: { kind: "text", text: "yeah that works for me" } },
    ],
  },
  {
    id: "dm-lena",
    otherUserId: "lena",
    unread: 0,
    lastMessageAt: "1h",
    messages: [
      { id: "dm-l-1", authorId: "lena", timestamp: "4:40 PM", content: { kind: "text", text: "gallery walk saturday?" } },
      { id: "dm-l-2", authorId: "you", timestamp: "4:45 PM", isOwn: true, content: { kind: "text", text: "absolutely" } },
      { id: "dm-l-3", authorId: "lena", timestamp: "4:46 PM", content: { kind: "text", text: "see you there!" } },
    ],
  },
  {
    id: "dm-river",
    otherUserId: "river",
    unread: 0,
    lastMessageAt: "3h",
    messages: [
      { id: "dm-r-1", authorId: "river", timestamp: "2:50 PM", content: { kind: "text", text: "left you a voice note on the new chapter" } },
    ],
  },
  {
    id: "dm-sol",
    otherUserId: "sol",
    unread: 0,
    lastMessageAt: "5h",
    messages: [
      { id: "dm-s-1", authorId: "sol", timestamp: "12:30 PM", content: { kind: "text", text: "thanks for the guestbook note!!" } },
      { id: "dm-s-2", authorId: "you", timestamp: "12:45 PM", isOwn: true, content: { kind: "text", text: "ofc, your work has been incredible lately" } },
    ],
  },
  {
    id: "dm-elm",
    otherUserId: "elm",
    unread: 0,
    lastMessageAt: "1d",
    messages: [
      { id: "dm-e-1", authorId: "elm", timestamp: "Yesterday", content: { kind: "text", text: "that playlist was fire btw" } },
    ],
  },
];

// ═════════════════════════════════════════════════════════════════
// FRIEND REQUESTS
// ═════════════════════════════════════════════════════════════════

export const friendRequests: FriendRequest[] = [
  { id: "fr-1", userId: "vega", direction: "incoming", sentAt: "1h ago" },
  { id: "fr-2", userId: "juno", direction: "incoming", sentAt: "3h ago" },
  { id: "fr-3", userId: "pax", direction: "outgoing", sentAt: "2d ago" },
];

export const friendIds: string[] = [
  "maya", "kai", "lena", "river", "sol", "elm", "wren", "juno", "ash", "vega",
];

// ═════════════════════════════════════════════════════════════════
// PINBOARD ITEMS (per user)
// ═════════════════════════════════════════════════════════════════

export const pinboardItems: PinItem[] = [
  {
    id: "p1", ownerId: "sol", title: "texture pack v3",
    description: "rust, paper, and noise overlays",
    gradient: "linear-gradient(135deg, #C4654A 0%, #2A2118 100%)",
    pinnedAt: "2d ago", likes: 12, comments: 3, tag: "textures",
  },
  {
    id: "p2", ownerId: "sol", title: "color study — coastal",
    gradient: "linear-gradient(135deg, #7BA87A 0%, #D4944C 100%)",
    pinnedAt: "5d ago", likes: 18, comments: 2, tag: "color",
  },
  {
    id: "p3", ownerId: "sol", title: "low-poly island",
    description: "test render for the next collab",
    gradient: "linear-gradient(135deg, #8B7FA0 0%, #C4654A 100%)",
    pinnedAt: "1w ago", likes: 24, comments: 5, tag: "3d",
  },
  {
    id: "p4", ownerId: "sol", title: "biomass gradient",
    gradient: "linear-gradient(135deg, #D4944C 0%, #7BA87A 50%, #8B7FA0 100%)",
    pinnedAt: "1w ago", likes: 9, comments: 1, tag: "gradient",
  },
  {
    id: "p5", ownerId: "sol", title: "molten type",
    description: "experiment with crt distortion",
    gradient: "linear-gradient(135deg, #B85544 0%, #131010 100%)",
    pinnedAt: "2w ago", likes: 31, comments: 7, tag: "type",
  },
  {
    id: "p6", ownerId: "sol", title: "field recording — waves",
    gradient: "linear-gradient(135deg, #7BA87A 0%, #211D17 100%)",
    pinnedAt: "2w ago", likes: 6, comments: 0, tag: "audio",
  },
  {
    id: "p7", ownerId: "sol", title: "studio setup 2026",
    gradient: "linear-gradient(135deg, #C4654A 0%, #D4944C 50%, #211D17 100%)",
    pinnedAt: "3w ago", likes: 14, comments: 4, tag: "studio",
  },
  {
    id: "p8", ownerId: "sol", title: "chromatic aberration test",
    gradient: "linear-gradient(135deg, #8B7FA0 0%, #C4654A 50%, #7BA87A 100%)",
    pinnedAt: "3w ago", likes: 22, comments: 3, tag: "fx",
  },
  // Maya's pinboard
  {
    id: "p9", ownerId: "maya", title: "sculpt — desert god",
    gradient: "linear-gradient(135deg, #C4654A 0%, #8B7FA0 100%)",
    pinnedAt: "4d ago", likes: 17, comments: 2, tag: "3d",
  },
  {
    id: "p10", ownerId: "maya", title: "topology study",
    gradient: "linear-gradient(135deg, #D4944C 0%, #211D17 100%)",
    pinnedAt: "1w ago", likes: 11, comments: 1, tag: "3d",
  },
  {
    id: "p11", ownerId: "maya", title: "hair shader wip",
    gradient: "linear-gradient(135deg, #7BA87A 0%, #C4654A 100%)",
    pinnedAt: "2w ago", likes: 8, comments: 0, tag: "shader",
  },
];

// ═════════════════════════════════════════════════════════════════
// GUESTBOOK ENTRIES (per user)
// ═════════════════════════════════════════════════════════════════

export const guestbookEntries: GuestbookEntry[] = [
  {
    id: "gb1", authorId: "wren", ownerId: "sol",
    text: "sol's work keeps getting better. that texture pack is unreal 🔥",
    signedAt: "2h ago", color: "sage",
  },
  {
    id: "gb2", authorId: "maya", ownerId: "sol",
    text: "you taught me everything i know about color. thank you for being you",
    signedAt: "1d ago", color: "terracotta",
  },
  {
    id: "gb3", authorId: "elm", ownerId: "sol",
    text: "the studio collab changed my whole approach to sound. forever grateful",
    signedAt: "3d ago", color: "amber",
  },
  {
    id: "gb4", authorId: "you", ownerId: "sol",
    text: "your bio redesign inspired me to redo mine. legends only",
    signedAt: "5d ago", color: "terracotta",
  },
  {
    id: "gb5", authorId: "river", ownerId: "sol",
    text: "you make me want to be a better writer. also love the new banner.",
    signedAt: "1w ago", color: "mauve",
  },
  {
    id: "gb6", authorId: "kai", ownerId: "sol",
    text: "drop the chromatic aberration preset when?? fr the best in the game",
    signedAt: "2w ago", color: "amber",
  },
];

// ═════════════════════════════════════════════════════════════════
// EVENTS
// ═════════════════════════════════════════════════════════════════

export const serverEvents: ServerEvent[] = [
  {
    id: "se1", serverId: "art-collective",
    title: "Studio collab session",
    description: "Bring your WIPs. Voice call in #studio. We'll do shared screen critiques and a 90-min collab sprint at the end.",
    startsAt: "Sat Jun 21 · 4:00 PM",
    endsAt: "Sat Jun 21 · 7:00 PM",
    hostId: "sol",
    attendees: ["sol", "maya", "wren", "you", "elm"],
    going: true,
    category: "voice",
  },
  {
    id: "se2", serverId: "art-collective",
    title: "Critique night — May drops",
    description: "Bring 1-3 pieces from this month. We'll do timed critiques in #critique + voice.",
    startsAt: "Wed Jun 25 · 8:00 PM",
    endsAt: "Wed Jun 25 · 10:00 PM",
    hostId: "wren",
    attendees: ["wren", "lena", "river"],
    going: false,
    category: "critique",
  },
  {
    id: "se3", serverId: "art-collective",
    title: "Gallery walk — downtown",
    description: "IRL meetup. 3 galleries in one night, dinner after. DM sol for the route.",
    startsAt: "Sat Jun 28 · 6:00 PM",
    hostId: "lena",
    attendees: ["lena", "sol", "kai"],
    going: false,
    category: "irl",
  },
  {
    id: "se4", serverId: "art-collective",
    title: "Texture pack v4 release stream",
    description: "sol is going live to walk through the new texture pack + answer questions.",
    startsAt: "Sun Jun 29 · 3:00 PM",
    endsAt: "Sun Jun 29 · 4:30 PM",
    hostId: "sol",
    attendees: ["sol", "maya", "elm", "vega"],
    going: true,
    category: "stream",
  },
];

// ═════════════════════════════════════════════════════════════════
// SHARED FILES (per server)
// ═════════════════════════════════════════════════════════════════

export const serverFiles: FileAttachment[] = [
  { id: "sf1", name: "textures_v3.zip", size: "14.2 MB", type: "zip", uploadedBy: "sol", uploadedAt: "2026-06-18T18:22" },
  { id: "sf2", name: "preview.png", size: "2.1 MB", type: "image", uploadedBy: "sol", uploadedAt: "2026-06-18T18:22" },
  { id: "sf3", name: "studio_ambience.wav", size: "48.7 MB", type: "audio", uploadedBy: "elm", uploadedAt: "2026-06-17T14:30" },
  { id: "sf4", name: "moodboard.fig", size: "8.4 MB", type: "doc", uploadedBy: "maya", uploadedAt: "2026-06-16T11:00" },
  { id: "sf5", name: "color_palette.pdf", size: "1.2 MB", type: "doc", uploadedBy: "sol", uploadedAt: "2026-06-15T09:00" },
  { id: "sf6", name: "island_test.glb", size: "32.6 MB", type: "model", uploadedBy: "sol", uploadedAt: "2026-06-14T16:45" },
  { id: "sf7", name: "shader_water.glsl", size: "12 KB", type: "code", uploadedBy: "ash", uploadedAt: "2026-06-13T22:10" },
  { id: "sf8", name: "studio_tour.mp4", size: "187.3 MB", type: "video", uploadedBy: "wren", uploadedAt: "2026-06-12T20:00" },
  { id: "sf9", name: "contact_sheet.jpg", size: "5.4 MB", type: "image", uploadedBy: "lena", uploadedAt: "2026-06-11T15:30" },
];

// ═════════════════════════════════════════════════════════════════
// NAV DOCK ITEMS
// ═════════════════════════════════════════════════════════════════

export const dockServerIds = ["art-collective", "dead", "gallery-space", "music-makers"];
