/* ==========================================================================
   CANVAS AUDIO VISUALIZER (4 High-FPS Rendering Engines)
   1. Neon Frequency Bars
   2. Fluid Oscilloscope Waves
   3. Circular Pulse Spectrum
   4. Cosmic Starfield Particles
   ========================================================================== */

import { audioEngine } from './audio-engine.js';
import { store } from '../state/store.js';

export class VisualizerRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.mode = 'bars'; // 'bars' | 'waves' | 'circle' | 'particles'
    this.animationFrameId = null;
    this.freqData = new Uint8Array(128);
    this.timeData = new Uint8Array(128);
    this.particles = [];
    this.initParticles();

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  setMode(mode) {
    this.mode = mode;
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio || 400;
    this.canvas.height = rect.height * window.devicePixelRatio || 200;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * 400,
        y: Math.random() * 200,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        baseHue: Math.random() * 60 + 60
      });
    }
  }

  start() {
    if (this.animationFrameId) return;
    const loop = () => {
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Get current audio data
    audioEngine.getFrequencyData(this.freqData);
    audioEngine.getTimeDomainData(this.timeData);

    // Accent color from CSS
    const computedAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#D7FF3F';

    // Clear background
    this.ctx.fillStyle = 'rgba(8, 9, 13, 0.4)';
    this.ctx.fillRect(0, 0, w, h);

    if (this.mode === 'bars') {
      this.renderBars(w, h, computedAccent);
    } else if (this.mode === 'waves') {
      this.renderWaves(w, h, computedAccent);
    } else if (this.mode === 'circle') {
      this.renderCircle(w, h, computedAccent);
    } else if (this.mode === 'particles') {
      this.renderParticles(w, h, computedAccent);
    }
  }

  // --- 1. Neon Bars ---
  renderBars(w, h, accentColor) {
    const numBars = 48;
    const barWidth = (w / numBars) * 0.75;
    const gap = (w / numBars) * 0.25;

    for (let i = 0; i < numBars; i++) {
      const dataIdx = Math.floor((i / numBars) * this.freqData.length * 0.7);
      const val = this.freqData[dataIdx] || 0;
      const barHeight = Math.max(4, (val / 255) * h * 0.85);

      const x = i * (barWidth + gap) + gap / 2;
      const y = h - barHeight;

      // Gradient bar
      const grad = this.ctx.createLinearGradient(0, y, 0, h);
      grad.addColorStop(0, accentColor);
      grad.addColorStop(1, 'rgba(59, 130, 246, 0.2)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      this.ctx.fill();

      // Top glowing cap
      if (val > 100) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x, y - 3, barWidth, 2);
      }
    }
  }

  // --- 2. Fluid Oscilloscope Waves ---
  renderWaves(w, h, accentColor) {
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = accentColor;
    this.ctx.shadowBlur = 12;
    this.ctx.shadowColor = accentColor;

    this.ctx.beginPath();
    const sliceWidth = w / this.timeData.length;
    let x = 0;

    for (let i = 0; i < this.timeData.length; i++) {
      const v = this.timeData[i] / 128.0;
      const y = (v * h) / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    this.ctx.lineTo(w, h / 2);
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  // --- 3. Circular Pulse Spectrum ---
  renderCircle(w, h, accentColor) {
    const cx = w / 2;
    const cy = h / 2;
    const baseRadius = Math.min(w, h) * 0.24;

    // Calculate average bass energy
    let bassSum = 0;
    for (let i = 0; i < 16; i++) bassSum += this.freqData[i];
    const bassEnergy = bassSum / 16 / 255;
    const dynamicRadius = baseRadius + bassEnergy * 24;

    // Inner Glowing Core
    const coreGrad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, dynamicRadius);
    coreGrad.addColorStop(0, 'rgba(215, 255, 63, 0.4)');
    coreGrad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = coreGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, dynamicRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Frequency rays
    const numPoints = 64;
    this.ctx.strokeStyle = accentColor;
    this.ctx.lineWidth = 2.5;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const dataIdx = Math.floor((i / numPoints) * this.freqData.length * 0.7);
      const val = (this.freqData[dataIdx] || 0) / 255;
      const rayLen = val * 35;

      const x1 = cx + Math.cos(angle) * dynamicRadius;
      const y1 = cy + Math.sin(angle) * dynamicRadius;
      const x2 = cx + Math.cos(angle) * (dynamicRadius + rayLen);
      const y2 = cy + Math.sin(angle) * (dynamicRadius + rayLen);

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
  }

  // --- 4. Cosmic Particles ---
  renderParticles(w, h, accentColor) {
    let bass = 0;
    for (let i = 0; i < 8; i++) bass += this.freqData[i];
    const energy = (bass / 8 / 255);

    this.particles.forEach(p => {
      p.x += p.vx * (1 + energy * 3);
      p.y += p.vy * (1 + energy * 3);

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const rad = p.radius + energy * 4;
      this.ctx.fillStyle = energy > 0.5 ? '#FFFFFF' : accentColor;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
}
