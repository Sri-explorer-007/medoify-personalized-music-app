/* ==========================================================================
   PLAYLIST & ALBUM DETAIL VIEW
   Dynamic header glow, Play All, Shuffle, and track table.
   ========================================================================== */

import { store } from '../state/store.js';
import { ICONS, formatTime } from '../components/ui.js';

export function renderPlaylistView(container, params = {}) {
  const plId = params.id;
  let playlist = null;
  let tracks = [];

  if (plId === 'liked') {
    tracks = store.getLikedTracks();
    playlist = {
      id: 'liked',
      title: 'Liked Songs',
      description: 'Your favorite tracks in one personal collection.',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      createdBy: 'You',
      color: '#4F46E5'
    };
  } else {
    playlist = store.getPlaylistById(plId) || store.getAllPlaylists()[0];
    tracks = (playlist.trackIds || []).map(id => store.getTrackById(id)).filter(Boolean);
  }

  const totalDuration = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const isCustom = playlist.id && playlist.id.startsWith('custom-');

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Hero Playlist Header with dynamic background gradient -->
      <div style="display: flex; align-items: flex-end; gap: 28px; padding: 24px 0 16px; position: relative;">
        <div style="width: 200px; height: 200px; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); flex-shrink: 0; background: var(--bg-highlight);">
          <img src="${playlist.coverUrl}" alt="${playlist.title}" style="width: 100%; height: 100%; object-fit: cover;"/>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; min-width: 0;">
          <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-secondary);">Playlist</span>
          <h1 style="font-size: 3rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; color: var(--text-primary);">${playlist.title}</h1>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">${playlist.description}</p>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            <span style="font-weight: 700; color: var(--text-primary);">${playlist.createdBy || 'Spotify'}</span>
            <span>•</span>
            <span>${tracks.length} songs</span>
            <span>•</span>
            <span>${formatTime(totalDuration)} total</span>
          </div>
        </div>
      </div>

      <!-- Action Toolbar -->
      <div style="display: flex; align-items: center; gap: 18px; padding: 12px 0;">
        <button class="btn-play-pause" id="btn-playlist-play-all" title="Play Playlist" style="width: 52px; height: 52px;">
          ${ICONS.play}
        </button>
        <button class="icon-btn" id="btn-playlist-shuffle" title="Shuffle Play">
          ${ICONS.shuffle}
        </button>

        ${isCustom ? `
          <button class="icon-btn" id="btn-delete-playlist" title="Delete Playlist">
            ${ICONS.trash}
          </button>
        ` : ''}
      </div>

      <!-- Songs Table -->
      ${tracks.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="32" height="32"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div style="font-weight: 700; font-size: 1.1rem;">This playlist is empty</div>
          <div style="color: var(--text-muted);">Explore tracks and add them to build your custom playlist!</div>
        </div>
      ` : `
        <table class="song-table">
          <thead class="song-table-header">
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th>Title</th>
              <th>Album</th>
              <th class="text-right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></th>
            </tr>
          </thead>
          <tbody>
            ${tracks.map((track, i) => {
              const isLiked = store.likedTrackIds.has(track.id);
              const isActive = store.currentTrack?.id === track.id;
              return `
                <tr class="song-row ${isActive ? 'active' : ''}" data-track-id="${track.id}">
                  <td class="col-index">
                    <span class="index-num">${i + 1}</span>
                    <span class="row-play-btn">${ICONS.play}</span>
                  </td>
                  <td>
                    <div class="col-track">
                      <div class="song-thumb">
                        <img src="${track.coverUrl}" alt="${track.title}"/>
                      </div>
                      <div class="song-meta-text">
                        <span class="song-title">${track.title}</span>
                        <span class="song-artist">${track.artist}</span>
                      </div>
                    </div>
                  </td>
                  <td class="col-album">${track.album}</td>
                  <td class="col-actions">
                    <button class="icon-btn ${isLiked ? 'liked' : ''}" data-like-track="${track.id}" title="Like">
                      ${isLiked ? ICONS.heartFilled : ICONS.heart}
                    </button>
                    <span style="margin-left: 12px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${formatTime(track.duration)}</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;

  // Attach event handlers
  container.onclick = (e) => {
    // Play All
    if (e.target.closest('#btn-playlist-play-all')) {
      if (tracks.length > 0) {
        store.playTrack(tracks[0], tracks);
      }
      return;
    }

    // Shuffle All
    if (e.target.closest('#btn-playlist-shuffle')) {
      if (tracks.length > 0) {
        store.isShuffle = true;
        store.playTrack(tracks[0], tracks);
      }
      return;
    }

    // Delete Playlist
    if (e.target.closest('#btn-delete-playlist')) {
      if (confirm(`Delete playlist "${playlist.title}"?`)) {
        store.deletePlaylist(playlist.id);
        store.navigate('library');
      }
      return;
    }

    // Like button
    const likeBtn = e.target.closest('[data-like-track]');
    if (likeBtn) {
      e.stopPropagation();
      const trackId = likeBtn.getAttribute('data-like-track');
      store.toggleLike(trackId);
      renderPlaylistView(container, params);
      return;
    }

    // Track row
    const songRow = e.target.closest('.song-row');
    if (songRow) {
      const trackId = songRow.getAttribute('data-track-id');
      const track = store.getTrackById(trackId);
      if (track) store.playTrack(track, tracks);
    }
  };
}
