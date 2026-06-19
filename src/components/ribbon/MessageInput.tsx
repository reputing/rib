"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface MessageInputProps {
  placeholder: string;
  onSend: (text: string) => void;
}

export function MessageInput({ placeholder, onSend }: MessageInputProps) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  // auto-resize textarea
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.min(ref.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const canSend = text.trim().length > 0;

  return (
    <div className="px-6 pb-4">
      <div
        className="flex items-end gap-2 rounded-2xl border px-4 py-2.5"
        style={{
          background: "var(--ribbon-card)",
          borderColor: "var(--ribbon-border)",
        }}
      >
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder={placeholder}
          className="flex-1 resize-none bg-transparent text-[13px] outline-none"
          style={{
            color: "var(--ribbon-text)",
            fontFamily: "inherit",
            lineHeight: "1.5",
          }}
        />
        <button
          onClick={send}
          disabled={!canSend}
          className="flex h-7 w-7 flex-none cursor-pointer items-center justify-center rounded-full transition disabled:cursor-default"
          style={{
            background: canSend
              ? "linear-gradient(135deg, #FF3B30 0%, #FFD60A 50%, #3B5BFF 100%)"
              : "var(--ribbon-hover)",
            opacity: canSend ? 1 : 0.4,
          }}
          title="Send"
        >
          <ArrowUp size={14} strokeWidth={3} style={{ color: "#FFFFFF" }} />
        </button>
      </div>
    </div>
  );
}
