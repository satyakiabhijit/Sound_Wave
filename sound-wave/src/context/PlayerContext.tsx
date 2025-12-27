'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Track, RepeatMode } from '@/types';
import { shuffleArray } from '@/lib/utils';

interface PlayerContextType {
    // State
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    progress: number;
    duration: number;
    shuffle: boolean;
    repeat: RepeatMode;
    queue: Track[];
    originalQueue: Track[];
    queueIndex: number;

    // Actions
    playTrack: (track: Track, tracks?: Track[]) => void;
    togglePlay: () => void;
    pause: () => void;
    resume: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    seekTo: (time: number) => void;
    setVolume: (volume: number) => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    addToQueue: (track: Track) => void;
    clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // State
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.7);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState<RepeatMode>('off');
    const [queue, setQueue] = useState<Track[]>([]);
    const [originalQueue, setOriginalQueue] = useState<Track[]>([]);
    const [queueIndex, setQueueIndex] = useState(0);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = volume;

        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setProgress(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            handleTrackEnd();
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTrackEnd = useCallback(() => {
        if (repeat === 'one') {
            // Repeat current track
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else if (queueIndex < queue.length - 1) {
            // Play next track
            const nextIndex = queueIndex + 1;
            setQueueIndex(nextIndex);
            setCurrentTrack(queue[nextIndex]);
        } else if (repeat === 'all' && queue.length > 0) {
            // Repeat queue from beginning
            setQueueIndex(0);
            setCurrentTrack(queue[0]);
        } else {
            // End of queue
            setIsPlaying(false);
        }
    }, [repeat, queueIndex, queue]);

    // Play track when currentTrack changes
    useEffect(() => {
        if (currentTrack && audioRef.current) {
            audioRef.current.src = currentTrack.audioUrl;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error('Playback error:', err));
        }
    }, [currentTrack]);

    // Update volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const playTrack = useCallback((track: Track, tracks?: Track[]) => {
        if (tracks && tracks.length > 0) {
            const trackIndex = tracks.findIndex(t => t.id === track.id);
            setOriginalQueue(tracks);

            if (shuffle) {
                const shuffled = shuffleArray(tracks);
                // Move selected track to front
                const selectedIndex = shuffled.findIndex(t => t.id === track.id);
                if (selectedIndex > 0) {
                    [shuffled[0], shuffled[selectedIndex]] = [shuffled[selectedIndex], shuffled[0]];
                }
                setQueue(shuffled);
                setQueueIndex(0);
            } else {
                setQueue(tracks);
                setQueueIndex(trackIndex >= 0 ? trackIndex : 0);
            }
        } else {
            setQueue([track]);
            setOriginalQueue([track]);
            setQueueIndex(0);
        }

        setCurrentTrack(track);
    }, [shuffle]);

    const togglePlay = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(err => console.error('Playback error:', err));
            }
        }
    }, [isPlaying]);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const resume = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error('Playback error:', err));
        }
    }, []);

    const nextTrack = useCallback(() => {
        if (queue.length === 0) return;

        let nextIndex = queueIndex + 1;
        if (nextIndex >= queue.length) {
            if (repeat === 'all') {
                nextIndex = 0;
            } else {
                return;
            }
        }

        setQueueIndex(nextIndex);
        setCurrentTrack(queue[nextIndex]);
    }, [queue, queueIndex, repeat]);

    const prevTrack = useCallback(() => {
        if (queue.length === 0) return;

        // If more than 3 seconds in, restart current track
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }

        let prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
            if (repeat === 'all') {
                prevIndex = queue.length - 1;
            } else {
                // Restart current track
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                }
                return;
            }
        }

        setQueueIndex(prevIndex);
        setCurrentTrack(queue[prevIndex]);
    }, [queue, queueIndex, repeat]);

    const seekTo = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    }, []);

    const setVolume = useCallback((newVolume: number) => {
        setVolumeState(Math.max(0, Math.min(1, newVolume)));
    }, []);

    const toggleShuffle = useCallback(() => {
        setShuffle(prev => {
            if (!prev) {
                // Turning shuffle on
                const currentTrackData = currentTrack;
                const shuffled = shuffleArray(originalQueue);
                if (currentTrackData) {
                    const idx = shuffled.findIndex(t => t.id === currentTrackData.id);
                    if (idx > 0) {
                        [shuffled[0], shuffled[idx]] = [shuffled[idx], shuffled[0]];
                    }
                }
                setQueue(shuffled);
                setQueueIndex(0);
            } else {
                // Turning shuffle off
                setQueue(originalQueue);
                if (currentTrack) {
                    const idx = originalQueue.findIndex(t => t.id === currentTrack.id);
                    setQueueIndex(idx >= 0 ? idx : 0);
                }
            }
            return !prev;
        });
    }, [currentTrack, originalQueue]);

    const toggleRepeat = useCallback(() => {
        setRepeat(prev => {
            if (prev === 'off') return 'all';
            if (prev === 'all') return 'one';
            return 'off';
        });
    }, []);

    const addToQueue = useCallback((track: Track) => {
        setQueue(prev => [...prev, track]);
        setOriginalQueue(prev => [...prev, track]);
    }, []);

    const clearQueue = useCallback(() => {
        setQueue([]);
        setOriginalQueue([]);
        setQueueIndex(0);
        setCurrentTrack(null);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
    }, []);

    const value: PlayerContextType = {
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        shuffle,
        repeat,
        queue,
        originalQueue,
        queueIndex,
        playTrack,
        togglePlay,
        pause,
        resume,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        clearQueue,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
}
