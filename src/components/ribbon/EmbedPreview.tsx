"use client";

import type { EmbedPreview as EmbedPreviewType } from "@/lib/ribbon/types";
import { Avatar, ACCENT_HEX } from "./Avatar";
import { useRibbon } from "@/lib/ribbon/store";

export function EmbedPreview({ embed }: { embed: EmbedPreviewType }) {
  const navigate = useRibbon((s) => s.navigate);
  const setActiveProfile = useRibbon((s) => s.setActiveProfile);

  return (
    <button
      onClick={() => {
        if (embed.type === "profile") {
          setActiveProfile("sol");
        } else if (embed.type === "pinboard") {
          navigate("pinboard", { userId: "sol" });
        }
      }}
      className="mt-2.5 block max-w-[340px] cursor-pointer overflow-hidden rounded-[12px] border text-left transition"
      style={{
        background: "#211D17",
        borderColor: "var(--color-ribbon-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "transparent";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-ribbon-border)";
      }}
    >
      {/* Banner strip with overlapping avatar */}
      {embed.banner && (
        <div
          className="relative h-14"
          style={{ background: embed.banner }}
        >
          {embed.avatarLetter && embed.avatarAccent && (
            <div className="absolute -bottom-3.5 left-3.5">
              <Avatar
                letter={embed.avatarLetter}
                accent={embed.avatarAccent}
                size={28}
                radius={9}
              />
            </div>
          )}
        </div>
      )}
      <div className={embed.banner ? "px-3.5 pb-3 pt-5" : "p-3.5"}>
        <div
          className="text-[12px] font-semibold"
          style={{ color: "var(--color-ribbon-text)" }}
        >
          {embed.title}
        </div>
        {embed.subtitle && (
          <div
            className="mt-0.5 text-[10px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            {embed.subtitle}
          </div>
        )}
        {embed.meta && (
          <div
            className="mt-0.5 text-[10px]"
            style={{ color: "var(--color-ribbon-text-faint)" }}
          >
            {embed.meta}
          </div>
        )}
        {embed.tiles && embed.tiles.length > 0 && (
          <div className="mt-2 flex gap-1">
            {embed.tiles.map((tile, i) => (
              <div
                key={i}
                className="flex h-8 flex-1 items-center justify-center rounded-md"
                style={{ background: `${ACCENT_HEX[tile]}14` }}
              >
                <div
                  className="h-6 w-6 rounded"
                  style={{
                    background: `repeating-linear-gradient(45deg, ${ACCENT_HEX[tile]}26, ${ACCENT_HEX[tile]}26 2px, transparent 2px, transparent 6px)`,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
