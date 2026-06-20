"use client";

import { useRibbon } from "@/lib/ribbon/store";
import { FloatingDock } from "./FloatingDock";
import { ProfilePopup } from "./ProfilePopup";
import { LandingView } from "./views/LandingView";
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
import { BiolinkView } from "./views/BiolinkView";

export function AppShell() {
  const view = useRibbon((s) => s.view);
  const hasEntered = useRibbon((s) => s.hasEntered);
  const profilePopupUserId = useRibbon((s) => s.profilePopupUserId);
  const biolinkUserId = useRibbon((s) => s.biolinkUserId);

  // Landing page — full-screen, no dock, no popups
  if (view === "landing") {
    return <LandingView />;
  }

  // Onboarding is full-screen, no dock
  if (view === "onboarding") {
    return (
      <>
        <OnboardingView />
        {profilePopupUserId && <ProfilePopup />}
        {biolinkUserId && <BiolinkView />}
      </>
    );
  }

  // Mobile is full-screen (has its own bottom tab bar)
  if (view === "mobile") {
    return (
      <>
        <div className="flex h-screen w-screen flex-col">
          <div className="flex-1 min-h-0">
            <MobileView />
          </div>
        </div>
        {profilePopupUserId && <ProfilePopup />}
        {biolinkUserId && <BiolinkView />}
      </>
    );
  }

  // Splash is full-screen (landing/onboarding/mobile are already handled above)
  if (view === "splash" || !hasEntered) {
    return (
      <>
        <SplashView />
        {profilePopupUserId && <ProfilePopup />}
        {biolinkUserId && <BiolinkView />}
      </>
    );
  }

  // Voice has its own full-screen layout
  if (view === "voice") {
    return (
      <>
        <div className="flex h-screen w-screen flex-col">
          <div className="flex-1 min-h-0">
            <VoiceView />
          </div>
          <FloatingDock />
        </div>
        {profilePopupUserId && <ProfilePopup />}
        {biolinkUserId && <BiolinkView />}
      </>
    );
  }

  // Profile is a full-screen overlay
  if (view === "profile") {
    return (
      <>
        <div className="flex h-screen w-screen flex-col">
          <div className="flex-1 min-h-0">
            <ProfileView />
          </div>
          <FloatingDock />
        </div>
        {profilePopupUserId && <ProfilePopup />}
        {biolinkUserId && <BiolinkView />}
      </>
    );
  }

  // All other views: content + floating dock
  return (
    <>
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
      {profilePopupUserId && <ProfilePopup />}
      {biolinkUserId && <BiolinkView />}
    </>
  );
}
