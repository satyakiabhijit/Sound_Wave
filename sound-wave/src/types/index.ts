// Jamendo API Types
export interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  artist_idstr: string;
  album_name: string;
  album_id: string;
  license_ccurl: string;
  position: number;
  releasedate: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  prourl: string;
  shorturl: string;
  shareurl: string;
  waveform: string;
  image: string;
  audiodownload_allowed: boolean;
}

export interface JamendoAlbum {
  id: string;
  name: string;
  releasedate: string;
  artist_id: string;
  artist_name: string;
  image: string;
  zip: string;
  shorturl: string;
  shareurl: string;
  zip_allowed: boolean;
}

export interface JamendoArtist {
  id: string;
  name: string;
  website: string;
  joindate: string;
  image: string;
  shorturl: string;
  shareurl: string;
}

export interface JamendoPlaylist {
  id: string;
  name: string;
  creationdate: string;
  user_id: string;
  user_name: string;
  zip: string;
  shorturl: string;
  shareurl: string;
}

export interface JamendoResponse<T> {
  headers: {
    status: string;
    code: number;
    error_message: string;
    warnings: string;
    results_count: number;
  };
  results: T[];
}

// App Types
export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  createdBy: string;
  gradient?: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseDate: string;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genres: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  imageUrl: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: RepeatMode;
  queue: Track[];
  queueIndex: number;
}
