/* ==========================================================================
   SYNCHRONIZED KARAOKE LYRICS COMPONENT
   Auto-scrolling with timestamp seeking and visual active line glow.
   ========================================================================== */

import { store } from '../state/store.js';

export class LyricsView {
  constructor(container) {
    this.container = container;
    this.activeLineIndex = -1;
    this.render();
    this.setupListeners();
  }

  render() {
    const track = store.currentTrack;
    if (!track || !track.lyrics || track.lyrics.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="32" height="32"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          </div>
          <div style="font-weight: 700; color: var(--text-secondary);">No Synced Lyrics Available</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Enjoy the ambient instrumental frequencies!</div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <div class="lyrics-container" id="lyrics-scroll-box">
        ${track.lyrics.map((line, index) => `
          <div class="lyric-line" data-index="${index}" data-time="${line.time}">
            ${line.text}
          </div>
        `).join('')}
      </div>
    `;
  }

  setupListeners() {
    this.container.addEventListener('click', (e) => {
      const line = e.target.closest('.lyric-line');
      if (line) {
        const time = parseFloat(line.getAttribute('data-time'));
        if (!isNaN(time)) {
          store.seek(time);
        }
      }
    });

    store.subscribe('trackChange', () => {
      this.activeLineIndex = -1;
      this.render();
    });

    store.subscribe('timeUpdate', ({ currentTime }) => {
      this.updateActiveLine(currentTime);
    });
  }

  updateActiveLine(currentTime) {
    const track = store.currentTrack;
    if (!track || !track.lyrics) return;

    let currentIndex = -1;
    for (let i = 0; i < track.lyrics.length; i++) {
      if (currentTime >= track.lyrics[i].time) {
        currentIndex = i;
      } else {
        break;
      }
    }

    if (currentIndex !== this.activeLineIndex) {
      this.activeLineIndex = currentIndex;
      const lines = this.container.querySelectorAll('.lyric-line');
      lines.forEach((line, idx) => {
        if (idx === currentIndex) {
          line.className = 'lyric-line active';
          // Auto scroll into center view
          line.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (idx < currentIndex) {
          line.className = 'lyric-line past';
        } else {
          line.className = 'lyric-line';
        }
      });
    }
  }
}
