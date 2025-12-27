import { JamendoTrack, JamendoAlbum, JamendoArtist, JamendoResponse, Track, Album, Artist } from '@/types';

const CLIENT_ID = '981ad1da';
const BASE_URL = 'https://api.jamendo.com/v3.0';

// Helper to convert Jamendo track to our Track type
export function convertTrack(track: JamendoTrack): Track {
    return {
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        artistId: track.artist_id,
        album: track.album_name,
        albumId: track.album_id,
        duration: track.duration,
        coverUrl: track.album_image || track.image,
        audioUrl: track.audio,
    };
}

// Helper to convert Jamendo album to our Album type
export function convertAlbum(album: JamendoAlbum): Album {
    return {
        id: album.id,
        name: album.name,
        artist: album.artist_name,
        artistId: album.artist_id,
        coverUrl: album.image,
        releaseDate: album.releasedate,
        tracks: [],
    };
}

// Helper to convert Jamendo artist to our Artist type
export function convertArtist(artist: JamendoArtist): Artist {
    return {
        id: artist.id,
        name: artist.name,
        imageUrl: artist.image,
        genres: [],
    };
}

// Fetch popular tracks
export async function getPopularTracks(limit: number = 20): Promise<Track[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=popularity_total&include=musicinfo`
        );
        const data: JamendoResponse<JamendoTrack> = await response.json();
        return data.results.map(convertTrack);
    } catch (error) {
        console.error('Error fetching popular tracks:', error);
        return [];
    }
}

// Fetch tracks by tag/genre
export async function getTracksByTag(tag: string, limit: number = 20): Promise<Track[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&tags=${encodeURIComponent(tag)}&order=popularity_total`
        );
        const data: JamendoResponse<JamendoTrack> = await response.json();
        return data.results.map(convertTrack);
    } catch (error) {
        console.error('Error fetching tracks by tag:', error);
        return [];
    }
}

// Search tracks
export async function searchTracks(query: string, limit: number = 20): Promise<Track[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&order=relevance`
        );
        const data: JamendoResponse<JamendoTrack> = await response.json();
        return data.results.map(convertTrack);
    } catch (error) {
        console.error('Error searching tracks:', error);
        return [];
    }
}

// Fetch popular albums
export async function getPopularAlbums(limit: number = 20): Promise<Album[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/albums/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=popularity_total`
        );
        const data: JamendoResponse<JamendoAlbum> = await response.json();
        return data.results.map(convertAlbum);
    } catch (error) {
        console.error('Error fetching popular albums:', error);
        return [];
    }
}

// Fetch album tracks
export async function getAlbumTracks(albumId: string): Promise<Track[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/albums/tracks/?client_id=${CLIENT_ID}&format=json&id=${albumId}`
        );
        const data: JamendoResponse<JamendoAlbum & { tracks: JamendoTrack[] }> = await response.json();
        if (data.results.length > 0 && data.results[0].tracks) {
            return data.results[0].tracks.map(convertTrack);
        }
        return [];
    } catch (error) {
        console.error('Error fetching album tracks:', error);
        return [];
    }
}

// Search albums
export async function searchAlbums(query: string, limit: number = 20): Promise<Album[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/albums/?client_id=${CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&order=relevance`
        );
        const data: JamendoResponse<JamendoAlbum> = await response.json();
        return data.results.map(convertAlbum);
    } catch (error) {
        console.error('Error searching albums:', error);
        return [];
    }
}

// Fetch artists
export async function getPopularArtists(limit: number = 20): Promise<Artist[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/artists/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=popularity_total&hasimage=true`
        );
        const data: JamendoResponse<JamendoArtist> = await response.json();
        return data.results.map(convertArtist);
    } catch (error) {
        console.error('Error fetching popular artists:', error);
        return [];
    }
}

// Search artists
export async function searchArtists(query: string, limit: number = 20): Promise<Artist[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/artists/?client_id=${CLIENT_ID}&format=json&limit=${limit}&namesearch=${encodeURIComponent(query)}&order=relevance&hasimage=true`
        );
        const data: JamendoResponse<JamendoArtist> = await response.json();
        return data.results.map(convertArtist);
    } catch (error) {
        console.error('Error searching artists:', error);
        return [];
    }
}

// Get artist tracks
export async function getArtistTracks(artistId: string, limit: number = 20): Promise<Track[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&artist_id=${artistId}&order=popularity_total`
        );
        const data: JamendoResponse<JamendoTrack> = await response.json();
        return data.results.map(convertTrack);
    } catch (error) {
        console.error('Error fetching artist tracks:', error);
        return [];
    }
}

// Get featured/curated playlists (using tags as categories)
export async function getFeaturedPlaylists(): Promise<{ name: string; tag: string; color: string }[]> {
    return [
        { name: 'Chill Vibes', tag: 'chillout', color: 'from-blue-500 to-purple-600' },
        { name: 'Electronic Beats', tag: 'electronic', color: 'from-pink-500 to-orange-500' },
        { name: 'Rock Classics', tag: 'rock', color: 'from-red-600 to-yellow-500' },
        { name: 'Jazz Sessions', tag: 'jazz', color: 'from-amber-500 to-pink-500' },
        { name: 'Hip Hop Flow', tag: 'hiphop', color: 'from-green-500 to-teal-500' },
        { name: 'Ambient Dreams', tag: 'ambient', color: 'from-indigo-500 to-purple-600' },
        { name: 'Pop Hits', tag: 'pop', color: 'from-rose-500 to-pink-500' },
        { name: 'Classical', tag: 'classical', color: 'from-yellow-500 to-amber-600' },
    ];
}

// Get browse categories
export async function getBrowseCategories() {
    return [
        { id: 'pop', name: 'Pop', color: '#E13300', imageUrl: '' },
        { id: 'rock', name: 'Rock', color: '#8D67AB', imageUrl: '' },
        { id: 'electronic', name: 'Electronic', color: '#1E3264', imageUrl: '' },
        { id: 'hiphop', name: 'Hip Hop', color: '#BA5D07', imageUrl: '' },
        { id: 'jazz', name: 'Jazz', color: '#608108', imageUrl: '' },
        { id: 'classical', name: 'Classical', color: '#477D95', imageUrl: '' },
        { id: 'ambient', name: 'Ambient', color: '#503750', imageUrl: '' },
        { id: 'chillout', name: 'Chill', color: '#0D73EC', imageUrl: '' },
        { id: 'folk', name: 'Folk', color: '#A56752', imageUrl: '' },
        { id: 'metal', name: 'Metal', color: '#1E1E1E', imageUrl: '' },
        { id: 'reggae', name: 'Reggae', color: '#148A08', imageUrl: '' },
        { id: 'blues', name: 'Blues', color: '#2D46B9', imageUrl: '' },
    ];
}
