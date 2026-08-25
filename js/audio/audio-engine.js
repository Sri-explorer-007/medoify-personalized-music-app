/* ==========================================================================
   GLOBAL AUDIO ENGINE (Web Audio API + HTML5 Audio + Synth Fallback)
   Master Context Spec: 1 Global Player.
   ========================================================================== */

import { store } from '../state/store.js';
import { EqualizerEngine } from './equalizer.js';

class AudioEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.audio.preload = "auto";

    this.ctx = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.analyser = null;
    this.equalizer = null;
    this.isInitialized = false;

    // Procedural Synth Fallback state
    this.isSynthMode = false;
    this.synthInterval = null;
    this.synthBeatIndex = 0;

    this.setupEventListeners();
  }

  // Lazy initialize AudioContext on first user interaction
  initAudioContext() {
    if (this.isInitialized) {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = store.isMuted ? 0 : store.volume;

      // FFT Analyser Node for Visualizers
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.82;

      // Media Element Source
      this.sourceNode = this.ctx.createMediaElementSource(this.audio);

      // Equalizer & DSP graph
      this.equalizer = new EqualizerEngine(this.ctx);
      this.equalizer.setupNodes(this.sourceNode, this.gainNode);

      // Connect Master Gain to Analyser & Output
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API node routing warning:", e);
    }
  }

  setupEventListeners() {
    // Audio element events
    this.audio.addEventListener("timeupdate", () => {
      if (!this.isSynthMode) {
        store.currentTime = this.audio.currentTime;
        store.duration = this.audio.duration || store.currentTrack?.duration || 0;
        store.emit("timeUpdate", {
          currentTime: store.currentTime,
          duration: store.duration
        });
      }
    });

    this.audio.addEventListener("ended", () => {
      store.nextTrack();
    });

    this.audio.addEventListener("error", (e) => {
      console.log("Remote audio stream unavailable. Activating procedural synthesis fallback...", e);
      this.startSynthFallback();
    });

    // Store event listeners
    store.subscribe("trackChange", (track) => {
      this.initAudioContext();
      this.loadAndPlay(track);
    });

    store.subscribe("playbackStateChange", ({ isPlaying }) => {
      this.initAudioContext();
      if (isPlaying) {
        this.play();
      } else {
        this.pause();
      }
    });

    store.subscribe("seekRequest", (time) => {
      if (this.isSynthMode) {
        store.currentTime = time;
      } else if (this.audio.duration) {
        this.audio.currentTime = time;
      }
    });

    store.subscribe("volumeChange", ({ volume, isMuted }) => {
      const vol = isMuted ? 0 : volume;
      this.audio.volume = vol;
      if (this.gainNode && this.ctx) {
        this.gainNode.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
      }
    });
  }

  loadAndPlay(track) {
    this.stopSynthFallback();

    if (track.blobUrl) {
      // Local imported file
      this.audio.src = track.blobUrl;
      this.audio.play().then(() => {
        store.isPlaying = true;
      }).catch(err => {
        console.warn("Play error:", err);
      });
      return;
    }

    if (track.audioUrl) {
      this.audio.src = track.audioUrl;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          store.isPlaying = true;
        }).catch(err => {
          // If browser policy or network blocked audio URL, smoothly run procedural synthesizer
          this.startSynthFallback();
        });
      }
    } else {
      this.startSynthFallback();
    }
  }

  play() {
    this.initAudioContext();
    if (this.isSynthMode) {
      this.resumeSynth();
    } else {
      this.audio.play().catch(() => {
        this.startSynthFallback();
      });
    }
  }

  pause() {
    if (this.isSynthMode) {
      this.pauseSynth();
    } else {
      this.audio.pause();
    }
  }

  // --- Real-time Procedural Synthesizer Fallback ---
  startSynthFallback() {
    this.isSynthMode = true;
    this.initAudioContext();
    store.duration = store.currentTrack?.duration || 180;
    store.isPlaying = true;

    if (this.synthInterval) clearInterval(this.synthInterval);

    // Chord progressions in C Minor & D Minor pentatonic
    const chords = [
      [130.81, 155.56, 196.00, 233.08], // Cm7
      [116.54, 146.83, 174.61, 207.65], // Bb
      [103.83, 130.81, 155.56, 196.00], // Abmaj7
      [116.54, 146.83, 174.61, 220.00]  // Gm7
    ];

    this.synthInterval = setInterval(() => {
      if (!store.isPlaying) return;

      store.currentTime += 0.25;
      if (store.currentTime >= store.duration) {
        store.nextTrack();
        return;
      }

      store.emit("timeUpdate", {
        currentTime: store.currentTime,
        duration: store.duration
      });

      // Play synth beat & chords
      this.playProceduralTone(chords[this.synthBeatIndex % chords.length]);
      this.synthBeatIndex++;
    }, 250);
  }

  playProceduralTone(chordNotes) {
    if (!this.ctx || !this.gainNode) return;

    try {
      // 1. Synth Chord Pad
      if (this.synthBeatIndex % 8 === 0) {
        chordNotes.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);

          noteGain.gain.setValueAtTime(0, this.ctx.currentTime);
          noteGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.3);
          noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

          osc.connect(noteGain);
          noteGain.connect(this.gainNode);

          osc.start();
          osc.stop(this.ctx.currentTime + 2.0);
        });
      }

      // 2. Bass Drum / Kick (on beats 0, 4)
      if (this.synthBeatIndex % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(120, this.ctx.currentTime);
        kickOsc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);

        kickGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        kickOsc.connect(kickGain);
        kickGain.connect(this.gainNode);

        kickOsc.start();
        kickOsc.stop(this.ctx.currentTime + 0.25);
      }

      // 3. Hi-Hat / Synth Pluck (on off-beats)
      if (this.synthBeatIndex % 2 === 1) {
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        hatOsc.type = "triangle";
        hatOsc.frequency.setValueAtTime(chordNotes[this.synthBeatIndex % chordNotes.length] * 2, this.ctx.currentTime);

        hatGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        hatGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        hatOsc.connect(hatGain);
        hatGain.connect(this.gainNode);

        hatOsc.start();
        hatOsc.stop(this.ctx.currentTime + 0.15);
      }
    } catch (e) {
      // Ignore audio synthesis errors
    }
  }

  pauseSynth() {
    // Keep timer intact but paused
  }

  resumeSynth() {
    // Continue timer
  }

  stopSynthFallback() {
    this.isSynthMode = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // Real-time frequency data for Visualizer
  getFrequencyData(array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    } else {
      // Mock data if audio context not yet unmuted
      for (let i = 0; i < array.length; i++) {
        array[i] = store.isPlaying ? Math.floor(Math.sin(Date.now() * 0.005 + i) * 60 + 80) : 0;
      }
    }
  }

  getTimeDomainData(array) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array);
    } else {
      array.fill(128);
    }
  }
}

export const audioEngine = new AudioEngine();
