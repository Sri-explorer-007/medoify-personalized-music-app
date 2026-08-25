/* ==========================================================================
   MAIN APPLICATION BOOTSTRAPPER & ROUTER
   ========================================================================== */

import { store } from './state/store.js';
import { storage } from './state/storage.js';
import { themeEngine } from './state/theme-engine.js';
import { audioEngine } from './audio/audio-engine.js';
import { VisualizerRenderer } from './audio/visualizer.js';
import { initToastSystem, ICONS, formatTime } from './components/ui.js';
import { Sidebar } from './components/sidebar.js';
import { Header } from './components/header.js';
import { PlayerBar } from './components/player-bar.js';
import { LyricsView } from './components/lyrics-view.js';
import { QueueDrawer } from './components/queue-drawer.js';
import { FriendActivity } from './components/friend-activity.js';
import { CustomizerDrawer } from './components/customizer-drawer.js';

import { renderHomeView } from './views/home-view.js';
import { renderSearchView } from './views/search-view.js';
import { renderLibraryView } from './views/library-view.js';
import { renderPlaylistView } from './views/playlist-view.js';
import { renderArtistView } from './views/artist-view.js';

class App {
  constructor() {
    this.contentArea = document.getElementById('content-scroll-area');
    this.rightPanelContainer = document.getElementById('right-panel-body-content');
    this.fullscreenOverlay = document.getElementById('fullscreen-overlay');
    this.visualizerRenderer = null;
    this.fullscreenVisRenderer = null;
  }

  async init() {
    // 1. Initialize Theme & Settings
    themeEngine.init();

    // 2. Initialize Toasts
    initToastSystem();

    // 3. Load Local Saved Tracks from IndexedDB
    await store.loadLocalTracks();

    // 4. Initialize Core Components
    new Sidebar(document.getElementById('sidebar'));
    new Header(document.getElementById('main-header'));
    new PlayerBar(document.getElementById('player-bar'));
    new CustomizerDrawer(document.getElementById('customizer-drawer'));

    // 5. Initialize Right Panel & Tab Switcher
    this.setupRightPanel();

    // 6. Initialize Router
    this.setupRouter();

    // 7. Initialize Global Drag-and-Drop for Audio Files
    this.setupDragAndDrop();

    // 8. Initialize Keyboard Shortcuts
    this.setupKeyboardShortcuts();

    // 9. Initialize Fullscreen Ambient Canvas
    this.setupFullscreen();

    // 10. Initial Route
    this.renderCurrentView();

    console.log("Spotify Customizer Studio fully booted!");
  }

  setupRouter() {
    store.subscribe('navigate', () => {
      this.renderCurrentView();
      if (this.contentArea) this.contentArea.scrollTop = 0;
    });
  }

  renderCurrentView() {
    if (!this.contentArea) return;

    switch (store.activeView) {
      case 'home':
        renderHomeView(this.contentArea);
        break;
      case 'search':
        renderSearchView(this.contentArea);
        break;
      case 'library':
        renderLibraryView(this.contentArea);
        break;
      case 'playlist':
        renderPlaylistView(this.contentArea, store.viewParams);
        break;
      case 'artist':
        renderArtistView(this.contentArea, store.viewParams);
        break;
      default:
        renderHomeView(this.contentArea);
    }
  }

  setupRightPanel() {
    const tabsContainer = document.getElementById('right-panel-tabs-header');
    const updateTabsUI = () => {
      if (!tabsContainer) return;
      const tabs = ['lyrics', 'visualizer', 'queue', 'friends'];
      tabsContainer.innerHTML = `
        <div class="right-panel-tabs">
          ${tabs.map(t => `
            <button class="panel-tab ${store.activeRightTab === t ? 'active' : ''}" data-tab="${t}">
              ${t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          `).join('')}
        </div>
        <button class="icon-btn" id="btn-close-right-panel" title="Close Panel">
          ${ICONS.close}
        </button>
      `;
    };

    updateTabsUI();

    if (tabsContainer) {
      tabsContainer.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('[data-tab]');
        if (tabBtn) {
          store.activeRightTab = tabBtn.getAttribute('data-tab');
          updateTabsUI();
          this.renderRightPanelContent();
          return;
        }

        if (e.target.closest('#btn-close-right-panel')) {
          store.isRightPanelOpen = false;
          store.emit('rightPanelToggle', { isOpen: false, tab: store.activeRightTab });
        }
      });
    }

    store.subscribe('rightPanelToggle', ({ isOpen, tab }) => {
      const appContainer = document.getElementById('app-container');
      if (isOpen) {
        appContainer.classList.remove('right-panel-closed');
      } else {
        appContainer.classList.add('right-panel-closed');
      }
      updateTabsUI();
      this.renderRightPanelContent();
    });

    this.renderRightPanelContent();
  }

  renderRightPanelContent() {
    if (!this.rightPanelContainer) return;
    this.rightPanelContainer.innerHTML = '';

    if (this.visualizerRenderer) {
      this.visualizerRenderer.stop();
      this.visualizerRenderer = null;
    }

    if (store.activeRightTab === 'lyrics') {
      new LyricsView(this.rightPanelContainer);
    } else if (store.activeRightTab === 'queue') {
      new QueueDrawer(this.rightPanelContainer);
    } else if (store.activeRightTab === 'friends') {
      new FriendActivity(this.rightPanelContainer);
    } else if (store.activeRightTab === 'visualizer') {
      this.renderVisualizerPanel();
    }
  }

  renderVisualizerPanel() {
    this.rightPanelContainer.innerHTML = `
      <div class="visualizer-card-container">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Audio Frequency Engine</span>
          <span class="chip" style="font-size: 0.7rem; padding: 2px 8px;">60 FPS</span>
        </div>

        <canvas id="right-panel-canvas" class="visualizer-canvas"></canvas>

        <div class="visualizer-mode-selector">
          <button class="vis-mode-btn active" data-vmode="bars">Bars</button>
          <button class="vis-mode-btn" data-vmode="waves">Waves</button>
          <button class="vis-mode-btn" data-vmode="circle">Pulse</button>
          <button class="vis-mode-btn" data-vmode="particles">Cosmic</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('right-panel-canvas');
    if (canvas) {
      this.visualizerRenderer = new VisualizerRenderer(canvas);
      this.visualizerRenderer.start();

      const selector = this.rightPanelContainer.querySelector('.visualizer-mode-selector');
      if (selector) {
        selector.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-vmode]');
          if (btn) {
            selector.querySelectorAll('.vis-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.visualizerRenderer.setMode(btn.getAttribute('data-vmode'));
          }
        });
      }
    }
  }

  setupFullscreen() {
    const overlay = this.fullscreenOverlay;
    const canvas = document.getElementById('fullscreen-canvas');

    store.subscribe('fullscreenToggle', (isOpen) => {
      if (isOpen) {
        overlay.classList.add('active');
        this.renderFullscreenContent();
        if (canvas) {
          this.fullscreenVisRenderer = new VisualizerRenderer(canvas);
          this.fullscreenVisRenderer.setMode('particles');
          this.fullscreenVisRenderer.start();
        }
      } else {
        overlay.classList.remove('active');
        if (this.fullscreenVisRenderer) {
          this.fullscreenVisRenderer.stop();
          this.fullscreenVisRenderer = null;
        }
      }
    });

    store.subscribe('trackChange', () => {
      if (store.isFullscreenOpen) {
        this.renderFullscreenContent();
      }
    });
  }

  renderFullscreenContent() {
    const track = store.currentTrack;
    if (!track) return;

    const artImg = document.getElementById('fs-art-img');
    const titleEl = document.getElementById('fs-title');
    const artistEl = document.getElementById('fs-artist');
    const lyricsBox = document.getElementById('fs-lyrics-box');

    if (artImg) artImg.src = track.coverUrl;
    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;

    if (lyricsBox) {
      new LyricsView(lyricsBox);
    }
  }

  setupDragAndDrop() {
    const dropZone = document.body;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.body.style.outline = "3px dashed var(--accent)";
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.body.style.outline = "none";
      }, false);
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = Array.from(dt.files);

      const audioFiles = files.filter(f => f.type.startsWith('audio/') || /\.(mp3|wav|ogg|flac|m4a)$/i.test(f.name));

      if (audioFiles.length > 0) {
        audioFiles.forEach(file => {
          const blobUrl = URL.createObjectURL(file);
          const newTrack = {
            id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Local Audio",
            album: "Local Uploads",
            duration: 200,
            genre: "Local File",
            year: new Date().getFullYear(),
            coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
            blobUrl: blobUrl,
            lyrics: [
              { time: 0, text: "♪ [Local Audio Import] ♪" },
              { time: 10, text: file.name }
            ]
          };
          store.addLocalTrack(newTrack);
        });
        store.libraryFilter = 'local';
        store.navigate('library');
      }
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore when typing inside search or input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          store.togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            store.nextTrack();
          } else {
            store.seek(store.currentTime + 5);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            store.previousTrack();
          } else {
            store.seek(store.currentTime - 5);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          store.setVolume(store.volume + 0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          store.setVolume(store.volume - 0.05);
          break;
        case 'KeyM':
          store.toggleMute();
          break;
        case 'KeyL':
          store.activeRightTab = 'lyrics';
          store.isRightPanelOpen = true;
          store.emit('rightPanelToggle', { isOpen: true, tab: 'lyrics' });
          break;
        case 'KeyQ':
          store.activeRightTab = 'queue';
          store.isRightPanelOpen = true;
          store.emit('rightPanelToggle', { isOpen: true, tab: 'queue' });
          break;
        case 'KeyC':
          store.isCustomizerOpen = !store.isCustomizerOpen;
          store.emit('customizerToggle', store.isCustomizerOpen);
          break;
        case 'KeyF':
          store.isFullscreenOpen = !store.isFullscreenOpen;
          store.emit('fullscreenToggle', store.isFullscreenOpen);
          break;
        case 'Escape':
          if (store.isFullscreenOpen) {
            store.isFullscreenOpen = false;
            store.emit('fullscreenToggle', false);
          }
          if (store.isCustomizerOpen) {
            store.isCustomizerOpen = false;
            store.emit('customizerToggle', false);
          }
          break;
      }
    });
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
