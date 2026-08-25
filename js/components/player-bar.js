/* ==========================================================================
   PERSISTENT PLAYER BAR COMPONENT
   Master Context Spec: 1 Global Player.
   ========================================================================== */

import { store } from '../state/store.js';
import { ICONS, formatTime } from './ui.js';

export class PlayerBar {
  constructor(container) {
    this.container = container;
    this.render();
    this.setupListeners();
  }

  render() {
    const track = store.currentTrack;
    const isLiked = track ? store.likedTrackIds.has(track.id) : false;

    this.container.innerHTML = `
      <!-- Left Track Info -->
      <div class="player-left">
        <div class="player-artwork" id="player-art-btn">
          <img src="${track ? track.coverUrl : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80'}" alt="Cover" id="player-art-img"/>
        </div>
        <div class="player-track-meta">
          <div class="player-title" id="player-track-title">${track ? track.title : 'No track selected'}</div>
          <div class="player-artist" id="player-track-artist">${track ? track.artist : 'Select a track to play'}</div>
        </div>
        <button class="icon-btn ${isLiked ? 'liked' : ''}" id="player-like-btn" title="${isLiked ? 'Unlike' : 'Like'}">
          ${isLiked ? ICONS.heartFilled : ICONS.heart}
        </button>
      </div>

      <!-- Center Player Controls & Progress Scrubber -->
      <div class="player-center">
        <div class="player-controls">
          <button class="icon-btn ${store.isShuffle ? 'active' : ''}" id="btn-shuffle" title="Shuffle">
            ${ICONS.shuffle}
          </button>
          <button class="icon-btn" id="btn-prev" title="Previous (Left Arrow)">
            ${ICONS.prev}
          </button>
          <button class="btn-play-pause" id="btn-play-pause" title="Play/Pause (Spacebar)">
            ${store.isPlaying ? ICONS.pause : ICONS.play}
          </button>
          <button class="icon-btn" id="btn-next" title="Next (Right Arrow)">
            ${ICONS.next}
          </button>
          <button class="icon-btn ${store.repeatMode !== 'off' ? 'active' : ''}" id="btn-repeat" title="Repeat (${store.repeatMode})">
            ${store.repeatMode === 'one' ? ICONS.repeatOne : ICONS.repeat}
          </button>
        </div>

        <div class="player-scrubber-group">
          <span class="time-stamp" id="time-current">${formatTime(store.currentTime)}</span>
          <div class="progress-track" id="progress-bar">
            <div class="progress-fill" id="progress-fill" style="width: 0%;"></div>
            <div class="progress-handle" id="progress-handle" style="left: 0%;"></div>
          </div>
          <span class="time-stamp" id="time-duration">${formatTime(store.duration || track?.duration || 0)}</span>
        </div>
      </div>

      <!-- Right Action Tools -->
      <div class="player-right">
        <button class="icon-btn ${store.activeRightTab === 'lyrics' && store.isRightPanelOpen ? 'active' : ''}" id="btn-lyrics-toggle" title="Lyrics (L)">
          ${ICONS.lyrics}
        </button>
        <button class="icon-btn ${store.activeRightTab === 'queue' && store.isRightPanelOpen ? 'active' : ''}" id="btn-queue-toggle" title="Queue (Q)">
          ${ICONS.queue}
        </button>
        <button class="icon-btn ${store.activeRightTab === 'visualizer' && store.isRightPanelOpen ? 'active' : ''}" id="btn-vis-toggle" title="Audio Visualizer">
          ${ICONS.equalizer}
        </button>

        <div class="volume-group">
          <button class="icon-btn" id="btn-volume-icon" title="Mute/Unmute (M)">
            ${store.isMuted || store.volume === 0 ? ICONS.volumeMute : ICONS.volumeHigh}
          </button>
          <input 
            type="range" 
            id="volume-slider" 
            class="custom-range" 
            min="0" 
            max="1" 
            step="0.01" 
            value="${store.isMuted ? 0 : store.volume}"
            title="Volume (Up/Down Arrow)"
          />
        </div>

        <button class="icon-btn" id="btn-fullscreen-toggle" title="Fullscreen Ambient View (F)">
          ${ICONS.fullscreen}
        </button>
      </div>
    `;
  }

  setupListeners() {
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('#btn-play-pause')) {
        store.togglePlay();
      } else if (e.target.closest('#btn-next')) {
        store.nextTrack();
      } else if (e.target.closest('#btn-prev')) {
        store.previousTrack();
      } else if (e.target.closest('#btn-shuffle')) {
        store.toggleShuffle();
      } else if (e.target.closest('#btn-repeat')) {
        store.toggleRepeat();
      } else if (e.target.closest('#player-like-btn')) {
        if (store.currentTrack) {
          store.toggleLike(store.currentTrack.id);
        }
      } else if (e.target.closest('#btn-volume-icon')) {
        store.toggleMute();
      } else if (e.target.closest('#btn-lyrics-toggle')) {
        this.toggleRightTab('lyrics');
      } else if (e.target.closest('#btn-queue-toggle')) {
        this.toggleRightTab('queue');
      } else if (e.target.closest('#btn-vis-toggle')) {
        this.toggleRightTab('visualizer');
      } else if (e.target.closest('#btn-fullscreen-toggle')) {
        store.isFullscreenOpen = !store.isFullscreenOpen;
        store.emit('fullscreenToggle', store.isFullscreenOpen);
      }
    });

    // Scrubber click/drag
    const progressBar = this.container.querySelector('#progress-bar');
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const targetTime = ratio * (store.duration || store.currentTrack?.duration || 0);
        store.seek(targetTime);
      });
    }

    // Volume Slider
    const volSlider = this.container.querySelector('#volume-slider');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        store.setVolume(parseFloat(e.target.value));
      });
    }

    // Subscriptions
    store.subscribe('trackChange', (track) => this.updateTrack(track));
    store.subscribe('playbackStateChange', ({ isPlaying }) => this.updatePlayState(isPlaying));
    store.subscribe('timeUpdate', ({ currentTime, duration }) => this.updateTime(currentTime, duration));
    store.subscribe('volumeChange', ({ volume, isMuted }) => this.updateVolume(volume, isMuted));
    store.subscribe('likeChange', () => this.updateLikeBtn());
    store.subscribe('shuffleChange', () => this.render());
    store.subscribe('repeatChange', () => this.render());
  }

  toggleRightTab(tabName) {
    if (store.isRightPanelOpen && store.activeRightTab === tabName) {
      store.isRightPanelOpen = false;
    } else {
      store.isRightPanelOpen = true;
      store.activeRightTab = tabName;
    }
    store.emit('rightPanelToggle', { isOpen: store.isRightPanelOpen, tab: store.activeRightTab });
    this.render();
  }

  updateTrack(track) {
    const artImg = this.container.querySelector('#player-art-img');
    const titleEl = this.container.querySelector('#player-track-title');
    const artistEl = this.container.querySelector('#player-track-artist');
    const durEl = this.container.querySelector('#time-duration');

    if (artImg) artImg.src = track.coverUrl;
    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    if (durEl) durEl.textContent = formatTime(track.duration);

    this.updateLikeBtn();
  }

  updatePlayState(isPlaying) {
    const playBtn = this.container.querySelector('#btn-play-pause');
    if (playBtn) {
      playBtn.innerHTML = isPlaying ? ICONS.pause : ICONS.play;
    }
  }

  updateTime(currentTime, duration) {
    const curEl = this.container.querySelector('#time-current');
    const durEl = this.container.querySelector('#time-duration');
    const fillEl = this.container.querySelector('#progress-fill');
    const handleEl = this.container.querySelector('#progress-handle');

    if (curEl) curEl.textContent = formatTime(currentTime);
    if (durEl && duration > 0) durEl.textContent = formatTime(duration);

    if (duration > 0 && fillEl && handleEl) {
      const pct = (currentTime / duration) * 100;
      fillEl.style.width = `${pct}%`;
      handleEl.style.left = `${pct}%`;
    }
  }

  updateVolume(volume, isMuted) {
    const volIcon = this.container.querySelector('#btn-volume-icon');
    const slider = this.container.querySelector('#volume-slider');
    if (volIcon) {
      volIcon.innerHTML = isMuted || volume === 0 ? ICONS.volumeMute : ICONS.volumeHigh;
    }
    if (slider) {
      slider.value = isMuted ? 0 : volume;
    }
  }

  updateLikeBtn() {
    const likeBtn = this.container.querySelector('#player-like-btn');
    if (likeBtn && store.currentTrack) {
      const isLiked = store.likedTrackIds.has(store.currentTrack.id);
      likeBtn.className = `icon-btn ${isLiked ? 'liked' : ''}`;
      likeBtn.innerHTML = isLiked ? ICONS.heartFilled : ICONS.heart;
    }
  }
}
