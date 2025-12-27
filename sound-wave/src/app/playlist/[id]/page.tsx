'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import IconSidebar from '@/components/IconSidebar';
import NowPlayingPanel from '@/components/NowPlayingPanel';
import TrackListPanel from '@/components/TrackListPanel';
import { getTracksByTag, getAlbumTracks } from '@/lib/jamendo';
import { Track } from '@/types';
import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';

const playlistMeta: Record<string, { name: string; description: string; gradient: string }> = {
    chillout: { name: 'Chill Vibes', description: 'Relax and unwind', gradient: 'from-blue-400 to-cyan-400' },
    electronic: { name: 'Electronic Beats', description: 'High energy electronic', gradient: 'from-pink-500 to-orange-400' },
    rock: { name: 'Rock Classics', description: 'Best rock tracks', gradient: 'from-red-500 to-yellow-500' },
    jazz: { name: 'Jazz Sessions', description: 'Smooth jazz vibes', gradient: 'from-amber-400 to-pink-400' },
    hiphop: { name: 'Hip Hop Flow', description: 'Freshest beats', gradient: 'from-green-400 to-teal-400' },
    ambient: { name: 'Ambient Dreams', description: 'Atmospheric sounds', gradient: 'from-indigo-400 to-purple-500' },
    pop: { name: 'Pop Hits', description: 'Catchy pop songs', gradient: 'from-rose-400 to-pink-400' },
    classical: { name: 'Classical', description: 'Timeless masterpieces', gradient: 'from-yellow-400 to-amber-500' },
};

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

    const meta = playlistMeta[id] || {
        name: id.charAt(0).toUpperCase() + id.slice(1),
        description: 'A curated collection',
        gradient: 'from-gray-400 to-gray-600',
    };

    useEffect(() => {
        async function fetchTracks() {
            setLoading(true);
            try {
                if (id.startsWith('album-')) {
                    const albumId = id.replace('album-', '');
                    const albumTracks = await getAlbumTracks(albumId);
                    setTracks(albumTracks);
                } else {
                    const genreTracks = await getTracksByTag(id, 30);
                    setTracks(genreTracks);
                }
            } catch (error) {
                console.error('Error fetching playlist tracks:', error);
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
        <div className="h-screen flex overflow-hidden bg-[#fafafa]">
            <IconSidebar />

            {/* Left Panel - Playlist */}
            <div className="w-96 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
                {/* Header with Gradient */}
                <div className={`bg-gradient-to-br ${meta.gradient} p-6 pb-8`}>
                    <button
                        onClick={() => router.back()}
                        className="mb-4 text-white/80 hover:text-white transition-colors"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 24 24" width="40" height="40" fill="white" opacity="0.9">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white/80 text-sm">Playlist</p>
                            <h1 className="text-2xl font-bold text-white">{meta.name}</h1>
                            <p className="text-white/80 text-sm mt-1">{meta.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePlayAll}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg hover:scale-105 transition-transform"
                        >
                            {isCurrentPlaylist && isPlaying ? (
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                        <div className="text-white/80 text-sm">
                            {tracks.length} songs • {Math.floor(totalDuration / 60)} min
                        </div>
                    </div>
                </div>

                {/* Track List */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-3 border-[#1ed760] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!loading && tracks.length > 0 && (
                        <div className="space-y-1">
                            {tracks.map((track, index) => (
                                <div
                                    key={track.id}
                                    onClick={() => playTrack(track, tracks)}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentTrack?.id === track.id
                                            ? 'bg-green-50'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="w-5 text-center text-sm text-gray-400">{index + 1}</span>
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                        {track.coverUrl ? (
                                            <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${meta.gradient}`}></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${currentTrack?.id === track.id ? 'text-[#1ed760]' : 'text-gray-900'
                                            }`}>
                                            {track.title}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono">{formatDuration(track.duration)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && tracks.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">No tracks found</p>
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-2 bg-[#1ed760] text-white rounded-full font-medium hover:bg-[#1db954] transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Center - Now Playing */}
            <NowPlayingPanel tracks={tracks} />

            {/* Right Panel - Track List */}
            <TrackListPanel tracks={tracks} title={meta.name} />
        </div>
    );
}
