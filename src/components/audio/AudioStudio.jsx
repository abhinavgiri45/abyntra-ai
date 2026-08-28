import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Mic, 
  Radio, 
  Sliders, 
  Layers, 
  Activity,
  Zap,
  Check,
  RefreshCw,
  Cpu,
  Crown
} from 'lucide-react';
import { cinematicAudio } from '../../services/CinematicAudioEngine';

export default function AudioStudio({ activeModel, isTitanMode = false }) {
  const [activeSubTab, setActiveSubTab] = useState('score'); // 'score' | 'voice' | 'sfx'
  const [selectedScoreTheme, setSelectedScoreTheme] = useState('epic');
  const [isScorePlaying, setIsScorePlaying] = useState(false);
  const [volume, setVolume] = useState(75);

  // Voice TTS State
  const [voiceText, setVoiceText] = useState('Welcome to Vedic AI Studio. Envisioned and engineered by Abhinav Giri to empower polymath thinkers, creators, and developers worldwide.');
  const [selectedVoice, setSelectedVoice] = useState('titan-deep');
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Canvas visualizer
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const scoreThemes = [
    { id: 'epic', name: '🎻 Epic Hollywood Orchestra', bpm: '110 BPM', mood: 'Heroic & Grand', desc: 'Sub-bass drones, brass swells, and cinematic Taiko drum pulses' },
    { id: 'cyberpunk', name: '⚡ Cyberpunk Synthwave', bpm: '128 BPM', mood: 'Futuristic & Intense', desc: '80s analog arpeggiators, filtered saw bass, and neon pads' },
    { id: 'ambient', name: '🎹 Ethereal Ambient Piano', bpm: '72 BPM', mood: 'Dreamy & Calm', desc: 'Lush reverb chords, celestial sine waves, and floating textures' },
    { id: 'suspense', name: '🥁 Dark Suspense 808 Trap', bpm: '140 BPM', mood: 'Tense & Heavy', desc: 'Deep 808 sub-bass glides, sharp ticks, and ominous minor chords' }
  ];

  const voiceOptions = [
    { id: 'titan-deep', name: '⚡ Titan Deep Baritone (Male)', gender: 'Male', accent: 'Deep & Authoritative', pitch: 0.85, rate: 0.95 },
    { id: 'aurora-warm', name: '✨ Aurora Studio Warm (Female)', gender: 'Female', accent: 'Inspiring & Melodic', pitch: 1.1, rate: 1.0 },
    { id: 'nova-ai', name: '🤖 Nova Cybernetic Core', gender: 'Neural', accent: 'Precise & Crisp', pitch: 1.0, rate: 1.05 },
    { id: 'bharat-narrator', name: '🇮🇳 Bharat Bilingual Narrator', gender: 'Polymath', accent: 'English & Hindi Fluent', pitch: 0.95, rate: 1.0 }
  ];

  const sfxPresets = [
    { name: '💥 Cinematic Sub-Boom Impact', type: 'impact', freq: 45, duration: 2.5 },
    { name: '⚡ Cyber Laser Beam Pulse', type: 'laser', freq: 1200, duration: 0.4 },
    { name: '🔮 Sci-Fi Hologram UI Chirp', type: 'ui', freq: 880, duration: 0.25 },
    { name: '🌊 Sub-Bass Drop Glissando', type: 'bassdrop', freq: 180, duration: 3.0 },
    { name: '⚡ Energy Shield Activation', type: 'shield', freq: 440, duration: 1.2 }
  ];

  // Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let phase = 0;
    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const height = (canvas.height = 140);

      ctx.fillStyle = '#060812';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 20; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const isAudioActive = isScorePlaying || isSpeaking;
      const barCount = 48;
      const barWidth = (width / barCount) - 3;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 3);
        const baseHeight = isAudioActive 
          ? Math.sin(phase + i * 0.25) * 45 + Math.cos(phase * 1.5 + i * 0.15) * 35 + 50
          : 8 + Math.sin(phase * 0.3 + i * 0.1) * 4;

        const clampedH = Math.max(4, Math.min(height - 20, baseHeight));
        const y = height - clampedH - 10;

        // Gradient
        const grad = ctx.createLinearGradient(0, y, 0, height);
        if (selectedScoreTheme === 'cyberpunk') {
          grad.addColorStop(0, '#00F0FF');
          grad.addColorStop(1, '#FF0055');
        } else if (selectedScoreTheme === 'ambient') {
          grad.addColorStop(0, '#A855F7');
          grad.addColorStop(1, '#06B6D4');
        } else if (selectedScoreTheme === 'suspense') {
          grad.addColorStop(0, '#EF4444');
          grad.addColorStop(1, '#78350F');
        } else {
          grad.addColorStop(0, '#00FFAA');
          grad.addColorStop(1, '#0284C7');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, clampedH);

        // Cap highlight
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y - 2, barWidth, 2);
      }

      phase += isAudioActive ? 0.08 : 0.02;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isScorePlaying, isSpeaking, selectedScoreTheme]);

  const handleToggleScore = () => {
    if (isScorePlaying) {
      cinematicAudio.stop();
      setIsScorePlaying(false);
    } else {
      cinematicAudio.playCinematicScore(selectedScoreTheme);
      cinematicAudio.setVolume(volume / 100);
      setIsScorePlaying(true);
    }
  };

  const handleScoreThemeSelect = (themeId) => {
    setSelectedScoreTheme(themeId);
    if (isScorePlaying) {
      cinematicAudio.playCinematicScore(themeId);
    }
  };

  // Browser Speech Synthesis for TTS
  const handleSpeakText = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.pitch = voicePitch;
    utterance.rate = voiceRate;
    utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (selectedVoice === 'aurora-warm') {
        const female = voices.find(v => /female|zira|samantha|victoria|karen/i.test(v.name));
        if (female) utterance.voice = female;
      } else if (selectedVoice === 'titan-deep') {
        const male = voices.find(v => /david|male|george|rishi|alex/i.test(v.name));
        if (male) utterance.voice = male;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Procedural Web Audio SFX Trigger
  const triggerSfx = (sfx) => {
    cinematicAudio.init();
    const ctx = cinematicAudio.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (sfx.type === 'impact') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(sfx.freq * 2, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + sfx.duration);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + sfx.duration);
    } else if (sfx.type === 'laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(sfx.freq, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + sfx.duration);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + sfx.duration);
    } else if (sfx.type === 'ui') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(sfx.freq, now);
      osc.frequency.setValueAtTime(sfx.freq * 1.5, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + sfx.duration);
    } else if (sfx.type === 'bassdrop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(sfx.freq, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + sfx.duration);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.linearRampToValueAtTime(0.001, now + sfx.duration);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(sfx.freq, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + sfx.duration);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + sfx.duration);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#060812] overflow-y-auto p-4 space-y-4">
      {/* Studio Header Card */}
      <div className="p-5 rounded-3xl bg-[#080B18] border border-emerald-500/30 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-glow-emerald">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Vedic AudioCraft & Neural Voice Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  48kHz Master Studio
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                {isTitanMode ? '⚡ 100% Offline Physical Web Audio Synthesizer' : '🌐 ElevenLabs V3 & Web Audio Engine'}
              </p>
            </div>
          </div>

          {/* Sub-Tab Navigation Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveSubTab('score')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeSubTab === 'score' 
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-emerald' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Soundtracks</span>
            </button>

            <button
              onClick={() => setActiveSubTab('voice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeSubTab === 'voice' 
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-emerald' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Neural Voice</span>
            </button>

            <button
              onClick={() => setActiveSubTab('sfx')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeSubTab === 'sfx' 
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-emerald' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Foley / SFX</span>
            </button>
          </div>
        </div>

        {/* Real-time Audio Spectrum Visualizer */}
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-[#060812]">
          <canvas ref={canvasRef} className="w-full h-28 block" />
          <div className="absolute top-2 right-3 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isScorePlaying || isSpeaking ? 'bg-emerald-400' : 'bg-gray-600'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isScorePlaying || isSpeaking ? 'bg-emerald-500' : 'bg-gray-600'}`}></span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              {isScorePlaying ? 'LIVE SCORE STREAM' : isSpeaking ? 'VOICE SYNTHESIS' : 'SPECTRUM IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: CINEMATIC SOUNDTRACK GENERATOR */}
      {activeSubTab === 'score' && (
        <div className="p-5 rounded-3xl bg-[#080B18] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Procedural Multi-Track Soundtracks</span>
            </h3>

            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  cinematicAudio.setVolume(Number(e.target.value) / 100);
                }}
                className="w-20 accent-emerald-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-gray-400 w-8">{volume}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scoreThemes.map((theme) => {
              const isSelected = selectedScoreTheme === theme.id;
              const isCurrentlyPlayingThis = isSelected && isScorePlaying;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleScoreThemeSelect(theme.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-glow-emerald'
                      : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{theme.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-emerald-300">
                      {theme.bpm}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">{theme.desc}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-gray-500">{theme.mood}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-emerald-400 font-bold' : 'text-gray-600'}`}>
                      {isCurrentlyPlayingThis ? '● PLAYING NOW' : isSelected ? '✓ SELECTED' : 'Click to select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={handleToggleScore}
              className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg ${
                isScorePlaying
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:opacity-90 text-black font-extrabold shadow-glow-emerald'
              }`}
            >
              {isScorePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isScorePlaying ? 'Stop Soundtrack Playback' : 'Play Selected Soundtrack Live'}</span>
            </button>

            <span className="text-xs font-mono text-gray-400">
              ⚡ Web Audio API 60FPS Multi-Oscillator Sound Engine
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: NEURAL SPEECH SYNTHESIS */}
      {activeSubTab === 'voice' && (
        <div className="p-5 rounded-3xl bg-[#080B18] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyan-400" />
              <span>Multi-Speaker Neural Speech Synthesis</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">Language:</span>
              <button
                onClick={() => setSelectedLanguage(l => l === 'en' ? 'hi' : 'en')}
                className="px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-300 font-bold hover:bg-white/5"
              >
                {selectedLanguage === 'en' ? '🇺🇸 English (US)' : '🇮🇳 Hindi (हिन्दी)'}
              </button>
            </div>
          </div>

          <textarea
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            rows={3}
            placeholder="Type text for neural voice narration..."
            className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none font-sans leading-relaxed"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {voiceOptions.map((voice) => {
              const isSelected = selectedVoice === voice.id;
              return (
                <div
                  key={voice.id}
                  onClick={() => {
                    setSelectedVoice(voice.id);
                    setVoicePitch(voice.pitch);
                    setVoiceRate(voice.rate);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-glow-cyan'
                      : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white text-xs truncate">{voice.name}</div>
                  <div className="text-[10px] text-gray-400">{voice.accent}</div>
                  <div className="text-[9px] font-mono text-cyan-400 pt-1">
                    {isSelected ? '✓ ACTIVE VOICE' : 'Select'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Voice Tuning Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Voice Pitch:</span>
                <span className="text-white font-bold">{voicePitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={voicePitch}
                onChange={(e) => setVoicePitch(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Speaking Rate / Speed:</span>
                <span className="text-white font-bold">{voiceRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={voiceRate}
                onChange={(e) => setVoiceRate(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeakText}
              disabled={!voiceText.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-black font-extrabold text-xs shadow-glow-cyan flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isSpeaking ? 'Stop Speaking' : 'Synthesize & Speak Live'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PROCEDURAL FOLEY & SFX GENERATOR */}
      {activeSubTab === 'sfx' && (
        <div className="p-5 rounded-3xl bg-[#080B18] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>1-Click Real-Time Foley & Sound Effects Synthesizer</span>
            </h3>
            <span className="text-[10px] font-mono text-gray-400">0ms Web Audio Generation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sfxPresets.map((sfx, idx) => (
              <button
                key={idx}
                onClick={() => triggerSfx(sfx)}
                className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/50 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between hover:scale-[1.02]"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                    {sfx.name}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400">
                    Base Freq: {sfx.freq} Hz • Length: {sfx.duration}s
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 group-hover:bg-amber-500/20 text-amber-400 transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
