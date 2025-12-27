'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPopularAlbums, getPopularArtists, getPopularTracks, getFeaturedPlaylists, getTracksByTag } from '@/lib/jamendo';
import { Album, Artist, Track } from '@/types';
import { usePlayer } from '@/context/PlayerContext';

type FilterType = 'playlists' | 'artists' | 'albums';

interface PlaylistData {
    name: string;
    tag: string;
    color: string;
    tracks: Track[];
}

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

export default function LibraryPage() {
    const [filter, setFilter] = useState<FilterType>('playlists');
    const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                if (filter === 'playlists') {
                    const meta = await getFeaturedPlaylists();
                    const data = await Promise.all(
                        meta.slice(0, 6).map(async (p) => ({
                            ...p,
                            tracks: await getTracksByTag(p.tag, 10)
                        }))
                    );
                    setPlaylists(data);
                } else if (filter === 'albums') {
                    setAlbums(await getPopularAlbums(12));
                } else {
                    setArtists(await getPopularArtists(12));
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [filter]);

    const filters: { id: FilterType; label: string }[] = [
        { id: 'playlists', label: 'Playlists' },
        { id: 'albums', label: 'Albums' },
        { id: 'artists', label: 'Artists' },
    ];

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
                    <Link href="/search" className="flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg mb-1 transition-colors">
                        <SearchIcon />
                        <span className="font-medium text-sm">Search</span>
                    </Link>
                    <Link href="/library" className="flex items-center gap-3 px-3 py-2.5 text-gray-900 bg-gray-100 rounded-lg">
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Library</h1>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-8">
                        {filters.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === f.id
                                        ? 'bg-[#1ed760] text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-2 border-[#1ed760] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Playlists */}
                    {!loading && filter === 'playlists' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {/* Liked Songs */}
                            <Link href="/liked" className="group">
                                <div className="aspect-square rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 flex items-center justify-center mb-3 shadow-lg group-hover:scale-105 transition-transform">
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="white">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900">Liked Songs</h3>
                                <p className="text-sm text-gray-500">Your favorites</p>
                            </Link>

                            {playlists.map((p) => (
                                <div
                                    key={p.tag}
                                    onClick={() => p.tracks.length > 0 && playTrack(p.tracks[0], p.tracks)}
                                    className="group cursor-pointer"
                                >
                                    <div className={`aspect-square rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-105 transition-transform`}>
                                        <svg viewBox="0 0 24 24" width="48" height="48" fill="white" opacity="0.9">
                                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                                    <p className="text-sm text-gray-500">{p.tracks.length} songs</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Albums */}
                    {!loading && filter === 'albums' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {albums.map((album) => (
                                <div key={album.id} className="group cursor-pointer">
                                    <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-lg group-hover:scale-105 transition-transform relative">
                                        {album.coverUrl ? (
                                            <Image src={album.coverUrl} alt={album.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 truncate">{album.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{album.artist}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Artists */}
                    {!loading && filter === 'artists' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {artists.map((artist) => (
                                <div key={artist.id} className="group cursor-pointer text-center">
                                    <div className="aspect-square rounded-full overflow-hidden mb-3 shadow-lg group-hover:scale-105 transition-transform mx-auto w-40 relative">
                                        {artist.imageUrl ? (
                                            <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" width="48" height="48" fill="#999">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{artist.name}</h3>
                                    <p className="text-sm text-gray-500">Artist</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
