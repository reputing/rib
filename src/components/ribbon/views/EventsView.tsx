"use client";

import { ArrowLeft, Calendar, Clock, Users, MapPin, Mic, Video, Star, MessageSquare } from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";
import { serverEvents, getUser, servers } from "@/lib/ribbon/mock-data";
import { Avatar, ACCENT_HEX } from "../Avatar";
import { SectionLabel } from "../Shared";
import type { ServerEvent } from "@/lib/ribbon/types";

const CATEGORY_CONFIG = {
  voice: { label: "voice", icon: Mic, color: "sage" as const },
  stream: { label: "stream", icon: Video, color: "mauve" as const },
  irl: { label: "irl", icon: MapPin, color: "amber" as const },
  release: { label: "release", icon: Star, color: "terracotta" as const },
  critique: { label: "critique", icon: MessageSquare, color: "terracotta" as const },
};

export function EventsView() {
  const { navigate, activeServerId, eventRSVP, toggleRSVP } = useRibbon();
  const server = servers[activeServerId];
  const events = serverEvents;

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{ background: "var(--color-ribbon-bg)", color: "var(--color-ribbon-text)" }}
    >
      {/* Header */}
      <div
        className="flex h-[52px] flex-none items-center px-5 border-b"
        style={{ borderColor: "var(--color-ribbon-border)" }}
      >
        <button
          onClick={() => navigate("chat")}
          className="mr-3 flex-none cursor-pointer"
          title="Back"
        >
          <ArrowLeft size={16} strokeWidth={2} style={{ color: "var(--color-ribbon-text-faint)" }} />
        </button>
        <Calendar size={16} style={{ color: "var(--color-ribbon-terracotta)" }} />
        <div className="ml-2 text-[15px] font-bold">Events</div>
        {server && (
          <span
            className="ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              background: "rgba(196, 101, 74, 0.08)",
              color: "var(--color-ribbon-terracotta)",
            }}
          >
            {server.name}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <SectionLabel>Upcoming — {events.length}</SectionLabel>
        <div className="space-y-3">
          {events.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              going={eventRSVP[e.id] ?? e.going}
              onRSVP={() => toggleRSVP(e.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EventCard({
  event,
  going,
  onRSVP,
}: {
  event: ServerEvent;
  going: boolean;
  onRSVP: () => void;
}) {
  const host = getUser(event.hostId);
  const cfg = CATEGORY_CONFIG[event.category];
  const Icon = cfg.icon;
  const accentColor = ACCENT_HEX[cfg.color];

  return (
    <div
      className="rounded-[14px] border p-4"
      style={{
        background: "#1A1612",
        borderColor: "var(--color-ribbon-border)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Date tile */}
        <div
          className="flex h-14 w-14 flex-none flex-col items-center justify-center rounded-[12px] border"
          style={{
            background: `${accentColor}1A`,
            borderColor: `${accentColor}26`,
          }}
        >
          <Calendar size={14} strokeWidth={2.5} style={{ color: accentColor }} />
          <div
            className="mt-0.5 text-[9px] font-semibold uppercase"
            style={{ color: accentColor }}
          >
            {event.startsAt.split(" · ")[0].split(" ").slice(0, 2).join(" ")}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="text-[14px] font-semibold">{event.title}</div>
              <div
                className="mt-0.5 text-[11px]"
                style={{ color: "var(--color-ribbon-text-faint)" }}
              >
                {event.description}
              </div>
            </div>
            <span
              className="flex flex-none items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase"
              style={{
                background: `${accentColor}1A`,
                color: accentColor,
              }}
            >
              <Icon size={9} strokeWidth={2.5} />
              {cfg.label}
            </span>
          </div>

          {/* Time row */}
          <div
            className="mt-2 flex flex-wrap items-center gap-3 text-[10px]"
            style={{ color: "var(--color-ribbon-text-muted)" }}
          >
            <span className="flex items-center gap-1">
              <Clock size={10} strokeWidth={2.5} />
              {event.startsAt.split(" · ")[1] ?? event.startsAt}
              {event.endsAt && ` → ${event.endsAt.split(" · ")[1] ?? event.endsAt}`}
            </span>
            <span className="flex items-center gap-1">
              <Users size={10} strokeWidth={2.5} />
              {event.attendees.length} attending
            </span>
            <button
              className="flex cursor-pointer items-center gap-1"
              style={{ color: "var(--color-ribbon-text-dim)" }}
            >
              <Avatar
                letter={host.avatarLetter}
                accent={host.accent}
                size={14}
                radius={5}
              />
              hosted by {host.username}
            </button>
          </div>

          {/* Attendees + RSVP */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center">
              {event.attendees.slice(0, 5).map((uid, i) => {
                const u = getUser(uid);
                return (
                  <div
                    key={uid}
                    style={{
                      marginLeft: i === 0 ? 0 : -8,
                      zIndex: 5 - i,
                    }}
                  >
                    <Avatar
                      letter={u.avatarLetter}
                      accent={u.accent}
                      size={24}
                      radius={8}
                      ring
                    />
                  </div>
                );
              })}
              {event.attendees.length > 5 && (
                <div
                  className="ml-2 flex h-6 items-center rounded-md px-1.5 text-[10px] font-semibold"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "var(--color-ribbon-text-dim)",
                  }}
                >
                  +{event.attendees.length - 5}
                </div>
              )}
            </div>
            <button
              onClick={onRSVP}
              className="cursor-pointer rounded-[10px] px-3 py-1.5 text-[11px] font-semibold transition"
              style={{
                background: going
                  ? "rgba(123, 168, 122, 0.15)"
                  : `${accentColor}26`,
                color: going
                  ? "var(--color-ribbon-sage)"
                  : accentColor,
              }}
            >
              {going ? "✓ going" : "RSVP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
