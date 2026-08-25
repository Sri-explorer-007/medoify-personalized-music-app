/* ==========================================================================
   ARTIST DETAIL VIEW
   Hero artist banner, verified badge, top 5 songs, and discography.
   ========================================================================== */

import { store } from '../state/store.js';
import { ARTISTS, CATALOG_TRACKS } from '../data/catalog.js';
import { ICONS, formatTime } from '../components/ui.js';

export function renderArtistView(container, params = {}) {
  const artistId = params.id;
  const artist = store.getArtistById(artistId) || ARTISTS[0];
  const artistTracks = store.getAllTracks().filter(t => t.artistId === artist.id || t.artist === artist.name);

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 28px;">
      <!-- Hero Artist Header -->
      <div style="position: relative; height: 280px; border-radius: var(--radius-xl); overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; padding: 32px; box-shadow: var(--shadow-lg);">
        <img src="${artist.bannerUrl}" alt="${artist.name}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.55); z-index: 1;"/>

        <div style="position: relative; z-index: 2; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; color: var(--accent);">
            <svg viewBox="0 0 24 24" fill="var(--accent)" width="18" height="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span>Verified Artist</span>
          </div>
          <h1 style="font-size: 3.5rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1;">${artist.name}</h1>
          <span style="font-size: 0.95rem; color: rgba(255,255,255,0.85);">${artist.monthlyListeners} monthly listeners</span>
        </div>
      </div>

      <!-- Action Toolbar -->
      <div style="display: flex; align-items: center; gap: 18px;">
        <button class="btn-play-pause" id="btn-artist-play-all" title="Play Artist" style="width: 52px; height: 52px;">
          ${ICONS.play}
        </button>
        <button class="btn btn-secondary btn-sm" id="btn-follow-artist">
          Follow
        </button>
      </div>

      <!-- Bio and Popular Tracks -->
      <div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 14px;">Popular</h2>
        <table class="song-table">
          <thead class="song-table-header">
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th>Title</th>
              <th>Album</th>
              <th class="text-right">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${artistTracks.map((track, i) => {
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
      </div>

      <!-- About Section -->
      <div style="background: rgba(22, 25, 37, 0.6); padding: 24px; border-radius: var(--radius-xl); border: 1px solid var(--border-subtle);">
        <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 8px;">About</h3>
        <p style="color: var(--text-secondary); line-height: 1.6; max-width: 700px;">${artist.bio}</p>
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.onclick = (e) => {
    // Play All
    if (e.target.closest('#btn-artist-play-all')) {
      if (artistTracks.length > 0) {
        store.playTrack(artistTracks[0], artistTracks);
      }
      return;
    }

    // Follow Button
    const followBtn = e.target.closest('#btn-follow-artist');
    if (followBtn) {
      const isFollowing = followBtn.classList.contains('following');
      if (isFollowing) {
        followBtn.classList.remove('following');
        followBtn.textContent = 'Follow';
      } else {
        followBtn.classList.add('following');
        followBtn.textContent = 'Following';
      }
      return;
    }

    // Like Button
    const likeBtn = e.target.closest('[data-like-track]');
    if (likeBtn) {
      e.stopPropagation();
      const trackId = likeBtn.getAttribute('data-like-track');
      store.toggleLike(trackId);
      renderArtistView(container, params);
      return;
    }

    // Track Row Click
    const songRow = e.target.closest('.song-row');
    if (songRow) {
      const trackId = songRow.getAttribute('data-track-id');
      const track = store.getTrackById(trackId);
      if (track) store.playTrack(track, artistTracks);
    }
  };
}
