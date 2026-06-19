"use client";

export function TypingIndicator({ users }: { users: string[] }) {
  if (users.length === 0) return null;
  return (
    <div
      className="flex items-center gap-1.5 px-1 pb-1.5 text-[11px]"
      style={{ color: "var(--color-ribbon-text-faint)" }}
    >
      <span style={{ color: "#D4944C", fontWeight: 600 }}>{users.join(", ")}</span>
      <span>is typing</span>
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "var(--color-ribbon-text-faint)",
              animation: "ribbon-typing 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </span>
    </div>
  );
}
