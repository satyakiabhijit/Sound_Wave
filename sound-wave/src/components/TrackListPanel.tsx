'use client';

import Image from 'next/image';
import { usePlayer } from '@/context/PlayerContext';
import { Track } from '@/types';
import { formatDuration } from '@/lib/utils';

interface TrackListPanelProps {
    tracks: Track[];
    title?: string;
}

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

export default function TrackListPanel({ tracks, title = "Track list" }: TrackListPanelProps) {
    const { currentTrack, playTrack, queue } = usePlayer();
    const displayTracks = queue.length > 0 ? queue : tracks;

    return (
        <div className="w-80 bg-white border-l border-gray-100 flex flex-col overflow-hidden flex-shrink-0">
            <div className="p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <ShuffleIcon />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <RepeatIcon />
                    </button>
                </div>
            </div>

            <p className="px-6 text-sm text-gray-500 mb-3">Playing next</p>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
                <div className="space-y-1">
                    {displayTracks.map((track, index) => (
                        <div
                            key={`${track.id}-${index}`}
                            onClick={() => playTrack(track, displayTracks)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentTrack?.id === track.id
                                    ? 'bg-green-50'
                                    : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                {track.coverUrl ? (
                                    <Image
                                        src={track.coverUrl}
                                        alt={track.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className={`text-sm font-medium truncate ${currentTrack?.id === track.id ? 'text-[#1ed760]' : 'text-gray-900'
                                        }`}>
                                        {track.title}
                                    </p>
                                    {index % 3 === 0 && (
                                        <span className="bg-gray-500 text-white text-[9px] px-1 rounded font-semibold">E</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                            </div>
                            <span className="text-xs text-gray-400 font-mono">{formatDuration(track.duration)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
