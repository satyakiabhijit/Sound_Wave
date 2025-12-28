'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPopularAlbums, getPopularArtists, getFeaturedPlaylists, getTracksByTag } from '@/lib/jamendo';
import { Album, Artist, Track } from '@/types';
import { usePlayer } from '@/context/PlayerContext';

type FilterType = 'playlists' | 'artists' | 'albums';

interface PlaylistData {
    name: string;
    tag: string;
    color: string;
    tracks: Track[];
}

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

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
);

export default function LibraryPage() {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterType>('playlists');
    const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrack } = usePlayer();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                if (filter === 'playlists') {
                    const meta = await getFeaturedPlaylists();
                    const data = await Promise.all(
                        meta.slice(0, 8).map(async (p) => ({
                            ...p,
                            tracks: await getTracksByTag(p.tag, 10)
                        }))
                    );
                    setPlaylists(data);
                } else if (filter === 'albums') {
                    setAlbums(await getPopularAlbums(16));
                } else {
                    setArtists(await getPopularArtists(16));
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
            </header>

            <div className="px-6 pb-8">
                <h1 className="text-3xl font-bold text-white mb-6">Your Library</h1>

                {/* Filter Pills */}
                <div className="flex gap-2 mb-6">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`chip ${filter === f.id ? 'active' : ''}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Playlists */}
                {!loading && filter === 'playlists' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {/* Liked Songs */}
                        <Link href="/liked" className="spotify-card group cursor-pointer">
                            <div className="relative aspect-square mb-4">
                                <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center shadow-lg">
                                    <svg viewBox="0 0 16 16" width="32" height="32" fill="white">
                                        <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z" />
                                    </svg>
                                </div>
                                <button className="spotify-play-btn absolute bottom-2 right-2 w-12 h-12 flex items-center justify-center text-black">
                                    <PlayIcon />
                                </button>
                            </div>
                            <p className="text-white font-bold truncate mb-1">Liked Songs</p>
                            <p className="text-[#b3b3b3] text-sm">Playlist • Your favorites</p>
                        </Link>

                        {playlists.map((p) => (
                            <Link
                                key={p.tag}
                                href={`/playlist/${p.tag}`}
                                className="spotify-card group cursor-pointer"
                            >
                                <div className="relative aspect-square mb-4">
                                    <div className={`absolute inset-0 rounded-md bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg`}>
                                        <svg viewBox="0 0 24 24" width="48" height="48" fill="white" opacity="0.9">
                                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                        </svg>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (p.tracks.length > 0) playTrack(p.tracks[0], p.tracks);
                                        }}
                                        className="spotify-play-btn absolute bottom-2 right-2 w-12 h-12 flex items-center justify-center text-black"
                                    >
                                        <PlayIcon />
                                    </button>
                                </div>
                                <p className="text-white font-bold truncate mb-1">{p.name}</p>
                                <p className="text-[#b3b3b3] text-sm">Playlist • {p.tracks.length} songs</p>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Albums */}
                {!loading && filter === 'albums' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {albums.map((album) => (
                            <div key={album.id} className="spotify-card group cursor-pointer">
                                <div className="relative aspect-square mb-4">
                                    <div className="absolute inset-0 rounded-md overflow-hidden shadow-lg">
                                        {album.coverUrl ? (
                                            <Image src={album.coverUrl} alt={album.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" width="48" height="48" fill="#7f7f7f">
                                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                                </svg>
                                            </div>
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
                )}

                {/* Artists */}
                {!loading && filter === 'artists' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {artists.map((artist) => (
                            <div key={artist.id} className="spotify-card group cursor-pointer text-center">
                                <div className="relative aspect-square mb-4">
                                    <div className="absolute inset-0 rounded-full overflow-hidden shadow-lg">
                                        {artist.imageUrl ? (
                                            <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" width="48" height="48" fill="#7f7f7f">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <button className="spotify-play-btn absolute bottom-2 right-2 w-12 h-12 flex items-center justify-center text-black">
                                        <PlayIcon />
                                    </button>
                                </div>
                                <p className="text-white font-bold truncate mb-1">{artist.name}</p>
                                <p className="text-[#b3b3b3] text-sm">Artist</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
