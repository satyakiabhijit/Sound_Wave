'use client';

import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';
import { Track } from '@/types';

interface NowPlayingPanelProps {
    tracks?: Track[];
}

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
);

const PrevIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
);

const NextIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
);

const ShuffleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
);

const RepeatIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
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

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const AirpodsIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="19" x2="12" y2="23" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="8" y1="23" x2="16" y2="23" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export default function NowPlayingPanel({ tracks = [] }: NowPlayingPanelProps) {
    const {
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

    const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        seekTo(percent * duration);
    };

    const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        setVolume(Math.max(0, Math.min(1, percent)));
    };

    const progressPercent = duration ? (progress / duration) * 100 : 0;

    if (!currentTrack) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fafafa]">
                <h3 className="text-gray-500 text-sm font-medium mb-8">Now playing</h3>
                <div className="w-72 h-72 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                    <svg viewBox="0 0 24 24" width="80" height="80" fill="#ccc">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                </div>
                <p className="text-gray-400">Select a track to play</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fafafa]">
            <h3 className="text-gray-500 text-sm font-medium mb-8">Now playing</h3>

            {/* Album Art */}
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-2xl mb-6">
                {currentTrack.coverUrl ? (
                    <Image
                        src={currentTrack.coverUrl}
                        alt={currentTrack.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="80" height="80" fill="white" opacity="0.8">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Track Info */}
            <div className="text-center mb-6 flex items-center gap-4">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <PlusIcon />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{currentTrack.title}</h2>
                    <p className="text-gray-500">{currentTrack.artist}</p>
                </div>
                <button className="text-gray-400 hover:text-[#1ed760] transition-colors">
                    <HeartIcon />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-sm mb-6">
                <div
                    onClick={handleProgressChange}
                    className="w-full h-1 bg-gray-200 rounded-full cursor-pointer relative group"
                >
                    <div
                        className="absolute h-full bg-[#1ed760] rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                    <div
                        className="absolute w-3 h-3 bg-[#1ed760] rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `${progressPercent}%`, transform: 'translateX(-50%)' }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
                    <span>{formatDuration(progress)}</span>
                    <span>-{formatDuration(Math.max(0, duration - progress))}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 mb-8">
                <button
                    onClick={toggleShuffle}
                    className={`transition-colors ${shuffle ? 'text-[#1ed760]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <ShuffleIcon />
                </button>
                <button
                    onClick={prevTrack}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <PrevIcon />
                </button>
                <button
                    onClick={togglePlay}
                    className="w-16 h-16 bg-[#1ed760] rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 hover:bg-[#1db954] hover:scale-105 transition-all"
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                    onClick={nextTrack}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <NextIcon />
                </button>
                <button
                    onClick={toggleRepeat}
                    className={`transition-colors ${repeat !== 'off' ? 'text-[#1ed760]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <RepeatIcon />
                </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 w-full max-w-xs">
                <button className="text-gray-400">
                    <VolumeIcon />
                </button>
                <div
                    onClick={handleVolumeChange}
                    className="flex-1 h-1 bg-gray-200 rounded-full cursor-pointer relative group"
                >
                    <div
                        className="absolute h-full bg-[#1ed760] rounded-full"
                        style={{ width: `${volume * 100}%` }}
                    />
                    <div
                        className="absolute w-3 h-3 bg-[#1ed760] rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `${volume * 100}%`, transform: 'translateX(-50%)' }}
                    />
                </div>
            </div>

            {/* Device Indicator */}
            <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm text-gray-600 hover:shadow-md transition-shadow">
                <AirpodsIcon />
                <span>Airpods Pro (Dave)</span>
            </button>
        </div>
    );
}
