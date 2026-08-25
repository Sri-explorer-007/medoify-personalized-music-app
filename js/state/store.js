/* ==========================================================================
   CENTRAL STATE STORE — (Single Source of Truth)
   Master Context Spec: 1 Global Player, 1 Queue, 1 DB Client, 1 Notification, 1 Design System.
   ========================================================================== */

import { CATALOG_TRACKS, ARTISTS, GENRES } from '../data/catalog.js';
import { DEFAULT_PLAYLISTS } from '../data/default-playlists.js';
import { storage } from './storage.js';
import { themeEngine } from './theme-engine.js';

class Store {
  constructor() {
    this.listeners = new Map();

    // 1. Audio & Global Player State
    this.currentTrack = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = storage.getItem("player_volume", 0.85);
    this.isMuted = false;
    this.isShuffle = storage.getItem("player_shuffle", false);
    this.repeatMode = storage.getItem("player_repeat", "off"); // 'off' | 'all' | 'one'

    // 2. Queue & History System
    this.queue = [];
    this.originalQueue = [];
    this.queueIndex = -1;
    this.history = [];

    // 3. User Library & Playlists
    this.likedTrackIds = new Set(storage.getItem("liked_tracks", ["track-1", "track-4"]));
    this.customPlaylists = storage.getItem("custom_playlists", []);
    this.localTracks = [];

    // 4. Navigation & Views
    this.activeView = "home"; // 'home' | 'search' | 'library' | 'playlist' | 'artist' | 'genre'
    this.viewParams = {};
    this.searchQuery = "";
    this.activeGenre = null;
    this.libraryFilter = "all"; // 'all' | 'playlists' | 'artists' | 'albums' | 'local'

    // 5. Panels & Overlays
    this.isSidebarCollapsed = false;
    this.isRightPanelOpen = true;
    this.activeRightTab = "lyrics"; // 'lyrics' | 'visualizer' | 'queue' | 'friends'
    this.isCustomizerOpen = false;
    this.isFullscreenOpen = false;

    // Load initial track
    if (CATALOG_TRACKS.length > 0) {
      this.currentTrack = CATALOG_TRACKS[0];
      this.queue = [...CATALOG_TRACKS];
      this.originalQueue = [...CATALOG_TRACKS];
      this.queueIndex = 0;
    }
  }

  // --- Subscriptions (Observer Pattern) ---
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data, this);
        } catch (e) {
          console.error(`Error in listener for event "${event}":`, e);
        }
      });
    }
  }

  // --- Track & Playback Actions ---
  playTrack(track, newQueue = null) {
    if (!track) return;
    this.currentTrack = track;
    this.isPlaying = true;
    this.currentTime = 0;

    if (newQueue) {
      this.setQueue(newQueue, track.id);
    } else {
      const idx = this.queue.findIndex(t => t.id === track.id);
      if (idx !== -1) {
        this.queueIndex = idx;
      } else {
        this.queue.unshift(track);
        this.queueIndex = 0;
      }
    }

    // Add to history
    this.addToHistory(track);

    // Dynamic ambiance
    themeEngine.setAmbientFromTrack(track);

    this.emit("trackChange", track);
    this.emit("playbackStateChange", { isPlaying: true });
  }

  togglePlay() {
    if (!this.currentTrack && this.queue.length > 0) {
      this.playTrack(this.queue[0]);
      return;
    }
    this.isPlaying = !this.isPlaying;
    this.emit("playbackStateChange", { isPlaying: this.isPlaying });
  }

  seek(seconds) {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration || 0));
    this.emit("timeUpdate", { currentTime: this.currentTime, duration: this.duration });
    this.emit("seekRequest", this.currentTime);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.isMuted = false;
    storage.setItem("player_volume", this.volume);
    this.emit("volumeChange", { volume: this.volume, isMuted: false });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.emit("volumeChange", { volume: this.volume, isMuted: this.isMuted });
  }

  nextTrack() {
    if (this.repeatMode === "one") {
      this.seek(0);
      this.isPlaying = true;
      this.emit("playbackStateChange", { isPlaying: true });
      return;
    }

    if (this.queue.length === 0) return;

    let nextIdx = this.queueIndex + 1;
    if (nextIdx >= this.queue.length) {
      if (this.repeatMode === "all") {
        nextIdx = 0;
      } else {
        this.isPlaying = false;
        this.emit("playbackStateChange", { isPlaying: false });
        return;
      }
    }

    this.queueIndex = nextIdx;
    this.playTrack(this.queue[nextIdx]);
  }

  previousTrack() {
    // If more than 3 seconds in, restart track
    if (this.currentTime > 3) {
      this.seek(0);
      return;
    }

    if (this.queue.length === 0) return;

    let prevIdx = this.queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = this.repeatMode === "all" ? this.queue.length - 1 : 0;
    }

    this.queueIndex = prevIdx;
    this.playTrack(this.queue[prevIdx]);
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    storage.setItem("player_shuffle", this.isShuffle);

    if (this.isShuffle) {
      const current = this.currentTrack;
      const others = this.queue.filter(t => t.id !== current?.id);
      // Fisher-Yates shuffle
      for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
      }
      this.queue = current ? [current, ...others] : others;
      this.queueIndex = 0;
    } else {
      this.queue = [...this.originalQueue];
      if (this.currentTrack) {
        this.queueIndex = this.queue.findIndex(t => t.id === this.currentTrack.id);
      }
    }

    this.emit("queueUpdate", { queue: this.queue, index: this.queueIndex });
    this.emit("shuffleChange", this.isShuffle);
  }

  toggleRepeat() {
    const modes = ["off", "all", "one"];
    const nextIdx = (modes.indexOf(this.repeatMode) + 1) % modes.length;
    this.repeatMode = modes[nextIdx];
    storage.setItem("player_repeat", this.repeatMode);
    this.emit("repeatChange", this.repeatMode);
  }

  // --- Queue Operations ---
  setQueue(tracks, activeTrackId = null) {
    this.originalQueue = [...tracks];
    this.queue = [...tracks];
    if (activeTrackId) {
      this.queueIndex = this.queue.findIndex(t => t.id === activeTrackId);
    } else {
      this.queueIndex = 0;
    }
    this.emit("queueUpdate", { queue: this.queue, index: this.queueIndex });
  }

  addToQueue(track) {
    this.queue.push(track);
    this.originalQueue.push(track);
    this.emit("queueUpdate", { queue: this.queue, index: this.queueIndex });
    this.emit("toast", { message: `Added "${track.title}" to queue` });
  }

  playNext(track) {
    const insertIdx = this.queueIndex + 1;
    this.queue.splice(insertIdx, 0, track);
    this.originalQueue.splice(insertIdx, 0, track);
    this.emit("queueUpdate", { queue: this.queue, index: this.queueIndex });
    this.emit("toast", { message: `"${track.title}" will play next` });
  }

  removeFromQueue(index) {
    if (index < 0 || index >= this.queue.length) return;
    this.queue.splice(index, 1);
    if (index < this.queueIndex) this.queueIndex--;
    this.emit("queueUpdate", { queue: this.queue, index: this.queueIndex });
  }

  clearQueue() {
    if (this.currentTrack) {
      this.queue = [this.currentTrack];
      this.queueIndex = 0;
    } else {
      this.queue = [];
      this.queueIndex = -1;
    }
    this.emit("queueUpdate", { queue: this.queue, index: this.queueIndex });
  }

  addToHistory(track) {
    this.history = [track, ...this.history.filter(t => t.id !== track.id)].slice(0, 30);
    this.emit("historyUpdate", this.history);
  }

  // --- Likes & Playlists ---
  toggleLike(trackId) {
    const isLiked = this.likedTrackIds.has(trackId);
    if (isLiked) {
      this.likedTrackIds.delete(trackId);
    } else {
      this.likedTrackIds.add(trackId);
    }
    storage.setItem("liked_tracks", Array.from(this.likedTrackIds));
    this.emit("likeChange", { trackId, isLiked: !isLiked });
    this.emit("toast", {
      message: !isLiked ? "Added to your Liked Songs" : "Removed from Liked Songs",
      icon: !isLiked ? "heart-filled" : "heart"
    });
  }

  createPlaylist(name, description = "") {
    const newPlaylist = {
      id: `custom-pl-${Date.now()}`,
      title: name || "My Playlist #" + (this.customPlaylists.length + 1),
      description: description || "Custom user playlist",
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
      color: "#D7FF3F",
      trackIds: [],
      createdAt: new Date().toISOString(),
      createdBy: "You"
    };

    this.customPlaylists.unshift(newPlaylist);
    storage.setItem("custom_playlists", this.customPlaylists);
    this.emit("playlistsUpdate", this.customPlaylists);
    this.emit("toast", { message: `Created playlist "${newPlaylist.title}"` });
    return newPlaylist;
  }

  addTrackToPlaylist(playlistId, trackId) {
    const pl = this.customPlaylists.find(p => p.id === playlistId);
    if (pl) {
      if (!pl.trackIds.includes(trackId)) {
        pl.trackIds.push(trackId);
        storage.setItem("custom_playlists", this.customPlaylists);
        this.emit("playlistsUpdate", this.customPlaylists);
        this.emit("toast", { message: `Added to "${pl.title}"` });
      }
    }
  }

  deletePlaylist(playlistId) {
    this.customPlaylists = this.customPlaylists.filter(p => p.id !== playlistId);
    storage.setItem("custom_playlists", this.customPlaylists);
    this.emit("playlistsUpdate", this.customPlaylists);
    this.emit("toast", { message: "Playlist deleted" });
  }

  // --- Local User Uploads ---
  async addLocalTrack(track) {
    this.localTracks.unshift(track);
    await storage.saveLocalTrack(track);
    this.emit("localTracksUpdate", this.localTracks);
    this.emit("toast", { message: `Imported "${track.title}"` });
  }

  async loadLocalTracks() {
    this.localTracks = await storage.getAllLocalTracks();
    this.emit("localTracksUpdate", this.localTracks);
  }

  // --- Navigation & View State ---
  navigate(view, params = {}) {
    this.activeView = view;
    this.viewParams = params;
    this.emit("navigate", { view, params });
  }

  // --- Track Lookups ---
  getAllTracks() {
    return [...this.localTracks, ...CATALOG_TRACKS];
  }

  getTrackById(id) {
    return this.getAllTracks().find(t => t.id === id);
  }

  getLikedTracks() {
    return this.getAllTracks().filter(t => this.likedTrackIds.has(t.id));
  }

  getAllPlaylists() {
    return [...this.customPlaylists, ...DEFAULT_PLAYLISTS];
  }

  getPlaylistById(id) {
    return this.getAllPlaylists().find(p => p.id === id);
  }

  getArtistById(id) {
    return ARTISTS.find(a => a.id === id);
  }
}

export const store = new Store();
