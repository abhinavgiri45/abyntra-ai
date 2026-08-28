/**
 * Girionix AI Global PWA Installation Manager
 * Enables 1-click native desktop and mobile installation with 0 downloads & 0 warnings.
 */

let deferredInstallPrompt = null;
const listeners = new Set();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    window.deferredPWAInstallPrompt = e;
    notifyListeners(true);
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    window.deferredPWAInstallPrompt = null;
    notifyListeners(false);
  });
}

function notifyListeners(canInstall) {
  listeners.forEach(fn => {
    try { fn(canInstall); } catch (_) {}
  });
}

export function subscribeToInstallability(callback) {
  listeners.add(callback);
  callback(isAppInstallable());
  return () => listeners.delete(callback);
}

export function isAppInstallable() {
  return !!deferredInstallPrompt || (typeof window !== 'undefined' && !!window.deferredPWAInstallPrompt);
}

export async function promptPWAInstall() {
  const prompt = deferredInstallPrompt || (typeof window !== 'undefined' ? window.deferredPWAInstallPrompt : null);
  if (prompt && typeof prompt.prompt === 'function') {
    try {
      prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        deferredInstallPrompt = null;
        if (typeof window !== 'undefined') window.deferredPWAInstallPrompt = null;
        notifyListeners(false);
        return { success: true, outcome: 'accepted' };
      }
      return { success: false, outcome: 'dismissed' };
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
  }
  return {
    success: false,
    outcome: 'unsupported',
    message: 'To install on this browser: click Menu (⋕) or Share and select Install App or Add to Home Screen.'
  };
}
