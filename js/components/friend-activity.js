/* ==========================================================================
   FRIEND ACTIVITY FEED COMPONENT (Privacy-Respecting)
   Master Context: Private music streaming for 7-10 trusted users.
   ========================================================================== */

import { store } from '../state/store.js';

export const MOCK_FRIENDS = [
  {
    name: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    track: "Midnight City Lights",
    artist: "Neon Dreamer",
    playlist: "Synthwave Night Drive",
    online: true,
    timeAgo: "Now"
  },
  {
    name: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    track: "Cyberpunk Odyssey",
    artist: "HyperMatrix",
    playlist: "Neo Tokyo 2099",
    online: true,
    timeAgo: "Now"
  },
  {
    name: "Chloe Bennett",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    track: "Rainy Cafe Lo-Fi",
    artist: "Aura Beats",
    playlist: "Coffee & Raindrops",
    online: false,
    timeAgo: "14m"
  },
  {
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    track: "Deep Focus Ambient",
    artist: "Solstice Studio",
    playlist: "Mindful Waves",
    online: false,
    timeAgo: "2h"
  }
];

export class FriendActivity {
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Trusted Circle (4)</span>
          <span style="font-size: 0.72rem; color: var(--accent); background: var(--accent-muted); padding: 2px 8px; border-radius: var(--radius-full); font-weight: 600;">Private Network</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${MOCK_FRIENDS.map(f => `
            <div style="display: flex; align-items: flex-start; gap: 12px;">
              <div style="position: relative; width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: var(--bg-highlight);">
                <img src="${f.avatar}" alt="${f.name}" style="width: 100%; height: 100%; object-fit: cover;"/>
                ${f.online ? `<span style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); border: 2px solid var(--bg-surface);"></span>` : ''}
              </div>

              <div style="display: flex; flex-direction: column; min-width: 0; flex: 1;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${f.name}</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">${f.timeAgo}</span>
                </div>
                <div style="font-size: 0.82rem; font-weight: 600; color: var(--accent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">
                  ${f.track}
                </div>
                <div style="font-size: 0.76rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${f.artist} • ${f.playlist}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
