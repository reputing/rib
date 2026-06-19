"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      // Default to system preference — if user's phone is on light mode, the site
      // renders in light mode automatically. They can override in Settings later.
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
