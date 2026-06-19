"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Image as ImageIcon, Mic, Smile } from "lucide-react";

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

  return (
    <div className="px-6 pb-3.5">
      <div
        className="flex items-center gap-2.5 rounded-2xl border px-4 py-3"
        style={{
          background: "#1A1612",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        <button
          className="flex-none cursor-pointer"
          style={{ color: "var(--color-ribbon-text-faint)" }}
          title="Attach"
        >
          <Plus size={17} strokeWidth={2} />
        </button>
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
            color: "var(--color-ribbon-text)",
            fontFamily: "inherit",
          }}
        />
        <button
          className="flex-none cursor-pointer"
          style={{ color: "var(--color-ribbon-text-faint)" }}
          title="Image"
        >
          <ImageIcon size={17} strokeWidth={2} />
        </button>
        <button
          className="flex-none cursor-pointer"
          style={{ color: "var(--color-ribbon-text-faint)" }}
          title="Voice"
        >
          <Mic size={17} strokeWidth={2} />
        </button>
        <button
          className="flex-none cursor-pointer"
          style={{ color: "var(--color-ribbon-text-faint)" }}
          title="Emoji"
        >
          <Smile size={17} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
