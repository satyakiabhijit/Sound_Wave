'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPopularTracks } from '@/lib/jamendo';
import { Track } from '@/types';
import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';

// Icons
const LogoIcon = () => (
    <svg viewBox="0 0 40 40" width="40" height="40">
        <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5d4" />
                <stop offset="100%" stopColor="#9b5de5" />
            </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" />
        <path d="M16 12v16l12-8z" fill="white" />
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

const HeartIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill={active ? "url(#heartGrad)" : "currentColor"}>
        <defs>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5d4" />
                <stop offset="100%" stopColor="#9b5de5" />
            </linearGradient>
        </defs>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const PlayIcon = ({ size = 14 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = ({ size = 14 }: { size?: number }) => (
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

// Equalizer Animation
const Equalizer = () => (
    <div className="flex items-end gap-0.5 h-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="w-0.5 bg-gradient-to-t from-[#00f5d4] to-[#9b5de5] rounded-full eq-bar" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
    </div>
);

export default function LikedSongsPage() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const {
        playTrack,
        currentTrack,
        isPlaying,
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
        async function fetchTracks() {
            setLoading(true);
            try {
                const popularTracks = await getPopularTracks(30);
                setTracks(popularTracks);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTracks();
    }, []);

    const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0);
    const progressPercent = duration ? (progress / duration) * 100 : 0;

    const handlePlayAll = () => {
        if (tracks.length > 0) {
            if (currentTrack && tracks.some(t => t.id === currentTrack.id)) {
                togglePlay();
            } else {
                playTrack(tracks[0], tracks);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d12] aurora-bg noise">
            <div className="relative z-10 flex">
                {/* Sidebar */}
                <aside className="w-72 min-h-screen p-6 flex flex-col border-r border-white/5">
                    <Link href="/" className="flex items-center gap-3 mb-10">
                        <LogoIcon />
                        <div>
                            <span className="text-xl font-bold text-white">Sound</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-[#00f5d4] to-[#9b5de5] bg-clip-text text-transparent">Wave</span>
                        </div>
                    </Link>

                    <nav className="space-y-2 mb-8">
                        <Link href="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
                            <HomeIcon />
                            <span className="font-medium">Home</span>
                        </Link>
                        <Link href="/search" className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
                            <SearchIcon />
                            <span className="font-medium">Search</span>
                        </Link>
                        <Link href="/library" className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
                            <LibraryIcon />
                            <span className="font-medium">Library</span>
                        </Link>
                        <Link href="/liked" className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 text-white">
                            <HeartIcon active />
                            <span className="font-medium">Liked Songs</span>
                        </Link>
                    </nav>

                    <div className="flex-1" />
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {/* Hero Header */}
                    <div className="relative h-80 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9b5de5] via-[#f15bb5] to-[#fee440]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <p className="text-white/80 text-sm font-medium mb-2">Playlist</p>
                            <h1 className="text-6xl font-bold text-white mb-4">Liked Songs</h1>
                            <p className="text-white/60">
                                {tracks.length} songs • {Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}m
                            </p>
                        </div>
                    </div>

                    {/* Controls Row */}
                    <div className="p-8 flex items-center gap-6">
                        <button onClick={handlePlayAll} className="w-14 h-14 btn-play flex items-center justify-center text-black">
                            {isPlaying && currentTrack && tracks.some(t => t.id === currentTrack.id) ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
                        </button>
                        <button onClick={toggleShuffle} className={`${shuffle ? 'text-[#00f5d4]' : 'text-white/40'} hover:text-white transition-colors`}>
                            <ShuffleIcon />
                        </button>
                    </div>

                    {/* Track List */}
                    <div className="px-8 pb-8">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {tracks.map((track, index) => (
                                    <div
                                        key={track.id}
                                        onClick={() => playTrack(track, tracks)}
                                        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group ${currentTrack?.id === track.id
                                                ? 'bg-gradient-to-r from-[#00f5d4]/10 to-transparent border-l-2 border-[#00f5d4]'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="w-6 text-center text-sm text-white/40 font-mono">
                                            {currentTrack?.id === track.id && isPlaying ? <Equalizer /> : String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                                            {track.coverUrl ? (
                                                <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#9b5de5] to-[#f15bb5]" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium truncate ${currentTrack?.id === track.id ? 'text-[#00f5d4]' : 'text-white'}`}>
                                                {track.title}
                                            </p>
                                            <p className="text-sm text-white/50 truncate">{track.artist}</p>
                                        </div>
                                        <span className="text-sm text-white/40 font-mono">{formatDuration(track.duration)}</span>
                                        <button className="text-[#00f5d4] opacity-0 group-hover:opacity-100 transition-opacity">
                                            <HeartIcon active />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Panel - Now Playing */}
                {currentTrack && (
                    <aside className="w-80 min-h-screen p-6 border-l border-white/5 flex flex-col">
                        <h3 className="text-white/50 text-sm font-medium mb-6 text-center">Now Playing</h3>

                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 glow-purple animate-float">
                            {currentTrack.coverUrl ? (
                                <Image src={currentTrack.coverUrl} alt={currentTrack.title} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#00f5d4] via-[#9b5de5] to-[#f15bb5]" />
                            )}
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-white truncate mb-1">{currentTrack.title}</h2>
                            <p className="text-white/50">{currentTrack.artist}</p>
                        </div>

                        <div className="mb-6">
                            <div
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    seekTo(((e.clientX - rect.left) / rect.width) * duration);
                                }}
                                className="h-1.5 progress-aurora cursor-pointer relative group"
                            >
                                <div className="h-full progress-aurora-fill" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-white/40 font-mono">
                                <span>{formatDuration(progress)}</span>
                                <span>{formatDuration(duration)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 mb-6">
                            <button onClick={toggleShuffle} className={`${shuffle ? 'text-[#00f5d4]' : 'text-white/40'} hover:text-white`}>
                                <ShuffleIcon />
                            </button>
                            <button onClick={prevTrack} className="text-white/60 hover:text-white"><PrevIcon /></button>
                            <button onClick={togglePlay} className="w-14 h-14 btn-play flex items-center justify-center text-black">
                                {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
                            </button>
                            <button onClick={nextTrack} className="text-white/60 hover:text-white"><NextIcon /></button>
                            <button onClick={toggleRepeat} className={`${repeat !== 'off' ? 'text-[#00f5d4]' : 'text-white/40'} hover:text-white`}>
                                <RepeatIcon />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 px-4">
                            <VolumeIcon />
                            <div
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
                                }}
                                className="flex-1 h-1.5 progress-aurora cursor-pointer"
                            >
                                <div className="h-full bg-gradient-to-r from-white/40 to-white rounded-full" style={{ width: `${volume * 100}%` }} />
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
