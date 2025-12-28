'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchTracks, searchAlbums, getBrowseCategories, getTracksByTag } from '@/lib/jamendo';
import { Track, Album } from '@/types';
import { usePlayer } from '@/context/PlayerContext';

// Icons
const BackIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z" />
    </svg>
);

const ForwardIcon = () => (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.392a1 1 0 1 0 1.414-1.414l-4.344-4.366a9.244 9.244 0 0 0 2.077-5.833c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
    </svg>
);

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
);

export default function SearchPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string; color: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const { playTrack, currentTrack, isPlaying } = usePlayer();

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
            setAlbums([]);
            setHasSearched(false);
            return;
        }
        setLoading(true);
        setHasSearched(true);
        try {
            const [tracksResult, albumsResult] = await Promise.all([
                searchTracks(query, 20),
                searchAlbums(query, 8)
            ]);
            setTracks(tracksResult);
            setAlbums(albumsResult);
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
            setAlbums([]);
        } catch (error) {
            console.error('Category error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <header className="sticky top-0 z-10 px-6 py-4 flex items-center gap-4 bg-[#121212]">
                <button
                    onClick={() => router.back()}
                    className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white"
                >
                    <BackIcon />
                </button>
                <button
                    onClick={() => router.forward()}
                    className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white"
                >
                    <ForwardIcon />
                </button>

                {/* Search Input */}
                <div className="relative flex-1 max-w-[364px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b3b3]">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="What do you want to listen to?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-white rounded-full pl-12 pr-4 text-black text-sm placeholder-[#757575] focus:outline-none"
                    />
                </div>
            </header>

            <div className="px-6 pb-8">
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Search Results */}
                {!loading && hasSearched && (
                    <>
                        {tracks.length > 0 && (
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
                                <div className="space-y-1">
                                    {tracks.slice(0, 10).map((track, index) => (
                                        <div
                                            key={track.id}
                                            onClick={() => playTrack(track, tracks)}
                                            className={`track-row flex items-center gap-4 p-2 cursor-pointer ${currentTrack?.id === track.id ? 'bg-[rgba(255,255,255,0.1)]' : ''
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 relative">
                                                {track.coverUrl ? (
                                                    <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#282828]"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`truncate ${currentTrack?.id === track.id ? 'text-[#1ed760]' : 'text-white'}`}>
                                                    {track.title}
                                                </p>
                                                <p className="text-sm text-[#b3b3b3] truncate">{track.artist}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {albums.length > 0 && (
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                    {albums.map((album) => (
                                        <div key={album.id} className="spotify-card group cursor-pointer">
                                            <div className="relative aspect-square mb-4">
                                                <div className="absolute inset-0 rounded-md overflow-hidden shadow-lg">
                                                    {album.coverUrl ? (
                                                        <Image src={album.coverUrl} alt={album.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#282828]"></div>
                                                    )}
                                                </div>
                                                <button className="spotify-play-btn absolute bottom-2 right-2 w-12 h-12 flex items-center justify-center text-black">
                                                    <PlayIcon />
                                                </button>
                                            </div>
                                            <p className="text-white font-bold truncate mb-1">{album.name}</p>
                                            <p className="text-[#b3b3b3] text-sm truncate">{album.artist}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {tracks.length === 0 && albums.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-white text-xl mb-2">No results found for &ldquo;{searchQuery}&rdquo;</p>
                                <p className="text-[#b3b3b3]">Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Browse Categories */}
                {!hasSearched && !loading && (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6">Browse all</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className="aspect-square rounded-lg overflow-hidden relative cursor-pointer hover:scale-105 transition-transform"
                                    style={{ backgroundColor: category.color }}
                                >
                                    <h3 className="absolute top-4 left-4 text-2xl font-bold text-white">{category.name}</h3>
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
