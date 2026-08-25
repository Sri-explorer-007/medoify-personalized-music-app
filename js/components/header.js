/* ==========================================================================
   HEADER COMPONENT
   Search bar, navigation history, Theme Quick Button, Customizer Toggle, User Avatar
   ========================================================================== */

import { store } from '../state/store.js';
import { ICONS } from './ui.js';

export class Header {
  constructor(container) {
    this.container = container;
    this.render();
    this.setupListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="header-left">
        <div class="nav-history-buttons">
          <button class="icon-btn" id="nav-back-btn" title="Go Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="icon-btn" id="nav-forward-btn" title="Go Forward">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div class="search-bar-container">
          <span class="search-icon-inside">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input 
            type="text" 
            id="global-search-input" 
            class="search-input" 
            placeholder="What do you want to play?" 
            value="${store.searchQuery || ''}"
          />
          <button class="search-clear-btn ${store.searchQuery ? 'visible' : ''}" id="search-clear-btn" title="Clear">
            ${ICONS.close}
          </button>
        </div>
      </div>

      <div class="header-right">
        <button class="btn btn-secondary btn-sm" id="btn-open-customizer" title="Customize Studio">
          ${ICONS.palette}
          <span>Customize</span>
        </button>

        <div class="user-avatar-btn" title="User Profile" style="cursor: pointer; width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px solid var(--accent); position: relative;">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" style="width:100%;height:100%;object-fit:cover;"/>
          <span style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: var(--accent); border-radius: 50%; border: 1.5px solid var(--bg-base);"></span>
        </div>
      </div>
    `;
  }

  setupListeners() {
    const searchInput = this.container.querySelector('#global-search-input');
    const clearBtn = this.container.querySelector('#search-clear-btn');
    const customizerBtn = this.container.querySelector('#btn-open-customizer');

    // Live search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        store.searchQuery = query;
        if (query) {
          clearBtn.classList.add('visible');
          if (store.activeView !== 'search') {
            store.navigate('search');
          }
        } else {
          clearBtn.classList.remove('visible');
        }
        store.emit('searchQueryChange', query);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        store.searchQuery = '';
        clearBtn.classList.remove('visible');
        store.emit('searchQueryChange', '');
      });
    }

    if (customizerBtn) {
      customizerBtn.addEventListener('click', () => {
        store.isCustomizerOpen = !store.isCustomizerOpen;
        store.emit('customizerToggle', store.isCustomizerOpen);
      });
    }

    // Back / forward
    const backBtn = this.container.querySelector('#nav-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (store.activeView !== 'home') store.navigate('home');
      });
    }
  }
}
