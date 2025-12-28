'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTracksByTag, getAlbumTracks } from '@/lib/jamendo';
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

const BackIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
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

const Equalizer = () => (
    <div className="flex items-end gap-0.5 h-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="w-0.5 bg-gradient-to-t from-[#00f5d4] to-[#9b5de5] rounded-full eq-bar" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
    </div>
);

const playlistMeta: Record<string, { name: string; description: string; gradient: string }> = {
    chillout: { name: 'Chill Vibes', description: 'Relax and unwind', gradient: 'from-[#00bbf9] to-[#00f5d4]' },
    electronic: { name: 'Electronic Beats', description: 'High energy electronic', gradient: 'from-[#f15bb5] to-[#fee440]' },
    rock: { name: 'Rock Classics', description: 'Best rock tracks', gradient: 'from-[#ff006e] to-[#fb5607]' },
    jazz: { name: 'Jazz Sessions', description: 'Smooth jazz vibes', gradient: 'from-[#9b5de5] to-[#f15bb5]' },
    hiphop: { name: 'Hip Hop Flow', description: 'Freshest beats', gradient: 'from-[#00f5d4] to-[#00bbf9]' },
    ambient: { name: 'Ambient Dreams', description: 'Atmospheric sounds', gradient: 'from-[#9b5de5] to-[#00f5d4]' },
    pop: { name: 'Pop Hits', description: 'Catchy pop songs', gradient: 'from-[#f15bb5] to-[#9b5de5]' },
    classical: { name: 'Classical', description: 'Timeless masterpieces', gradient: 'from-[#fee440] to-[#00bbf9]' },
};

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrack, currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, shuffle, toggleShuffle } = usePlayer();

    const meta = playlistMeta[id] || {
        name: id.charAt(0).toUpperCase() + id.slice(1),
        description: 'A curated collection',
        gradient: 'from-[#9b5de5] to-[#00f5d4]',
    };

    useEffect(() => {
        async function fetchTracks() {
            setLoading(true);
            try {
                if (id.startsWith('album-')) {
                    const albumTracks = await getAlbumTracks(id.replace('album-', ''));
                    setTracks(albumTracks);
                } else {
                    const genreTracks = await getTracksByTag(id, 30);
                    setTracks(genreTracks);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTracks();
    }, [id]);

    const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0);
    const isCurrentPlaylist = tracks.some(t => t.id === currentTrack?.id);

    const handlePlayAll = () => {
        if (tracks.length > 0) {
            if (isCurrentPlaylist) {
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
                    </nav>

                    <div className="flex-1" />

                    {currentTrack && (
                        <div className="p-4 rounded-2xl glass border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0">
                                    {currentTrack.coverUrl ? (
                                        <Image src={currentTrack.coverUrl} alt={currentTrack.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#00f5d4] to-[#9b5de5]" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
                                    <p className="text-xs text-white/50 truncate">{currentTrack.artist}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <button onClick={prevTrack} className="text-white/60 hover:text-white"><PrevIcon /></button>
                                <button onClick={togglePlay} className="w-10 h-10 btn-play flex items-center justify-center text-black">
                                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                </button>
                                <button onClick={nextTrack} className="text-white/60 hover:text-white"><NextIcon /></button>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {/* Hero Header */}
                    <div className="relative h-80 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent" />
                        <div className="absolute top-6 left-6">
                            <button onClick={() => router.back()} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/80 hover:text-white transition-colors">
                                <BackIcon />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <p className="text-white/80 text-sm font-medium mb-2">Playlist</p>
                            <h1 className="text-6xl font-bold text-white mb-4">{meta.name}</h1>
                            <p className="text-white/60">{meta.description} • {tracks.length} songs • {Math.floor(totalDuration / 60)} min</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-8 flex items-center gap-6">
                        <button onClick={handlePlayAll} className="w-14 h-14 btn-play flex items-center justify-center text-black">
                            {isCurrentPlaylist && isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
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
                        ) : tracks.length > 0 ? (
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
                                                <div className={`w-full h-full bg-gradient-to-br ${meta.gradient}`} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium truncate ${currentTrack?.id === track.id ? 'text-[#00f5d4]' : 'text-white'}`}>
                                                {track.title}
                                            </p>
                                            <p className="text-sm text-white/50 truncate">{track.artist}</p>
                                        </div>
                                        <span className="text-sm text-white/40 font-mono">{formatDuration(track.duration)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-white/50 mb-4">No tracks found</p>
                                <button
                                    onClick={() => router.back()}
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#00f5d4] to-[#9b5de5] text-black rounded-full font-medium hover:opacity-90 transition-opacity"
                                >
                                    Go Back
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
