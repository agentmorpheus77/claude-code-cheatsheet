import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Claude Code Cheatsheet — The Ultimate Reference",
  description:
    "The most comprehensive, beautiful, and always up-to-date Claude Code reference. All keyboard shortcuts, slash commands, workflows, MCP servers, CLI flags, and more.",
  keywords: [
    "Claude Code",
    "cheatsheet",
    "reference",
    "shortcuts",
    "commands",
    "Anthropic",
    "AI coding",
    "CLI",
  ],
  authors: [{ name: "Chris Hubmann", url: "https://github.com/chhubmann" }],
  openGraph: {
    title: "Claude Code Cheatsheet — The Ultimate Reference",
    description:
      "All keyboard shortcuts, commands, workflows, and tips for Claude Code in one beautiful page.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
