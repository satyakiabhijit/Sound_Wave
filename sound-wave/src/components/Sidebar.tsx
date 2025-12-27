'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Modern Icon components
const HomeIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        {!active && <path d="M9 22V12h6v10" />}
    </svg>
);

const SearchIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const LibraryIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const playlists = [
    { id: '1', name: 'My Playlist #1' },
    { id: '2', name: 'Chill Vibes' },
    { id: '3', name: 'Workout Mix' },
    { id: '4', name: 'Focus Flow' },
    { id: '5', name: 'Evening Jazz' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[280px] bg-[#0a0a0f]/95 backdrop-blur-xl flex flex-col h-full border-r border-white/5">
            {/* Logo */}
            <div className="p-6 pb-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
                        <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <span className="text-white font-bold text-xl tracking-tight">Sound</span>
                        <span className="gradient-text font-bold text-xl">Wave</span>
                    </div>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="px-3 mb-6">
                <ul className="space-y-1">
                    <li>
                        <Link
                            href="/"
                            className={cn(
                                'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300',
                                pathname === '/'
                                    ? 'bg-gradient-to-r from-indigo-500/20 to-transparent text-white border-l-2 border-indigo-500'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <HomeIcon active={pathname === '/'} />
                            <span className="font-medium">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/search"
                            className={cn(
                                'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300',
                                pathname === '/search'
                                    ? 'bg-gradient-to-r from-indigo-500/20 to-transparent text-white border-l-2 border-indigo-500'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <SearchIcon active={pathname === '/search'} />
                            <span className="font-medium">Search</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/library"
                            className={cn(
                                'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300',
                                pathname === '/library'
                                    ? 'bg-gradient-to-r from-indigo-500/20 to-transparent text-white border-l-2 border-indigo-500'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <LibraryIcon active={pathname === '/library'} />
                            <span className="font-medium">Your Library</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Divider with Glow */}
            <div className="mx-6 mb-4 relative">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            {/* Playlist Actions */}
            <div className="px-3 space-y-1">
                <button className="flex items-center gap-4 px-4 py-3 text-zinc-400 hover:text-white transition-all w-full group rounded-xl hover:bg-white/5">
                    <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg">
                        <PlusIcon />
                    </div>
                    <span className="font-medium text-sm">Create Playlist</span>
                </button>
                <Link
                    href="/liked"
                    className={cn(
                        'flex items-center gap-4 px-4 py-3 transition-all w-full group rounded-xl',
                        pathname === '/liked'
                            ? 'text-white bg-gradient-to-r from-indigo-500/20 to-transparent'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    )}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <HeartIcon />
                    </div>
                    <span className="font-medium text-sm">Liked Songs</span>
                </Link>
            </div>

            {/* Divider */}
            <div className="mx-6 my-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            {/* Playlists */}
            <div className="flex-1 overflow-y-auto px-3 scrollbar-thin">
                <p className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-500 font-semibold">Your Playlists</p>
                <ul className="space-y-0.5">
                    {playlists.map((playlist) => (
                        <li key={playlist.id}>
                            <Link
                                href={`/playlist/${playlist.id}`}
                                className={cn(
                                    'block px-4 py-2.5 text-sm transition-all truncate rounded-lg',
                                    pathname === `/playlist/${playlist.id}`
                                        ? 'text-white bg-white/5'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {playlist.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">User</p>
                        <p className="text-zinc-500 text-xs">Free Account</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
