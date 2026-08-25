/* ==========================================================================
   SIDEBAR COMPONENT
   ========================================================================== */

import { store } from '../state/store.js';
import { ICONS } from './ui.js';

export class Sidebar {
  constructor(container) {
    this.container = container;
    this.render();
    this.setupListeners();
  }

  render() {
    const playlists = store.getAllPlaylists();

    this.container.innerHTML = `
      <div class="sidebar-header">
        <div class="logo-badge">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.65c-.2.32-.6.42-.92.22-2.52-1.54-5.7-1.89-9.44-1.04-.37.08-.73-.15-.81-.52-.08-.37.15-.73.52-.81 4.1-.94 7.62-.54 10.43 1.18.32.2.42.6.22.97zm1.24-2.75c-.25.4-.78.53-1.18.28-2.88-1.77-7.28-2.28-10.69-1.25-.45.14-.93-.12-1.07-.57-.14-.45.12-.93.57-1.07 3.89-1.18 8.76-.61 12.09 1.43.4.25.53.78.28 1.18zm.11-2.88c-3.46-2.05-9.17-2.24-12.49-1.23-.53.16-1.09-.14-1.25-.67-.16-.53.14-1.09.67-1.25 3.82-1.16 10.12-.93 14.12 1.45.48.28.64.9.36 1.38-.28.48-.9.64-1.41.32z"/>
            </svg>
          </div>
          <span>Spotify Studio</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-item ${store.activeView === 'home' ? 'active' : ''}" data-view="home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>Home</span>
        </div>
        <div class="nav-item ${store.activeView === 'search' ? 'active' : ''}" data-view="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Search</span>
        </div>
        <div class="nav-item ${store.activeView === 'library' ? 'active' : ''}" data-view="library">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          <span>Your Library</span>
        </div>
      </nav>

      <div class="sidebar-divider"></div>

      <div class="sidebar-library-header">
        <div class="library-heading">Playlists</div>
        <button class="icon-btn" id="btn-create-playlist-sidebar" title="Create Playlist">
          ${ICONS.plus}
        </button>
      </div>

      <div class="sidebar-playlists" id="sidebar-playlists-list">
        <!-- Liked Songs Row -->
        <div class="playlist-item ${store.activeView === 'playlist' && store.viewParams.id === 'liked' ? 'active' : ''}" data-playlist-id="liked">
          <div class="playlist-thumb" style="background: linear-gradient(135deg, #4F46E5, #F43F5E);">
            ${ICONS.heartFilled}
          </div>
          <div class="playlist-info">
            <div class="playlist-title">Liked Songs</div>
            <div class="playlist-meta">${store.likedTrackIds.size} songs</div>
          </div>
        </div>

        <!-- Local Files Row -->
        <div class="playlist-item ${store.activeView === 'library' && store.libraryFilter === 'local' ? 'active' : ''}" data-playlist-id="local">
          <div class="playlist-thumb" style="background: #1E293B;">
            ${ICONS.upload}
          </div>
          <div class="playlist-info">
            <div class="playlist-title">Local Files</div>
            <div class="playlist-meta">${store.localTracks.length} tracks</div>
          </div>
        </div>

        ${playlists.map(pl => `
          <div class="playlist-item ${store.activeView === 'playlist' && store.viewParams.id === pl.id ? 'active' : ''}" data-playlist-id="${pl.id}">
            <div class="playlist-thumb">
              <img src="${pl.coverUrl}" alt="${pl.title}" loading="lazy"/>
            </div>
            <div class="playlist-info">
              <div class="playlist-title">${pl.title}</div>
              <div class="playlist-meta">Playlist • ${pl.createdBy || 'Spotify'}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  setupListeners() {
    this.container.addEventListener('click', (e) => {
      // Nav links
      const navItem = e.target.closest('.nav-item');
      if (navItem) {
        const view = navItem.getAttribute('data-view');
        store.navigate(view);
        return;
      }

      // Create Playlist button
      if (e.target.closest('#btn-create-playlist-sidebar')) {
        const name = prompt("Enter new playlist name:", "My Awesome Playlist");
        if (name && name.trim()) {
          const pl = store.createPlaylist(name.trim());
          store.navigate('playlist', { id: pl.id });
        }
        return;
      }

      // Playlist Item click
      const plItem = e.target.closest('.playlist-item');
      if (plItem) {
        const plId = plItem.getAttribute('data-playlist-id');
        if (plId === 'liked') {
          store.navigate('playlist', { id: 'liked' });
        } else if (plId === 'local') {
          store.libraryFilter = 'local';
          store.navigate('library');
        } else {
          store.navigate('playlist', { id: plId });
        }
      }
    });

    store.subscribe('navigate', () => this.render());
    store.subscribe('playlistsUpdate', () => this.render());
    store.subscribe('likeChange', () => this.render());
    store.subscribe('localTracksUpdate', () => this.render());
  }
}
