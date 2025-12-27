'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { searchTracks, getBrowseCategories, getTracksByTag } from '@/lib/jamendo';
import { Track } from '@/types';
import { usePlayer } from '@/context/PlayerContext';
import { formatDuration } from '@/lib/utils';

const HomeIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const LibraryIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
    </svg>
);

const PlayIcon = ({ size = 14 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = ({ size = 14 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
);

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string; color: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

    useEffect(() => {
        async function fetchCategories() {
            const cats = await getBrowseCategories();
            setCategories(cats);
        }
        fetchCategories();
    }, []);

    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setTracks([]);
            setHasSearched(false);
            return;
        }
        setLoading(true);
        setHasSearched(true);
        try {
            const results = await searchTracks(query, 20);
            setTracks(results);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => performSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, performSearch]);

    const handleCategoryClick = async (categoryId: string) => {
        setLoading(true);
        setHasSearched(true);
        setSearchQuery(categoryId);
        try {
            const results = await getTracksByTag(categoryId, 20);
            setTracks(results);
        } catch (error) {
            console.error('Category error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex bg-[#f8f9fa] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white flex flex-col border-r border-gray-100">
                <div className="p-6 pb-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-[#1ed760] rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Sound-Wave</span>
                    </Link>
                </div>

                <nav className="px-3 mb-4">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg mb-1 transition-colors">
                        <HomeIcon />
                        <span className="font-medium text-sm">Home</span>
                    </Link>
                    <Link href="/search" className="flex items-center gap-3 px-3 py-2.5 text-gray-900 bg-gray-100 rounded-lg mb-1">
                        <SearchIcon />
                        <span className="font-medium text-sm">Search</span>
                    </Link>
                    <Link href="/library" className="flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                        <LibraryIcon />
                        <span className="font-medium text-sm">Library</span>
                    </Link>
                </nav>

                <div className="flex-1"></div>

                {currentTrack && (
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                                {currentTrack.coverUrl ? (
                                    <Image src={currentTrack.coverUrl} alt={currentTrack.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">{currentTrack.title}</p>
                                <p className="text-xs text-gray-500 truncate">{currentTrack.artist}</p>
                            </div>
                            <button onClick={togglePlay} className="w-8 h-8 bg-[#1ed760] rounded-full flex items-center justify-center text-white">
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
                        <div className="relative max-w-lg">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="What do you want to listen to?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 bg-white rounded-full pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1ed760] border border-gray-200 shadow-sm"
                            />
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-2 border-[#1ed760] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Search Results */}
                    {!loading && hasSearched && tracks.length > 0 && (
                        <div className="space-y-2">
                            {tracks.map((track, index) => (
                                <div
                                    key={track.id}
                                    onClick={() => playTrack(track, tracks)}
                                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${currentTrack?.id === track.id ? 'bg-green-50 border border-green-100' : 'hover:bg-white'
                                        }`}
                                >
                                    <span className="w-6 text-center text-sm text-gray-400">{index + 1}</span>
                                    <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                                        {track.coverUrl ? (
                                            <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium truncate ${currentTrack?.id === track.id ? 'text-[#1ed760]' : 'text-gray-900'}`}>
                                            {track.title}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{track.artist}</p>
                                    </div>
                                    <span className="text-sm text-gray-400">{formatDuration(track.duration)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && hasSearched && tracks.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No results found for &quot;{searchQuery}&quot;</p>
                        </div>
                    )}

                    {/* Browse Categories */}
                    {!hasSearched && !loading && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse all</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.id)}
                                        className="aspect-[3/2] rounded-xl overflow-hidden relative cursor-pointer hover:scale-105 transition-transform shadow-sm"
                                        style={{ backgroundColor: category.color }}
                                    >
                                        <h3 className="absolute top-4 left-4 text-xl font-bold text-white">{category.name}</h3>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
