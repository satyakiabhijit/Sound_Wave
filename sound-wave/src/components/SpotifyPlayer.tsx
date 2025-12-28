'use client';

import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Spotify Icons
const PlayIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
    </svg>
);

const PrevIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
    </svg>
);

const NextIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
    </svg>
);

const ShuffleIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z" />
        <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z" />
    </svg>
);

const RepeatIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a.75.75 0 0 1-1.5 0v-5A2.25 2.25 0 0 0 12.25 2.5h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z" />
        <path d="M12.101 2.5a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l1.97-1.97-1.97-1.97a.75.75 0 0 1 0-1.06zM9 6a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5A.75.75 0 0 1 9 6zm-4.25 6.5H9V14H4.75A3.75 3.75 0 0 1 1 10.25v-.5a.75.75 0 0 1 1.5 0v.5a2.25 2.25 0 0 0 2.25 2.25z" />
    </svg>
);

const RepeatOneIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h.75v1.5h-.75A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5zM12.25 2.5h-.75V1h.75A3.75 3.75 0 0 1 16 4.75v5a.75.75 0 0 1-1.5 0v-5a2.25 2.25 0 0 0-2.25-2.25z" />
        <path d="M9.006 1.79a.75.75 0 0 1 .274 1.025l-.066.099-1.714 2.25a.75.75 0 0 1-1.24-.847l.066-.098L7.5 2.669V6h-.75a.75.75 0 0 1-.743-.648L6 5.25v-.5c0-.357.25-.656.584-.73l.11-.017.056-.003h.75V2.5h-.75a.75.75 0 0 1-.102-1.493l.102-.007h1.5a.75.75 0 0 1 .756.79zM9 10.75v-5.5a.75.75 0 0 1 1.5 0v5.5a.75.75 0 0 1-1.5 0zm-4.25 3.75H9V16H4.75A3.75 3.75 0 0 1 1 12.25v-2a.75.75 0 0 1 1.5 0v2a2.25 2.25 0 0 0 2.25 2.25z" />
        <path d="M12.101 2.5a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l1.97-1.97-1.97-1.97a.75.75 0 0 1 0-1.06z" />
    </svg>
);

const VolumeHighIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" />
        <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z" />
    </svg>
);

const VolumeLowIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" />
    </svg>
);

const VolumeMuteIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z" />
        <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-13a.75.75 0 0 0-.375-.65zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35z" />
    </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill={filled ? "#1ed760" : "currentColor"}>
        {filled ? (
            <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z" />
        ) : (
            <path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z" />
        )}
    </svg>
);

const QueueIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z" />
    </svg>
);

const DeviceIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M6 2.75C6 1.784 6.784 1 7.75 1h6.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15h-6.5A1.75 1.75 0 0 1 6 13.25V2.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25h-6.5zm-6 0a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25H4V11H1.75A1.75 1.75 0 0 1 0 9.25v-6.5C0 1.784.784 1 1.75 1H4v1.5H1.75zM4 15H2v-1.5h2V15z" />
        <path d="M13 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-1-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
);

const FullscreenIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M6.53 9.47a.75.75 0 0 1 0 1.06l-2.72 2.72h1.018a.75.75 0 0 1 0 1.5H1.25v-3.579a.75.75 0 0 1 1.5 0v1.018l2.72-2.72a.75.75 0 0 1 1.06 0zm2.94-2.94a.75.75 0 0 1 0-1.06l2.72-2.72h-1.018a.75.75 0 1 1 0-1.5h3.578v3.579a.75.75 0 0 1-1.5 0V3.81l-2.72 2.72a.75.75 0 0 1-1.06 0z" />
    </svg>
);

export default function SpotifyPlayer() {
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

    const progressRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [showVolume, setShowVolume] = useState(true);

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && duration) {
            const rect = progressRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seekTo(percent * duration);
        }
    };

    const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (volumeRef.current) {
            const rect = volumeRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            setVolume(Math.max(0, Math.min(1, percent)));
        }
    };

    const progressPercent = duration ? (progress / duration) * 100 : 0;

    const VolumeIconComponent = volume === 0 ? VolumeMuteIcon : volume < 0.5 ? VolumeLowIcon : VolumeHighIcon;

    return (
        <footer className="h-[90px] bg-black px-4 flex items-center border-t border-[#282828]">
            {/* Left - Now Playing */}
            <div className="w-[30%] min-w-[180px] flex items-center">
                {currentTrack ? (
                    <>
                        <div className="w-14 h-14 rounded mr-4 overflow-hidden flex-shrink-0 relative">
                            {currentTrack.coverUrl ? (
                                <Image
                                    src={currentTrack.coverUrl}
                                    alt={currentTrack.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#7f7f7f">
                                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="mr-4 min-w-0">
                            <p className="text-sm text-white truncate hover:underline cursor-pointer">
                                {currentTrack.title}
                            </p>
                            <p className="text-xs text-[#b3b3b3] truncate hover:underline hover:text-white cursor-pointer">
                                {currentTrack.artist}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`player-btn ${isLiked ? 'active' : ''}`}
                        >
                            <HeartIcon filled={isLiked} />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded bg-[#282828]"></div>
                        <div>
                            <p className="text-sm text-[#b3b3b3]">No track playing</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Center - Player Controls */}
            <div className="flex-1 max-w-[722px] flex flex-col items-center">
                {/* Control Buttons */}
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={toggleShuffle}
                        className={`player-btn ${shuffle ? 'active' : ''}`}
                    >
                        <ShuffleIcon />
                    </button>
                    <button onClick={prevTrack} className="player-btn">
                        <PrevIcon />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                    >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button onClick={nextTrack} className="player-btn">
                        <NextIcon />
                    </button>
                    <button
                        onClick={toggleRepeat}
                        className={`player-btn ${repeat !== 'off' ? 'active' : ''}`}
                    >
                        {repeat === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center gap-2">
                    <span className="text-xs text-[#b3b3b3] w-10 text-right">
                        {formatDuration(progress)}
                    </span>
                    <div
                        ref={progressRef}
                        onClick={handleProgressClick}
                        className="flex-1 h-1 progress-bar cursor-pointer group relative"
                    >
                        <div
                            className="progress-bar-fill h-full relative"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <span className="text-xs text-[#b3b3b3] w-10">
                        {formatDuration(duration)}
                    </span>
                </div>
            </div>

            {/* Right - Volume & Extra Controls */}
            <div className="w-[30%] min-w-[180px] flex items-center justify-end gap-2">
                <button className="player-btn">
                    <QueueIcon />
                </button>
                <button className="player-btn">
                    <DeviceIcon />
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                        className="player-btn"
                    >
                        <VolumeIconComponent />
                    </button>
                    <div
                        ref={volumeRef}
                        onClick={handleVolumeClick}
                        className="w-24 h-1 progress-bar cursor-pointer group"
                    >
                        <div
                            className="progress-bar-fill h-full relative"
                            style={{ width: `${volume * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
                <button className="player-btn">
                    <FullscreenIcon />
                </button>
            </div>
        </footer>
    );
}
