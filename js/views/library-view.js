/* ==========================================================================
   LIBRARY VIEW
   Filterable collection of Playlists, Liked Tracks, Artists, and Local Uploaded Audio.
   ========================================================================== */

import { store } from '../state/store.js';
import { ARTISTS } from '../data/catalog.js';
import { ICONS, formatTime } from '../components/ui.js';

export function renderLibraryView(container) {
  const filter = store.libraryFilter;
  const playlists = store.getAllPlaylists();
  const liked = store.getLikedTracks();
  const localTracks = store.localTracks;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Header & Filter Chips -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="chip ${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
          <button class="chip ${filter === 'playlists' ? 'active' : ''}" data-filter="playlists">Playlists (${playlists.length})</button>
          <button class="chip ${filter === 'liked' ? 'active' : ''}" data-filter="liked">Liked (${liked.length})</button>
          <button class="chip ${filter === 'local' ? 'active' : ''}" data-filter="local">Local Files (${localTracks.length})</button>
          <button class="chip ${filter === 'artists' ? 'active' : ''}" data-filter="artists">Artists</button>
        </div>

        <!-- Action Tools: Add Playlist & Upload Audio -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn btn-secondary btn-sm" id="btn-upload-file-trigger">
            ${ICONS.upload}
            <span>Import Audio File</span>
          </button>
          <input type="file" id="local-audio-file-input" accept="audio/*" style="display: none;" multiple/>

          <button class="btn btn-primary btn-sm" id="btn-create-playlist-lib">
            ${ICONS.plus}
            <span>New Playlist</span>
          </button>
        </div>
      </div>

      <!-- Content Grid / List -->
      ${filter === 'local' ? `
        <!-- Local Files List -->
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h2 style="font-size: 1.3rem; font-weight: 800;">Local Audio Files</h2>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${localTracks.length} tracks imported</span>
          </div>

          ${localTracks.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">
                ${ICONS.upload}
              </div>
              <div style="font-size: 1.1rem; font-weight: 700;">No local audio files imported</div>
              <div style="color: var(--text-muted); max-width: 400px;">Drag & drop any .mp3, .wav, or .flac file anywhere into the app or click Import Audio File above.</div>
            </div>
          ` : `
            <table class="song-table">
              <thead class="song-table-header">
                <tr>
                  <th style="width: 40px; text-align: center;">#</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th class="text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                ${localTracks.map((t, i) => `
                  <tr class="song-row" data-local-track-id="${t.id}">
                    <td class="col-index">
                      <span class="index-num">${i + 1}</span>
                      <span class="row-play-btn">${ICONS.play}</span>
                    </td>
                    <td>
                      <div class="col-track">
                        <div class="song-thumb" style="background: var(--bg-highlight); display: flex; align-items: center; justify-content: center;">
                          ${ICONS.lyrics}
                        </div>
                        <span class="song-title">${t.title}</span>
                      </div>
                    </td>
                    <td class="col-album">${t.artist || 'Local File'}</td>
                    <td class="col-actions">
                      <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${formatTime(t.duration)}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      ` : `
        <!-- Playlists & Liked Grid -->
        <div class="cards-grid">
          <!-- Liked Songs Tile Card -->
          <div class="glass-card playlist-card" data-playlist-id="liked" style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.4), rgba(244, 63, 94, 0.4));">
            <div class="artwork" style="background: linear-gradient(135deg, #4F46E5, #F43F5E); display: flex; align-items: center; justify-content: center;">
              <div style="transform: scale(1.5); color: #FFFFFF;">${ICONS.heartFilled}</div>
              <div class="card-play-overlay" data-play-playlist="liked">${ICONS.play}</div>
            </div>
            <div class="card-title">Liked Songs</div>
            <div class="card-desc">${liked.length} liked tracks</div>
          </div>

          ${playlists.map(pl => `
            <div class="glass-card playlist-card" data-playlist-id="${pl.id}">
              <div class="artwork">
                <img src="${pl.coverUrl}" alt="${pl.title}"/>
                <div class="card-play-overlay" data-play-playlist="${pl.id}">${ICONS.play}</div>
              </div>
              <div class="card-title">${pl.title}</div>
              <div class="card-desc">${pl.trackIds.length} tracks • ${pl.createdBy || 'Spotify'}</div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  // Attach Events
  container.onclick = (e) => {
    // Filter chip
    const chip = e.target.closest('[data-filter]');
    if (chip) {
      store.libraryFilter = chip.getAttribute('data-filter');
      renderLibraryView(container);
      return;
    }

    // New Playlist
    if (e.target.closest('#btn-create-playlist-lib')) {
      const name = prompt("Enter playlist title:", "New Playlist");
      if (name && name.trim()) {
        const pl = store.createPlaylist(name.trim());
        store.navigate('playlist', { id: pl.id });
      }
      return;
    }

    // Upload Trigger
    if (e.target.closest('#btn-upload-file-trigger')) {
      const fileInput = container.querySelector('#local-audio-file-input');
      if (fileInput) fileInput.click();
      return;
    }

    // Playlist click
    const plCard = e.target.closest('.playlist-card');
    if (plCard) {
      const id = plCard.getAttribute('data-playlist-id');
      store.navigate('playlist', { id });
      return;
    }

    // Local track play
    const localRow = e.target.closest('[data-local-track-id]');
    if (localRow) {
      const id = localRow.getAttribute('data-local-track-id');
      const track = store.localTracks.find(t => t.id === id);
      if (track) store.playTrack(track, store.localTracks);
    }
  };

  // Local File Input Change
  const fileInput = container.querySelector('#local-audio-file-input');
  if (fileInput) {
    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const blobUrl = URL.createObjectURL(file);
        const newTrack = {
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Local Artist",
          album: "Local Uploads",
          duration: 180,
          genre: "Local Audio",
          year: new Date().getFullYear(),
          coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
          blobUrl: blobUrl,
          lyrics: [
            { time: 0, text: "♪ [Local Audio Playback] ♪" },
            { time: 10, text: file.name }
          ]
        };
        store.addLocalTrack(newTrack);
      });
      renderLibraryView(container);
    };
  }
}
