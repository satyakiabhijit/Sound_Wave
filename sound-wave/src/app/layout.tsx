import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sound-Wave | Music Streaming",
  description: "Discover and stream your favorite music with Sound-Wave",
  keywords: ["music", "streaming", "songs", "playlists", "albums", "artists"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-[#fafafa] text-gray-900`}>
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
