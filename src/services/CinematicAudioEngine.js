/**
 * Girionix AI Cinematic Sound & Score Synthesizer
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
   * Continuous multi-layer scheduler supports infinite 1-Hour continuous generation
   */
  playCinematicScore(theme = 'epic') {
    this.init();
    this.stop();
    this.isPlaying = true;
    this.currentTheme = theme;

    let measureIndex = 0;
    const scheduleNext = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      this.playMeasure(theme, now, measureIndex);
      measureIndex++;
    };

    scheduleNext();
    // Schedule every 3.0 seconds seamlessly
    this.loopInterval = setInterval(scheduleNext, 2950);
  }

  playMeasure(theme, now, measureIndex) {
    if (theme === 'cyberpunk') {
      this.playCyberpunkMeasure(now, measureIndex);
    } else if (theme === 'ambient') {
      this.playAmbientMeasure(now, measureIndex);
    } else if (theme === 'suspense') {
      this.playSuspenseMeasure(now, measureIndex);
    } else {
      this.playEpicMeasure(now, measureIndex);
    }
  }

  playEpicMeasure(now, measureIndex) {
    const chordProgression = [
      { root: 55, freqs: [220, 261.63, 329.63, 440], name: 'Am' },
      { root: 43.65, freqs: [174.61, 220, 261.63, 349.23], name: 'F' },
      { root: 65.41, freqs: [130.81, 164.81, 196.00, 261.63], name: 'C' },
      { root: 49.00, freqs: [196.00, 246.94, 293.66, 392.00], name: 'G' }
    ];

    const currentChord = chordProgression[measureIndex % chordProgression.length];

    // 1. Hans Zimmer Sub-Bass Braam Swell (Dual Detuned Sawtooths)
    const subOsc1 = this.ctx.createOscillator();
    const subOsc2 = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const subFilter = this.ctx.createBiquadFilter();

    subOsc1.type = 'sawtooth';
    subOsc1.frequency.setValueAtTime(currentChord.root, now);
    subOsc2.type = 'sawtooth';
    subOsc2.frequency.setValueAtTime(currentChord.root * 1.005, now); // Detune 5 cents

    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(80, now);
    subFilter.frequency.exponentialRampToValueAtTime(550, now + 1.2);
    subFilter.frequency.exponentialRampToValueAtTime(120, now + 2.9);
    subFilter.Q.setValueAtTime(3.5, now);

    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(0.35, now + 0.8);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 2.95);

    subOsc1.connect(subFilter);
    subOsc2.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc1.start(now);
    subOsc2.start(now);
    subOsc1.stop(now + 3.0);
    subOsc2.stop(now + 3.0);
    this.activeNodes.push(subOsc1, subOsc2, subGain, subFilter);

    // 2. Hollywood Strings & Brass Polyphony
    currentChord.freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700 + idx * 200, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.8);
      gain.gain.linearRampToValueAtTime(0.04, now + 2.2);
      gain.gain.linearRampToValueAtTime(0, now + 2.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.0);
      this.activeNodes.push(osc, gain, filter);
    });

    // 3. Cinematic Taiko Drums & 808 Pulses (Beat 1 and Beat 3)
    [0, 1.5].forEach((offset, idx) => {
      const hitTime = now + offset;
      const drumOsc = this.ctx.createOscillator();
      const drumGain = this.ctx.createGain();

      drumOsc.type = 'sine';
      drumOsc.frequency.setValueAtTime(idx === 0 ? 110 : 85, hitTime);
      drumOsc.frequency.exponentialRampToValueAtTime(32, hitTime + 0.35);

      drumGain.gain.setValueAtTime(0.4, hitTime);
      drumGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.4);

      drumOsc.connect(drumGain);
      drumGain.connect(this.masterGain);

      drumOsc.start(hitTime);
      drumOsc.stop(hitTime + 0.45);
      this.activeNodes.push(drumOsc, drumGain);
    });

    // 4. Evolving High Arpeggio (16th-Note Shimmer)
    const arpNotes = [currentChord.freqs[0] * 2, currentChord.freqs[1] * 2, currentChord.freqs[2] * 2, currentChord.freqs[3] * 2];
    for (let step = 0; step < 8; step++) {
      const arpTime = now + step * 0.375;
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();

      arpOsc.type = 'sine';
      arpOsc.frequency.setValueAtTime(arpNotes[step % arpNotes.length], arpTime);

      arpGain.gain.setValueAtTime(0.035, arpTime);
      arpGain.gain.exponentialRampToValueAtTime(0.001, arpTime + 0.3);

      arpOsc.connect(arpGain);
      arpGain.connect(this.masterGain);

      arpOsc.start(arpTime);
      arpOsc.stop(arpTime + 0.32);
      this.activeNodes.push(arpOsc, arpGain);
    }
  }

  playCyberpunkMeasure(now, measureIndex) {
    const bassNotes = [110, 130.81, 146.83, 164.81];
    const root = bassNotes[measureIndex % bassNotes.length];

    // 1. Detuned Moog Saw Bassline Arp (8 steps per measure)
    for (let step = 0; step < 8; step++) {
      const stepTime = now + step * 0.375;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const note = step % 2 === 0 ? root : root * 1.5;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note, stepTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, stepTime);
      filter.frequency.exponentialRampToValueAtTime(200, stepTime + 0.3);
      filter.Q.setValueAtTime(5, stepTime);

      gain.gain.setValueAtTime(0.22, stepTime);
      gain.gain.exponentialRampToValueAtTime(0.01, stepTime + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(stepTime);
      osc.stop(stepTime + 0.35);
      this.activeNodes.push(osc, gain, filter);
    }

    // 2. Vangelis CS-80 Neon Synth Pad
    const leadOsc = this.ctx.createOscillator();
    const leadGain = this.ctx.createGain();
    const leadFilter = this.ctx.createBiquadFilter();

    leadOsc.type = 'sawtooth';
    leadOsc.frequency.setValueAtTime(root * 2, now);
    leadOsc.frequency.linearRampToValueAtTime(root * 2.25, now + 2.0);

    leadFilter.type = 'bandpass';
    leadFilter.frequency.setValueAtTime(1200, now);
    leadFilter.Q.setValueAtTime(2.0, now);

    leadGain.gain.setValueAtTime(0, now);
    leadGain.gain.linearRampToValueAtTime(0.08, now + 0.6);
    leadGain.gain.exponentialRampToValueAtTime(0.001, now + 2.9);

    leadOsc.connect(leadFilter);
    leadFilter.connect(leadGain);
    leadGain.connect(this.masterGain);

    leadOsc.start(now);
    leadOsc.stop(now + 3.0);
    this.activeNodes.push(leadOsc, leadGain, leadFilter);
  }

  playAmbientMeasure(now, measureIndex) {
    const ambientChords = [
      [261.63, 329.63, 392.00, 523.25], // Cmaj7
      [220.00, 261.63, 329.63, 440.00], // Am7
      [174.61, 220.00, 261.63, 349.23], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G6
    ];

    const chord = ambientChords[measureIndex % ambientChords.length];

    // Deep Calm Sub Drone
    const droneOsc = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(chord[0] / 4, now);
    droneGain.gain.setValueAtTime(0, now);
    droneGain.gain.linearRampToValueAtTime(0.18, now + 1.0);
    droneGain.gain.linearRampToValueAtTime(0, now + 3.0);
    droneOsc.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start(now);
    droneOsc.stop(now + 3.0);
    this.activeNodes.push(droneOsc, droneGain);

    // Ethereal Sine Chords
    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 1.2);
      gain.gain.linearRampToValueAtTime(0, now + 3.0);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.1);
      this.activeNodes.push(osc, gain);
    });
  }

  playSuspenseMeasure(now, measureIndex) {
    // 1. Deep 808 Sub Drop
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    sub.type = 'sine';
    sub.frequency.setValueAtTime(95, now);
    sub.frequency.exponentialRampToValueAtTime(32, now + 1.4);

    subGain.gain.setValueAtTime(0.45, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    sub.connect(subGain);
    subGain.connect(this.masterGain);

    sub.start(now);
    sub.stop(now + 1.7);
    this.activeNodes.push(sub, subGain);

    // 2. High Metallic Clock Ticking
    for (let t = 0; t < 3.0; t += 0.375) {
      const tickTime = now + t;
      const tick = this.ctx.createOscillator();
      const tickGain = this.ctx.createGain();

      tick.type = 'triangle';
      tick.frequency.setValueAtTime(1800 + (measureIndex % 2) * 200, tickTime);

      tickGain.gain.setValueAtTime(0.08, tickTime);
      tickGain.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.08);

      tick.connect(tickGain);
      tickGain.connect(this.masterGain);

      tick.start(tickTime);
      tick.stop(tickTime + 0.09);
      this.activeNodes.push(tick, tickGain);
    }
  }

  /**
   * Trigger Dynamic Cinematic Sound FX for Shot & Act Transitions
   */
  triggerActTransition(actIndex = 1) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (actIndex === 3) {
      // Act 3 Hero Climax Impact (Sub-Boom Impact)
      const impactOsc = this.ctx.createOscillator();
      const impactGain = this.ctx.createGain();
      impactOsc.type = 'sine';
      impactOsc.frequency.setValueAtTime(120, now);
      impactOsc.frequency.exponentialRampToValueAtTime(25, now + 1.8);

      impactGain.gain.setValueAtTime(0.55, now);
      impactGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      impactOsc.connect(impactGain);
      impactGain.connect(this.masterGain);
      impactOsc.start(now);
      impactOsc.stop(now + 2.1);
      this.activeNodes.push(impactOsc, impactGain);
    } else {
      // Cinematic Whoosh Riser Transition
      const riserOsc = this.ctx.createOscillator();
      const riserGain = this.ctx.createGain();
      const riserFilter = this.ctx.createBiquadFilter();

      riserOsc.type = 'sawtooth';
      riserOsc.frequency.setValueAtTime(180, now);
      riserOsc.frequency.exponentialRampToValueAtTime(880, now + 0.8);

      riserFilter.type = 'bandpass';
      riserFilter.frequency.setValueAtTime(400, now);
      riserFilter.frequency.exponentialRampToValueAtTime(1600, now + 0.8);
      riserFilter.Q.setValueAtTime(3.0, now);

      riserGain.gain.setValueAtTime(0.01, now);
      riserGain.gain.linearRampToValueAtTime(0.2, now + 0.6);
      riserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      riserOsc.connect(riserFilter);
      riserFilter.connect(riserGain);
      riserGain.connect(this.masterGain);

      riserOsc.start(now);
      riserOsc.stop(now + 0.95);
      this.activeNodes.push(riserOsc, riserGain, riserFilter);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (_) {}
    });
    this.activeNodes = [];
  }

  /**
   * Render and Export Soundtrack to Downloadable .WAV Audio File
   */
  async renderScoreToWav(theme = 'epic', duration = 12) {
    if (typeof window === 'undefined') return null;
    const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OfflineCtx) return null;

    const sampleRate = 44100;
    const offline = new OfflineCtx(2, sampleRate * duration, sampleRate);
    const master = offline.createGain();
    master.gain.value = 0.5;
    master.connect(offline.destination);

    // Render thematic layers offline
    const now = 0;
    if (theme === 'cyberpunk') {
      const bassNotes = [110, 130.81, 146.83, 164.81];
      for (let t = 0; t < duration; t += 0.375) {
        const hitTime = now + t;
        const osc = offline.createOscillator();
        const gain = offline.createGain();
        const filter = offline.createBiquadFilter();
        const note = bassNotes[Math.floor((t / 0.375) % bassNotes.length)];

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note, hitTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, hitTime);
        filter.Q.setValueAtTime(4, hitTime);

        gain.gain.setValueAtTime(0.3, hitTime);
        gain.gain.exponentialRampToValueAtTime(0.01, hitTime + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        osc.start(hitTime);
        osc.stop(hitTime + 0.35);
      }
    } else if (theme === 'ambient') {
      const ambientChords = [
        [261.63, 329.63, 392.00, 523.25],
        [220.00, 261.63, 329.63, 440.00],
        [174.61, 220.00, 261.63, 349.23],
        [196.00, 246.94, 293.66, 392.00]
      ];
      for (let cycle = 0; cycle < Math.ceil(duration / 12); cycle++) {
        ambientChords.forEach((chord, chordIdx) => {
          const chordStart = cycle * 12 + chordIdx * 3;
          if (chordStart >= duration) return;
          chord.forEach(freq => {
            const osc = offline.createOscillator();
            const gain = offline.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, chordStart);

            gain.gain.setValueAtTime(0, chordStart);
            gain.gain.linearRampToValueAtTime(0.08, chordStart + 1.0);
            gain.gain.linearRampToValueAtTime(0, Math.min(duration, chordStart + 3.0));

            osc.connect(gain);
            gain.connect(master);
            osc.start(chordStart);
            osc.stop(Math.min(duration, chordStart + 3.1));
          });
        });
      }
    } else if (theme === 'suspense') {
      for (let t = 0; t < duration; t += 2.5) {
        const dropTime = t;
        const sub = offline.createOscillator();
        const subGain = offline.createGain();

        sub.type = 'sine';
        sub.frequency.setValueAtTime(100, dropTime);
        sub.frequency.exponentialRampToValueAtTime(32, dropTime + 1.2);

        subGain.gain.setValueAtTime(0.5, dropTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 1.5);

        sub.connect(subGain);
        subGain.connect(master);
        sub.start(dropTime);
        sub.stop(dropTime + 1.6);
      }
    } else {
      // Epic Hollywood Orchestra
      const subOsc = offline.createOscillator();
      const subGain = offline.createGain();
      const subFilter = offline.createBiquadFilter();

      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(55, 0);
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(140, 0);

      subGain.gain.setValueAtTime(0.3, 0);
      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(master);
      subOsc.start(0);
      subOsc.stop(duration);

      const chordFreqs = [
        [220, 261.63, 329.63],
        [174.61, 220, 261.63],
        [130.81, 164.81, 196.00],
        [196.00, 246.94, 293.66]
      ];
      for (let cycle = 0; cycle < Math.ceil(duration / 12); cycle++) {
        chordFreqs.forEach((chord, chordIdx) => {
          const chordStart = cycle * 12 + chordIdx * 3;
          if (chordStart >= duration) return;
          chord.forEach(freq => {
            const osc = offline.createOscillator();
            const gain = offline.createGain();
            const filter = offline.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, chordStart);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(900, chordStart);

            gain.gain.setValueAtTime(0, chordStart);
            gain.gain.linearRampToValueAtTime(0.12, chordStart + 1.0);
            gain.gain.linearRampToValueAtTime(0, Math.min(duration, chordStart + 3.0));

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(master);

            osc.start(chordStart);
            osc.stop(Math.min(duration, chordStart + 3.1));
          });
        });
      }

      for (let t = 0; t < duration; t += 1.5) {
        const drumOsc = offline.createOscillator();
        const drumGain = offline.createGain();

        drumOsc.type = 'sine';
        drumOsc.frequency.setValueAtTime(120, t);
        drumOsc.frequency.exponentialRampToValueAtTime(30, t + 0.35);

        drumGain.gain.setValueAtTime(0.4, t);
        drumGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        drumOsc.connect(drumGain);
        drumGain.connect(master);

        drumOsc.start(t);
        drumOsc.stop(t + 0.45);
      }
    }

    const renderedBuffer = await offline.startRendering();
    return this.audioBufferToWavBlob(renderedBuffer);
  }

  /**
   * Render and Export Custom Sound Effect to .WAV Blob
   */
  async renderSfxToWav(sfx) {
    if (typeof window === 'undefined') return null;
    const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OfflineCtx) return null;

    const duration = sfx.duration || 1.5;
    const sampleRate = 44100;
    const offline = new OfflineCtx(1, sampleRate * duration, sampleRate);
    const osc = offline.createOscillator();
    const gain = offline.createGain();

    if (sfx.type === 'impact') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(sfx.freq * 2, 0);
      osc.frequency.exponentialRampToValueAtTime(20, duration);
      gain.gain.setValueAtTime(0.8, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, duration);
    } else if (sfx.type === 'laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(sfx.freq, 0);
      osc.frequency.exponentialRampToValueAtTime(100, duration);
      gain.gain.setValueAtTime(0.6, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, duration);
    } else if (sfx.type === 'ui') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(sfx.freq, 0);
      osc.frequency.setValueAtTime(sfx.freq * 1.5, 0.08);
      gain.gain.setValueAtTime(0.5, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, duration);
    } else if (sfx.type === 'bassdrop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(sfx.freq, 0);
      osc.frequency.exponentialRampToValueAtTime(28, duration);
      gain.gain.setValueAtTime(0.8, 0);
      gain.gain.linearRampToValueAtTime(0.001, duration);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(sfx.freq, 0);
      gain.gain.setValueAtTime(0.5, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, duration);
    }

    osc.connect(gain);
    gain.connect(offline.destination);
    osc.start(0);
    osc.stop(duration);

    const renderedBuffer = await offline.startRendering();
    return this.audioBufferToWavBlob(renderedBuffer);
  }

  /**
   * Play Dynamic AI Singing Vocals with Harmonic Backing Band
   */
  playSingingTrack({ lyrics = 'Girionix AI lighting up the starry sky', singer = 'aria', scale = 'major', tempo = 116 }) {
    this.init();
    this.stop();
    this.isPlaying = true;

    try {
      const now = this.ctx.currentTime;
      const beatDuration = 60 / tempo;
      
      const scaleMap = {
        major: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // C4, D4, E4, G4, A4, C5
        minor: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00], // A3, C4, D4, E4, G4, A4
        cyber: [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 587.33], // D Dorian
        raga: [261.63, 277.18, 311.13, 349.23, 392.00, 415.30, 466.16] // Bhairavi
      };

      const notes = scaleMap[scale] || scaleMap.major;
      const words = lyrics.trim().split(/\s+/);

      // 1. Synthesize Vocal Melodic Formants
      words.forEach((word, idx) => {
        const noteStart = now + idx * beatDuration;
        const notePitch = notes[idx % notes.length];
        
        const osc = this.ctx.createOscillator();
        const formantFilter = this.ctx.createBiquadFilter();
        const vocalGain = this.ctx.createGain();
        const vibratoLFO = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();

        // Singer voice characteristics
        if (singer === 'nexus') {
          osc.type = 'sawtooth';
          formantFilter.type = 'bandpass';
          formantFilter.frequency.setValueAtTime(1400, noteStart);
          formantFilter.Q.setValueAtTime(8, noteStart);
          vibratoLFO.frequency.setValueAtTime(8.0, noteStart);
          vibratoGain.gain.setValueAtTime(2.0, noteStart);
        } else if (singer === 'leo') {
          osc.type = 'triangle';
          formantFilter.type = 'lowpass';
          formantFilter.frequency.setValueAtTime(1200, noteStart);
          vibratoLFO.frequency.setValueAtTime(5.2, noteStart);
          vibratoGain.gain.setValueAtTime(6.0, noteStart);
        } else if (singer === 'sur') {
          osc.type = 'sawtooth';
          formantFilter.type = 'lowpass';
          formantFilter.frequency.setValueAtTime(950, noteStart);
          vibratoLFO.frequency.setValueAtTime(6.0, noteStart);
          vibratoGain.gain.setValueAtTime(9.0, noteStart);
          osc.frequency.setValueAtTime(notePitch * 0.95, noteStart);
          osc.frequency.exponentialRampToValueAtTime(notePitch, noteStart + 0.15);
        } else {
          osc.type = 'sine';
          formantFilter.type = 'bandpass';
          formantFilter.frequency.setValueAtTime(2200, noteStart);
          formantFilter.Q.setValueAtTime(2.5, noteStart);
          vibratoLFO.frequency.setValueAtTime(5.8, noteStart);
          vibratoGain.gain.setValueAtTime(5.0, noteStart);
        }

        osc.frequency.setValueAtTime(notePitch, noteStart);

        vibratoLFO.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);

        vocalGain.gain.setValueAtTime(0, noteStart);
        vocalGain.gain.linearRampToValueAtTime(0.35, noteStart + 0.08);
        vocalGain.gain.linearRampToValueAtTime(0.28, noteStart + beatDuration * 0.7);
        vocalGain.gain.exponentialRampToValueAtTime(0.001, noteStart + beatDuration * 0.95);

        osc.connect(formantFilter);
        formantFilter.connect(vocalGain);
        vocalGain.connect(this.masterGain);

        osc.start(noteStart);
        vibratoLFO.start(noteStart);
        osc.stop(noteStart + beatDuration);
        vibratoLFO.stop(noteStart + beatDuration);

        this.activeNodes.push(osc, formantFilter, vocalGain, vibratoLFO, vibratoGain);
      });

      // 2. Add Backing Harmony Chords & Pulse
      const totalDuration = words.length * beatDuration + 1;
      for (let t = 0; t < totalDuration; t += beatDuration * 2) {
        const chordStart = now + t;
        const root = notes[Math.floor((t / (beatDuration * 2)) % notes.length)] / 2;
        
        [root, root * 1.25, root * 1.5].forEach(f => {
          const padOsc = this.ctx.createOscillator();
          const padGain = this.ctx.createGain();
          padOsc.type = 'triangle';
          padOsc.frequency.setValueAtTime(f, chordStart);

          padGain.gain.setValueAtTime(0, chordStart);
          padGain.gain.linearRampToValueAtTime(0.08, chordStart + 0.4);
          padGain.gain.linearRampToValueAtTime(0, chordStart + beatDuration * 2);

          padOsc.connect(padGain);
          padGain.connect(this.masterGain);
          padOsc.start(chordStart);
          padOsc.stop(chordStart + beatDuration * 2);
          this.activeNodes.push(padOsc, padGain);
        });

        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(110, chordStart);
        kickOsc.frequency.exponentialRampToValueAtTime(35, chordStart + 0.3);
        kickGain.gain.setValueAtTime(0.3, chordStart);
        kickGain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.35);

        kickOsc.connect(kickGain);
        kickGain.connect(this.masterGain);
        kickOsc.start(chordStart);
        kickOsc.stop(chordStart + 0.4);
        this.activeNodes.push(kickOsc, kickGain);
      }

      // 3. Trigger Lyric Vocal Speech Pronunciation
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lyrics);
        utterance.rate = (tempo / 120) * 0.9;
        utterance.pitch = singer === 'aria' ? 1.3 : singer === 'leo' ? 0.9 : 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Singing synthesis error:', err);
    }
  }

  /**
   * Render Singing Track to Downloadable .WAV Blob
   */
  async renderSingingToWav({ lyrics = 'Girionix AI lighting up the sky', singer = 'aria', scale = 'major', tempo = 116 }) {
    if (typeof window === 'undefined') return null;
    const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OfflineCtx) return null;

    const beatDuration = 60 / tempo;
    const words = lyrics.trim().split(/\s+/);
    const duration = Math.max(6, words.length * beatDuration + 2);
    const sampleRate = 44100;

    const offline = new OfflineCtx(2, Math.ceil(sampleRate * duration), sampleRate);
    const master = offline.createGain();
    master.gain.value = 0.5;
    master.connect(offline.destination);

    const scaleMap = {
      major: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
      minor: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00],
      cyber: [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 587.33],
      raga: [261.63, 277.18, 311.13, 349.23, 392.00, 415.30, 466.16]
    };
    const notes = scaleMap[scale] || scaleMap.major;

    words.forEach((_, idx) => {
      const noteStart = idx * beatDuration;
      const notePitch = notes[idx % notes.length];
      const osc = offline.createOscillator();
      const vocalGain = offline.createGain();
      const formant = offline.createBiquadFilter();

      osc.type = singer === 'nexus' ? 'sawtooth' : singer === 'leo' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(notePitch, noteStart);

      formant.type = 'bandpass';
      formant.frequency.setValueAtTime(singer === 'aria' ? 2200 : 1200, noteStart);

      vocalGain.gain.setValueAtTime(0, noteStart);
      vocalGain.gain.linearRampToValueAtTime(0.4, noteStart + 0.08);
      vocalGain.gain.linearRampToValueAtTime(0.001, noteStart + beatDuration * 0.95);

      osc.connect(formant);
      formant.connect(vocalGain);
      vocalGain.connect(master);

      osc.start(noteStart);
      osc.stop(noteStart + beatDuration);
    });

    for (let t = 0; t < duration; t += beatDuration * 2) {
      const root = notes[Math.floor((t / (beatDuration * 2)) % notes.length)] / 2;
      [root, root * 1.5].forEach(f => {
        const pad = offline.createOscillator();
        const gain = offline.createGain();
        pad.type = 'triangle';
        pad.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.3);
        gain.gain.linearRampToValueAtTime(0, Math.min(duration, t + beatDuration * 2));
        pad.connect(gain);
        gain.connect(master);
        pad.start(t);
        pad.stop(Math.min(duration, t + beatDuration * 2));
      });
    }

    const renderedBuffer = await offline.startRendering();
    return this.audioBufferToWavBlob(renderedBuffer);
  }

  /**
   * Convert AudioBuffer to Standard PCM 16-bit WAV Blob
   */
  audioBufferToWavBlob(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    function setUint16(data) {
      out.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    // RIFF identifier
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // format chunk identifier
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // subchunk1size (16 for PCM)
    setUint16(1); // PCM format
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2); // block align
    setUint16(16); // bits per sample

    // data chunk identifier
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out], { type: 'audio/wav' });
  }
}

export const cinematicAudio = new CinematicAudioEngine();
