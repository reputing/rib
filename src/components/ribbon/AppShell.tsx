"use client";

import { useRibbon } from "@/lib/ribbon/store";
import { BottomDock } from "./BottomDock";
import { SplashView } from "./views/SplashView";
import { DMsView } from "./views/DMsView";
import { ChatView } from "./views/ChatView";
import { ProfileView } from "./views/ProfileView";
import { ServersListView } from "./views/ServersListView";
import { DiscoverView } from "./views/DiscoverView";
import { FriendsView } from "./views/FriendsView";
import { SettingsView } from "./views/SettingsView";
import { PinboardView } from "./views/PinboardView";
import { GuestbookView } from "./views/GuestbookView";
import { VoiceView } from "./views/VoiceView";
import { EventsView } from "./views/EventsView";
import { FilesView } from "./views/FilesView";

export function AppShell() {
  const view = useRibbon((s) => s.view);
  const hasEntered = useRibbon((s) => s.hasEntered);

  // Splash is full-screen, no bottom dock
  if (view === "splash" || !hasEntered) {
    return <SplashView />;
  }

  // Voice and Profile are also full-screen (no bottom dock — they have their own controls)
  if (view === "voice") {
    return (
      <div className="flex h-screen w-screen flex-col">
        <div className="flex-1 min-h-0">
          <VoiceView />
        </div>
        <BottomDock />
      </div>
    );
  }

  // Profile is a full-screen overlay (click-to-enter splash style)
  if (view === "profile") {
    return (
      <div className="flex h-screen w-screen flex-col">
        <div className="flex-1 min-h-0">
          <ProfileView />
        </div>
        <BottomDock />
      </div>
    );
  }

  // All other views: top content + bottom dock
  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex-1 min-h-0">
        {view === "dms" && <DMsView />}
        {view === "chat" && <ChatView />}
        {view === "servers" && <ServersListView />}
        {view === "discover" && <DiscoverView />}
        {view === "friends" && <FriendsView />}
        {view === "settings" && <SettingsView />}
        {view === "pinboard" && <PinboardView />}
        {view === "guestbook" && <GuestbookView />}
        {view === "events" && <EventsView />}
        {view === "files" && <FilesView />}
      </div>
      <BottomDock />
    </div>
  );
}
