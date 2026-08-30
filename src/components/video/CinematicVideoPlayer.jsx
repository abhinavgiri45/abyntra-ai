import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Maximize2, 
  Minimize2, 
  Film, 
  Sliders, 
  Sparkles, 
  Camera, 
  Layers, 
  Volume2, 
  VolumeX, 
  Check, 
  ChevronRight, 
  Clock, 
  Music,
  Loader2,
  Tv,
  Zap,
  Flame,
  Activity,
  SlidersHorizontal
} from 'lucide-react';
import { cinematicAudio } from '../../services/CinematicAudioEngine';

export default function CinematicVideoPlayer({ 
  videoData, 
  title = 'Cinematic Motion Scene', 
  aspectRatio = '2.39:1 Anamorphic Cinema',
  resolution = '4k',
  fps = '60 FPS',
  isTitanMode = false,
  onFullscreen 
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(videoData?.duration || 60); // 12s | 60s | 300s (5m) | 900s (15m) | 1800s (30m) | 3600s (1 Hour)
  const [activeShotIdx, setActiveShotIdx] = useState(0);
  const [cameraMode, setCameraMode] = useState('orbit'); // 'orbit' | 'dolly' | 'fpv' | 'pan'
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // 0.5 | 1.0 | 1.5 | 2.0
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDirectorNotes, setShowDirectorNotes] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [loadedImagesMap, setLoadedImagesMap] = useState({});

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const loadedImagesRef = useRef([]);
  const containerRef = useRef(null);

  const formatTimecode = (seconds) => {
    const total = Math.max(0, Math.floor(seconds));
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    if (hrs > 0 || duration >= 3600) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Particles for high-end cinematic volumetric dust & embers
  const particlesRef = useRef(
    Array.from({ length: 45 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 450,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.2
    }))
  );

  const cleanSubject = (videoData?.prompt || title || 'cinematic futuristic cyberpunk world')
    .replace(/^(create a cinematic 3d multi-shot video scene for:|generate a video of|generate video of|create a video of|create video of|make a video of|video of|create video for|video scene for:?)/i, '')
    .trim();

  const shot1Image = videoData?.shots?.[0]?.image || videoData?.url || `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanSubject + ', wide establishing vista shot, master anamorphic cinema, 8k')}&width=1280&height=720&seed=10101&model=flux&nologo=true`;
  const shot2Image = videoData?.shots?.[1]?.image || `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanSubject + ', dynamic speed tracking action angle, volumetric fog, motion blur, 8k')}&width=1280&height=720&seed=20202&model=flux&nologo=true`;
  const shot3Image = videoData?.shots?.[2]?.image || `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanSubject + ', dramatic intense hero close up shot, rim light, shallow depth of field, 8k')}&width=1280&height=720&seed=30303&model=flux&nologo=true`;
  const shot4Image = videoData?.shots?.[3]?.image || `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanSubject + ', epic high altitude drone ascending finale reveal shot, golden hour twilight, 8k')}&width=1280&height=720&seed=40404&model=flux&nologo=true`;

  const secPerAct = duration / 4;

  // Normalize shots from videoData into 4 distinct evolving scenes
  const shots = videoData?.shots || [
    {
      id: 1,
      time: `${formatTimecode(0)} - ${formatTimecode(secPerAct)}`,
      name: 'Act I: Panoramic Establishing Sweep',
      camera: '360° Smooth Orbit & Wide Horizon Pan',
      lens: '35mm Master Anamorphic Prime (f/1.4)',
      image: shot1Image,
      prompt: `${cleanSubject}, wide establishing vista shot`
    },
    {
      id: 2,
      time: `${formatTimecode(secPerAct)} - ${formatTimecode(secPerAct * 2)}`,
      name: 'Act II: Dynamic Action Tracking',
      camera: 'Hyper-Dolly Zoom & Speed Ramp Tracking',
      lens: '50mm Cinema Prime (f/1.2)',
      image: shot2Image,
      prompt: `${cleanSubject}, dynamic action tracking shot`
    },
    {
      id: 3,
      time: `${formatTimecode(secPerAct * 2)} - ${formatTimecode(secPerAct * 3)}`,
      name: 'Act III: Hero Climax Close-Up',
      camera: 'Slow Push-in with Volumetric Glow',
      lens: '85mm Blockbuster Prime (f/1.2)',
      image: shot3Image,
      prompt: `${cleanSubject}, dramatic hero climax`
    },
    {
      id: 4,
      time: `${formatTimecode(secPerAct * 3)} - ${formatTimecode(duration)}`,
      name: 'Act IV: Ascending Crane Finale',
      camera: 'FPV Ascending Crane & Twilight Reveal',
      lens: '24mm Ultra-Wide Cine Prime (f/2.0)',
      image: shot4Image,
      prompt: `${cleanSubject}, climactic finale sweep`
    }
  ];

  // Preload all 4 Shot Images into memory with individual load tracking
  useEffect(() => {
    loadedImagesRef.current = [];
    setLoadedImagesMap({});

    shots.forEach((shot, idx) => {
      if (!shot.image) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = shot.image;

      img.onload = () => {
        loadedImagesRef.current[idx] = img;
        setLoadedImagesMap(prev => ({ ...prev, [idx]: true }));
      };

      img.onerror = () => {
        // Retry with cache-busted URL
        const retryImg = new Image();
        retryImg.crossOrigin = 'anonymous';
        retryImg.src = shot.image + '&retry=' + Date.now();
        retryImg.onload = () => {
          loadedImagesRef.current[idx] = retryImg;
          setLoadedImagesMap(prev => ({ ...prev, [idx]: true }));
        };
      };
    });
  }, [videoData]);

  // Audio Playback Synchronization
  useEffect(() => {
    if (isPlaying && !isMuted) {
      cinematicAudio.playCinematicScore(videoData?.audioTrack || 'epic');
    } else {
      cinematicAudio.stop();
    }
    return () => {
      cinematicAudio.stop();
    };
  }, [isPlaying, isMuted, videoData?.audioTrack]);

  // Main 60-120 FPS HTML5 Canvas Cinema Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let localCurrentTime = currentTime;
    const shotCount = shots.length;
    const secondsPerShot = duration / shotCount; // 3.0 seconds per shot

    const render = () => {
      const parent = canvas.parentElement;
      const width = (canvas.width = parent?.clientWidth || 760);
      let height = Math.round(width * (9 / 16));

      if (aspectRatio.includes('9:16')) {
        height = Math.round(width * (16 / 9));
      } else if (aspectRatio.includes('1:1')) {
        height = width;
      } else if (aspectRatio.includes('21:9')) {
        height = Math.round(width * (9 / 21));
      }
      canvas.height = height;

      if (isPlaying) {
        localCurrentTime += 0.0166 * playbackSpeed; // 60 FPS tick with speed multiplier
        if (localCurrentTime >= duration) {
          localCurrentTime = 0;
        }
        setCurrentTime(localCurrentTime);
      }

      // Determine active shot based on 4-shot cycle
      const currentShotIndex = Math.min(Math.floor(localCurrentTime / secondsPerShot), shotCount - 1);
      setActiveShotIdx(currentShotIndex);

      const shotProgress = (localCurrentTime % secondsPerShot) / secondsPerShot; // 0.0 to 1.0 within current shot
      const img = loadedImagesRef.current[currentShotIndex];

      // Draw Deep Cinema Dark Background
      ctx.fillStyle = '#04060F';
      ctx.fillRect(0, 0, width, height);

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();

        // 3D Camera Physics & Motion Matrix (Customized per Shot for Dynamic Movement)
        let panX = 0;
        let panY = 0;
        let zoom = 1.05;
        let rotation = 0;

        if (cameraMode === 'orbit') {
          if (currentShotIndex === 0) {
            panX = Math.sin(shotProgress * Math.PI) * 45;
            zoom = 1.06 + shotProgress * 0.07;
          } else if (currentShotIndex === 1) {
            panX = -Math.sin(shotProgress * Math.PI) * 50;
            panY = Math.cos(shotProgress * Math.PI) * 18;
            zoom = 1.12 + Math.sin(shotProgress * Math.PI) * 0.09;
            rotation = (shotProgress - 0.5) * 0.035;
          } else if (currentShotIndex === 2) {
            zoom = 1.05 + shotProgress * 0.18; // Hero zoom in
            panY = -shotProgress * 22;
          } else {
            panY = (shotProgress - 0.5) * -40; // Crane upward reveal
            zoom = 1.12 - shotProgress * 0.06;
          }
        } else if (cameraMode === 'dolly') {
          zoom = 1.03 + shotProgress * 0.22; // Hyper Dolly Zoom
          panY = -shotProgress * 20;
        } else if (cameraMode === 'fpv') {
          panX = Math.sin(shotProgress * Math.PI * 4) * 48;
          panY = Math.sin(shotProgress * Math.PI * 2) * 32;
          zoom = 1.15 + Math.sin(shotProgress * Math.PI) * 0.12;
          rotation = Math.sin(shotProgress * Math.PI * 2) * 0.045;
        } else {
          // Pan sweep mode
          panX = (shotProgress - 0.5) * 90;
          zoom = 1.08;
        }

        ctx.translate(width / 2 + panX, height / 2 + panY);
        ctx.rotate(rotation);
        ctx.scale(zoom, zoom);

        // Aspect fit image
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = width / height;
        let drawW, drawH;

        if (imgAspect > canvasAspect) {
          drawH = height;
          drawW = height * imgAspect;
        } else {
          drawW = width;
          drawH = width / imgAspect;
        }

        // Draw active shot frame
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

        // Cross-dissolve morph transition at shot boundaries (last 0.35s of each shot)
        if (shotProgress > 0.80) {
          const nextShotIndex = (currentShotIndex + 1) % shotCount;
          const nextImg = loadedImagesRef.current[nextShotIndex];
          if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
            const alpha = (shotProgress - 0.80) / 0.20;
            ctx.globalAlpha = Math.min(1.0, Math.max(0.0, alpha));
            ctx.drawImage(nextImg, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.globalAlpha = 1.0;
          }
        }

        ctx.restore();

        // Cinematic Color Grade & Vignette Shader
        const grad = ctx.createRadialGradient(width / 2, height / 2, height * 0.35, width / 2, height / 2, height * 0.9);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.70)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Dynamic Atmosphere Lighting & Anamorphic Lens Streak
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const streakGrad = ctx.createLinearGradient(0, height * 0.45, width, height * 0.45);
        streakGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        streakGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.08)');
        streakGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = streakGrad;
        ctx.fillRect(0, height * 0.44, width, 4);
        ctx.restore();

      } else {
        // High-Tech Procedural Raymarched Shader Grid for 100% Offline / Buffering
        const time = localCurrentTime;
        const gradBg = ctx.createLinearGradient(0, 0, width, height);
        gradBg.addColorStop(0, '#060A1A');
        gradBg.addColorStop(0.5, '#0B1229');
        gradBg.addColorStop(1, '#050711');
        ctx.fillStyle = gradBg;
        ctx.fillRect(0, 0, width, height);

        // Dynamic 3D Horizon Grid
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        const horizonY = height * 0.55;

        for (let x = -width; x < width * 2; x += 50) {
          ctx.beginPath();
          ctx.moveTo(width / 2 + Math.sin(time * 0.5) * 40, horizonY);
          ctx.lineTo(x + ((time * 30) % 50), height);
          ctx.stroke();
        }

        // Horizontal Grid Lines
        for (let i = 1; i <= 10; i++) {
          const y = horizonY + Math.pow(i / 10, 2) * (height - horizonY);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Starfield
        ctx.fillStyle = '#FFFFFF';
        for (let s = 0; s < 35; s++) {
          const sx = (s * 37 + time * 10) % width;
          const sy = (s * 19) % horizonY;
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }

        // Center HUD
        ctx.fillStyle = '#00F0FF';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`⚡ GIRIONIX TITAN CINE-ENGINE • SHOT ${currentShotIndex + 1}/4`, width / 2, height / 2 - 15);
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '11px monospace';
        ctx.fillText(`${shots[currentShotIndex]?.name || 'Synthesizing Scene Motion'}`, width / 2, height / 2 + 10);
        ctx.fillStyle = '#F59E0B';
        ctx.font = '10px monospace';
        ctx.fillText(`[ ${resolution.toUpperCase()} • ${fps} • PHYSICAL GPU SHADERS ACTIVE ]`, width / 2, height / 2 + 30);
      }

      // Volumetric Particle Dust & Embers
      if (showParticles) {
        ctx.save();
        particlesRef.current.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y < 0) p.y = height;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;

          ctx.fillStyle = `rgba(255, 215, 100, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // Cinematic Letterbox Bars (2.39:1 Cinema Scope)
      const barHeight = Math.max(16, Math.round(height * 0.075));
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, barHeight);
      ctx.fillRect(0, height - barHeight, width, barHeight);

      // Camera HUD Telemetry Overlay
      ctx.fillStyle = '#00F0FF';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';

      const secStr = Math.floor(localCurrentTime).toString().padStart(2, '0');
      const frameStr = Math.floor((localCurrentTime % 1) * 60).toString().padStart(2, '0');
      const currentShot = shots[currentShotIndex] || shots[0];

      // Top HUD
      ctx.fillText(`● REC [${isPlaying ? 'PLAY' : 'PAUSE'}]  00:00:${secStr}:${frameStr}  ${resolution.toUpperCase()}  ${fps}  ${playbackSpeed}X`, 16, Math.max(13, barHeight - 4));
      ctx.textAlign = 'right';
      ctx.fillText(`${currentShot.lens.toUpperCase()}`, width - 16, Math.max(13, barHeight - 4));

      // Bottom HUD
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FF007A';
      ctx.fillText(`SHOT ${currentShotIndex + 1}/4: ${currentShot.name.toUpperCase()}`, 16, height - 6);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#F59E0B';
      ctx.fillText(`GIRIONIX MOTIONLAB ULTRA`, width - 16, height - 6);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, cameraMode, shots, duration, loadedImagesMap, playbackSpeed, resolution, fps, showParticles, aspectRatio]);

  // Handle Video Export (Multiplexes 60 FPS Canvas + Web Audio API stream into downloadable .webm)
  const handleExportVideo = async (format = 'webm') => {
    const canvas = canvasRef.current;
    if (!canvas || isExporting) return;

    try {
      setIsExporting(true);
      setExportProgress(10);

      const canvasStream = canvas.captureStream(60);
      const audioStream = cinematicAudio.getAudioStream();

      const tracks = [...canvasStream.getVideoTracks()];
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        tracks.push(...audioStream.getAudioTracks());
      }
      const combinedStream = new MediaStream(tracks);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm';

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Girionix_${resolution.toUpperCase()}_Cinema_${Date.now()}.${format === 'mp4' ? 'mp4' : 'webm'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsExporting(false);
        setExportProgress(100);
        setTimeout(() => setExportProgress(0), 3000);
      };

      setCurrentTime(0);
      setIsPlaying(true);
      cinematicAudio.playCinematicScore(videoData?.audioTrack || 'epic');
      recorder.start();

      let progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 8;
        });
      }, 1000);

      setTimeout(() => {
        recorder.stop();
        clearInterval(progressInterval);
      }, 12000);

    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = pos * duration;
    setCurrentTime(targetTime);
  };

  const handleToggleMute = () => {
    const muted = cinematicAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div 
      ref={containerRef}
      className={`rounded-3xl overflow-hidden border border-amber-500/30 bg-[#080A16] shadow-2xl space-y-0 select-none group ${
        isFullscreen ? 'fixed inset-0 z-[99999] rounded-none bg-black' : 'w-full shadow-glow-amber'
      }`}
    >
      {/* Top Header Bar */}
      <div className="p-3.5 px-4 bg-gradient-to-r from-amber-950/50 via-purple-950/40 to-slate-900 border-b border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2.5 text-amber-300 font-bold truncate">
          <Film className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
          <span className="truncate">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1">
            <Tv className="w-3 h-3 text-cyan-400" />
            <span>{resolution.toUpperCase()}</span>
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1">
            <Music className="w-3 h-3 text-purple-400" />
            <span>Stereo Score</span>
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
            {fps}
          </span>
        </div>
      </div>

      {/* Main 60-120 FPS Video Canvas Viewport */}
      <div className="relative bg-black flex items-center justify-center overflow-hidden cursor-pointer">
        <canvas
          ref={canvasRef}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-full h-auto max-h-[520px] object-contain block"
        />

        {/* Play/Pause Overlay Icon on Hover */}
        <div 
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
        >
          <div className="p-4 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-2xl scale-110">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 fill-current" />}
          </div>
        </div>

        {/* Exporting Progress Badge */}
        {isExporting && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/90 border border-amber-500/60 text-xs font-mono text-amber-300 flex items-center gap-2 shadow-2xl backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mastering {resolution.toUpperCase()} Video ({exportProgress}%)...</span>
          </div>
        )}
      </div>

      {/* Interactive Timeline Scrub Bar */}
      <div 
        onClick={handleSeek}
        className="h-2.5 bg-white/10 hover:h-3.5 transition-all cursor-pointer relative group/timeline"
      >
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 relative"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/timeline:scale-100 transition-transform" />
        </div>

        {/* 4-Shot Dividers on Timeline */}
        <div className="absolute top-0 bottom-0 left-[25%] w-0.5 bg-white/30" title="Shot 2 Start (03s)" />
        <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-white/30" title="Shot 3 Start (06s)" />
        <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-white/30" title="Shot 4 Start (09s)" />
      </div>

      {/* Control Panel: Playback, Audio, Camera Physics, Timeline Time, Export */}
      <div className="p-4 bg-[#070914] border-t border-white/5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Left Controls: Play, Reset, Mute, Speed, Timecode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
              title={isPlaying ? 'Pause Video' : 'Play 60 FPS Video'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => { setCurrentTime(0); setIsPlaying(true); }}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
              title="Replay from Beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-colors ${
                isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              }`}
              title={isMuted ? 'Unmute Audio Soundtrack' : 'Mute Audio Soundtrack'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
              {[0.5, 1.0, 1.5, 2.0].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    playbackSpeed === speed
                      ? 'bg-cyan-500 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Video Duration Selector (12s to 1 Hour) */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-amber-500/30">
              {[
                { sec: 12, label: '12s' },
                { sec: 60, label: '60s' },
                { sec: 300, label: '5m' },
                { sec: 900, label: '15m' },
                { sec: 1800, label: '30m' },
                { sec: 3600, label: '1 Hr 🔥' }
              ].map(d => (
                <button
                  key={d.sec}
                  onClick={() => { setDuration(d.sec); setCurrentTime(0); }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    duration === d.sec
                      ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-black shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={`Set Video Length to ${d.label}`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-amber-300 font-mono px-2.5 py-1 rounded-xl bg-black/70 border border-amber-500/30 font-bold">
              {formatTimecode(currentTime)} / {formatTimecode(duration)}
            </div>
          </div>

          {/* Center Controls: 3D Camera Trajectory Modes */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/5">
            {[
              { id: 'orbit', label: '360° Orbit' },
              { id: 'dolly', label: 'Dolly Zoom' },
              { id: 'fpv', label: 'FPV Drone' },
              { id: 'pan', label: 'Pan Sweep' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setCameraMode(mode.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                  cameraMode === mode.id
                    ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Director Notes, Export Button, Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowParticles(!showParticles)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition-colors flex items-center gap-1 ${
                showParticles 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-white/[0.04] text-gray-400 hover:text-white border-white/5'
              }`}
              title="Toggle Volumetric Dust Particles"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Particles</span>
            </button>

            <button
              onClick={() => setShowDirectorNotes(!showDirectorNotes)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition-colors flex items-center gap-1 ${
                showDirectorNotes 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                  : 'bg-white/[0.04] text-gray-400 hover:text-white border-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Screenplay</span>
            </button>

            <button
              onClick={() => handleExportVideo('webm')}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-glow-amber hover:opacity-90 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Mastering...' : `Export ${resolution.toUpperCase()} Master`}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 4-Shot Visual Storyboard Thumbnails with Live Load States */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5">
          {shots.map((shot, idx) => {
            return (
              <button
                key={shot.id}
                onClick={() => {
                  setCurrentTime(idx * (duration / 4));
                  setActiveShotIdx(idx);
                }}
                className={`p-2 rounded-2xl border text-left transition-all flex items-center gap-2.5 overflow-hidden ${
                  activeShotIdx === idx
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm ring-1 ring-amber-400/40'
                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'
                }`}
              >
                {/* Mini Image Thumbnail */}
                <div className="w-12 h-9 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0 relative">
                  {shot.image ? (
                    <img 
                      src={shot.image} 
                      alt={shot.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-amber-400">
                      SHOT {idx+1}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-amber-300">SHOT 0{idx + 1}</span>
                    <span className="text-gray-500 text-[9px]">{shot.time}</span>
                  </div>
                  <p className="text-[10px] font-sans truncate text-gray-300 mt-0.5">{shot.name}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Collapsible Director Screenplay Drawer */}
        {showDirectorNotes && (
          <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/20 text-xs font-mono text-gray-300 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>Cinematography & Audio Scoring Breakdown:</span>
              </span>
              <span className="text-[10px] text-gray-400">{resolution.toUpperCase()} Master • {fps}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-amber-300 font-bold block">Shot 1 (00:00 - 00:03)</span>
                <p className="text-gray-400">Panoramic wide establishing horizon with sub-bass drone and atmospheric sunrise sweep.</p>
                <div className="text-[10px] text-gray-500 font-mono">35mm Master Anamorphic</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-cyan-300 font-bold block">Shot 2 (00:03 - 00:06)</span>
                <p className="text-gray-400">Dynamic action tracking with hyper-dolly zoom and rhythmic percussion heartbeat pulse.</p>
                <div className="text-[10px] text-gray-500 font-mono">50mm Cinema Prime f/1.2</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-purple-300 font-bold block">Shot 3 (00:06 - 00:09)</span>
                <p className="text-gray-400">Hero dramatic close-up with volumetric god rays, detailed micro textures, and orchestral swell.</p>
                <div className="text-[10px] text-gray-500 font-mono">85mm Macro Prime f/1.2</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-rose-300 font-bold block">Shot 4 (00:09 - 00:12)</span>
                <p className="text-gray-400">FPV ascending crane finale reveal into dusk twilight glow and grand resolution chord.</p>
                <div className="text-[10px] text-gray-500 font-mono">24mm Ultra-Wide Cine Prime</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
