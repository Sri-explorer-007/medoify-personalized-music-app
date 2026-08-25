/* ==========================================================================
   QUEUE & HISTORY DRAWER COMPONENT
   ========================================================================== */

import { store } from '../state/store.js';
import { ICONS, formatTime } from './ui.js';

export class QueueDrawer {
  constructor(container) {
    this.container = container;
    this.tab = 'queue'; // 'queue' | 'history'
    this.render();
    this.setupListeners();
  }

  render() {
    const current = store.currentTrack;
    const nextTracks = store.queue.slice(store.queueIndex + 1);

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Header Sub-Tabs -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div class="right-panel-tabs">
            <button class="panel-tab ${this.tab === 'queue' ? 'active' : ''}" id="queue-subtab-queue">Queue (${nextTracks.length})</button>
            <button class="panel-tab ${this.tab === 'history' ? 'active' : ''}" id="queue-subtab-history">History (${store.history.length})</button>
          </div>
          ${this.tab === 'queue' && nextTracks.length > 0 ? `
            <button class="btn btn-ghost btn-sm" id="btn-clear-queue" style="font-size: 0.75rem;">Clear</button>
          ` : ''}
        </div>

        ${this.tab === 'queue' ? `
          <!-- Now Playing Card -->
          ${current ? `
            <div>
              <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Now Playing</div>
              <div class="playlist-item active" style="padding: 10px; border-radius: var(--radius-md);">
                <div class="playlist-thumb">
                  <img src="${current.coverUrl}" alt="${current.title}"/>
                </div>
                <div class="playlist-info">
                  <div class="playlist-title" style="color: var(--accent);">${current.title}</div>
                  <div class="playlist-meta">${current.artist}</div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Next in Queue List -->
          <div>
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Next In Queue</div>
            ${nextTracks.length === 0 ? `
              <div style="font-size: 0.8rem; color: var(--text-muted); padding: 16px 0; text-align: center;">Queue is empty. Select tracks to play next!</div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${nextTracks.map((track, idx) => {
                  const actualIdx = store.queueIndex + 1 + idx;
                  return `
                    <div class="playlist-item" data-queue-idx="${actualIdx}">
                      <div class="playlist-thumb">
                        <img src="${track.coverUrl}" alt="${track.title}"/>
                      </div>
                      <div class="playlist-info" style="flex: 1;">
                        <div class="playlist-title">${track.title}</div>
                        <div class="playlist-meta">${track.artist} • ${formatTime(track.duration)}</div>
                      </div>
                      <button class="icon-btn remove-queue-item" data-remove-idx="${actualIdx}" title="Remove">
                        ${ICONS.close}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        ` : `
          <!-- History List -->
          <div>
            ${store.history.length === 0 ? `
              <div style="font-size: 0.8rem; color: var(--text-muted); padding: 16px 0; text-align: center;">No history yet.</div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${store.history.map(track => `
                  <div class="playlist-item" data-track-id="${track.id}">
                    <div class="playlist-thumb">
                      <img src="${track.coverUrl}" alt="${track.title}"/>
                    </div>
                    <div class="playlist-info">
                      <div class="playlist-title">${track.title}</div>
                      <div class="playlist-meta">${track.artist}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        `}
      </div>
    `;
  }

  setupListeners() {
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('#queue-subtab-queue')) {
        this.tab = 'queue';
        this.render();
      } else if (e.target.closest('#queue-subtab-history')) {
        this.tab = 'history';
        this.render();
      } else if (e.target.closest('#btn-clear-queue')) {
        store.clearQueue();
      }

      // Remove from queue
      const removeBtn = e.target.closest('.remove-queue-item');
      if (removeBtn) {
        e.stopPropagation();
        const idx = parseInt(removeBtn.getAttribute('data-remove-idx'), 10);
        store.removeFromQueue(idx);
        return;
      }

      // Play track from queue/history
      const queueItem = e.target.closest('.playlist-item');
      if (queueItem) {
        const qIdx = queueItem.getAttribute('data-queue-idx');
        const trackId = queueItem.getAttribute('data-track-id');
        if (qIdx !== null && qIdx !== undefined) {
          store.queueIndex = parseInt(qIdx, 10);
          store.playTrack(store.queue[store.queueIndex]);
        } else if (trackId) {
          const track = store.getTrackById(trackId);
          if (track) store.playTrack(track);
        }
      }
    });

    store.subscribe('queueUpdate', () => this.render());
    store.subscribe('historyUpdate', () => this.render());
    store.subscribe('trackChange', () => this.render());
  }
}
