'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPopularTracks, getPopularAlbums, getFeaturedPlaylists, getTracksByTag } from '@/lib/jamendo';
import { Track, Album } from '@/types';
import { usePlayer } from '@/context/PlayerContext';
import { getGreeting } from '@/lib/utils';

// Spotify Icons
const BackIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z" />
  </svg>
);

const ForwardIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

interface PlaylistCard {
  id: string;
  name: string;
  imageUrl?: string;
  color: string;
  tracks: Track[];
}

export default function Home() {
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [tracksData, albumsData, playlistMeta] = await Promise.all([
          getPopularTracks(10),
          getPopularAlbums(8),
          getFeaturedPlaylists()
        ]);

        setTracks(tracksData);
        setAlbums(albumsData);

        // Fetch tracks for playlists
        const playlistsWithTracks = await Promise.all(
          playlistMeta.slice(0, 6).map(async (p) => ({
            id: p.tag,
            name: p.name,
            color: p.color,
            tracks: await getTracksByTag(p.tag, 10)
          }))
        );
        setPlaylists(playlistsWithTracks);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePlayPlaylist = (playlist: PlaylistCard, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const greeting = getGreeting();

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-b from-[#1e3a5f] to-[#121212]">
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between bg-[rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white disabled:opacity-50"
            >
              <BackIcon />
            </button>
            <button
              onClick={() => router.forward()}
              className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white disabled:opacity-50"
            >
              <ForwardIcon />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-bold text-[#b3b3b3] hover:text-white hover:scale-105 transition-all">
              Sign up
            </button>
            <button className="px-8 py-3 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-transform">
              Log in
            </button>
          </div>
        </header>

        {/* Greeting */}
        <div className="px-6 pt-2 pb-4">
          <h1 className="text-3xl font-bold text-white">{greeting}</h1>
        </div>

        {/* Quick Play Cards */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-[rgba(255,255,255,0.1)] rounded animate-pulse"></div>
              ))
            ) : (
              playlists.slice(0, 6).map((playlist) => {
                const isCurrentPlaylist = playlist.tracks.some(t => t.id === currentTrack?.id);
                return (
                  <Link
                    key={playlist.id}
                    href={`/playlist/${playlist.id}`}
                    className="group flex items-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] rounded overflow-hidden transition-colors"
                  >
                    <div className={`w-16 h-16 flex-shrink-0 bg-gradient-to-br ${playlist.color} flex items-center justify-center shadow-lg`}>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="white" opacity="0.8">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </div>
                    <span className="flex-1 px-4 font-bold text-white text-sm truncate">
                      {playlist.name}
                    </span>
                    <button
                      onClick={(e) => handlePlayPlaylist(playlist, e)}
                      className="w-12 h-12 mr-2 bg-[#1ed760] rounded-full flex items-center justify-center text-black shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:scale-105"
                    >
                      {isCurrentPlaylist && isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8">
        {/* Popular Albums */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/library" className="text-2xl font-bold text-white hover:underline">
              Popular albums
            </Link>
            <Link href="/library" className="text-sm font-bold text-[#b3b3b3] hover:underline">
              Show all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="spotify-card">
                  <div className="aspect-square bg-[#282828] rounded-md mb-4 animate-pulse"></div>
                  <div className="h-4 bg-[#282828] rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-[#282828] rounded w-2/3 animate-pulse"></div>
                </div>
              ))
            ) : (
              albums.slice(0, 6).map((album, index) => (
                <div key={album.id} className="spotify-card group cursor-pointer">
                  <div className="relative aspect-square mb-4">
                    <div className="absolute inset-0 rounded-md overflow-hidden shadow-lg">
                      {album.coverUrl ? (
                        <Image
                          src={album.coverUrl}
                          alt={album.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                          <svg viewBox="0 0 24 24" width="48" height="48" fill="#7f7f7f">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Play Button */}
                    <button
                      onClick={() => {
                        if (tracks[index]) {
                          playTrack(tracks[index], tracks);
                        }
                      }}
                      className="spotify-play-btn absolute bottom-2 right-2 w-12 h-12 flex items-center justify-center text-black"
                    >
                      <PlayIcon />
                    </button>
                  </div>
                  <p className="text-white font-bold truncate mb-1">{album.name}</p>
                  <p className="text-[#b3b3b3] text-sm line-clamp-2">{album.artist}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Popular Tracks */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/search" className="text-2xl font-bold text-white hover:underline">
              Popular this week
            </Link>
            <Link href="/search" className="text-sm font-bold text-[#b3b3b3] hover:underline">
              Show all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="spotify-card">
                  <div className="aspect-square bg-[#282828] rounded-md mb-4 animate-pulse"></div>
                  <div className="h-4 bg-[#282828] rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-[#282828] rounded w-2/3 animate-pulse"></div>
                </div>
              ))
            ) : (
              tracks.slice(0, 6).map((track) => (
                <div
                  key={track.id}
                  className="spotify-card group cursor-pointer"
                  onClick={() => playTrack(track, tracks)}
                >
                  <div className="relative aspect-square mb-4">
                    <div className="absolute inset-0 rounded-md overflow-hidden shadow-lg">
                      {track.coverUrl ? (
                        <Image
                          src={track.coverUrl}
                          alt={track.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                          <svg viewBox="0 0 24 24" width="48" height="48" fill="#7f7f7f">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Play Button */}
                    <button className="spotify-play-btn absolute bottom-2 right-2 w-12 h-12 flex items-center justify-center text-black">
                      {currentTrack?.id === track.id && isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                  </div>
                  <p className="text-white font-bold truncate mb-1">{track.title}</p>
                  <p className="text-[#b3b3b3] text-sm line-clamp-2">{track.artist}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Made For You */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Made for you</h2>
            <Link href="/library" className="text-sm font-bold text-[#b3b3b3] hover:underline">
              Show all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {playlists.slice(0, 6).map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="spotify-card group cursor-pointer"
              >
                <div className="relative aspect-square mb-4">
                  <div className={`absolute inset-0 rounded-md bg-gradient-to-br ${playlist.color} flex items-center justify-center shadow-lg`}>
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="white" opacity="0.9">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                  {/* Play Button */}
                  <button
                    onClick={(e) => handlePlayPlaylist(playlist, e)}
                    className="spotify-play-btn absolute bottom-2 right-2 w-12 h-12 flex items-center justify-center text-black"
                  >
                    <PlayIcon />
                  </button>
                </div>
                <p className="text-white font-bold truncate mb-1">{playlist.name}</p>
                <p className="text-[#b3b3b3] text-sm line-clamp-2">Curated playlist</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
