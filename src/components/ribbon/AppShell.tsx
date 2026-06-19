"use client";

import { useRibbon } from "@/lib/ribbon/store";
import { BottomDock } from "./BottomDock";
import { SplashView } from "./views/SplashView";
import { OnboardingView } from "./views/OnboardingView";
import { DMsView } from "./views/DMsView";
import { ChatView } from "./views/ChatView";
import { MobileView } from "./views/MobileView";
import { ProfileView } from "./views/ProfileView";
import { ServersListView } from "./views/ServersListView";
import { DiscoverView } from "./views/DiscoverView";
import { FriendsView } from "./views/FriendsView";
import { SettingsView } from "./views/SettingsView";
import { ServerSettingsView } from "./views/ServerSettingsView";
import { PinboardView } from "./views/PinboardView";
import { GuestbookView } from "./views/GuestbookView";
import { VoiceView } from "./views/VoiceView";
import { EventsView } from "./views/EventsView";
import { FilesView } from "./views/FilesView";

export function AppShell() {
  const view = useRibbon((s) => s.view);
  const hasEntered = useRibbon((s) => s.hasEntered);

  // Onboarding + Mobile + Splash are full-screen, no bottom dock, and accessible
  // from the splash screen BEFORE the user has "entered" the app.
  if (view === "onboarding") {
    return <OnboardingView />;
  }

  if (view === "mobile") {
    return (
      <div className="flex h-screen w-screen flex-col">
        <div className="flex-1 min-h-0">
          <MobileView />
        </div>
      </div>
    );
  }

  if (view === "splash" || (!hasEntered && view !== "mobile" && view !== "onboarding")) {
    return <SplashView />;
  }

  // Voice has its own full-screen layout with sidebar + controls
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
        {view === "server-settings" && <ServerSettingsView />}
        {view === "pinboard" && <PinboardView />}
        {view === "guestbook" && <GuestbookView />}
        {view === "events" && <EventsView />}
        {view === "files" && <FilesView />}
      </div>
      <BottomDock />
    </div>
  );
}
