import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import StudioPanel from './components/layout/StudioPanel';
import CommandPalette from './components/layout/CommandPalette';
import ToolsModal from './components/tools/ToolsModal';
import VoiceOrbModal from './components/chat/VoiceOrbModal';
import ShortcutsModal from './components/common/ShortcutsModal';
import WelcomeNameModal from './components/common/WelcomeNameModal';
import IntroducingGirionixPage from './components/common/IntroducingGirionixPage';
import ScratchpadModal from './components/common/ScratchpadModal';
import DownloadAppsModal from './components/common/DownloadAppsModal';
import ProAppStatusModal from './components/common/ProAppStatusModal';
import UpdateModal from './components/common/UpdateModal';
import LocalNeuralModal from './components/common/LocalNeuralModal';
import TitanWorkstationModal from './components/common/TitanWorkstationModal';
import TitanWorkstationView from './components/titan/TitanWorkstationView';
import ChatView from './components/chat/ChatView';

import { AI_MODELS, TITAN_AI_MODELS } from './services/modelCatalog';
import { storage } from './services/storage';
import { updateService } from './services/updateService';

// Dynamic Route Resolver for Instant SPA Web Navigation:
// - '/' or '/chat' -> Full Superhuman Chat & AI Studio Canvas Workspace (Default)
// - '/intro' or '/about' -> Official Introduction / Announcement Page
// - '/why-switch' -> Model Benchmarks & Comparison Matrix
// - '/downloads' -> Standalone Platform Native App Packages
// - '/switch-user' -> Switch User Identity & Profile Selector
const resolveInitialRoute = () => {
  if (typeof window === 'undefined') return { view: 'chat' };
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  const search = new URLSearchParams(window.location.search);

  // Introduction requested
  if (pathname === '/intro' || pathname === '/about' || hash === 'intro' || hash === 'about' || search.get('view') === 'intro') {
    return { view: 'intro' };
  }
  // Why switch comparison requested
  if (pathname === '/why-switch' || hash === 'why-switch' || search.get('view') === 'why-switch') {
    return { view: 'why-switch' };
  }
  // Downloads requested
  if (pathname === '/downloads' || hash === 'downloads' || search.get('view') === 'downloads') {
    return { view: 'downloads' };
  }
  // Switch user profile requested
  if (pathname === '/switch-user' || hash === 'switch-user' || search.get('view') === 'switch-user') {
    return { view: 'switch-user' };
  }

  // Default for '/' and '/chat' is the full Chat Workspace!
  return { view: 'chat' };
};

export default function App() {
  const initialRoute = resolveInitialRoute();
  const [isAppInstalled, setIsAppInstalled] = useState(() => storage.isAppInstalled());
  const [isTitanMode, setIsTitanMode] = useState(() => {
    try {
      return localStorage.getItem('girionix_titan_mode') === 'true' || (typeof window !== 'undefined' && window.location.search.includes('titan=true'));
    } catch (_) { return false; }
  });
  const [isTitanWorkstationOpen, setIsTitanWorkstationOpen] = useState(false);
  const [activeModel, setActiveModel] = useState(() => {
    const isTitan = typeof window !== 'undefined' && (localStorage.getItem('girionix_titan_mode') === 'true' || window.location.search.includes('titan=true'));
    const isLite = typeof window !== 'undefined' && window.location.search.includes('profile=lite');
    if (isTitan) return isLite ? TITAN_AI_MODELS[1] : TITAN_AI_MODELS[0];
    return AI_MODELS[0]; // Full Pro Flagship Universal Model
  });
  const [layoutMode, setLayoutMode] = useState('chat'); // 'chat' | 'split' | 'studio'
  const [activeStudioTab, setActiveStudioTab] = useState('code'); // 'code' | 'math' | 'image' | 'video'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [introTab, setIntroTab] = useState(initialRoute.view === 'why-switch' ? 'comparison' : 'overview');
  
  // Dynamic Route States
  const [isAboutOpen, setIsAboutOpen] = useState(initialRoute.view === 'intro' || initialRoute.view === 'why-switch');
  const [isNameModalOpen, setIsNameModalOpen] = useState(initialRoute.view === 'switch-user');
  const [isDownloadOpen, setIsDownloadOpen] = useState(initialRoute.view === 'downloads');

  // Bidirectional History & URL Routing Synchronizer
  const navigateTo = (route, push = true) => {
    if (typeof window === 'undefined') return;
    let targetPath = '/chat';
    if (route === 'chat') targetPath = '/chat';
    else if (route === 'intro' || route === 'about') targetPath = '/intro';
    else if (route === 'why-switch') targetPath = '/why-switch';
    else if (route === 'downloads') targetPath = '/downloads';
    else if (route === 'switch-user') targetPath = '/switch-user';
    else targetPath = '/chat';

    try {
      if (window.location.pathname !== targetPath) {
        if (push) {
          window.history.pushState({ route }, '', targetPath);
        } else {
          window.history.replaceState({ route }, '', targetPath);
        }
      }
    } catch (_) {}
  };

  // Listen for browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const current = resolveInitialRoute();
      if (current.view === 'intro') {
        setIsAboutOpen(true);
        setIntroTab('overview');
        setIsNameModalOpen(false);
        setIsDownloadOpen(false);
      } else if (current.view === 'why-switch') {
        setIsAboutOpen(true);
        setIntroTab('comparison');
        setIsNameModalOpen(false);
        setIsDownloadOpen(false);
      } else if (current.view === 'downloads') {
        setIsDownloadOpen(true);
        setIsAboutOpen(false);
        setIsNameModalOpen(false);
      } else if (current.view === 'switch-user') {
        setIsNameModalOpen(true);
        setIsAboutOpen(false);
        setIsDownloadOpen(false);
      } else {
        setIsAboutOpen(false);
        setIsNameModalOpen(false);
        setIsDownloadOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenIntro = () => {
    setIntroTab('overview');
    setIsAboutOpen(true);
    navigateTo('intro');
  };

  const handleOpenWhySwitch = () => {
    setIntroTab('comparison');
    setIsAboutOpen(true);
    navigateTo('why-switch');
  };

  const handleCloseIntro = () => {
    setIsAboutOpen(false);
    storage.setSeenIntro(true);
    navigateTo('chat');
  };

  const handleLaunchApp = (studioTab = null) => {
    handleCloseIntro();
    if (studioTab && typeof studioTab === 'string') {
      setActiveStudioTab(studioTab);
      setLayoutMode('split');
    }
  };

  const handleOpenSwitchUser = () => {
    setIsNameModalOpen(true);
    navigateTo('switch-user');
  };

  const handleSaveName = (newName) => {
    setUserName(newName);
    setIsNameModalOpen(false);
    navigateTo('chat');
  };

  const handleCloseSwitchUser = () => {
    setIsNameModalOpen(false);
    navigateTo('chat');
  };

  const [isProStatusOpen, setIsProStatusOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);
  const [hasAvailableUpdate, setHasAvailableUpdate] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [injectedCode, setInjectedCode] = useState(null);

  const handleToggleTitanMode = (enableTitan, targetModelId = null) => {
    setIsTitanMode(enableTitan);
    try {
      localStorage.setItem('girionix_titan_mode', enableTitan ? 'true' : 'false');
    } catch (_) {}
    if (enableTitan) {
      const selected = targetModelId ? (TITAN_AI_MODELS.find(m => m.id === targetModelId) || TITAN_AI_MODELS[0]) : TITAN_AI_MODELS[0];
      setActiveModel(selected);
    } else {
      setActiveModel(AI_MODELS[0]);
    }
  };

  const [sessions, setSessions] = useState(() => storage.getSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => storage.getActiveSessionId());
  const [pinnedItems, setPinnedItems] = useState(() => storage.getPinnedItems());
  const [activePersona, setActivePersona] = useState(() => storage.getSettings().activePersona || 'default');

  // Load user name and settings on boot + strict app mode detection
  useEffect(() => {
    const isApp = storage.isAppInstalled();
    const savedName = storage.getUserName();
    if (savedName) {
      setUserName(savedName);
    }

    const checkAppMode = () => {
      const isRunningApp = storage.isAppInstalled();
      setIsAppInstalled(isRunningApp);
      const isExplicitNative = typeof window !== 'undefined' && (
        window.location.search.includes('app=true') || 
        window.location.search.includes('native=true') ||
        window.location.hash.includes('app=true') ||
        window.location.hash.includes('native=true')
      );
      if (isRunningApp && isExplicitNative) {
        setIsAboutOpen(false);
        navigateTo('chat', false);
      }
    };

    checkAppMode();

    // Background Over-The-Air (OTA) Code Update Check
    const runUpdateCheck = async () => {
      try {
        const res = await updateService.checkForUpdates();
        if (res && res.hasUpdate) {
          setHasAvailableUpdate(true);
        }
      } catch (_) {}
    };
    runUpdateCheck();
    const updateInterval = setInterval(runUpdateCheck, 15 * 60 * 1000);

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mql = window.matchMedia('(display-mode: standalone)');
      const handler = () => checkAppMode();
      if (mql.addEventListener) mql.addEventListener('change', handler);
      return () => {
        clearInterval(updateInterval);
        if (mql.removeEventListener) mql.removeEventListener('change', handler);
      };
    }
    return () => clearInterval(updateInterval);
  }, []);

  // Global Key listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsScratchpadOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDownloadOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setIsVoiceModeOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setLayoutMode(prev => prev === 'split' ? 'chat' : 'split');
      }
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        setIsShortcutsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateNewSession = () => {
    const newSession = {
      id: 'session-' + Date.now(),
      title: 'New Session',
      createdAt: Date.now(),
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id) => {
    const remaining = sessions.filter(s => s.id !== id);
    if (remaining.length > 0) {
      setSessions(remaining);
      if (activeSessionId === id) setActiveSessionId(remaining[0].id);
    }
  };

  const handleClearAllSessions = () => {
    const freshSession = {
      id: 'session-' + Date.now(),
      title: 'New Session',
      createdAt: Date.now(),
      messages: []
    };
    setSessions([freshSession]);
    setActiveSessionId(freshSession.id);
  };

  const handleOpenInCodeStudio = (code) => {
    setInjectedCode(code);
    setActiveStudioTab('code');
    setLayoutMode('split');
  };

  const handleLaunchStudioFromTools = (studioId) => {
    setActiveStudioTab(studioId);
    setLayoutMode('split');
  };

  if (isTitanMode) {
    return (
      <TitanWorkstationView
        onExitTitanMode={() => handleToggleTitanMode(false)}
        userName={userName}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07080E] text-gray-100 font-sans">
      {/* Left Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
        onCreateNewSession={handleCreateNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenSettings={() => setIsToolsOpen(true)}
        onOpenAbout={handleOpenIntro}
        onOpenWhySwitch={handleOpenWhySwitch}
        onOpenDownload={() => { setIsDownloadOpen(true); navigateTo('downloads'); }}
        onOpenProStatus={() => setIsProStatusOpen(true)}
        isAppInstalled={isAppInstalled}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
          onOpenTools={() => setIsToolsOpen(true)}
          onOpenAbout={handleOpenIntro}
          onOpenWhySwitch={handleOpenWhySwitch}
          onOpenDownload={() => { setIsDownloadOpen(true); navigateTo('downloads'); }}
          onOpenProStatus={() => setIsProStatusOpen(true)}
          onOpenScratchpad={() => setIsScratchpadOpen(true)}
          onOpenUpdates={() => setIsUpdateModalOpen(true)}
          onOpenLocalEngine={() => setIsLocalModalOpen(true)}
          onOpenTitanWorkstation={() => setIsTitanWorkstationOpen(true)}
          onNewChat={handleCreateNewSession}
          onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          userName={userName}
          onChangeName={handleOpenSwitchUser}
          isAppInstalled={isAppInstalled}
          isTitanMode={isTitanMode}
          onToggleTitanMode={handleToggleTitanMode}
        />

        {/* Workspace Dual Pane / Chat Layout */}
        <main className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
          {/* Left Pane: Chat & Welcome Screen */}
          {(layoutMode === 'chat' || layoutMode === 'split') && (
            <div className={`h-full flex flex-col transition-all duration-300 min-w-0 ${
              layoutMode === 'split' ? 'w-full md:w-1/2 border-r border-white/[0.08]' : 'w-full'
            }`}>
              <ChatView
                activeModel={activeModel}
                setActiveModel={setActiveModel}
                onOpenInCodeStudio={handleOpenInCodeStudio}
                onOpenStudioTab={(tabId) => {
                  setActiveStudioTab(tabId);
                  setLayoutMode('split');
                }}
                layoutMode={layoutMode}
                setLayoutMode={setLayoutMode}
                userName={userName}
                sessions={sessions}
                setSessions={setSessions}
                activeSessionId={activeSessionId}
                setActiveSessionId={setActiveSessionId}
                onCreateNewSession={handleCreateNewSession}
                onOpenVoiceModal={() => setIsVoiceModeOpen(true)}
                onOpenAbout={handleOpenIntro}
                onOpenWhySwitch={handleOpenWhySwitch}
                onOpenDownload={() => { setIsDownloadOpen(true); navigateTo('downloads'); }}
                isAppInstalled={isAppInstalled}
                isTitanMode={isTitanMode}
                onOpenTitanWorkstation={() => setIsTitanWorkstationOpen(true)}
              />
            </div>
          )}

          {/* Right Pane: Live AI Studio (Code Sandbox, Math Lab, 8K Vision, Motion Lab) */}
          {(layoutMode === 'studio' || layoutMode === 'split') && (
            <div className={`h-full flex flex-col transition-all duration-300 min-w-0 ${
              layoutMode === 'split' ? 'w-full md:w-1/2' : 'w-full'
            }`}>
              <StudioPanel
                activeStudioTab={activeStudioTab}
                setActiveStudioTab={setActiveStudioTab}
                activeModel={activeModel}
                injectedCode={injectedCode}
                onClose={() => setLayoutMode('chat')}
                isAppInstalled={isAppInstalled}
                isTitanMode={isTitanMode}
                onOpenDownload={() => { setIsDownloadOpen(true); navigateTo('downloads'); }}
              />
            </div>
          )}
        </main>
      </div>

      {/* Tools & AI Studio Hub Modal */}
      <ToolsModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
        onLaunchStudio={handleLaunchStudioFromTools}
        activePersona={activePersona}
        onSelectPersona={(p) => {
          setActivePersona(p);
          storage.saveSettings({ ...storage.getSettings(), activePersona: p });
        }}
        pinnedItems={pinnedItems}
        onRemovePinned={(id) => {
          const updated = pinnedItems.filter(p => p.id !== id);
          setPinnedItems(updated);
          storage.savePinnedItems(updated);
        }}
        onOpenLocalEngine={() => setIsLocalModalOpen(true)}
      />

      {/* Official OpenAI-Style Introducing Girionix AI Landing & Announcement Page */}
      <IntroducingGirionixPage
        isOpen={isAboutOpen}
        initialTab={introTab}
        onClose={handleCloseIntro}
        onLaunchApp={handleLaunchApp}
        onOpenDownload={() => {
          handleCloseIntro();
          setIsDownloadOpen(true);
          navigateTo('downloads');
        }}
      />

      {/* Download Native Apps Modal (Android, Windows, iOS, Mac, Linux) */}
      <DownloadAppsModal
        isOpen={isDownloadOpen}
        onClose={() => {
          setIsDownloadOpen(false);
          navigateTo('chat');
        }}
        onInstalledChange={(installed) => {
          setIsAppInstalled(installed);
          if (installed) setActiveModel(AI_MODELS[0]);
        }}
      />

      {/* Pro App Active Status & Local Vault Modal */}
      <ProAppStatusModal
        isOpen={isProStatusOpen}
        onClose={() => setIsProStatusOpen(false)}
        userName={userName}
      />

      {/* Real-Time System Updates & Over-The-Air Sync Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onOpenDownload={() => {
          setIsUpdateModalOpen(false);
          setIsDownloadOpen(true);
          navigateTo('downloads');
        }}
      />

      {/* 100% On-Device Local Neural Core Hardware Audit & Launcher Modal */}
      <LocalNeuralModal
        isOpen={isLocalModalOpen}
        onClose={() => setIsLocalModalOpen(false)}
        activeModel={activeModel}
        onActivateLocalModel={() => {
          const localModel = AI_MODELS.find(m => m.id === 'girionix-local-core') || AI_MODELS[0];
          setActiveModel(localModel);
        }}
      />

      {/* Dedicated Titan Heavy Hardware Workstation & Stress Benchmark Modal */}
      <TitanWorkstationModal
        isOpen={isTitanWorkstationOpen}
        onClose={() => setIsTitanWorkstationOpen(false)}
        onActivateTitanModel={(targetModelId) => {
          handleToggleTitanMode(true, targetModelId);
        }}
      />

      {/* AI Smart Scratchpad Modal (Ctrl+J) */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        activeModel={activeModel}
      />

      {/* Welcome & Switch User Profile Modal */}
      <WelcomeNameModal
        isOpen={isNameModalOpen}
        currentUserName={userName}
        onSaveName={handleSaveName}
        onClose={handleCloseSwitchUser}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Live Voice Conversation Orb Modal */}
      <VoiceOrbModal
        isOpen={isVoiceModeOpen}
        onClose={() => setIsVoiceModeOpen(false)}
        activeModel={activeModel}
      />

      {/* Quick Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setCurrentStudio={(s) => { setActiveStudioTab(s); setLayoutMode('split'); }}
        setActiveModel={setActiveModel}
        onOpenSettings={() => setIsToolsOpen(true)}
      />
    </div>
  );
}
