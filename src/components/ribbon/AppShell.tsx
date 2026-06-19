"use client";

import { useRibbon } from "@/lib/ribbon/store";
import { FloatingDock } from "./FloatingDock";
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
import { VoiceView } from "./views/VoiceView";

export function AppShell() {
  const view = useRibbon((s) => s.view);
  const hasEntered = useRibbon((s) => s.hasEntered);

  // Onboarding is full-screen, no dock
  if (view === "onboarding") {
    return <OnboardingView />;
  }

  // Mobile is full-screen (has its own bottom tab bar)
  if (view === "mobile") {
    return (
      <div className="flex h-screen w-screen flex-col">
        <div className="flex-1 min-h-0">
          <MobileView />
        </div>
      </div>
    );
  }

  // Splash is full-screen
  if (view === "splash" || (!hasEntered && view !== "mobile" && view !== "onboarding")) {
    return <SplashView />;
  }

  // Voice has its own full-screen layout
  if (view === "voice") {
    return (
      <div className="flex h-screen w-screen flex-col">
        <div className="flex-1 min-h-0">
          <VoiceView />
        </div>
        <FloatingDock />
      </div>
    );
  }

  // Profile is a full-screen overlay
  if (view === "profile") {
    return (
      <div className="flex h-screen w-screen flex-col">
        <div className="flex-1 min-h-0">
          <ProfileView />
        </div>
        <FloatingDock />
      </div>
    );
  }

  // All other views: content + floating dock
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
      </div>
      <FloatingDock />
    </div>
  );
}
