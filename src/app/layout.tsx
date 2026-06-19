import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeWrapper } from "@/components/ribbon/ThemeWrapper";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ribbon — chat for digital alchemists",
  description: "A niche chat app for creative communities. DMs, servers, voice, and more.",
  keywords: ["ribbon", "chat", "discord alternative", "creative community", "niche chat"],
  authors: [{ name: "ribbon.lol" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ribbon",
    description: "chat for digital alchemists",
    siteName: "ribbon.lol",
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
        className={`${quicksand.variable} antialiased bg-background text-foreground`}
      >
        <ThemeWrapper>
          {children}
          <Toaster />
        </ThemeWrapper>
      </body>
    </html>
  );
}
