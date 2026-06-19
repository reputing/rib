"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import {
  Home, Compass, Users, Settings as SettingsIcon, Server,
} from "lucide-react";
import { useRibbon } from "@/lib/ribbon/store";

type Edge = "top" | "bottom" | "left" | "right";

interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export function FloatingDock() {
  const { view, navigate, joinedVoice } = useRibbon();

  // Dock position — stored as edge + offset along that edge.
  // Default: bottom-center.
  const [edge, setEdge] = useState<Edge>("bottom");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const hasPositionedRef = useRef(false);

  // Center the dock on the bottom edge on first mount.
  useEffect(() => {
    if (hasPositionedRef.current) return;
    hasPositionedRef.current = true;
    const dockWidth = 280;
    const dockHeight = 56;
    x.set((window.innerWidth - dockWidth) / 2);
    y.set(window.innerHeight - dockHeight - 24);
  }, [x, y]);

  // Re-center on window resize (only if not actively dragging).
  useEffect(() => {
    const handleResize = () => {
      if (isDragging) return;
      const dockWidth = 280;
      const dockHeight = 56;
      if (edge === "top" || edge === "bottom") {
        x.set((window.innerWidth - dockWidth) / 2);
        if (edge === "bottom") y.set(window.innerHeight - dockHeight - 24);
        else y.set(24);
      } else {
        y.set((window.innerHeight - dockHeight) / 2);
        if (edge === "right") x.set(window.innerWidth - dockWidth - 24);
        else x.set(24);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [edge, isDragging, x, y]);

  // Snap to nearest edge on drag end.
  const handleDragEnd = () => {
    setIsDragging(false);
    const dockWidth = 280;
    const dockHeight = 56;
    const currentX = x.get();
    const currentY = y.get();
    const centerX = currentX + dockWidth / 2;
    const centerY = currentY + dockHeight / 2;

    // Distance to each edge
    const distTop = centerY;
    const distBottom = window.innerHeight - centerY;
    const distLeft = centerX;
    const distRight = window.innerWidth - centerX;

    const minDist = Math.min(distTop, distBottom, distLeft, distRight);
    let newEdge: Edge;
    let targetX: number;
    let targetY: number;

    if (minDist === distTop) {
      newEdge = "top";
      targetX = (window.innerWidth - dockWidth) / 2;
      targetY = 24;
    } else if (minDist === distBottom) {
      newEdge = "bottom";
      targetX = (window.innerWidth - dockWidth) / 2;
      targetY = window.innerHeight - dockHeight - 24;
    } else if (minDist === distLeft) {
      newEdge = "left";
      targetX = 24;
      targetY = (window.innerHeight - dockHeight) / 2;
    } else {
      newEdge = "right";
      targetX = window.innerWidth - dockWidth - 24;
      targetY = (window.innerHeight - dockHeight) / 2;
    }

    setEdge(newEdge);
    animate(x, targetX, { type: "spring", stiffness: 400, damping: 30 });
    animate(y, targetY, { type: "spring", stiffness: 400, damping: 30 });
  };

  // 5 items max — aggressive icon cut
  const items: DockItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home size={18} strokeWidth={2.5} />,
      active: view === "dms",
      onClick: () => navigate("dms"),
    },
    {
      id: "servers",
      label: "Servers",
      icon: <Server size={18} strokeWidth={2.5} />,
      active: view === "chat" || view === "servers",
      onClick: () => navigate("servers"),
    },
    {
      id: "discover",
      label: "Discover",
      icon: <Compass size={18} strokeWidth={2.5} />,
      active: view === "discover",
      onClick: () => navigate("discover"),
    },
    {
      id: "friends",
      label: "Friends",
      icon: <Users size={18} strokeWidth={2.5} />,
      active: view === "friends",
      onClick: () => navigate("friends"),
    },
    {
      id: "you",
      label: "You",
      icon: <SettingsIcon size={18} strokeWidth={2.5} />,
      active: view === "settings" || view === "server-settings" || view === "profile",
      onClick: () => navigate("settings"),
    },
  ];

  // Horizontal layout for top/bottom edges, vertical for left/right
  const isVertical = edge === "left" || edge === "right";

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{ x, y }}
      className="fixed z-50 flex items-center gap-1 rounded-full border p-1.5 backdrop-blur-xl"
      data-edge={edge}
    >
      {/* Items */}
      {items.map((item) => (
        <DockButton
          key={item.id}
          item={item}
          isVertical={isVertical}
          isDragging={isDragging}
        />
      ))}

      {/* Voice indicator — only shows when in a voice call */}
      {joinedVoice && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("voice");
          }}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition"
          style={{
            background: "rgba(0, 214, 125, 0.15)",
            border: "1px solid rgba(0, 214, 125, 0.3)",
          }}
          title="Voice call active"
        >
          <span
            className="rounded-full"
            style={{
              width: 8,
              height: 8,
              background: "#12B886",
              animation: "ribbon-enter-pulse 1.5s ease-in-out infinite",
            }}
          />
        </button>
      )}
    </motion.div>
  );
}

function DockButton({
  item,
  isVertical,
  isDragging,
}: {
  item: DockItem;
  isVertical: boolean;
  isDragging: boolean;
}) {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <button
      onClick={(e) => {
        // Prevent click after drag
        if (isDragging) {
          e.preventDefault();
          return;
        }
        item.onClick();
      }}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
      className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all"
      style={{
        background: item.active
          ? "linear-gradient(135deg, #E5484D 0%, #F5A623 50%, #4263EB 100%)"
          : "transparent",
        color: item.active ? "#FFFFFF" : "var(--ribbon-text-dim)",
      }}
      title={item.label}
    >
      {item.icon}

      {/* Hover label tooltip */}
      {showLabel && !item.active && (
        <div
          className="pointer-events-none absolute whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold"
          style={{
            background: "var(--ribbon-elevated)",
            color: "var(--ribbon-text)",
            border: "1px solid var(--ribbon-border)",
            // Position label based on dock orientation
            ...(isVertical
              ? { left: "100%", marginLeft: 8, top: "50%", transform: "translateY(-50%)" }
              : { bottom: "100%", marginBottom: 8, left: "50%", transform: "translateX(-50%)" }),
          }}
        >
          {item.label}
        </div>
      )}
    </button>
  );
}
