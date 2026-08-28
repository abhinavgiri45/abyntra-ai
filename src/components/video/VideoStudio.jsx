import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Sparkles, 
  Play, 
  Camera, 
  Sliders, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2, 
  Video, 
  Orbit, 
  Crown, 
  Lock, 
  Download, 
  Zap, 
  Layers, 
  Cpu,
  Music,
  Tv,
  Eye,
  Settings2,
  Clapperboard,
  SlidersHorizontal,
  Flame,
  Palette
} from 'lucide-react';
import { imageGenerator } from '../../services/imageGenerator';
import CinematicVideoPlayer from './CinematicVideoPlayer';

export default function VideoStudio({ activeModel, isAppInstalled = false, isTitanMode = false, onOpenDownload }) {
  const [customPrompt, setCustomPrompt] = useState('a majestic cybernetic dragon soaring above futuristic neo-Tokyo skyscrapers at midnight with volumetric rain reflections');
  const [cameraMotion, setCameraMotion] = useState('Orbit 360° Counter-Clockwise');
  const [cinematicStyle, setCinematicStyle] = useState('Hollywood Blockbuster Sci-Fi');
  const [resolution, setResolution] = useState('4k'); // '1080p' | '4k' | '8k'
  const [aspectRatio, setAspectRatio] = useState('2.39:1 Anamorphic Cinema');
  const [audioGenre, setAudioGenre] = useState('epic');
  const [fps, setFps] = useState('60 FPS');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeVideoData, setActiveVideoData] = useState(null);

  const motions = [
    { label: '🔄 Orbit 360° Counter-Clockwise (Smooth Drone Pan)', value: 'Orbit 360° Counter-Clockwise' },
    { label: '🎯 Hyper-Dolly Zoom (Vertigo Cinematic Effect)', value: 'Hyper-Dolly Zoom (Vertigo Effect)' },
    { label: '🦅 FPV Drone Dive (Speed Ramp Down)', value: 'FPV Drone Dive (Speed Ramp)' },
    { label: '🏗️ Top-Down Crane Sweep (Starry Reveal)', value: 'Top-Down Crane Sweep' },
    { label: '🔍 Rack Focus Macro Push-In (Depth Blur)', value: 'Rack Focus Macro Push-In' },
    { label: '🏎️ Low-Angle Hero Tracking (Action Drift)', value: 'Low-Angle Hero Tracking' },
    { label: '⚡ Cyberpunk Glitch Pan (Speed Jolt)', value: 'Cyberpunk Glitch Pan' }
  ];

  const styles = [
    { label: '🚀 Hollywood Blockbuster Sci-Fi (Arri Alexa 65)', value: 'Hollywood Blockbuster Sci-Fi' },
    { label: '🎮 Hyperrealistic Unreal Engine 5.4 (Lumen & Nanite)', value: 'Hyperrealistic Unreal Engine 5.4' },
    { label: '✨ Studio Ghibli Anime Masterpiece (Makoto Shinkai)', value: 'Studio Ghibli Anime' },
    { label: '🌆 Cyberpunk 2077 Night City (Blade Runner 2049)', value: 'Cyberpunk 2077 Night City' },
    { label: '🦅 National Geographic 8K HDR (RED Monstro)', value: 'National Geographic 8K HDR' },
    { label: '🎬 Vintage 35mm Film Noir (Kodak Portra Grain)', value: 'Vintage 35mm Film Noir' }
  ];

  const resolutions = [
    { id: '1080p', label: '1080p Full HD', badge: 'Fast' },
    { id: '4k', label: '4K UHD Cinema (2160p)', badge: 'Master', default: true },
    { id: '8k', label: '8K IMAX Cinema (4320p)', badge: 'Extreme 🔥' }
  ];

  const aspectRatios = [
    { label: '2.39:1 Anamorphic Cinema', value: '2.39:1 Anamorphic Cinema' },
    { label: '16:9 4K Widescreen', value: '16:9 4K Widescreen' },
    { label: '9:16 Vertical (TikTok/Reels)', value: '9:16 Vertical' },
    { label: '1:1 Square (Social Feed)', value: '1:1 Square' },
    { label: '21:9 Ultra-Wide IMAX', value: '21:9 Ultra-Wide IMAX' }
  ];

  const fpsOptions = [
    { label: '24 FPS (Cinematic Film Rate)', value: '24 FPS' },
    { label: '60 FPS (Ultra-Fluid Motion)', value: '60 FPS' },
    { label: '120 FPS (Hyper-Smooth E-Sports)', value: '120 FPS' }
  ];

  const audioGenres = [
    { id: 'epic', label: '🎻 Epic Hollywood Orchestra' },
    { id: 'cyberpunk', label: '⚡ Cyberpunk Synthwave' },
    { id: 'ambient', label: '🎹 Ethereal Ambient Piano' },
    { id: 'suspense', label: '🥁 Dark Suspense 808 Trap' }
  ];

  const inspirationPrompts = [
    'a cybernetic samurai duel in rain-soaked Neo-Tokyo neon alleyway',
    'interstellar spaceship warping through a glowing purple accretion disk of a black hole',
    'ancient mythical golden dragon emerging from misty Himalayan mountain peaks at sunrise',
    'hypercar drifting through futuristic glass tunnel beneath bioluminescent ocean'
  ];

  // Initialize with initial storyboard on mount
  useEffect(() => {
    if (!activeVideoData) {
      imageGenerator.generateVideoStoryboard({ 
        prompt: 'cybernetic neon city night cinematic', 
        audioTheme: audioGenre,
        stylePreset: cinematicStyle,
        resolution,
        fps,
        aspectRatio,
        cameraMotion
      })
        .then(storyboard => setActiveVideoData(storyboard))
        .catch(() => {});
    }
  }, []);

  const handleGenerateScript = async () => {
    if (!customPrompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const storyboard = await imageGenerator.generateVideoStoryboard({ 
        prompt: customPrompt,
        audioTheme: audioGenre,
        stylePreset: cinematicStyle,
        resolution,
        fps,
        aspectRatio,
        cameraMotion
      });
      setActiveVideoData(storyboard);
    } catch (err) {
      console.error('Video generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07080F] overflow-y-auto p-4 space-y-4 font-sans">
      {/* Top Director Controls Hub */}
      <div className="p-5 rounded-3xl bg-[#090B18] border border-amber-500/30 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-glow-amber">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>MotionLab 4K/8K Cinema Video Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-black text-[10px] font-mono font-extrabold shadow-sm">
                  {resolution.toUpperCase()} • {fps} • 4-Shot Master
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                {isTitanMode ? '⚡ Titan 60-120 FPS On-Device Neural Renderer' : '🎬 Hollywood Multi-Shot Continuity & Web Audio Sync'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Engine Model:</span>
            <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
              <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTitanMode ? '⚡ Titan CineMotion Core' : 'Girionix CineMotion 4K/8K Max'}</span>
            </span>
          </div>
        </div>

        {/* Input & Action Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateScript()}
                placeholder="Describe your cinematic 4K/8K video scene..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/70 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-500/50 shadow-inner"
              />
              <Video className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={isGenerating || !customPrompt.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:opacity-90 text-black font-black text-xs shadow-glow-amber transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Rendering 4K/8K Shots ({fps})...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Generate Video ({resolution.toUpperCase()} Master)</span>
                </>
              )}
            </button>
          </div>

          {/* Hollywood Inspiration Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
            <span className="text-gray-500 flex items-center gap-1 shrink-0">
              <Flame className="w-3 h-3 text-amber-400" /> Ideas:
            </span>
            {inspirationPrompts.map((idea, idx) => (
              <button
                key={idx}
                onClick={() => setCustomPrompt(idea)}
                className="px-2.5 py-1 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/5 whitespace-nowrap transition-colors truncate max-w-xs"
              >
                "{idea}"
              </button>
            ))}
          </div>

          {/* Director Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono pt-1 border-t border-white/5">
            {/* Resolution Selector */}
            <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><Tv className="w-3.5 h-3.5 text-amber-400" /> Resolution:</span>
                <span className="text-amber-300 font-bold">{resolution.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {resolutions.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setResolution(r.id)}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                      resolution === r.id
                        ? 'bg-amber-500 text-black shadow-glow-amber'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {r.id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* FPS Selector */}
            <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Framerate:</span>
                <span className="text-cyan-300 font-bold">{fps}</span>
              </div>
              <select
                value={fps}
                onChange={(e) => setFps(e.target.value)}
                className="w-full bg-black/60 text-white p-1.5 rounded-lg text-xs border border-white/10 focus:outline-none cursor-pointer"
              >
                {fpsOptions.map(f => (
                  <option key={f.value} value={f.value} className="bg-gray-900 text-white">{f.label}</option>
                ))}
              </select>
            </div>

            {/* Camera Motion */}
            <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5 text-rose-400" /> Camera Motion:</span>
              </div>
              <select
                value={cameraMotion}
                onChange={(e) => setCameraMotion(e.target.value)}
                className="w-full bg-black/60 text-white p-1.5 rounded-lg text-xs border border-white/10 focus:outline-none cursor-pointer truncate"
              >
                {motions.map(m => (
                  <option key={m.value} value={m.value} className="bg-gray-900 text-white">{m.label}</option>
                ))}
              </select>
            </div>

            {/* Cinematic Style Preset */}
            <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><Palette className="w-3.5 h-3.5 text-purple-400" /> Style Optics:</span>
              </div>
              <select
                value={cinematicStyle}
                onChange={(e) => setCinematicStyle(e.target.value)}
                className="w-full bg-black/60 text-white p-1.5 rounded-lg text-xs border border-white/10 focus:outline-none cursor-pointer truncate"
              >
                {styles.map(s => (
                  <option key={s.value} value={s.value} className="bg-gray-900 text-white">{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Viewport Player with 60 FPS Canvas Engine */}
      <div className="flex-1 min-h-[420px] rounded-3xl bg-black/90 border border-white/10 overflow-hidden shadow-2xl relative">
        <CinematicVideoPlayer
          videoData={activeVideoData}
          title={customPrompt}
          aspectRatio={aspectRatio}
          resolution={resolution}
          fps={fps}
          isTitanMode={isTitanMode}
        />
      </div>
    </div>
  );
}
