"use client";

import { Search } from "lucide-react";

export function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="h-px flex-1"
        style={{ background: "var(--color-ribbon-border)" }}
      />
      <div
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-ribbon-text-faint)" }}
      >
        {label}
      </div>
      <div
        className="h-px flex-1"
        style={{ background: "var(--color-ribbon-border)" }}
      />
    </div>
  );
}

export function SearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="px-3.5 pb-2.5">
      <div
        className="flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1.5"
        style={{
          background: "#211D17",
          borderColor: "var(--color-ribbon-border)",
        }}
      >
        <Search
          size={12}
          strokeWidth={2}
          style={{ color: "var(--color-ribbon-text-faint)" }}
        />
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[12px] outline-none"
          style={{
            color: "var(--color-ribbon-text)",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ color: "var(--color-ribbon-text-faint)" }}
    >
      {children}
    </div>
  );
}
