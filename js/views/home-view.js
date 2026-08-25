/* ==========================================================================
   HOME VIEW
   Dynamic greeting, Hero quick tiles, Featured mixes, Top artists, and New releases.
   ========================================================================== */

import { store } from '../state/store.js';
import { CATALOG_TRACKS, ARTISTS, GENRES } from '../data/catalog.js';
import { DEFAULT_PLAYLISTS } from '../data/default-playlists.js';
import { ICONS, formatTime } from '../components/ui.js';

export function renderHomeView(container) {
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const quickTracks = CATALOG_TRACKS.slice(0, 6);
  const playlists = store.getAllPlaylists();

  container.innerHTML = `
    <!-- Top Hero Greeting -->
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <h1 style="font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; color: var(--text-primary);">${greeting}</h1>
        <div style="display: flex; gap: 8px;">
          <button class="chip active">All</button>
          <button class="chip" data-nav="music">Music</button>
          <button class="chip" data-nav="podcasts">Podcasts</button>
        </div>
      </div>

      <!-- Quick Play 2-column Grid (Spotify signature header) -->
      <div class="hero-quick-grid">
        <!-- Liked Songs Quick Tile -->
        <div class="hero-quick-card" data-quick-action="play-liked">
          <div class="hero-quick-thumb" style="background: linear-gradient(135deg, #4F46E5, #F43F5E); display: flex; align-items: center; justify-content: center;">
            ${ICONS.heartFilled}
          </div>
          <div class="hero-quick-title">Liked Songs</div>
          <div class="hero-quick-play">${ICONS.play}</div>
        </div>

        ${quickTracks.map(track => `
          <div class="hero-quick-card" data-track-id="${track.id}">
            <div class="hero-quick-thumb">
              <img src="${track.coverUrl}" alt="${track.title}"/>
            </div>
            <div class="hero-quick-title">${track.title}</div>
            <div class="hero-quick-play">${ICONS.play}</div>
          </div>
        `).join('')}
      </div>

      <!-- Section: Made For You -->
      <div style="margin-top: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h2 style="font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em;">Made For You</h2>
          <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); cursor: pointer;" data-nav="library">Show all</span>
        </div>

        <div class="cards-grid">
          ${playlists.map(pl => `
            <div class="glass-card playlist-card" data-playlist-id="${pl.id}">
              <div class="artwork">
                <img src="${pl.coverUrl}" alt="${pl.title}" loading="lazy"/>
                <div class="card-play-overlay" data-play-playlist="${pl.id}">${ICONS.play}</div>
              </div>
              <div class="card-title">${pl.title}</div>
              <div class="card-desc">${pl.description}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section: Popular Artists -->
      <div style="margin-top: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h2 style="font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em;">Popular Artists</h2>
        </div>

        <div class="cards-grid">
          ${ARTISTS.map(artist => `
            <div class="glass-card artist-card" data-artist-id="${artist.id}">
              <div class="artwork artwork-rounded">
                <img src="${artist.avatarUrl}" alt="${artist.name}" loading="lazy"/>
                <div class="card-play-overlay" data-play-artist="${artist.id}">${ICONS.play}</div>
              </div>
              <div class="card-title">${artist.name}</div>
              <div class="card-desc">Artist • ${artist.monthlyListeners} listeners</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section: Recently Played Tracks Table -->
      <div style="margin-top: 16px;">
        <h2 style="font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px;">Top Tracks</h2>
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
            ${CATALOG_TRACKS.map((track, i) => {
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
    </div>
  `;

  // Attach view events
  container.onclick = (e) => {
    // Quick Tile Play
    const quickCard = e.target.closest('.hero-quick-card');
    if (quickCard) {
      if (quickCard.getAttribute('data-quick-action') === 'play-liked') {
        const liked = store.getLikedTracks();
        if (liked.length > 0) store.playTrack(liked[0], liked);
      } else {
        const trackId = quickCard.getAttribute('data-track-id');
        const track = store.getTrackById(trackId);
        if (track) store.playTrack(track);
      }
      return;
    }

    // Like click
    const likeBtn = e.target.closest('[data-like-track]');
    if (likeBtn) {
      e.stopPropagation();
      const trackId = likeBtn.getAttribute('data-like-track');
      store.toggleLike(trackId);
      renderHomeView(container);
      return;
    }

    // Playlist click
    const plCard = e.target.closest('.playlist-card');
    if (plCard) {
      const plId = plCard.getAttribute('data-playlist-id');
      store.navigate('playlist', { id: plId });
      return;
    }

    // Artist click
    const artCard = e.target.closest('.artist-card');
    if (artCard) {
      const artId = artCard.getAttribute('data-artist-id');
      store.navigate('artist', { id: artId });
      return;
    }

    // Song row click
    const songRow = e.target.closest('.song-row');
    if (songRow) {
      const trackId = songRow.getAttribute('data-track-id');
      const track = store.getTrackById(trackId);
      if (track) store.playTrack(track, CATALOG_TRACKS);
    }
  };
}
