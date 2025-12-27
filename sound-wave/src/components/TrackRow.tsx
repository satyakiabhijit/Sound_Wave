'use client';

import Image from 'next/image';
import { usePlayer } from '@/context/PlayerContext';
import { Track } from '@/types';
import { formatDuration, cn } from '@/lib/utils';
import { useState } from 'react';

interface TrackRowProps {
    track: Track;
    index: number;
    tracks: Track[];
    showAlbum?: boolean;
}

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={filled ? 'url(#heartGradient)' : 'none'} stroke={filled ? 'none' : 'currentColor'} strokeWidth="1.5">
        <defs>
            <linearGradient id="heartGradientRow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
        </defs>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

// Equalizer animation for playing track
const Equalizer = () => (
    <div className="flex items-end gap-0.5 h-4">
        <div className="w-0.5 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full wave-bar" style={{ height: '100%' }}></div>
        <div className="w-0.5 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full wave-bar" style={{ height: '60%' }}></div>
        <div className="w-0.5 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full wave-bar" style={{ height: '80%' }}></div>
        <div className="w-0.5 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full wave-bar" style={{ height: '40%' }}></div>
    </div>
);

export default function TrackRow({ track, index, tracks, showAlbum = true }: TrackRowProps) {
    const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isCurrentTrack = currentTrack?.id === track.id;

    const handleClick = () => {
        if (isCurrentTrack) {
            togglePlay();
        } else {
            playTrack(track, tracks);
        }
    };

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'group grid gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300',
                showAlbum ? 'grid-cols-[16px_4fr_3fr_minmax(120px,1fr)]' : 'grid-cols-[16px_4fr_minmax(120px,1fr)]',
                isCurrentTrack ? 'bg-gradient-to-r from-indigo-500/10 to-transparent' : 'hover:bg-white/5'
            )}
        >
            {/* Track Number / Play Button / Equalizer */}
            <div className="flex items-center justify-center w-5">
                {isCurrentTrack && isPlaying && !isHovered ? (
                    <Equalizer />
                ) : isHovered || (isCurrentTrack && !isPlaying) ? (
                    <button className="text-white hover:scale-110 transition-transform">
                        {isCurrentTrack && isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                ) : (
                    <span className={cn(
                        'text-sm font-medium',
                        isCurrentTrack ? 'text-indigo-400' : 'text-zinc-500'
                    )}>
                        {index + 1}
                    </span>
                )}
            </div>

            {/* Song Info */}
            <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                    {track.coverUrl ? (
                        <Image
                            src={track.coverUrl}
                            alt={track.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="white" opacity="0.8">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className={cn(
                        'text-sm font-semibold truncate transition-colors',
                        isCurrentTrack ? 'text-indigo-400' : 'text-white group-hover:text-indigo-300'
                    )}>
                        {track.title}
                    </p>
                    <p className="text-zinc-500 text-xs truncate hover:text-zinc-300 transition-colors">
                        {track.artist}
                    </p>
                </div>
            </div>

            {/* Album */}
            {showAlbum && (
                <div className="flex items-center">
                    <span className="text-zinc-500 text-sm truncate hover:text-zinc-300 cursor-pointer transition-colors">
                        {track.album}
                    </span>
                </div>
            )}

            {/* Duration & Like */}
            <div className="flex items-center justify-end gap-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsLiked(!isLiked);
                    }}
                    className={cn(
                        'transition-all duration-300 hover:scale-110',
                        isLiked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                        isLiked ? '' : 'text-zinc-400 hover:text-white'
                    )}
                >
                    <HeartIcon filled={isLiked} />
                </button>
                <span className="text-zinc-500 text-sm w-12 text-right font-mono">
                    {formatDuration(track.duration)}
                </span>
            </div>
        </div>
    );
}
