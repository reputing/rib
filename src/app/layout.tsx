import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeWrapper } from "@/components/ribbon/ThemeWrapper";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "prey — chat for digital alchemists",
  description: "A niche chat app for creative communities. DMs, servers, voice, and more.",
  keywords: ["ribbon", "chat", "discord alternative", "creative community", "niche chat"],
  authors: [{ name: "prey.lol" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ribbon",
    description: "chat for digital alchemists",
    siteName: "prey.lol",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeWrapper>
          {children}
          <Toaster />
        </ThemeWrapper>
      </body>
    </html>
  );
}
