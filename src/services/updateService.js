/**
 * Abyntra AI Real-Time Over-The-Air (OTA) Code & System Update Service
 * Enables instant update delivery, version synchronization, and hot-patching across all platforms.
 */

export const CURRENT_APP_VERSION = {
  version: '2.1.0',
  versionCode: 210,
  buildDate: '2026-08-26',
  channel: 'stable',
  platform: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'web'
};

class UpdateService {
  constructor() {
    this.listeners = new Set();
    this.updateInfo = null;
    this.isChecking = false;
    this.hasUpdate = false;
  }

  getCurrentVersion() {
    return CURRENT_APP_VERSION;
  }

  /**
   * Check for remote updates from version manifest
   */
  async checkForUpdates() {
    this.isChecking = true;
    this.notifyListeners();

    try {
      // Query central version manifest with anti-cache timestamp
      const response = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch version manifest: ${response.status}`);
      }

      const remoteData = await response.json();
      this.updateInfo = remoteData;

      // Compare versions
      const isNewer = this.compareVersions(remoteData.version, CURRENT_APP_VERSION.version) > 0 ||
        (remoteData.buildTimestamp && remoteData.buildTimestamp > (CURRENT_APP_VERSION.buildTimestamp || 0));

      this.hasUpdate = isNewer;
      localStorage.setItem('abyntra_last_update_check', Date.now().toString());

      return {
        hasUpdate: this.hasUpdate,
        currentVersion: CURRENT_APP_VERSION.version,
        latestVersion: remoteData.version,
        releaseDate: remoteData.releaseDate,
        title: remoteData.title,
        changelog: remoteData.changelog || [],
        platformDownloads: remoteData.platformDownloads || {}
      };
    } catch (err) {
      console.warn('Update check warning (running local/offline):', err.message);
      return {
        hasUpdate: false,
        currentVersion: CURRENT_APP_VERSION.version,
        latestVersion: CURRENT_APP_VERSION.version,
        changelog: ['Running latest local build.']
      };
    } finally {
      this.isChecking = false;
      this.notifyListeners();
    }
  }

  /**
   * Compare semver strings (e.g. 2.1.0 vs 2.0.0)
   */
  compareVersions(v1, v2) {
    if (!v1 || !v2) return 0;
    const p1 = v1.split('.').map(Number);
    const p2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      const num1 = p1[i] || 0;
      const num2 = p2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  }

  /**
   * 1-Click Instant Apply Update (Clears cache and hot-reloads)
   */
  async applyUpdate() {
    try {
      // Clear service worker caches if present
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map(k => window.caches.delete(k)));
      }

      // Unregister old service workers
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
    } catch (_) {}

    // Cleanly reload application with newest code
    if (typeof window !== 'undefined') {
      window.location.reload(true);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(l => {
      try { l({ isChecking: this.isChecking, hasUpdate: this.hasUpdate, updateInfo: this.updateInfo }); } catch (_) {}
    });
  }
}

export const updateService = new UpdateService();
