'use client';

import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Modern Icons
const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
);

const PrevIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
);

const NextIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
);

const ShuffleIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className={active ? 'text-indigo-400' : ''}>
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
);

const RepeatIcon = ({ mode }: { mode: 'off' | 'all' | 'one' }) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className={mode !== 'off' ? 'text-indigo-400' : ''}>
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        {mode === 'one' && <text x="10" y="15" fill="currentColor" fontSize="8" fontWeight="bold">1</text>}
    </svg>
);

const VolumeIcon = ({ level }: { level: number }) => {
    if (level === 0) {
        return (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
        );
    }
    if (level < 0.5) {
        return (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
    );
};

const HeartIcon = ({ filled }: { filled?: boolean }) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={filled ? 'url(#heartGradient)' : 'none'} stroke={filled ? 'none' : 'currentColor'} strokeWidth="1.5">
        <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
        </defs>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const QueueIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

const ExpandIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
);

export default function Player() {
    const {
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        shuffle,
        repeat,
        togglePlay,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
    } = usePlayer();

    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeBarRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressBarRef.current && duration) {
            const rect = progressBarRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seekTo(percent * duration);
        }
    };

    const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (volumeBarRef.current) {
            const rect = volumeBarRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            setVolume(Math.max(0, Math.min(1, percent)));
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && progressBarRef.current && duration) {
                const rect = progressBarRef.current.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                seekTo(percent * duration);
            }
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, duration, seekTo]);

    const progressPercent = duration ? (progress / duration) * 100 : 0;

    if (!currentTrack) {
        return (
            <footer className="h-24 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-center">
                <div className="flex items-center gap-3 text-zinc-500">
                    <div className="flex gap-1">
                        <div className="w-1 h-4 bg-zinc-700 rounded-full"></div>
                        <div className="w-1 h-6 bg-zinc-700 rounded-full"></div>
                        <div className="w-1 h-4 bg-zinc-700 rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium">Select a track to start the vibe</p>
                </div>
            </footer>
        );
    }

    return (
        <footer className="h-24 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 px-4 grid grid-cols-3 items-center">
            {/* Now Playing */}
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shadow-xl">
                        {currentTrack.coverUrl ? (
                            <Image
                                src={currentTrack.coverUrl}
                                alt={currentTrack.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="white" opacity="0.8">
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate hover:underline cursor-pointer">
                        {currentTrack.title}
                    </p>
                    <p className="text-zinc-400 text-xs truncate hover:text-white cursor-pointer transition-colors">
                        {currentTrack.artist}
                    </p>
                </div>
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="text-zinc-400 hover:text-white transition-colors ml-2"
                >
                    <HeartIcon filled={isLiked} />
                </button>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-5">
                    <button
                        onClick={toggleShuffle}
                        className={`${shuffle ? 'text-indigo-400' : 'text-zinc-400'} hover:text-white transition-colors hover:scale-110`}
                    >
                        <ShuffleIcon active={shuffle} />
                    </button>
                    <button
                        onClick={prevTrack}
                        className="text-zinc-400 hover:text-white transition-all hover:scale-110"
                    >
                        <PrevIcon />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-105 transition-all text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                    >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button
                        onClick={nextTrack}
                        className="text-zinc-400 hover:text-white transition-all hover:scale-110"
                    >
                        <NextIcon />
                    </button>
                    <button
                        onClick={toggleRepeat}
                        className={`${repeat !== 'off' ? 'text-indigo-400' : 'text-zinc-400'} hover:text-white transition-colors hover:scale-110`}
                    >
                        <RepeatIcon mode={repeat} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md flex items-center gap-2">
                    <span className="text-xs text-zinc-500 w-10 text-right font-mono">
                        {formatDuration(progress)}
                    </span>
                    <div
                        ref={progressBarRef}
                        onClick={handleProgressClick}
                        onMouseDown={() => setIsDragging(true)}
                        className="flex-1 h-1.5 bg-zinc-800 rounded-full cursor-pointer group relative overflow-hidden"
                    >
                        <div
                            className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-100"
                            style={{ width: `${progressPercent}%` }}
                        />
                        <div
                            className="absolute w-3 h-3 bg-white rounded-full shadow-lg shadow-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ left: `${progressPercent}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                        />
                    </div>
                    <span className="text-xs text-zinc-500 w-10 font-mono">
                        {formatDuration(duration)}
                    </span>
                </div>
            </div>

            {/* Volume & Other Controls */}
            <div className="flex items-center justify-end gap-4">
                <button className="text-zinc-400 hover:text-white transition-colors">
                    <QueueIcon />
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <VolumeIcon level={volume} />
                    </button>
                    <div
                        ref={volumeBarRef}
                        onClick={handleVolumeClick}
                        className="w-24 h-1.5 bg-zinc-800 rounded-full cursor-pointer group relative overflow-hidden"
                    >
                        <div
                            className="absolute h-full bg-gradient-to-r from-zinc-400 to-white rounded-full"
                            style={{ width: `${volume * 100}%` }}
                        />
                        <div
                            className="absolute w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ left: `${volume * 100}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                        />
                    </div>
                </div>
                <button className="text-zinc-400 hover:text-white transition-colors ml-2">
                    <ExpandIcon />
                </button>
            </div>
        </footer>
    );
}
