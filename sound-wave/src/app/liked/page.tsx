'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import IconSidebar from '@/components/IconSidebar';
import NowPlayingPanel from '@/components/NowPlayingPanel';
import TrackListPanel from '@/components/TrackListPanel';
import { getPopularTracks } from '@/lib/jamendo';
import { Track } from '@/types';
import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';

export default function LikedSongsPage() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

    useEffect(() => {
        async function fetchTracks() {
            setLoading(true);
            try {
                const popularTracks = await getPopularTracks(30);
                setTracks(popularTracks);
            } catch (error) {
                console.error('Error fetching liked songs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTracks();
    }, []);

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

            {/* Left Panel - Liked Songs */}
            <div className="w-96 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 p-6 pb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white/80 text-sm">Playlist</p>
                            <h1 className="text-2xl font-bold text-white">Liked Songs</h1>
                            <p className="text-white/80 text-sm mt-1">
                                {tracks.length} songs • {Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}m
                            </p>
                        </div>
                    </div>

                    {/* Play Button */}
                    <button
                        onClick={handlePlayAll}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1ed760] shadow-lg hover:scale-105 transition-transform"
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
                </div>

                {/* Track List */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-3 border-[#1ed760] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!loading && (
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
                                            <Image
                                                src={track.coverUrl}
                                                alt={track.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
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
                </div>
            </div>

            {/* Center - Now Playing */}
            <NowPlayingPanel tracks={tracks} />

            {/* Right Panel - Track List */}
            <TrackListPanel tracks={tracks} title="Liked Songs" />
        </div>
    );
}
