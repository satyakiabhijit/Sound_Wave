import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import SpotifySidebar from "@/components/SpotifySidebar";
import SpotifyPlayer from "@/components/SpotifyPlayer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Spotify - Web Player",
  description: "Listen to music for free in the browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <PlayerProvider>
          <div className="h-screen flex flex-col">
            <div className="flex-1 flex overflow-hidden">
              <SpotifySidebar />
              <main className="flex-1 overflow-hidden flex flex-col bg-[#121212] rounded-lg m-2 mr-0 ml-0">
                {children}
              </main>
            </div>
            <SpotifyPlayer />
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}
