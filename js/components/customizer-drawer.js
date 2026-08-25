/* ==========================================================================
   CUSTOMIZER STUDIO DRAWER COMPONENT
   "Make it customize": Themes, Glassmorphism, 5-Band EQ, DSP Spatial Audio,
   Visualizers, and Dynamic Ambiance.
   ========================================================================== */

import { store } from '../state/store.js';
import { themeEngine, THEME_PRESETS } from '../state/theme-engine.js';
import { audioEngine } from '../audio/audio-engine.js';
import { EQ_PRESETS } from '../audio/equalizer.js';
import { ICONS } from './ui.js';

export class CustomizerDrawer {
  constructor(container) {
    this.container = container;
    this.render();
    this.setupListeners();
  }

  render() {
    const tSettings = themeEngine.settings;
    const eq = audioEngine.equalizer?.settings || {
      preset: 'flat',
      bands: [0, 0, 0, 0, 0],
      spatialAudio: false,
      speed: 1.0
    };

    this.container.innerHTML = `
      <div class="customizer-header">
        <div class="customizer-title">
          ${ICONS.palette}
          <span>Customization Studio</span>
        </div>
        <button class="icon-btn" id="btn-close-customizer" title="Close Customizer">
          ${ICONS.close}
        </button>
      </div>

      <div class="customizer-body">
        <!-- 1. COLOR THEME PRESETS -->
        <div class="customizer-section">
          <div class="customizer-label">
            <span>Color Palette Presets</span>
          </div>
          <div class="palette-grid">
            ${THEME_PRESETS.map(preset => `
              <div class="palette-btn ${tSettings.presetId === preset.id ? 'active' : ''}" data-preset-id="${preset.id}">
                <div class="palette-swatch" style="background: ${preset.accent};"></div>
                <span class="palette-name">${preset.name}</span>
              </div>
            `).join('')}
          </div>

          <!-- Custom Color Picker -->
          <div class="color-picker-row">
            <input type="color" id="custom-color-input" class="color-picker-input" value="${tSettings.customAccent || '#D7FF3F'}"/>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">Custom Hex Accent</span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">Pick any color for instant UI styling</span>
            </div>
          </div>
        </div>

        <!-- 2. GLASSMORPHISM & UI TUNING -->
        <div class="customizer-section">
          <div class="customizer-label">
            <span>Glassmorphism & Surface</span>
          </div>

          <!-- Glass Blur Slider -->
          <div class="slider-group">
            <div class="slider-header">
              <span>Glass Blur Intensity</span>
              <span class="slider-val" id="val-glass-blur">${tSettings.glassBlur}px</span>
            </div>
            <input type="range" class="custom-range" id="slider-glass-blur" min="0" max="30" value="${tSettings.glassBlur}"/>
          </div>

          <!-- Glass Opacity Slider -->
          <div class="slider-group">
            <div class="slider-header">
              <span>Surface Opacity</span>
              <span class="slider-val" id="val-glass-opacity">${Math.round(tSettings.glassOpacity * 100)}%</span>
            </div>
            <input type="range" class="custom-range" id="slider-glass-opacity" min="0.3" max="0.95" step="0.05" value="${tSettings.glassOpacity}"/>
          </div>

          <!-- Border Glow Slider -->
          <div class="slider-group">
            <div class="slider-header">
              <span>Neon Border Glow</span>
              <span class="slider-val" id="val-border-glow">${Math.round(tSettings.borderGlow * 100)}%</span>
            </div>
            <input type="range" class="custom-range" id="slider-border-glow" min="0" max="1" step="0.1" value="${tSettings.borderGlow}"/>
          </div>

          <!-- Corner Radius Slider -->
          <div class="slider-group">
            <div class="slider-header">
              <span>Corner Radius</span>
              <span class="slider-val" id="val-border-radius">${tSettings.borderRadius}px</span>
            </div>
            <input type="range" class="custom-range" id="slider-border-radius" min="4" max="24" step="2" value="${tSettings.borderRadius}"/>
          </div>

          <!-- Dynamic Album Lighting Switch -->
          <div class="switch-row">
            <div class="switch-label-group">
              <span class="switch-title">Album Reactive Aura</span>
              <span class="switch-sub">Extract background light from current cover</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="switch-album-aura" ${tSettings.dynamicAlbumGlow ? 'checked' : ''}/>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- 3. WEB AUDIO 5-BAND EQUALIZER -->
        <div class="customizer-section">
          <div class="customizer-label">
            <span>5-Band Graphic Equalizer</span>
          </div>

          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${Object.keys(EQ_PRESETS).map(key => `
              <button class="chip ${eq.preset === key ? 'active' : ''}" data-eq-preset="${key}">
                ${EQ_PRESETS[key].name}
              </button>
            `).join('')}
          </div>

          <div class="eq-container">
            <div class="eq-sliders-row">
              ${['60Hz', '250Hz', '1kHz', '4kHz', '12kHz'].map((label, i) => `
                <div class="eq-band">
                  <span class="eq-gain-val" id="eq-val-${i}">${eq.bands[i] > 0 ? '+' : ''}${eq.bands[i]}dB</span>
                  <input type="range" class="eq-slider" data-band="${i}" min="-12" max="12" step="1" value="${eq.bands[i]}"/>
                  <span class="eq-freq-label">${label}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Spatial Audio Widening Switch -->
          <div class="switch-row">
            <div class="switch-label-group">
              <span class="switch-title">3D Spatial Audio Widener</span>
              <span class="switch-sub">Simulates acoustic stereo expansion</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="switch-spatial-audio" ${eq.spatialAudio ? 'checked' : ''}/>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- Playback Speed -->
          <div class="slider-group">
            <div class="slider-header">
              <span>Playback Speed</span>
              <span class="slider-val" id="val-playback-speed">${eq.speed}x</span>
            </div>
            <input type="range" class="custom-range" id="slider-playback-speed" min="0.5" max="2.0" step="0.25" value="${eq.speed}"/>
          </div>
        </div>
      </div>
    `;
  }

  setupListeners() {
    this.container.addEventListener('click', (e) => {
      // Close
      if (e.target.closest('#btn-close-customizer')) {
        store.isCustomizerOpen = false;
        store.emit('customizerToggle', false);
        return;
      }

      // Preset click
      const presetBtn = e.target.closest('.palette-btn');
      if (presetBtn) {
        const id = presetBtn.getAttribute('data-preset-id');
        themeEngine.applyTheme(id);
        this.render();
        return;
      }

      // EQ Preset click
      const eqBtn = e.target.closest('[data-eq-preset]');
      if (eqBtn) {
        const presetKey = eqBtn.getAttribute('data-eq-preset');
        audioEngine.equalizer?.applyPreset(presetKey);
        this.render();
      }
    });

    // Custom Color picker
    this.container.addEventListener('input', (e) => {
      if (e.target.id === 'custom-color-input') {
        themeEngine.setCustomColor(e.target.value);
      } else if (e.target.id === 'slider-glass-blur') {
        const val = parseInt(e.target.value);
        themeEngine.applyGlassSettings({ glassBlur: val });
        const el = this.container.querySelector('#val-glass-blur');
        if (el) el.textContent = `${val}px`;
      } else if (e.target.id === 'slider-glass-opacity') {
        const val = parseFloat(e.target.value);
        themeEngine.applyGlassSettings({ glassOpacity: val });
        const el = this.container.querySelector('#val-glass-opacity');
        if (el) el.textContent = `${Math.round(val * 100)}%`;
      } else if (e.target.id === 'slider-border-glow') {
        const val = parseFloat(e.target.value);
        themeEngine.applyGlassSettings({ borderGlow: val });
        const el = this.container.querySelector('#val-border-glow');
        if (el) el.textContent = `${Math.round(val * 100)}%`;
      } else if (e.target.id === 'slider-border-radius') {
        const val = parseInt(e.target.value);
        themeEngine.applyGlassSettings({ borderRadius: val });
        const el = this.container.querySelector('#val-border-radius');
        if (el) el.textContent = `${val}px`;
      } else if (e.target.classList.contains('eq-slider')) {
        const band = parseInt(e.target.getAttribute('data-band'));
        const val = parseInt(e.target.value);
        audioEngine.equalizer?.setBandGain(band, val);
        const valEl = this.container.querySelector(`#eq-val-${band}`);
        if (valEl) valEl.textContent = `${val > 0 ? '+' : ''}${val}dB`;
      } else if (e.target.id === 'slider-playback-speed') {
        const speed = parseFloat(e.target.value);
        audioEngine.equalizer?.setSpeed(speed, audioEngine.audio);
        const el = this.container.querySelector('#val-playback-speed');
        if (el) el.textContent = `${speed}x`;
      }
    });

    // Switches
    this.container.addEventListener('change', (e) => {
      if (e.target.id === 'switch-album-aura') {
        themeEngine.settings.dynamicAlbumGlow = e.target.checked;
        if (e.target.checked && store.currentTrack) {
          themeEngine.setAmbientFromTrack(store.currentTrack);
        }
      } else if (e.target.id === 'switch-spatial-audio') {
        audioEngine.equalizer?.toggleSpatialAudio(e.target.checked);
      }
    });

    store.subscribe('customizerToggle', (isOpen) => {
      if (isOpen) {
        this.container.classList.add('open');
        this.render();
      } else {
        this.container.classList.remove('open');
      }
    });
  }
}
