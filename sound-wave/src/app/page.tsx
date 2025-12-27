'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPopularTracks, getPopularAlbums } from '@/lib/jamendo';
import { Track, Album } from '@/types';
import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';

// Minimal Icons
const PlayIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const PrevIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

const ShuffleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

const RepeatIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const VolumeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
  </svg>
);

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    progress,
    duration,
    volume,
    setVolume,
    seekTo,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat
  } = usePlayer();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [tracksData, albumsData] = await Promise.all([
          getPopularTracks(15),
          getPopularAlbums(4)
        ]);
        setTracks(tracksData);
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="h-screen flex bg-[#f8f9fa] overflow-hidden">
      {/* Left Sidebar - Minimal */}
      <aside className="w-64 bg-white flex flex-col border-r border-gray-100">
        {/* Logo */}
        <div className="p-6 pb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#1ed760] rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Sound-Wave</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="px-3 mb-4">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-gray-900 bg-gray-100 rounded-lg mb-1">
            <HomeIcon />
            <span className="font-medium text-sm">Home</span>
          </Link>
          <Link href="/search" className="flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg mb-1 transition-colors">
            <SearchIcon />
            <span className="font-medium text-sm">Search</span>
          </Link>
          <Link href="/library" className="flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <LibraryIcon />
            <span className="font-medium text-sm">Library</span>
          </Link>
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-gray-100 mb-4"></div>

        {/* Recent Albums */}
        <div className="px-4 mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent</h3>
          <div className="space-y-2">
            {albums.slice(0, 4).map((album) => (
              <div key={album.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                  {album.coverUrl ? (
                    <Image src={album.coverUrl} alt={album.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{album.name}</p>
                  <p className="text-xs text-gray-500 truncate">{album.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Now Playing Mini (when track selected) */}
        {currentTrack && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                {currentTrack.coverUrl ? (
                  <Image src={currentTrack.coverUrl} alt={currentTrack.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{currentTrack.title}</p>
                <p className="text-xs text-gray-500 truncate">{currentTrack.artist}</p>
              </div>
              <button onClick={togglePlay} className="w-8 h-8 bg-[#1ed760] rounded-full flex items-center justify-center text-white">
                {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good evening</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#1ed760] flex items-center justify-center text-white font-medium">
              U
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tracks List */}
          <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Tracks</h2>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track, tracks)}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${currentTrack?.id === track.id
                        ? 'bg-green-50 border border-green-100'
                        : 'hover:bg-gray-50'
                      }`}
                  >
                    <span className="w-6 text-center text-sm text-gray-400 font-mono">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <div className="flex justify-center gap-0.5">
                          <span className="w-0.5 h-3 bg-[#1ed760] rounded animate-pulse"></span>
                          <span className="w-0.5 h-4 bg-[#1ed760] rounded animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-0.5 h-2 bg-[#1ed760] rounded animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                      ) : (
                        index + 1
                      )}
                    </span>
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                      {track.coverUrl ? (
                        <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${currentTrack?.id === track.id ? 'text-[#1ed760]' : 'text-gray-900'}`}>
                        {track.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{track.artist}</p>
                    </div>
                    <span className="text-sm text-gray-400 font-mono">{formatDuration(track.duration)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Now Playing Panel */}
          <div className="w-80 bg-white border-l border-gray-100 flex flex-col p-6">
            {currentTrack ? (
              <>
                {/* Album Art */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl mb-6">
                  {currentTrack.coverUrl ? (
                    <Image src={currentTrack.coverUrl} alt={currentTrack.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="64" height="64" fill="white" opacity="0.8">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900 truncate">{currentTrack.title}</h2>
                  <p className="text-gray-500">{currentTrack.artist}</p>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      seekTo(percent * duration);
                    }}
                    className="w-full h-1.5 bg-gray-200 rounded-full cursor-pointer relative group"
                  >
                    <div className="absolute h-full bg-[#1ed760] rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>{formatDuration(progress)}</span>
                    <span>{formatDuration(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <button onClick={toggleShuffle} className={`${shuffle ? 'text-[#1ed760]' : 'text-gray-400'} hover:text-gray-600 transition-colors`}>
                    <ShuffleIcon />
                  </button>
                  <button onClick={prevTrack} className="text-gray-600 hover:text-gray-900 transition-colors">
                    <PrevIcon />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 bg-[#1ed760] rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <PauseIcon size={26} /> : <PlayIcon size={26} />}
                  </button>
                  <button onClick={nextTrack} className="text-gray-600 hover:text-gray-900 transition-colors">
                    <NextIcon />
                  </button>
                  <button onClick={toggleRepeat} className={`${repeat !== 'off' ? 'text-[#1ed760]' : 'text-gray-400'} hover:text-gray-600 transition-colors`}>
                    <RepeatIcon />
                  </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3">
                  <VolumeIcon />
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      setVolume(Math.max(0, Math.min(1, percent)));
                    }}
                    className="flex-1 h-1.5 bg-gray-200 rounded-full cursor-pointer"
                  >
                    <div className="h-full bg-[#1ed760] rounded-full" style={{ width: `${volume * 100}%` }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="#ccc">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Select a track to play</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
