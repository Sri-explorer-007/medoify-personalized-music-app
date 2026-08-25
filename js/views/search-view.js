/* ==========================================================================
   SEARCH & EXPLORE VIEW
   Instant live filter matching and Spotify browse category tiles.
   ========================================================================== */

import { store } from '../state/store.js';
import { GENRES, ARTISTS } from '../data/catalog.js';
import { ICONS, formatTime } from '../components/ui.js';

export function renderSearchView(container) {
  const query = (store.searchQuery || '').trim().toLowerCase();
  const allTracks = store.getAllTracks();

  if (query) {
    // Perform Search Filter
    const matchedTracks = allTracks.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.artist.toLowerCase().includes(query) ||
      t.genre.toLowerCase().includes(query) ||
      t.album.toLowerCase().includes(query)
    );

    const matchedArtists = ARTISTS.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.genre.toLowerCase().includes(query)
    );

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <h1 style="font-size: 1.6rem; font-weight: 800;">Results for "${store.searchQuery}"</h1>

        ${matchedTracks.length === 0 && matchedArtists.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="32" height="32"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div style="font-size: 1.1rem; font-weight: 700;">No results found</div>
            <div style="color: var(--text-muted);">Please make sure your words are spelled correctly or use different keywords.</div>
          </div>
        ` : `
          <!-- Top Result & Tracks -->
          <div style="display: grid; grid-template-columns: 360px 1fr; gap: 24px;">
            ${matchedTracks.length > 0 ? `
              <div>
                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">Top Result</h3>
                <div class="glass-card" style="padding: 20px; display: flex; flex-direction: column; gap: 14px; cursor: pointer;" id="top-result-card" data-track-id="${matchedTracks[0].id}">
                  <div style="width: 80px; height: 80px; border-radius: var(--radius-md); overflow: hidden;">
                    <img src="${matchedTracks[0].coverUrl}" alt="${matchedTracks[0].title}" style="width:100%;height:100%;object-fit:cover;"/>
                  </div>
                  <div>
                    <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary);">${matchedTracks[0].title}</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
                      <span>${matchedTracks[0].artist}</span>
                      <span class="chip" style="margin-left: 8px; font-size: 0.7rem; padding: 2px 8px;">Song</span>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Songs List -->
            <div style="flex: 1;">
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">Songs</h3>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${matchedTracks.slice(0, 5).map(track => `
                  <div class="playlist-item song-search-item" data-track-id="${track.id}">
                    <div class="playlist-thumb">
                      <img src="${track.coverUrl}" alt="${track.title}"/>
                    </div>
                    <div class="playlist-info" style="flex: 1;">
                      <div class="playlist-title">${track.title}</div>
                      <div class="playlist-meta">${track.artist}</div>
                    </div>
                    <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${formatTime(track.duration)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Artists if any -->
          ${matchedArtists.length > 0 ? `
            <div style="margin-top: 20px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">Artists</h3>
              <div class="cards-grid">
                ${matchedArtists.map(artist => `
                  <div class="glass-card artist-card" data-artist-id="${artist.id}">
                    <div class="artwork artwork-rounded">
                      <img src="${artist.avatarUrl}" alt="${artist.name}"/>
                    </div>
                    <div class="card-title">${artist.name}</div>
                    <div class="card-desc">Artist • ${artist.monthlyListeners} listeners</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        `}
      </div>
    `;
  } else {
    // Browse Category Tiles
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <h1 style="font-size: 2rem; font-weight: 800; letter-spacing: -0.03em;">Browse All</h1>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 18px;">
          ${GENRES.map(genre => `
            <div class="genre-card" data-genre-id="${genre.id}" style="height: 140px; border-radius: var(--radius-lg); background: ${genre.color}; padding: 16px; position: relative; overflow: hidden; cursor: pointer; transition: transform var(--transition-normal); box-shadow: var(--shadow-sm);">
              <span style="font-size: 1.25rem; font-weight: 800; color: #FFFFFF; position: relative; z-index: 2;">${genre.name}</span>
              <img src="${genre.img}" alt="${genre.name}" style="position: absolute; right: -12px; bottom: -8px; width: 90px; height: 90px; transform: rotate(25deg); border-radius: var(--radius-sm); box-shadow: 0 4px 14px rgba(0,0,0,0.4); object-fit: cover;"/>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Event handlers
  container.onclick = (e) => {
    // Top result or song item click
    const trackItem = e.target.closest('[data-track-id]');
    if (trackItem) {
      const id = trackItem.getAttribute('data-track-id');
      const track = store.getTrackById(id);
      if (track) store.playTrack(track, allTracks);
      return;
    }

    // Artist card
    const artistCard = e.target.closest('.artist-card');
    if (artistCard) {
      const id = artistCard.getAttribute('data-artist-id');
      store.navigate('artist', { id });
      return;
    }

    // Genre Card
    const genreCard = e.target.closest('.genre-card');
    if (genreCard) {
      const gId = genreCard.getAttribute('data-genre-id');
      const g = GENRES.find(item => item.id === gId);
      if (g) {
        store.searchQuery = g.name;
        renderSearchView(container);
      }
    }
  };
}
