import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Zap, 
  Layers, 
  ShieldCheck,
  Check,
  ArrowRight,
  HardDrive,
  Cpu,
  Monitor,
  Smartphone,
  Laptop,
  Terminal,
  Clock
} from 'lucide-react';
import { updateService, CURRENT_APP_VERSION } from '../../services/updateService';

export default function UpdateModal({ isOpen, onClose, onOpenDownload }) {
  const [updateState, setUpdateState] = useState({
    isChecking: false,
    hasUpdate: false,
    updateInfo: null
  });
  const [lastChecked, setLastChecked] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (isOpen) {
      handleCheckUpdates();
    }
  }, [isOpen]);

  const handleCheckUpdates = async () => {
    setUpdateState(prev => ({ ...prev, isChecking: true }));
    const res = await updateService.checkForUpdates();
    setUpdateState({
      isChecking: false,
      hasUpdate: res.hasUpdate,
      updateInfo: res
    });
    setLastChecked(new Date().toLocaleTimeString());
  };

  const handleApplyUpdate = async () => {
    setIsUpdating(true);
    setTimeout(async () => {
      await updateService.applyUpdate();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-2xl w-full bg-[#090B18] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-5 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <RefreshCw className={`w-6 h-6 ${updateState.isChecking ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>System Updates & Over-The-Air (OTA) Sync</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                Live Cloud Channel
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Instant code delivery and automatic version synchronization across all apps
            </p>
          </div>
        </div>

        {/* Version Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Installed App Build:</span>
            <div className="text-xl font-black text-white flex items-center gap-2">
              <span>v{CURRENT_APP_VERSION.version}</span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300 text-[10px] font-mono">
                {CURRENT_APP_VERSION.channel}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono">
              Build Date: {CURRENT_APP_VERSION.buildDate}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Latest Available Release:</span>
            <div className="text-xl font-black text-cyan-400 flex items-center gap-2">
              <span>v{updateState.updateInfo?.latestVersion || CURRENT_APP_VERSION.version}</span>
              {updateState.hasUpdate ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  Update Ready
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  Up to Date
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-500 font-mono">
              {lastChecked ? `Checked today at ${lastChecked}` : 'Checking live cloud...'}
            </p>
          </div>
        </div>

        {/* Update Status Card */}
        {updateState.hasUpdate ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>New Update Available! (v{updateState.updateInfo?.latestVersion})</span>
            </div>
            <p className="text-xs text-gray-300 font-sans">
              {updateState.updateInfo?.title || 'A new build has been published with upgraded studios and performance optimizations.'}
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-xs">You are running the latest version of Girionix AI</h4>
              <p className="text-[11px] text-gray-400 font-sans">All studios, 8K engines, and offline vaults are fully synchronized.</p>
            </div>
          </div>
        )}

        {/* Changelog Section */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
            Release Notes & What's New:
          </span>
          <div className="max-h-40 overflow-y-auto p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-2 text-xs font-sans text-gray-300">
            {updateState.updateInfo?.changelog && updateState.updateInfo.changelog.length > 0 ? (
              <ul className="space-y-1.5 list-disc pl-5">
                {updateState.updateInfo.changelog.map((note, i) => (
                  <li key={i} className="text-gray-300 leading-relaxed text-[11px]">
                    {note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-xs italic">
                - 100% Standalone Multi-Platform Native Engine (Windows, Android, macOS, Linux, iOS).<br />
                - Hollywood 4-Shot Cinematic Video Studio with Web Audio Stereo Scoring.<br />
                - 8K FLUX.1 Visual Studio with 8 artistic styles & aspect ratios.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <button
            onClick={handleCheckUpdates}
            disabled={updateState.isChecking}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${updateState.isChecking ? 'animate-spin' : ''}`} />
            <span>{updateState.isChecking ? 'Checking Cloud...' : 'Check for Updates'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDownload}
              className="px-4 py-2.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Standalone Setup</span>
            </button>

            <button
              onClick={handleApplyUpdate}
              disabled={isUpdating}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-extrabold text-xs shadow-glow-cyan hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Applying Update...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-black" />
                  <span>1-Click Apply Live Code Sync</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
