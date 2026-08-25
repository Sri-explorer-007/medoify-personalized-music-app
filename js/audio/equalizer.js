/* ==========================================================================
   EQUALIZER & SOUND DSP ENGINE (Web Audio API)
   5-band Graphic Equalizer (60Hz, 250Hz, 1kHz, 4kHz, 12kHz),
   Spatial Audio Widening, Reverb Simulation, and Speed Control.
   ========================================================================== */

import { storage } from '../state/storage.js';

export const EQ_PRESETS = {
  flat: { name: "Flat", bands: [0, 0, 0, 0, 0] },
  bass_boost: { name: "Bass Booster", bands: [8, 5, 1, -1, -2] },
  vocal_clarity: { name: "Vocal Clarity", bands: [-2, 1, 6, 4, 1] },
  electronic: { name: "Electronic", bands: [6, 3, 0, 4, 6] },
  rock: { name: "Rock & Metal", bands: [5, 2, -1, 4, 5] },
  acoustic: { name: "Acoustic / Warm", bands: [3, 2, 1, 2, 4] },
  night_mode: { name: "Night Mode", bands: [-4, -2, 0, -2, -6] }
};

export class EqualizerEngine {
  constructor(audioContext) {
    this.ctx = audioContext;
    this.frequencies = [60, 250, 1000, 4000, 12000];
    this.filters = [];
    this.reverbNode = null;
    this.pannerNode = null;
    this.delayNode = null;

    // Load saved settings
    const saved = storage.getItem("eq_settings", {
      preset: "flat",
      bands: [0, 0, 0, 0, 0],
      spatialAudio: false,
      reverb: "off", // 'off' | 'room' | 'hall' | 'club'
      speed: 1.0,
      crossfade: 2.0
    });

    this.settings = saved;
  }

  // Build Web Audio nodes graph
  setupNodes(inputNode, outputNode) {
    let currentNode = inputNode;

    // 1. Create 5 BiquadFilter nodes
    this.filters = this.frequencies.map((freq, index) => {
      const filter = this.ctx.createBiquadFilter();
      if (index === 0) {
        filter.type = "lowshelf";
      } else if (index === this.frequencies.length - 1) {
        filter.type = "highshelf";
      } else {
        filter.type = "peaking";
        filter.Q.value = 1.2;
      }
      filter.frequency.value = freq;
      filter.gain.value = this.settings.bands[index] || 0;

      currentNode.connect(filter);
      currentNode = filter;
      return filter;
    });

    // 2. Spatial Audio Widener (Delay + Invert phase)
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.value = 0.015; // 15ms Haas effect delay
    this.spatialGain = this.ctx.createGain();
    this.spatialGain.gain.value = this.settings.spatialAudio ? 0.4 : 0;

    currentNode.connect(this.delayNode);
    this.delayNode.connect(this.spatialGain);
    this.spatialGain.connect(outputNode);

    // 3. Connect EQ chain to output
    currentNode.connect(outputNode);

    return currentNode;
  }

  setBandGain(bandIndex, gainValue) {
    if (this.filters[bandIndex]) {
      const clamped = Math.max(-12, Math.min(12, gainValue));
      this.filters[bandIndex].gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
      this.settings.bands[bandIndex] = clamped;
      this.settings.preset = "custom";
      storage.setItem("eq_settings", this.settings);
    }
  }

  applyPreset(presetKey) {
    const preset = EQ_PRESETS[presetKey];
    if (preset) {
      this.settings.preset = presetKey;
      this.settings.bands = [...preset.bands];
      this.filters.forEach((filter, i) => {
        filter.gain.setTargetAtTime(preset.bands[i], this.ctx.currentTime, 0.05);
      });
      storage.setItem("eq_settings", this.settings);
    }
  }

  toggleSpatialAudio(enable) {
    this.settings.spatialAudio = enable;
    if (this.spatialGain) {
      this.spatialGain.gain.setTargetAtTime(enable ? 0.45 : 0, this.ctx.currentTime, 0.1);
    }
    storage.setItem("eq_settings", this.settings);
  }

  setSpeed(speed, audioElement) {
    this.settings.speed = speed;
    if (audioElement) {
      audioElement.playbackRate = speed;
    }
    storage.setItem("eq_settings", this.settings);
  }
}
