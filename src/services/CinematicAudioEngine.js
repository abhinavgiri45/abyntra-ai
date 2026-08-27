/**
 * Abyntra AI Cinematic Sound & Score Synthesizer
 * Generates dynamic multi-layer cinematic soundtracks and foley audio via Web Audio API
 * Ready for both live playback and WebM video stream multiplexing
 */

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.mediaStreamDest = null;
    this.activeNodes = [];
    this.isPlaying = false;
    this.isMuted = false;
    this.currentTheme = 'epic';
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.35;
      this.masterGain.connect(this.ctx.destination);

      // Media stream destination for Canvas Video Recording
      this.mediaStreamDest = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.mediaStreamDest);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getAudioStream() {
    this.init();
    return this.mediaStreamDest ? this.mediaStreamDest.stream : null;
  }

  setVolume(val) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : val, this.ctx?.currentTime || 0);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  /**
   * Play an evolving cinematic soundtrack (Epic Hollywood, Cyberpunk, Ambient Sci-Fi, Suspense)
   */
  playCinematicScore(theme = 'epic') {
    this.init();
    this.stop();
    this.isPlaying = true;
    this.currentTheme = theme;

    try {
      const now = this.ctx.currentTime;

      if (theme === 'cyberpunk') {
        this.playCyberpunkScore(now);
      } else if (theme === 'ambient') {
        this.playAmbientScore(now);
      } else if (theme === 'suspense') {
        this.playSuspenseScore(now);
      } else {
        this.playEpicScore(now);
      }
    } catch (err) {
      console.error('Audio synthesizer error:', err);
    }
  }

  playEpicScore(now) {
    // 1. Deep Sub-Bass Cinematic Drone (55Hz A1)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const subFilter = this.ctx.createBiquadFilter();

    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(55, now);
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(140, now);

    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.3, now + 1.5);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    this.activeNodes.push(subOsc, subGain, subFilter);

    // 2. Evolving Warm Pad Chord Swells (Am -> F -> C -> G)
    const chordFreqs = [
      [220, 261.63, 329.63], // Am (0-3s)
      [174.61, 220, 261.63], // F (3-6s)
      [130.81, 164.81, 196.00], // C (6-9s)
      [196.00, 246.94, 293.66]  // G (9-12s)
    ];

    chordFreqs.forEach((chord, chordIdx) => {
      const chordStart = now + chordIdx * 3;
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, chordStart);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, chordStart);

        gain.gain.setValueAtTime(0, chordStart);
        gain.gain.linearRampToValueAtTime(0.08, chordStart + 1.0);
        gain.gain.linearRampToValueAtTime(0.06, chordStart + 2.5);
        gain.gain.linearRampToValueAtTime(0, chordStart + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(chordStart);
        osc.stop(chordStart + 3.3);
        this.activeNodes.push(osc, gain, filter);
      });
    });

    // 3. Cinematic Heartbeat / Taiko Drum Pulse
    for (let t = 0; t < 12; t += 1.5) {
      const hitTime = now + t;
      const drumOsc = this.ctx.createOscillator();
      const drumGain = this.ctx.createGain();

      drumOsc.type = 'sine';
      drumOsc.frequency.setValueAtTime(110, hitTime);
      drumOsc.frequency.exponentialRampToValueAtTime(30, hitTime + 0.35);

      drumGain.gain.setValueAtTime(0.35, hitTime);
      drumGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.4);

      drumOsc.connect(drumGain);
      drumGain.connect(this.masterGain);

      drumOsc.start(hitTime);
      drumOsc.stop(hitTime + 0.45);
      this.activeNodes.push(drumOsc, drumGain);
    }
  }

  playCyberpunkScore(now) {
    // Fast arpeggiated bassline + synth saw lead
    const bassNotes = [110, 130.81, 146.83, 164.81];
    for (let t = 0; t < 12; t += 0.375) {
      const hitTime = now + t;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const note = bassNotes[Math.floor((t / 0.375) % bassNotes.length)];
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note, hitTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, hitTime);
      filter.Q.setValueAtTime(4, hitTime);

      gain.gain.setValueAtTime(0.2, hitTime);
      gain.gain.exponentialRampToValueAtTime(0.01, hitTime + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(hitTime);
      osc.stop(hitTime + 0.35);
      this.activeNodes.push(osc, gain, filter);
    }
  }

  playAmbientScore(now) {
    // Celestial piano pad & calm strings
    const ambientChords = [
      [261.63, 329.63, 392.00, 523.25], // Cmaj7
      [220.00, 261.63, 329.63, 440.00], // Am7
      [174.61, 220.00, 261.63, 349.23], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G6
    ];

    ambientChords.forEach((chord, chordIdx) => {
      const chordStart = now + chordIdx * 3;
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordStart);

        gain.gain.setValueAtTime(0, chordStart);
        gain.gain.linearRampToValueAtTime(0.06, chordStart + 1.2);
        gain.gain.linearRampToValueAtTime(0, chordStart + 3.0);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(chordStart);
        osc.stop(chordStart + 3.1);
        this.activeNodes.push(osc, gain);
      });
    });
  }

  playSuspenseScore(now) {
    // 808 sub drops + tense ticking
    for (let t = 0; t < 12; t += 3.0) {
      const dropTime = now + t;
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();

      sub.type = 'sine';
      sub.frequency.setValueAtTime(90, dropTime);
      sub.frequency.exponentialRampToValueAtTime(35, dropTime + 1.2);

      subGain.gain.setValueAtTime(0.4, dropTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 1.5);

      sub.connect(subGain);
      subGain.connect(this.masterGain);

      sub.start(dropTime);
      sub.stop(dropTime + 1.6);
      this.activeNodes.push(sub, subGain);
    }
  }

  stop() {
    this.isPlaying = false;
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (_) {}
    });
    this.activeNodes = [];
  }
}

export const cinematicAudio = new CinematicAudioEngine();
