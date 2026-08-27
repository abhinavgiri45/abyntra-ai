import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Monitor, 
  Laptop, 
  Terminal, 
  Sparkles, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Layers, 
  Cpu, 
  Lock, 
  Radio, 
  ExternalLink, 
  HardDrive, 
  Trash2,
  Activity,
  CheckSquare
} from 'lucide-react';
import { detectUserOS, getPlatformDetailedSpecs } from '../../services/osDetector';
import { triggerFileDownload } from '../../services/downloadHelper';

export default function DownloadAppsModal({ isOpen, onClose }) {
  const [selectedPlatform, setSelectedPlatform] = useState(() => detectUserOS());
  const [selectedEdition, setSelectedEdition] = useState('standard'); // 'standard' | 'titan'
  const [actionMessage, setActionMessage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const downloadMapStandard = {
    windows: {
      file: '/downloads/Abyntra_AI_Setup.exe',
      name: 'Abyntra_AI_Setup.exe',
      label: 'Download Windows Setup Wizard (.exe)',
      uninstaller: '/downloads/Uninstall_Abyntra_AI.exe',
      uninstallerName: 'Uninstall_Abyntra_AI.exe'
    },
    android: {
      file: '/downloads/Abyntra_AI.apk',
      name: 'Abyntra_AI.apk',
      label: 'Download Android App Package (.apk)',
      uninstallGuide: 'Long-press Abyntra AI icon on your Android home screen and tap "Uninstall".'
    },
    mac: {
      file: '/downloads/Abyntra_AI_macOS.dmg',
      name: 'Abyntra_AI_macOS.dmg',
      label: 'Download macOS Universal Bundle (.dmg)',
      uninstaller: '/downloads/Uninstall_Abyntra_Mac.command',
      uninstallerName: 'Uninstall_Abyntra_Mac.command'
    },
    ios: {
      file: '/downloads/Abyntra_AI_iOS.mobileconfig',
      name: 'Abyntra_AI_iOS.mobileconfig',
      label: 'Download iOS Profile (.mobileconfig)',
      uninstallGuide: 'Go to iOS Settings -> General -> VPN & Device Management -> Abyntra AI Pro -> Remove Profile.'
    },
    linux: {
      file: '/downloads/Abyntra_AI_Linux.AppImage',
      name: 'Abyntra_AI_Linux.AppImage',
      label: 'Download Linux Standalone (.AppImage)',
      uninstaller: '/downloads/uninstall_abyntra_linux.sh',
      uninstallerName: 'uninstall_abyntra_linux.sh'
    }
  };

  const downloadMapTitan = {
    windows: {
      file: '/downloads/Abyntra_AI_Titan_Setup.exe',
      name: 'Abyntra_AI_Titan_Setup.exe',
      label: 'Download Titan Setup Wizard (.exe - Hardware Verified)',
      uninstaller: '/downloads/Uninstall_Abyntra_AI.exe',
      uninstallerName: 'Uninstall_Abyntra_AI.exe'
    },
    android: {
      file: '/downloads/Abyntra_AI_Titan.apk',
      name: 'Abyntra_AI_Titan.apk',
      label: 'Download Titan Android Package (.apk - Hardware Verified)',
      uninstallGuide: 'Long-press Abyntra AI Titan icon and tap "Uninstall".'
    },
    mac: {
      file: '/downloads/Abyntra_AI_Titan_macOS.dmg',
      name: 'Abyntra_AI_Titan_macOS.dmg',
      label: 'Download Titan macOS Bundle (.dmg - Hardware Verified)',
      uninstaller: '/downloads/Uninstall_Abyntra_Mac.command',
      uninstallerName: 'Uninstall_Abyntra_Mac.command'
    },
    ios: {
      file: '/downloads/Abyntra_AI_Titan_iOS.mobileconfig',
      name: 'Abyntra_AI_Titan_iOS.mobileconfig',
      label: 'Download Titan iOS Profile (.mobileconfig)',
      uninstallGuide: 'Go to iOS Settings -> General -> VPN & Device Management -> Abyntra AI Titan -> Remove Profile.'
    },
    linux: {
      file: '/downloads/Abyntra_AI_Titan_Linux.AppImage',
      name: 'Abyntra_AI_Titan_Linux.AppImage',
      label: 'Download Titan Linux AppImage (.AppImage - Hardware Verified)',
      uninstaller: '/downloads/uninstall_abyntra_linux.sh',
      uninstallerName: 'uninstall_abyntra_linux.sh'
    }
  };

  const downloadMapTitanLite = {
    windows: {
      file: '/downloads/Abyntra_AI_Titan_Lite_Setup.exe',
      name: 'Abyntra_AI_Titan_Lite_Setup.exe',
      label: 'Download Titan Lite Setup (.exe - Low-End Hardware)',
      uninstaller: '/downloads/Uninstall_Abyntra_AI.exe',
      uninstallerName: 'Uninstall_Abyntra_AI.exe'
    },
    android: {
      file: '/downloads/Abyntra_AI_Titan_Lite.apk',
      name: 'Abyntra_AI_Titan_Lite.apk',
      label: 'Download Titan Lite Android APK (.apk - 2GB+ RAM)',
      uninstallGuide: 'Long-press Abyntra AI Titan Lite icon and tap "Uninstall".'
    },
    mac: {
      file: '/downloads/Abyntra_AI_Titan_Lite_macOS.dmg',
      name: 'Abyntra_AI_Titan_Lite_macOS.dmg',
      label: 'Download Titan Lite macOS DMG (.dmg - Air & Intel Macs)',
      uninstaller: '/downloads/Uninstall_Abyntra_Mac.command',
      uninstallerName: 'Uninstall_Abyntra_Mac.command'
    },
    ios: {
      file: '/downloads/Abyntra_AI_Titan_Lite_iOS.mobileconfig',
      name: 'Abyntra_AI_Titan_Lite_iOS.mobileconfig',
      label: 'Download Titan Lite iOS Profile (.mobileconfig)',
      uninstallGuide: 'Go to iOS Settings -> General -> VPN & Device Management -> Abyntra AI Titan Lite -> Remove Profile.'
    },
    linux: {
      file: '/downloads/Abyntra_AI_Titan_Lite_Linux.AppImage',
      name: 'Abyntra_AI_Titan_Lite_Linux.AppImage',
      label: 'Download Titan Lite Linux AppImage (.AppImage - Low Spec)',
      uninstaller: '/downloads/uninstall_abyntra_linux.sh',
      uninstallerName: 'uninstall_abyntra_linux.sh'
    }
  };

  const downloadMap = selectedEdition === 'titan' 
    ? downloadMapTitan 
    : (selectedEdition === 'titan-lite' ? downloadMapTitanLite : downloadMapStandard);

  const handleDownloadFile = async (filePath, fileName, successMessage) => {
    setIsDownloading(true);
    setActionMessage(`Preparing and streaming ${fileName}...`);

    await triggerFileDownload(filePath, fileName, (status) => {
      if (status === 'downloading') {
        setActionMessage(`Streaming ${fileName} directly to your device...`);
      } else if (status === 'completed') {
        setActionMessage(successMessage || `✅ ${fileName} downloaded successfully.`);
      }
    });

    setIsDownloading(false);
    setTimeout(() => setActionMessage(null), 5000);
  };

  const platforms = [
    {
      id: 'windows',
      name: 'Windows',
      tag: 'Win 7, 8, 10, 11 & Windows 12',
      format: '.EXE Setup Wizard',
      fileName: 'Abyntra_AI_Setup.exe',
      uninstallerName: 'Uninstall_Abyntra_AI.exe',
      icon: <Monitor className="w-5 h-5 text-cyan-400" />,
      size: 'Native Setup Installer',
      localPath: '%LocalAppData%\\Abyntra AI\\Data',
      compatibility: 'Windows 7 SP1, Windows 8.1, Windows 10, Windows 11 & Windows 12 (x64 / Snapdragon X ARM64)',
      features: [
        'Full GUI Setup Wizard with custom path & desktop shortcut creation',
        'Automatic Windows Control Panel Add/Remove Programs registration',
        'Dedicated Local Machine Disk Storage at %LocalAppData%\\Abyntra AI\\Data',
        '90-Day Extended Chat Retention & Local Vault',
        'Pure Standalone Window Mode with F11 fullscreen and zero URL bar clutter'
      ]
    },
    {
      id: 'android',
      name: 'Android',
      tag: 'Android 8.0 to Android 15 & 16',
      format: '.APK Installer Package',
      fileName: 'Abyntra_AI.apk',
      icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
      size: '12.4 MB Signed Package',
      localPath: 'Android Internal Sandbox Storage',
      compatibility: 'All Android smartphones, foldables, and tablets (Android 8.0+)',
      features: [
        'Real signed Android Package (.APK) with standalone manifest & permissions',
        'Optimized for Android 15/16 Edge-to-Edge displays and foldables',
        'Standard 1-tap uninstall via Android App Settings / Home Screen',
        '90-Day Local Vault with hardware-accelerated 60 FPS video & 8K viewer',
        'Dedicated offline storage with zero browser dependency'
      ]
    },
    {
      id: 'mac',
      name: 'macOS',
      tag: 'Apple Silicon (M1-M4) & Intel',
      format: '.DMG Universal Bundle',
      fileName: 'Abyntra_AI_macOS.dmg',
      uninstallerName: 'Uninstall_Abyntra_Mac.command',
      icon: <Laptop className="w-5 h-5 text-rose-400" />,
      size: 'Universal Binary',
      localPath: '~/Library/Application Support/Abyntra AI/Data',
      compatibility: 'macOS Sequoia 15, macOS 16, Sonoma, Ventura, Monterey & Older OS X',
      features: [
        'Universal macOS DMG bundle optimized for Apple M1/M2/M3/M4 & Intel',
        'Dedicated local disk storage at ~/Library/Application Support/Abyntra AI',
        '90-Day Extended Chat Retention & Local Vault',
        'Command (⌘) key shortcuts fully mapped with retina display scaling'
      ]
    },
    {
      id: 'ios',
      name: 'iOS / iPadOS',
      tag: 'iOS 15.0 to iOS 18 & 19',
      format: '.MobileConfig / WebClip',
      fileName: 'Abyntra_AI_iOS.mobileconfig',
      icon: <Smartphone className="w-5 h-5 text-purple-400" />,
      size: 'Instant Standalone',
      localPath: 'iOS Isolated App Container',
      compatibility: 'iPhone 8 to iPhone 16 Pro Max, iPad Pro (M4), iOS 18+',
      features: [
        'Apple iOS Configuration Profile (.mobileconfig) & WebClip',
        '1-tap removal via iOS Settings -> VPN & Device Management',
        'Optimized for iOS 18 & 19 Dynamic Island & Liquid Glass design',
        '90-Day Extended Chat Retention in isolated iOS container',
        'Haptic touch feedback and Apple Neural voice synthesis'
      ]
    },
    {
      id: 'linux',
      name: 'Linux',
      tag: 'Universal .AppImage',
      format: '.AppImage Standalone',
      fileName: 'Abyntra_AI_Linux.AppImage',
      uninstallerName: 'uninstall_abyntra_linux.sh',
      icon: <Terminal className="w-5 h-5 text-amber-400" />,
      size: 'Self-Contained',
      localPath: '~/.local/share/abyntra-ai/data',
      compatibility: 'Ubuntu 24.04/26.04 LTS, Fedora, Arch, Linux Mint, Manjaro',
      features: [
        'Self-contained Linux .AppImage binary with zero external dependencies',
        'Dedicated local disk storage at ~/.local/share/abyntra-ai/data',
        '90-Day Extended Chat Retention & Local Vault',
        'Future-proof Wayland fractional scaling & PipeWire audio streaming'
      ]
    }
  ];

  const premiumFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: 'Turbo Ultra-Fast Inference',
      badge: 'PRO EXCLUSIVE',
      desc: 'Dedicated high-priority compute channel with sub-100ms response streaming across all Abyntra AI models.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      title: 'Unlimited 8K VisionForge & 4X Upscaler',
      badge: 'UNLOCKED',
      desc: 'Generate studio-grade 8K visuals, Studio Ghibli art, and 4X upscale renders without daily rate limits.'
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: 'Multi-Agent Co-Pilot Intelligence',
      badge: 'SUPERHUMAN',
      desc: 'Simultaneously run CodeMaster, Math-X, and VisionForge in parallel to solve complex multi-domain challenges.'
    },
    {
      icon: <HardDrive className="w-5 h-5 text-emerald-400" />,
      title: '90-Day Local Disk Storage Vault',
      badge: 'APP EXCLUSIVE',
      desc: 'Saves all chats and code projects directly on your local device disk with 90-day auto-clean retention.'
    },
    {
      icon: <Radio className="w-5 h-5 text-rose-400" />,
      title: 'HD Neural Voice & Multilingual Tuning',
      badge: 'PRO VOICE',
      desc: 'Studio-grade hands-free voice synthesis with customizable speech pitch, speaking speed, and English/Hindi bilingual switching.'
    },
    {
      icon: <Crown className="w-5 h-5 text-amber-300" />,
      title: 'Universal Standalone Window Mode',
      badge: 'ALL OS',
      desc: 'Borderless distraction-free window mode across Windows 7-12, macOS Sequoia, Android 15/16, and Linux.'
    }
  ];

  const activePlat = platforms.find(p => p.id === selectedPlatform) || platforms[0];
  const activeDownloadData = downloadMap[selectedPlatform] || downloadMap.windows;
  const detailedSpecs = getPlatformDetailedSpecs(selectedPlatform, selectedEdition);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl rounded-3xl bg-[#090B16] border border-cyan-500/30 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden shadow-glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Official Abyntra AI Apps & Installer Suite</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Full Setup & Uninstaller
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Windows (7-12) • Android • macOS • iOS • Linux • Real Binaries with Uninstaller Wizards
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Edition Switcher Pill Bar */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <button
              onClick={() => setSelectedEdition('standard')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-mono transition-all flex items-center gap-2 ${
                selectedEdition === 'standard'
                  ? 'bg-cyan-400 text-black font-extrabold shadow-glow-cyan scale-105'
                  : 'bg-black/60 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>🌐 Standard Universal</span>
            </button>

            <button
              onClick={() => setSelectedEdition('titan')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-mono transition-all flex items-center gap-2 ${
                selectedEdition === 'titan'
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black font-extrabold shadow-glow-emerald scale-105'
                  : 'bg-black/60 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>⚡ Titan Heavy (16GB+ RAM)</span>
            </button>

            <button
              onClick={() => setSelectedEdition('titan-lite')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-mono transition-all flex items-center gap-2 ${
                selectedEdition === 'titan-lite'
                  ? 'bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 text-black font-extrabold shadow-glow-emerald scale-105'
                  : 'bg-black/60 text-teal-300 hover:text-teal-200 border border-teal-500/40'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>🌱 Titan Lite (2GB–8GB Low-End)</span>
            </button>
          </div>

          {/* Prominent Callout Banner */}
          {selectedEdition === 'titan' ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border border-emerald-500/50 space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
                    <Cpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>⚡ Titan Heavy Workstation Edition (100% Offline Physical Execution)</span>
                    </h3>
                    <p className="text-[11px] text-gray-300 font-mono">
                      High-End air-gapped physical execution. The setup installer runs an automated hardware audit before installation!
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-xl bg-emerald-400/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-400/40 whitespace-nowrap">
                  HARDWARE AUDITED 🛡️
                </div>
              </div>

              {/* Dedicated Titan Minimum vs Maximum Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-emerald-500/20 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-black/50 border border-teal-500/30 space-y-1">
                  <div className="text-teal-300 font-bold flex items-center justify-between">
                    <span>⚡ Titan Minimum Spec:</span>
                    <span className="text-[10px] text-gray-400">~90-120 tok/s</span>
                  </div>
                  <ul className="text-[10px] text-gray-300 space-y-0.5 list-disc pl-3.5 font-sans">
                    <li><strong>CPU</strong>: 8+ Cores (Intel i7 12th+, Ryzen 7, M2 Pro)</li>
                    <li><strong>RAM</strong>: 16 GB DDR4/DDR5 / Unified</li>
                    <li><strong>GPU</strong>: NVIDIA RTX 3060 / RX 6700 / Apple 16-Core</li>
                    <li><strong>Storage</strong>: 5.0 GB Free NVMe SSD</li>
                  </ul>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                  <div className="text-emerald-300 font-bold flex items-center justify-between">
                    <span>🔥 Titan Maximum / Ultra Spec:</span>
                    <span className="text-[10px] text-amber-300 font-extrabold">~140-180+ tok/s</span>
                  </div>
                  <ul className="text-[10px] text-gray-200 space-y-0.5 list-disc pl-3.5 font-sans">
                    <li><strong>CPU</strong>: 16–32+ Extreme Cores (i9 14900K, R9 7950X, M4 Max)</li>
                    <li><strong>RAM</strong>: 64 GB – 128 GB+ DDR5 (6000MHz+)</li>
                    <li><strong>GPU</strong>: NVIDIA RTX 4080 / 4090 / 5090 (16-24GB)</li>
                    <li><strong>Storage</strong>: 25.0 GB+ PCIe Gen4/Gen5 SSD</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : selectedEdition === 'titan-lite' ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/60 via-cyan-950/40 to-slate-900 border border-teal-500/50 space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>🌱 Titan Lite Edition (100% Offline for Low-End & Budget PCs)</span>
                    </h3>
                    <p className="text-[11px] text-gray-300 font-mono">
                      Ultra-lean memory footprint (~350MB). Runs 100% offline with zero internet on 2GB–8GB RAM machines!
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-xl bg-teal-400/20 text-teal-300 font-mono text-[10px] font-bold border border-teal-400/40 whitespace-nowrap">
                  LOW-END OPTIMIZED ⚡
                </div>
              </div>

              {/* Titan Lite Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-teal-500/20 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-black/50 border border-teal-500/30 space-y-1">
                  <div className="text-teal-300 font-bold flex items-center justify-between">
                    <span>🌱 Low-End Hardware Minimum:</span>
                    <span className="text-[10px] text-gray-400">~15-25 tok/s</span>
                  </div>
                  <ul className="text-[10px] text-gray-300 space-y-0.5 list-disc pl-3.5 font-sans">
                    <li><strong>CPU</strong>: 2 Cores (Intel Celeron, Core i3, Athlon, ARM)</li>
                    <li><strong>RAM</strong>: 2 GB RAM (350MB model footprint)</li>
                    <li><strong>GPU</strong>: Integrated Graphics / Pure CPU Mode</li>
                    <li><strong>Storage</strong>: 250 MB Free Space</li>
                  </ul>
                </div>

                <div className="p-2.5 rounded-xl bg-teal-950/30 border border-teal-500/40 space-y-1">
                  <div className="text-teal-300 font-bold flex items-center justify-between">
                    <span>⚡ Titan Lite Recommended:</span>
                    <span className="text-[10px] text-teal-300 font-extrabold">~30-50 tok/s</span>
                  </div>
                  <ul className="text-[10px] text-gray-200 space-y-0.5 list-disc pl-3.5 font-sans">
                    <li><strong>CPU</strong>: 4 Cores (Intel Core i5, AMD Ryzen 3/5)</li>
                    <li><strong>RAM</strong>: 4 GB – 8 GB RAM</li>
                    <li><strong>GPU</strong>: Intel UHD / Iris / Entry GPU</li>
                    <li><strong>Storage</strong>: 1.0 GB Free Space</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                  <Crown className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>⚡ Standard Universal Edition (Runs Smoothly on All PCs & Phones)</span>
                  </h3>
                  <p className="text-[11px] text-gray-300 font-mono">
                    Universal ~3 MB standalone installer with embedded local background server and 90-day private local vault.
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/30 whitespace-nowrap">
                PRO UNLOCKED 👑
              </div>
            </div>
          )}

          {/* Platform Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 ${
                  selectedPlatform === p.id
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-glow-cyan scale-[1.03]'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] text-gray-400 hover:text-white'
                }`}
              >
                {p.icon}
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-bold block text-white">{p.name}</span>
                    {p.id === detectUserOS() && (
                      <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Auto
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 block font-semibold">{p.format}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Platform Detail Card */}
          <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  {activePlat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Abyntra AI {selectedEdition === 'titan' ? 'Titan Edition' : ''} for {activePlat.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      selectedEdition === 'titan'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {selectedEdition === 'titan' ? '⚡ 100% Offline Titan' : activePlat.format}
                    </span>
                  </h3>
                  <span className="text-xs font-mono text-gray-400 block">
                    Target Package: <strong className={selectedEdition === 'titan' ? 'text-emerald-300' : 'text-cyan-300'}>{activeDownloadData.name}</strong> • Vault: <code className="text-cyan-300">{activePlat.localPath}</code>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Setup Installer */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => handleDownloadFile(activeDownloadData.file, activeDownloadData.name, `✅ ${activeDownloadData.name} downloaded! Run the setup installer to install Abyntra AI ${selectedEdition === 'titan' ? 'Titan' : 'Pro'}.`)}
                  disabled={isDownloading}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer ${
                    selectedEdition === 'titan'
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-glow-emerald hover:opacity-90'
                      : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 shadow-glow-cyan hover:opacity-90'
                  }`}
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Download {selectedEdition === 'titan' ? 'Titan Edition' : 'Setup'} ({activeDownloadData.name})</span>
                </button>
              </div>
            </div>

            {actionMessage && (
              <div className="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-xs font-mono text-cyan-200 text-center animate-fadeIn">
                {actionMessage}
              </div>
            )}

            {/* Uninstall Notice / Guide */}
            {activeDownloadData.uninstallGuide && (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 font-mono flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span><strong>Uninstall Method:</strong> {activeDownloadData.uninstallGuide}</span>
              </div>
            )}

            {/* Platform Features */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-mono uppercase text-gray-400 tracking-wider font-bold">
                ⚡ Native OS Architecture & Features:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activePlat.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-300 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Platform Specific Hardware Requirements Matrix */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-cyan-300 tracking-wider font-bold flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Hardware Requirements for {detailedSpecs.name}:</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {selectedEdition === 'titan' ? '⚡ Titan Heavy' : selectedEdition === 'titan-lite' ? '🌱 Titan Lite' : '🌐 Standard Universal'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {detailedSpecs.matrix.slice(0, 6).map((spec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold">
                      <span className="flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-cyan-400" />
                        <span>{spec.category}</span>
                      </span>
                    </div>
                    <div className="text-gray-300 text-[11px] font-sans leading-snug">
                      <span className="text-gray-500 font-mono text-[10px]">Min: </span>{spec.minimum}
                    </div>
                    <div className="text-cyan-300 text-[11px] font-sans font-medium leading-snug">
                      <span className="text-teal-400 font-mono text-[10px]">Rec: </span>{spec.recommended}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRO FEATURES LIST EMBEDDED DIRECTLY IN THE DOWNLOAD SECTION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  Exclusive Pro Superhuman Features Unlocked in All Apps:
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">
                Use the app to access 90-day retention & Pro models
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {premiumFeatures.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#0B0D18] border border-amber-500/20 hover:border-amber-400/40 space-y-2 transition-all shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-white/[0.04]">
                      {feat.icon}
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {feat.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-gray-500">
          <span>Official Cross-Platform Distribution • Created by Abhinav Giri (@abhinavgiri45)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
