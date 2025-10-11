// Music Player JavaScript

class MusicPlayer {
    constructor() {
        this.songs = [
            {
                id: 1,
                title: "Song Title 1",
                artist: "Artist 1",
                album: "Album 1",
                duration: "3:45",
                src: "audio/song1.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/1db954/ffffff?text=Song+1"
            },
            {
                id: 2,
                title: "Song Title 2",
                artist: "Artist 2",
                album: "Album 2",
                duration: "4:20",
                src: "audio/song2.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/e22856/ffffff?text=Song+2"
            },
            {
                id: 3,
                title: "Song Title 3",
                artist: "Artist 3",
                album: "Album 3",
                duration: "3:30",
                src: "audio/song3.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/ff6b35/ffffff?text=Song+3"
            },
            {
                id: 4,
                title: "Song Title 4",
                artist: "Artist 4",
                album: "Album 4",
                duration: "5:15",
                src: "audio/song4.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/4ecdc4/ffffff?text=Song+4"
            },
            {
                id: 5,
                title: "Song Title 5",
                artist: "Artist 5",
                album: "Album 5",
                duration: "3:58",
                src: "audio/song5.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/45b7d1/ffffff?text=Song+5"
            },
            {
                id: 6,
                title: "Song Title 6",
                artist: "Artist 6",
                album: "Album 6",
                duration: "4:12",
                src: "audio/song6.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/f39c12/ffffff?text=Song+6"
            },
            {
                id: 7,
                title: "Song Title 7",
                artist: "Artist 7",
                album: "Album 7",
                duration: "3:25",
                src: "audio/song7.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/9b59b6/ffffff?text=Song+7"
            },
            {
                id: 8,
                title: "Song Title 8",
                artist: "Artist 8",
                album: "Album 8",
                duration: "4:33",
                src: "audio/song8.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/e74c3c/ffffff?text=Song+8"
            },
            {
                id: 9,
                title: "Song Title 9",
                artist: "Artist 9",
                album: "Album 9",
                duration: "3:41",
                src: "audio/song9.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/2ecc71/ffffff?text=Song+9"
            },
            {
                id: 10,
                title: "Song Title 10",
                artist: "Artist 10",
                album: "Album 10",
                duration: "4:07",
                src: "audio/song10.mp3", // Add your audio file path here
                cover: "https://via.placeholder.com/300x300/34495e/ffffff?text=Song+10"
            }
        ];

        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeated = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;

        this.initializeElements();
        this.setupEventListeners();
        this.renderSongs();
        this.updatePlayerDisplay();
    }

    initializeElements() {
        // Audio element
        this.audio = document.getElementById('audioPlayer');
        
        // Player elements
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        
        // Display elements
        this.currentSongImage = document.getElementById('currentSongImage');
        this.currentSongTitle = document.getElementById('currentSongTitle');
        this.currentSongArtist = document.getElementById('currentSongArtist');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        
        // Progress elements
        this.progressFill = document.getElementById('progressFill');
        this.progressHandle = document.getElementById('progressHandle');
        this.progressTrack = document.querySelector('.progress-track');
        
        // Volume elements
        this.volumeFill = document.getElementById('volumeFill');
        this.volumeHandle = document.getElementById('volumeHandle');
        this.volumeBar = document.querySelector('.volume-bar');
        
        // Songs grid
        this.songsGrid = document.getElementById('songsGrid');
    }

    setupEventListeners() {
        // Player controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        
        // Progress bar
        this.progressTrack.addEventListener('click', (e) => this.seekTo(e));
        
        // Volume control
        this.volumeBar.addEventListener('click', (e) => this.setVolume(e));
        
        // Set initial volume
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
    }

    renderSongs() {
        this.songsGrid.innerHTML = '';
        
        this.songs.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <button class="play-button" onclick="musicPlayer.playSong(${index})">
                    <i class="fas fa-play"></i>
                </button>
            `;
            
            songCard.addEventListener('click', () => this.playSong(index));
            this.songsGrid.appendChild(songCard);
        });
    }

    playSong(index) {
        this.currentSongIndex = index;
        const song = this.songs[this.currentSongIndex];
        
        this.audio.src = song.src;
        this.audio.load();
        
        this.updatePlayerDisplay();
        
        if (this.isPlaying) {
            this.audio.play().catch(e => {
                console.log('Error playing audio:', e);
                // Handle case where audio file doesn't exist
                this.showNotification('Audio file not found. Please add your music files to the audio folder.');
            });
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.audio.src) {
            this.playSong(0);
        }
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(e => {
            console.log('Error playing audio:', e);
            this.showNotification('Audio file not found. Please add your music files to the audio folder.');
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    previousSong() {
        if (this.isShuffled) {
            this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            this.currentSongIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.songs.length - 1;
        }
        this.playSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    nextSong() {
        if (this.isShuffled) {
            this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            this.currentSongIndex = this.currentSongIndex < this.songs.length - 1 ? this.currentSongIndex + 1 : 0;
        }
        this.playSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.style.color = this.isShuffled ? '#1db954' : '#b3b3b3';
    }

    toggleRepeat() {
        this.isRepeated = !this.isRepeated;
        this.repeatBtn.style.color = this.isRepeated ? '#1db954' : '#b3b3b3';
    }

    handleSongEnd() {
        if (this.isRepeated) {
            this.audio.currentTime = 0;
            this.play();
        } else {
            this.nextSong();
        }
    }

    updatePlayerDisplay() {
        const song = this.songs[this.currentSongIndex];
        this.currentSongImage.src = song.cover;
        this.currentSongTitle.textContent = song.title;
        this.currentSongArtist.textContent = song.artist;
    }

    updateProgress() {
        this.currentTime = this.audio.currentTime;
        this.duration = this.audio.duration;
        
        if (this.duration) {
            const progressPercent = (this.currentTime / this.duration) * 100;
            this.progressFill.style.width = `${progressPercent}%`;
            this.progressHandle.style.left = `${progressPercent}%`;
        }
        
        this.currentTimeEl.textContent = this.formatTime(this.currentTime);
    }

    updateDuration() {
        this.duration = this.audio.duration;
        this.totalTimeEl.textContent = this.formatTime(this.duration);
    }

    seekTo(e) {
        const rect = this.progressTrack.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * this.duration;
        this.audio.currentTime = newTime;
    }

    setVolume(e) {
        const rect = this.volumeBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.volume = Math.max(0, Math.min(1, percent));
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
    }

    updateVolumeDisplay() {
        const volumePercent = this.volume * 100;
        this.volumeFill.style.width = `${volumePercent}%`;
        this.volumeHandle.style.left = `${volumePercent}%`;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1db954;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: inherit;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize the music player when the page loads
let musicPlayer;

document.addEventListener('DOMContentLoaded', () => {
    musicPlayer = new MusicPlayer();
});

// Additional UI interactions
document.addEventListener('DOMContentLoaded', () => {
    // Navigation active states
    const navItems = document.querySelectorAll('.navigation li');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Playlist interactions
    const playlistItems = document.querySelectorAll('.playlists li');
    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            playlistItems.forEach(playlist => playlist.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Quick pick interactions
    const quickPicks = document.querySelectorAll('.quick-pick-item');
    quickPicks.forEach(pick => {
        pick.addEventListener('click', () => {
            // Add functionality for quick picks
            console.log('Quick pick clicked:', pick.querySelector('span').textContent);
        });
    });

    // Like button functionality
    const likeBtn = document.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
        const icon = likeBtn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#1db954';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '#b3b3b3';
        }
    });
});
