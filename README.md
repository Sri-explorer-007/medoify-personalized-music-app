# 🎵 Medoify — Personalized Music Streaming Application & Customization Studio

> A private, customizable music streaming web application built with modern Web Standards (HTML5, Vanilla CSS Design System, Modular JavaScript, Web Audio API DSP, and HTML5 Canvas).

---

## ✨ Features

- 🎨 **Deep Customization Studio**:
  - **8 Signature Color Themes**: Electric Lime, Spotify Classic Green, Cyberpunk Violet, Sunset Horizon, Oceanic Cyan, Rose Quartz, OLED Monochrome, and Golden Hour.
  - **Live Custom Color Engine**: Hex/RGB real-time custom palette switcher.
  - **Glassmorphism Tuner**: Sliders for blur intensity (0–30px), opacity, neon border glow, and corner radius.
  - **Dynamic Album Ambiance**: Automatically projects color aura from the active album cover into the ambient backdrop.
- 🎛️ **Web Audio API DSP & Sound Studio**:
  - **5-Band Graphic Equalizer**: 60Hz, 250Hz, 1kHz, 4kHz, 12kHz bands with presets (Bass Boost, Vocal Clarity, Electronic, Rock, Acoustic, Night Mode).
  - **3D Spatial Audio Widener**: Haas effect delay and stereo widening.
  - **Playback Speed**: 0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x.
  - **Procedural Synthesizer Fallback**: Built-in polyphonic synth engine for seamless offline audio playback.
- 📊 **60 FPS Real-Time Canvas Audio Visualizers**:
  - Neon Frequency Equalizer Bars
  - Fluid Oscilloscope Sine Waves
  - Circular Pulse Spectrum Orb
  - Cosmic Starfield Audio Particles
- 🎤 **Synchronized Karaoke Lyrics**: Auto-scrolling lyrics with active line highlighting and interactive click-to-seek.
- 📂 **Local Audio Drag-and-Drop**: Import your own `.mp3`, `.wav`, `.ogg`, or `.flac` files with ID3 tag parsing and persistent storage in `IndexedDB`.
- ⌨️ **Keyboard Navigation**: Space (Play/Pause), Arrow keys (Seek & Volume), M (Mute), L (Lyrics), Q (Queue), C (Customizer), F (Fullscreen).

---

## 🚀 Getting Started

Simply serve the project folder with any static web server or open `index.html` in your modern browser:

```bash
# Using npx serve
npx serve .

# Or using Python
python -m http.server 5173
```

Then visit `http://localhost:5173`.

---

## 📁 Project Structure

```
├── index.html               # Single Page Application shell
├── css/
│   ├── design-system.css    # Color tokens, glass utilities, typography
│   ├── layout.css           # Responsive Spotify grid layout
│   ├── components.css       # Reusable UI component library
│   ├── customizer.css       # Customizer Studio drawer & sliders
│   └── visualizer.css       # Canvas visualizers & fullscreen overlay
├── js/
│   ├── data/                # Music catalog & curated playlists
│   ├── audio/               # AudioContext, Equalizer, Analyser, & Visualizers
│   ├── state/               # Central store, IndexedDB storage, Theme engine
│   ├── components/          # Sidebar, Header, Player bar, Lyrics, Queue, Customizer
│   ├── views/               # Home, Search, Library, Playlist, Artist views
│   └── app.js               # Application bootstrap & router
└── PROJECT_MASTER_CONTEXT.md
```

---

## 📄 License
MIT License
