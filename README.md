# ribbon

> chat for digital alchemists

A niche Discord-style chat app for creative communities. Warm dark terracotta aesthetic, built with Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui.

## ✨ Features

- **Splash entry** — click-to-enter breathing avatar with ring pulses, particles, and glitch username
- **Direct Messages** — conversation list with online row, search, message bubbles (left/right aligned), typing indicator
- **Server Chat** — channels (text + voice), voice channel members, message cards with embeds, file attachments, and reactions
- **Member list** — right sidebar grouped by role (owner/admin/mod/member) and online status
- **Profile** — full-screen click-to-enter splash with avatar, UID, custom tag, bio, pronouns, location, social links, now-playing widget, add friend / message / guestbook actions
- **Pinboard** — grid of pinned visual items (textures, color studies, etc.) per user, with like/comment counts
- **Guestbook** — visitors leave signed entries on your profile
- **Friends** — online/offline friends list, incoming/outgoing friend requests, add friend
- **Servers list** — grid of joined servers with banners and member counts
- **Discover** — featured collections + trending public servers, search, join/open
- **Events** — upcoming events with host, attendees, RSVP, categories (voice/stream/irl/release/critique)
- **Files** — shared files browser with list/grid toggle, type filter, search
- **Voice** — voice channel UI with participant tiles, mute/deafen/share/disconnect controls, speaking indicators, channel info (ping, bitrate, duration)
- **Settings** — tabs for Profile, Appearance (accent color, reduce motion), Notifications, Audio (voice activity, push-to-talk, volumes), Privacy

## 🎨 Design System

The exact palette from the original HTML mockups:

| Token | Hex |
|---|---|
| Background | `#131010` |
| Sidebar | `#1A1612` |
| Card / elevated | `#211D17` |
| Hover | `#2A2118` |
| Text primary | `#EDE5D8` |
| Text dim | `#A89A88` |
| Text muted | `#736757` |
| Text faint | `#5C5045` |
| Text ghost | `#4A4038` |
| Terracotta (primary) | `#C4654A` |
| Rust | `#B85544` |
| Amber | `#D4944C` |
| Sage (online) | `#7BA87A` |
| Mauve | `#8B7FA0` |

Font: **Quicksand** (400/500/600/700).

## 🛠 Tech Stack

- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui (New York style)
- Zustand (client state)
- Lucide React (icons)
- Framer Motion (available)

## 🚀 Run locally

```bash
bun install
bun run dev
```

Open http://localhost:3000 — you'll see the splash screen. Click to enter.

> **Windows users:** if `bun install` fails with `ENOSPC`, your disk is full OR bun's cache is corrupted. Fix with:
> ```powershell
> # 1. Check disk space
> Get-PSDrive C | Select-Object Used,Free
>
> # 2. Clear bun cache
> bun pm cache rm
>
> # 3. Delete the broken node_modules and lockfile, then retry
> Remove-Item -Recurse -Force node_modules
> Remove-Item -Force bun.lock
> bun install
> ```
>
> If bun still struggles, fall back to npm:
> ```powershell
> Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
> npm install
> npx next dev -p 3000
> ```

## 📁 Structure

```
src/
├── app/
│   ├── globals.css         # Ribbon palette + animations
│   ├── layout.tsx          # Quicksand font, dark mode
│   └── page.tsx            # Renders <AppShell />
├── components/
│   └── ribbon/
│       ├── AppShell.tsx     # View router
│       ├── BottomDock.tsx   # Universal bottom navigation
│       ├── Avatar.tsx       # Avatar + status dot + accent helpers
│       ├── ChannelItem.tsx  # Sidebar channel + voice channel + server selector
│       ├── ConversationItem.tsx
│       ├── EmbedPreview.tsx # Embedded profile/pinboard preview
│       ├── FileAttachment.tsx
│       ├── MemberItem.tsx   # MemberRow + OnlineRow
│       ├── MessageBubble.tsx # DM-style bubble
│       ├── MessageCard.tsx   # Channel-style message card
│       ├── MessageInput.tsx
│       ├── Reaction.tsx
│       ├── Shared.tsx        # DateDivider, SearchBar, SectionLabel
│       ├── TypingIndicator.tsx
│       ├── UserCard.tsx
│       └── views/
│           ├── SplashView.tsx
│           ├── DMsView.tsx
│           ├── ChatView.tsx
│           ├── ProfileView.tsx
│           ├── ServersListView.tsx
│           ├── DiscoverView.tsx
│           ├── FriendsView.tsx
│           ├── SettingsView.tsx
│           ├── PinboardView.tsx
│           ├── GuestbookView.tsx
│           ├── VoiceView.tsx
│           ├── EventsView.tsx
│           └── FilesView.tsx
└── lib/
    └── ribbon/
        ├── types.ts         # All TypeScript types
        ├── mock-data.ts     # Users, servers, channels, messages, DMs, etc.
        └── store.ts         # Zustand store (view routing, messages, friends, settings)
```

## 🎯 State management

Single Zustand store (`useRibbon`) handles:
- View navigation (`view`, `params`, `navigate()`)
- Splash → app transition (`hasEntered`, `enterApp()`)
- Active server / channel / DM / profile / settings tab
- Voice state (joined, muted, deafened)
- Channel messages (send, toggle reaction)
- DMs (send, mark read)
- Friends (accept, decline, remove)
- Event RSVPs
- User settings (reduce motion, accent color, audio, privacy, etc.)

## 📝 Notes

- All data is mock data — reload resets state. No backend.
- The bottom dock is the universal navigation — home (ribbon r), DMs, servers (A/D/G/M), discover, add, pinboard, guestbook, files, friends, voice.
- The original 3 HTML mockups (DMs, Profile, Chat) are faithfully reproduced and extended with 10 additional working screens.

## 📜 License

MIT
