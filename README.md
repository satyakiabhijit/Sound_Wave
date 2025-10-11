# � SoundWave - Modern Music Player

<div align="center">

![SoundWave](https://img.shields.io/badge/SoundWave-Music%20Player-1db954?style=for-the-badge&logo=spotify&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

![Responsive](https://img.shields.io/badge/Responsive-Yes-green?style=for-the-badge)
![Modern UI](https://img.shields.io/badge/Modern%20UI-Design-purple?style=for-the-badge)

</div>

## 🎶 About

**SoundWave** is a modern, responsive web-based music player built with vanilla HTML, CSS, and JavaScript. Inspired by popular music streaming platforms, it provides an elegant and intuitive interface for playing your favorite music tracks.

### 🎯 Key Features
- � **Full Music Playback**: Play, pause, skip, and control your music
- 🔀 **Shuffle & Repeat**: Randomize your playlist or repeat your favorite tracks
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface inspired by Spotify
- � **Playlist Management**: Organize your music into playlists
- 🔍 **Search Functionality**: Find your favorite songs quickly

## ✨ Features

### � **Music Player Controls**
- Play/Pause functionality
- Next/Previous track navigation
- Shuffle and repeat modes
- Volume control with mute option
- Progress bar with seek functionality
- Real-time duration display

### 🎨 **User Interface**
- Modern, dark-themed design
- Responsive layout for all devices
- Smooth animations and transitions
- Interactive album artwork display
- Navigation sidebar with playlists

### 📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly controls
- Optimized for various screen sizes
- Cross-browser compatibility

### 🎯 **Music Library**
- Song collection with metadata
- Album artwork display
- Artist and album information
- Duration tracking
- Playlist organization

## 🛠️ Tech Stack

### **Core Technologies**
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### **Libraries & Dependencies**
- **Font Awesome** - Icons for player controls and navigation
- **CSS Grid & Flexbox** - Modern layout system
- **CSS Animations** - Smooth transitions and effects
- **HTML5 Audio API** - Audio playback functionality
- **JavaScript ES6+** - Modern JavaScript features and classes

### **Features Implemented**
- **Audio Controls**: HTML5 Audio API for playback
- **Responsive Design**: CSS Grid and Flexbox
- **State Management**: JavaScript classes and event handling
- **User Interface**: Modern CSS with hover effects and animations

## 🚀 Getting Started

### Prerequisites
- A modern web browser with HTML5 audio support
- Local web server (recommended for development)

### Installation

1. **Clone or Download the Repository**
   ```bash
   git clone <repository-url>
   cd music-player
   ```

2. **Add Your Music Files**
   ```bash
   # Create an audio directory
   mkdir audio
   
   # Add your .mp3 files to the audio directory
   # Update the file paths in script.js accordingly
   ```

3. **Open the Project**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server like Live Server in VS Code
   ```

4. **For Development with Live Server**
   ```bash
   # If you have Python installed
   python -m http.server 8000
   
   # Or with Node.js
   npx serve .
   
   # Or use VS Code Live Server extension
   ```

5. **Access the Music Player**
   - Open `http://localhost:8000` in your browser
   - Or directly open `index.html` file

## 📁 Project Structure

```
music-player/
├── 📄 index.html              # Main HTML structure
├── 🎨 style.css               # Stylesheet and responsive design
├── ⚡ script.js               # Music player functionality
├──  README.md               # Project documentation
└── 📁 audio/                  # Music files directory (create this)
    ├── 🎵 song1.mp3
    ├── 🎵 song2.mp3
    └── 🎵 ...
```

## ⚙️ Configuration

### Adding Your Own Music

1. **Prepare Your Music Files**
   - Place your `.mp3` files in the `audio/` directory
   - Ensure proper naming for easy management

2. **Update the Song List**
   - Open `script.js`
   - Modify the `songs` array in the `MusicPlayer` constructor
   - Update file paths, titles, artists, and album information

   ```javascript
   this.songs = [
       {
           id: 1,
           title: "Your Song Title",
           artist: "Artist Name",
           album: "Album Name",
           duration: "3:45",
           src: "audio/your-song.mp3",
           cover: "path/to/cover-image.jpg"
       },
       // Add more songs...
   ];
   ```

3. **Customize Album Artwork**
   - Add cover images to an `images/` directory
   - Update the `cover` property in the songs array
   - Or use placeholder images as currently implemented

## 🎵 Usage

### Basic Controls
- **Play/Pause**: Click the play button or spacebar
- **Next/Previous**: Use navigation arrows or keyboard arrows
- **Volume**: Adjust using the volume slider
- **Seek**: Click anywhere on the progress bar
- **Shuffle**: Toggle random playback order
- **Repeat**: Toggle repeat mode for current track

### Navigation
- **Sidebar**: Access playlists and library sections
- **Search**: Find specific songs (functionality to be implemented)
- **User Profile**: Access user settings and preferences

## 🎨 Customization

### Themes and Colors
- Modify the CSS variables in `style.css` for color schemes
- Update the gradient backgrounds and accent colors
- Customize button styles and hover effects

### Layout Modifications
- Adjust the grid layout in the main content area
- Modify sidebar width and navigation structure
- Update responsive breakpoints for different devices

## � Development

### Key Components

1. **MusicPlayer Class** (`script.js`)
   - Handles audio playback logic
   - Manages playlist and song data
   - Controls player state and UI updates

2. **CSS Grid Layout** (`style.css`)
   - Responsive design system
   - Modern flexbox and grid implementation
   - Mobile-first responsive breakpoints

3. **HTML Structure** (`index.html`)
   - Semantic HTML5 structure
   - Accessibility considerations
   - Modern web standards compliance

### Future Enhancements
- 🔍 Advanced search functionality
- 📱 Progressive Web App (PWA) features
- 🎚️ Equalizer controls
- 📊 Music visualization
- ☁️ Cloud storage integration
- 👥 Social sharing features

## 🤝 Contributing

We welcome contributions to improve SoundWave! Here's how you can help:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Ideas
- Add new player features (equalizer, lyrics display)
- Improve responsive design
- Add keyboard shortcuts
- Implement playlist management
- Add music visualization
- Improve accessibility features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Acknowledgments

- Design inspiration from modern music streaming platforms
- Font Awesome for the beautiful icons
- HTML5 Audio API for seamless audio playback
- CSS Grid and Flexbox for responsive layout

---

<div align="center">

### � Enjoy Your Music with SoundWave! �

**Built with ❤️ for music lovers everywhere**

*Experience your favorite tracks with style and simplicity*

![Music Notes](https://img.shields.io/badge/♪♫♪-Music%20Notes-brightgreen?style=for-the-badge)

</div>