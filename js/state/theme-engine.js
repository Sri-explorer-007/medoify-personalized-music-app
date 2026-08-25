/* ==========================================================================
   THEME & CUSTOMIZATION ENGINE
   Manages accent presets, custom color palettes, glassmorphism parameters,
   and dynamic ambient color extraction from album artwork.
   ========================================================================== */

import { storage } from './storage.js';

export const THEME_PRESETS = [
  {
    id: "electric-lime",
    name: "Electric Lime",
    accent: "#D7FF3F",
    accentRgb: "215, 255, 63",
    accentText: "#08090D",
    desc: "Project Master signature obsidian & high-voltage lime"
  },
  {
    id: "spotify-green",
    name: "Spotify Classic",
    accent: "#1DB954",
    accentRgb: "29, 185, 84",
    accentText: "#08090D",
    desc: "Iconic music streaming neon emerald"
  },
  {
    id: "cyberpunk-violet",
    name: "Cyber Violet",
    accent: "#A855F7",
    accentRgb: "168, 85, 247",
    accentText: "#FFFFFF",
    desc: "Neo Tokyo synthwave ultraviolet"
  },
  {
    id: "sunset-horizon",
    name: "Sunset Horizon",
    accent: "#FF6B4A",
    accentRgb: "255, 107, 74",
    accentText: "#08090D",
    desc: "Warm twilight orange glow"
  },
  {
    id: "oceanic-cyan",
    name: "Oceanic Cyan",
    accent: "#06B6D4",
    accentRgb: "6, 182, 212",
    accentText: "#08090D",
    desc: "Deep sea luminescent aquamarine"
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    accent: "#F43F5E",
    accentRgb: "244, 63, 94",
    accentText: "#FFFFFF",
    desc: "Crimson velvet elegance"
  },
  {
    id: "pure-oled",
    name: "OLED Mono",
    accent: "#FFFFFF",
    accentRgb: "255, 255, 255",
    accentText: "#08090D",
    desc: "Ultra-clean high-contrast stark monochrome"
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    accent: "#FBBF24",
    accentRgb: "251, 191, 36",
    accentText: "#08090D",
    desc: "Warm vinyl acoustic glow"
  }
];

class ThemeEngine {
  constructor() {
    const saved = storage.getItem("theme_settings", {
      presetId: "electric-lime",
      customAccent: "#D7FF3F",
      glassBlur: 16,
      glassOpacity: 0.72,
      borderGlow: 0.4,
      borderRadius: 12,
      dynamicAlbumGlow: true
    });

    this.settings = saved;
    this.canvasHelper = document.createElement("canvas");
    this.canvasHelper.width = 10;
    this.canvasHelper.height = 10;
    this.ctxHelper = this.canvasHelper.getContext("2d", { willReadFrequently: true });
  }

  init() {
    this.applyTheme(this.settings.presetId, false);
    this.applyGlassSettings(this.settings);
  }

  hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `${r}, ${g}, ${b}`;
  }

  isLightColor(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  }

  applyTheme(presetId, save = true) {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    const root = document.documentElement;

    if (preset) {
      this.settings.presetId = preset.id;
      this.settings.customAccent = preset.accent;
      root.style.setProperty("--accent", preset.accent);
      root.style.setProperty("--accent-rgb", preset.accentRgb);
      root.style.setProperty("--accent-text", preset.accentText);
      root.style.setProperty("--accent-glow", `rgba(${preset.accentRgb}, 0.35)`);
      root.style.setProperty("--accent-muted", `rgba(${preset.accentRgb}, 0.15)`);
    }

    if (save) storage.setItem("theme_settings", this.settings);
  }

  setCustomColor(hex) {
    const rgb = this.hexToRgb(hex);
    const isLight = this.isLightColor(hex);
    const root = document.documentElement;

    this.settings.presetId = "custom";
    this.settings.customAccent = hex;

    root.style.setProperty("--accent", hex);
    root.style.setProperty("--accent-rgb", rgb);
    root.style.setProperty("--accent-text", isLight ? "#08090D" : "#FFFFFF");
    root.style.setProperty("--accent-glow", `rgba(${rgb}, 0.35)`);
    root.style.setProperty("--accent-muted", `rgba(${rgb}, 0.15)`);

    storage.setItem("theme_settings", this.settings);
  }

  applyGlassSettings(settings, save = true) {
    Object.assign(this.settings, settings);
    const root = document.documentElement;

    if (settings.glassBlur !== undefined) {
      root.style.setProperty("--glass-blur", `${settings.glassBlur}px`);
    }
    if (settings.glassOpacity !== undefined) {
      root.style.setProperty("--glass-opacity", `${settings.glassOpacity}`);
    }
    if (settings.borderGlow !== undefined) {
      root.style.setProperty("--glass-glow-intensity", `${settings.borderGlow}`);
    }
    if (settings.borderRadius !== undefined) {
      root.style.setProperty("--radius-md", `${settings.borderRadius}px`);
      root.style.setProperty("--radius-lg", `${Math.round(settings.borderRadius * 1.5)}px`);
    }

    if (save) storage.setItem("theme_settings", this.settings);
  }

  // Dynamic ambient color extractor from album artwork
  setAmbientFromTrack(track) {
    if (!this.settings.dynamicAlbumGlow || !track) return;

    const root = document.documentElement;
    const color1 = track.color || "rgba(215, 255, 63, 0.25)";
    root.style.setProperty("--ambient-color", color1);
    root.style.setProperty("--ambient-color-2", "rgba(59, 130, 246, 0.18)");
  }
}

export const themeEngine = new ThemeEngine();
