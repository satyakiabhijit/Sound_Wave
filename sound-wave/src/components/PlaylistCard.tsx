'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '@/context/PlayerContext';
import { Track } from '@/types';
import { useState } from 'react';

interface PlaylistCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    tracks?: Track[];
    gradient?: string;
}

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

export default function PlaylistCard({
    id,
    title,
    description,
    imageUrl,
    tracks,
    gradient,
}: PlaylistCardProps) {
    const { playTrack } = usePlayer();
    const [isHovered, setIsHovered] = useState(false);

    const handlePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (tracks && tracks.length > 0) {
            playTrack(tracks[0], tracks);
        }
    };

    return (
        <Link href={`/playlist/${id}`}>
            <div
                className="group relative bg-gradient-to-b from-white/[0.07] to-transparent rounded-2xl p-4 transition-all duration-500 cursor-pointer hover:bg-white/[0.12] hover:shadow-2xl hover:shadow-indigo-500/10"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-xl shadow-black/30 group-hover:shadow-2xl group-hover:shadow-black/40 transition-all duration-500">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient || 'from-indigo-600 via-purple-600 to-pink-500'} flex items-center justify-center relative overflow-hidden`}>
                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float"></div>
                                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
                            </div>
                            <svg viewBox="0 0 24 24" width="56" height="56" fill="white" opacity="0.9" className="relative z-10 drop-shadow-lg">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Play Button */}
                    <button
                        onClick={handlePlay}
                        className={`absolute bottom-3 right-3 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40 transition-all duration-300 hover:scale-110 hover:shadow-green-500/60 text-black ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                            }`}
                    >
                        <PlayIcon />
                    </button>
                </div>

                {/* Info */}
                <h3 className="text-white font-bold truncate mb-1 group-hover:text-indigo-300 transition-colors duration-300">{title}</h3>
                <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">{description}</p>
            </div>
        </Link>
    );
}
