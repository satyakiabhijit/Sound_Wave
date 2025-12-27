'use client';

import { useRouter } from 'next/navigation';

interface HeaderProps {
    showSearch?: boolean;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    bgColor?: string;
}

const BackIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
);

const ForwardIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const BellIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

export default function Header({
    showSearch = false,
    searchQuery = '',
    onSearchChange,
    bgColor = 'bg-transparent',
}: HeaderProps) {
    const router = useRouter();

    return (
        <header className={`sticky top-0 z-20 flex items-center justify-between px-6 py-4 ${bgColor} backdrop-blur-xl border-b border-white/5`}>
            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/5 hover:border-white/10"
                >
                    <BackIcon />
                </button>
                <button
                    onClick={() => router.forward()}
                    className="w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/5 hover:border-white/10"
                >
                    <ForwardIcon />
                </button>

                {/* Search Bar */}
                {showSearch && (
                    <div className="relative ml-4 group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-400 transition-colors">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            placeholder="What do you want to listen to?"
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-[380px] h-11 bg-white/5 hover:bg-white/10 focus:bg-white/10 rounded-full pl-12 pr-4 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-white/5 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
                {/* Upgrade Button */}
                <button className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105">
                    Upgrade
                </button>

                {/* Notifications */}
                <button className="w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/5">
                    <BellIcon />
                </button>

                {/* User Profile */}
                <button className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105">
                    U
                </button>
            </div>
        </header>
    );
}
