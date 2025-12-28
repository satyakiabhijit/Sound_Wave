'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Spotify Icons
const SpotifyLogo = () => (
    <svg viewBox="0 0 1134 340" width="78" height="24" fill="white">
        <path d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zm3-47C198 129 111 133 61 152c-19 7-28-24-9-30 58-22 159-18 225 21 17 9 2 34-14 24z" />
        <path d="M471 145c-36-7-43-12-43-25 0-12 10-19 26-19 15 0 30 6 46 17 2 1 4 1 5 0l21-30c1-2 1-4-1-5-18-14-40-21-68-21-38 0-65 23-65 56 0 37 25 50 67 59 36 8 43 14 43 26 0 13-11 20-31 20-20 0-38-7-55-22-1-1-4-1-5 0l-23 28c-1 1-1 4 0 5 21 20 51 30 82 30 43 0 71-21 71-56 0-32-19-48-70-58zm190-70c-22 0-40 9-52 25V78c0-2-1-3-3-3h-38c-2 0-3 1-3 3v177c0 2 1 3 3 3h38c2 0 3-1 3-3v-60c12 17 30 26 52 26 40 0 80-31 80-87 0-56-40-87-80-87zm36 87c0 31-21 53-49 53-27 0-50-23-50-53 0-30 23-53 50-53 28 0 49 22 49 53zm124-87c-48 0-85 37-85 87 0 50 37 87 85 87 48 0 86-37 86-87 0-50-38-87-86-87zm0 140c-29 0-50-23-50-53 0-30 21-53 50-53 29 0 50 23 50 53 0 30-21 53-50 53zm181-140h-16V46c0-2-1-3-3-3h-38c-2 0-3 1-3 3v29h-27c-2 0-3 1-3 3v31c0 2 1 3 3 3h27v78c0 43 21 64 65 64 17 0 32-4 44-11 1-1 2-2 2-4v-29c0-1-1-3-3-3s-3 0-4 1c-9 5-17 7-27 7-18 0-25-8-25-26v-77h50c2 0 3-1 3-3V78c0-2-1-3-3-3zm102 0c-2 0-3 1-3 3v142c0 2 1 3 3 3h38c2 0 3-1 3-3V78c0-2-1-3-3-3zm19-76c-15 0-27 12-27 27s12 28 27 28 28-13 28-28-13-27-28-27zm124 76h-15V46c0-2-1-3-3-3h-38c-2 0-3 1-3 3v29h-8c-2 0-3 1-3 3v31c0 2 1 3 3 3h8v78c0 43 21 64 65 64 11 0 22-2 31-6 2 0 3-2 3-4v-30c0-2-2-3-3-3-2 0-3 1-5 1-5 2-10 3-16 3-18 0-25-8-25-26v-77h49c2 0 3-1 3-3V78c0-2-1-3-3-3zm81 113h-4c-8 0-11-3-11-10V75c0-2-1-3-3-3h-39c-2 0-3 1-3 3v150c0 40 17 57 53 57 9 0 18-1 27-5 2-1 3-2 3-4v-27c0-2-2-4-4-4-2 1-4 1-5 1-7 2-10 3-14 3z" />
    </svg>
);

const HomeIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? "white" : "#b3b3b3"}>
        {active ? (
            <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z" />
        ) : (
            <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
        )}
    </svg>
);

const SearchIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? "white" : "#b3b3b3"}>
        {active ? (
            <path d="M15.356 10.558c0 2.623-2.16 4.75-4.823 4.75-2.664 0-4.824-2.127-4.824-4.75s2.16-4.75 4.824-4.75c2.664 0 4.823 2.127 4.823 4.75z" />
        ) : null}
        <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.392a1 1 0 1 0 1.414-1.414l-4.344-4.366a9.244 9.244 0 0 0 2.077-5.833c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
    </svg>
);

const LibraryIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? "white" : "#b3b3b3"}>
        {active ? (
            <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z" />
        ) : (
            <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 22a1 1 0 0 1-1-1V3a1 1 0 1 1 2 0v18a1 1 0 0 1-1 1zm7-1V4.732l4 2.309V20h-4z" />
        )}
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z" />
    </svg>
);

const GlobalIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M8.152 16H8a8 8 0 1 1 .152 0zm-.41-14.98c-.07.144-.15.312-.232.504a13.77 13.77 0 0 0-.545 1.478c-.09.288-.171.59-.244.908H9.28a10.84 10.84 0 0 0-.244-.908 13.77 13.77 0 0 0-.545-1.478 7.312 7.312 0 0 0-.233-.504 6.02 6.02 0 0 0-.515 0zM5.456 4.57c.106-.387.227-.756.36-1.107.12-.32.252-.63.395-.93-.917.292-1.74.746-2.43 1.322a6.037 6.037 0 0 0-.618.596h2.16c.022.04.067.078.133.12zm-.77 1.5H2.269c-.178.5-.307 1.024-.383 1.57h2.36c.036-.522.1-1.028.188-1.512.015-.02.035-.039.052-.058zm-.306 3.07H2.012c.063.568.18 1.12.345 1.647h2.47a14.6 14.6 0 0 1-.195-1.57c.001-.026.017-.051.048-.077zm.36 3.148H2.653a6.017 6.017 0 0 0 1.146 1.8c.249.277.52.533.812.765a8.693 8.693 0 0 1-.412-1.028 11.4 11.4 0 0 1-.384-1.166c-.017-.114-.062-.229-.092-.371zm2.47 2.665c.082-.192.161-.36.232-.504.12-.248.232-.51.335-.79.112-.3.214-.618.306-.95H5.72c.09.333.193.65.306.95.103.28.214.542.336.79.07.144.149.312.232.504.167.008.339.012.515.012.008-.006.017-.012.027-.012h.075z" />
    </svg>
);

// Sample playlists for "Your Library"
const libraryItems = [
    { id: 'liked', name: 'Liked Songs', type: 'Playlist', imageUrl: '', isLiked: true },
    { id: '1', name: 'Daily Mix 1', type: 'Playlist', imageUrl: '' },
    { id: '2', name: 'Discover Weekly', type: 'Playlist', imageUrl: '' },
    { id: '3', name: 'Release Radar', type: 'Playlist', imageUrl: '' },
    { id: '4', name: 'Chill Hits', type: 'Playlist', imageUrl: '' },
    { id: '5', name: 'Rock Classics', type: 'Playlist', imageUrl: '' },
];

export default function SpotifySidebar() {
    const pathname = usePathname();
    const [filter, setFilter] = useState<'playlists' | 'artists' | 'albums' | null>(null);

    return (
        <div className="w-[420px] flex flex-col gap-2 p-2 flex-shrink-0">
            {/* Top Navigation Box */}
            <div className="bg-[#121212] rounded-lg p-4">
                <Link href="/" className="mb-5 block">
                    <SpotifyLogo />
                </Link>

                <nav className="space-y-2">
                    <Link
                        href="/"
                        className={`flex items-center gap-4 px-3 py-2 rounded-md transition-colors ${pathname === '/' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
                            }`}
                    >
                        <HomeIcon active={pathname === '/'} />
                        <span className="font-bold">Home</span>
                    </Link>
                    <Link
                        href="/search"
                        className={`flex items-center gap-4 px-3 py-2 rounded-md transition-colors ${pathname === '/search' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
                            }`}
                    >
                        <SearchIcon active={pathname === '/search'} />
                        <span className="font-bold">Search</span>
                    </Link>
                </nav>
            </div>

            {/* Library Box */}
            <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
                {/* Library Header */}
                <div className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href="/library"
                            className={`flex items-center gap-3 transition-colors ${pathname === '/library' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
                                }`}
                        >
                            <LibraryIcon active={pathname === '/library'} />
                            <span className="font-bold">Your Library</span>
                        </Link>
                        <button className="w-8 h-8 flex items-center justify-center text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-full transition-colors">
                            <PlusIcon />
                        </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilter(filter === 'playlists' ? null : 'playlists')}
                            className={`chip ${filter === 'playlists' ? 'active' : ''}`}
                        >
                            Playlists
                        </button>
                        <button
                            onClick={() => setFilter(filter === 'artists' ? null : 'artists')}
                            className={`chip ${filter === 'artists' ? 'active' : ''}`}
                        >
                            Artists
                        </button>
                        <button
                            onClick={() => setFilter(filter === 'albums' ? null : 'albums')}
                            className={`chip ${filter === 'albums' ? 'active' : ''}`}
                        >
                            Albums
                        </button>
                    </div>
                </div>

                {/* Library List */}
                <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-hide">
                    {libraryItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.id === 'liked' ? '/liked' : `/playlist/${item.id}`}
                            className={`library-item flex items-center gap-3 p-2 ${pathname === (item.id === 'liked' ? '/liked' : `/playlist/${item.id}`) ? 'active' : ''
                                }`}
                        >
                            <div className="w-12 h-12 rounded flex-shrink-0 overflow-hidden">
                                {item.isLiked ? (
                                    <div className="w-full h-full bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center">
                                        <svg viewBox="0 0 16 16" width="16" height="16" fill="white">
                                            <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="#7f7f7f">
                                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className={`text-base truncate ${pathname === (item.id === 'liked' ? '/liked' : `/playlist/${item.id}`) ? 'text-white' : 'text-white'}`}>
                                    {item.name}
                                </p>
                                <p className="text-sm text-[#b3b3b3] truncate">{item.type} • You</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Legal Footer */}
            <div className="bg-[#121212] rounded-lg p-4">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#b3b3b3] mb-4">
                    <a href="#" className="hover:underline">Legal</a>
                    <a href="#" className="hover:underline">Safety & Privacy Center</a>
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Cookies</a>
                    <a href="#" className="hover:underline">About Ads</a>
                    <a href="#" className="hover:underline">Accessibility</a>
                </div>
                <button className="flex items-center gap-2 px-3 py-1 border border-[#7f7f7f] rounded-full text-sm font-bold hover:border-white hover:scale-105 transition-all">
                    <GlobalIcon />
                    English
                </button>
            </div>
        </div>
    );
}
