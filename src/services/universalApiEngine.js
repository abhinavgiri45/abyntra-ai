/**
 * ABYNTRA AI — UNIVERSAL API & DYNAMIC MODEL AUTO-UPGRADE ENGINE
 * Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
 * 
 * Capabilities:
 * 1. Universal Multi-Provider Gateway (OpenRouter, Custom OpenAI-Compatible Base URL, Anthropic, Gemini, Groq, Ollama, DeepSeek)
 * 2. Real-Time Dynamic Model Discovery: Auto-queries model registries for newly released weights
 * 3. Autonomous Model Auto-Upgrade: Automatically maps aliases to the newest model generation
 * 4. Zero-Downtime Fallback Cascade with Free Neural Gateway
 */

import { storage } from './storage';

const STORAGE_KEYS = {
  UNIVERSAL_PROVIDER: 'abyntra_universal_provider',
  CUSTOM_BASE_URL: 'abyntra_custom_base_url',
  CUSTOM_API_KEY: 'abyntra_custom_api_key',
  AUTO_UPGRADE_ENABLED: 'abyntra_auto_upgrade_enabled',
  DYNAMIC_MODEL_REGISTRY: 'abyntra_dynamic_model_registry',
  LAST_MODEL_SYNC: 'abyntra_last_model_sync',
  UPGRADE_HISTORY: 'abyntra_model_upgrade_history'
};

const LEGACY_STORAGE_KEYS = {
  UNIVERSAL_PROVIDER: 'girionix_universal_provider',
  CUSTOM_BASE_URL: 'girionix_custom_base_url',
  CUSTOM_API_KEY: 'girionix_custom_api_key',
  AUTO_UPGRADE_ENABLED: 'girionix_auto_upgrade_enabled',
  DYNAMIC_MODEL_REGISTRY: 'girionix_dynamic_model_registry',
  LAST_MODEL_SYNC: 'girionix_last_model_sync',
  UPGRADE_HISTORY: 'girionix_model_upgrade_history'
};

// Default latest baseline models
export const DEFAULT_MODEL_FAMILIES = {
  frontier: {
    name: 'Frontier Flagship Intelligence (MiniMax M3 / 550B)',
    currentId: 'minimax/minimax-m3:free',
    fallbackId: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    patterns: [/minimax-m3/i, /nemotron-3-ultra/i, /claude-4/i, /claude-3\.7/i, /deepseek-r1/i, /deepseek-r2/i, /o3/i, /o1/i, /gpt-5/i, /gpt-4\.5/i],
    category: 'reasoning'
  },
  coding: {
    name: 'Superhuman Coding Engine (Cohere / Claude 3.7)',
    currentId: 'cohere/north-mini-code:free',
    fallbackId: 'anthropic/claude-3.7-sonnet',
    patterns: [/north-mini-code/i, /claude-4/i, /claude-3\.7-sonnet/i, /qwen-2\.5-coder/i, /deepseek-coder/i, /codestral/i],
    category: 'coding'
  },
  math: {
    name: 'Olympiad Math & Formal Logic (30B Omni Reasoning / o3-mini)',
    currentId: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    fallbackId: 'openai/o3-mini',
    patterns: [/nemotron-3-nano/i, /o3/i, /o1/i, /deepseek-r1/i, /qwq-32b/i],
    category: 'reasoning'
  },
  multimodal: {
    name: 'Omnimodal Vision & Analysis (GPT-4o / Gemini 2.0)',
    currentId: 'minimax/minimax-m3:free',
    fallbackId: 'openai/gpt-4o',
    patterns: [/minimax-m3/i, /gpt-5/i, /gpt-4\.5/i, /gpt-4o/i, /gemini-2\.0-flash/i, /claude-3\.7/i],
    category: 'multimodal'
  },
  fast: {
    name: 'High-Speed Low Latency & High Accuracy',
    currentId: 'minimax/minimax-m3:free',
    fallbackId: 'dots-studio/dots-3-note-preview:free',
    patterns: [/minimax-m3/i, /dots-3-note/i, /gemini-2\.0-flash/i, /gpt-4o-mini/i, /llama-3\.3-70b/i],
    category: 'fast'
  },
  script: {
    name: 'Screenplay & Narrative Cinema (MiniMax M3 / Claude 3.7)',
    currentId: 'minimax/minimax-m3:free',
    fallbackId: 'anthropic/claude-3.7-sonnet',
    patterns: [/minimax-m3/i, /claude-4/i, /claude-3\.7-sonnet/i, /gpt-4o/i],
    category: 'script'
  }
};

export const SUPPORTED_PROVIDERS = [
  { id: 'openrouter', name: 'OpenRouter (Universal All-in-One)', defaultBaseUrl: 'https://openrouter.ai/api/v1', defaultPlaceholder: 'sk-or-v1-...' },
  { id: 'custom', name: 'Custom OpenAI-Compatible Endpoint (Ollama / Local / LM Studio)', defaultBaseUrl: 'http://localhost:11434/v1', defaultPlaceholder: 'API Key (or leave blank for local)' },
  { id: 'groq', name: 'Groq Cloud (Ultra-Fast 500+ tok/s)', defaultBaseUrl: 'https://api.groq.com/openai/v1', defaultPlaceholder: 'gsk_...' },
  { id: 'deepseek', name: 'DeepSeek Direct API', defaultBaseUrl: 'https://api.deepseek.com/v1', defaultPlaceholder: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic Direct API', defaultBaseUrl: 'https://api.anthropic.com/v1', defaultPlaceholder: 'sk-ant-...' },
  { id: 'openai', name: 'OpenAI Direct API', defaultBaseUrl: 'https://api.openai.com/v1', defaultPlaceholder: 'sk-proj-...' },
  { id: 'google', name: 'Google Gemini AI Direct', defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', defaultPlaceholder: 'AIzaSy...' }
];

export const universalApiEngine = {
  /**
   * Get active provider configuration
   */
  getProviderConfig() {
    try {
      const providerId = localStorage.getItem(STORAGE_KEYS.UNIVERSAL_PROVIDER) || 'openrouter';
      const customBaseUrl = localStorage.getItem(STORAGE_KEYS.CUSTOM_BASE_URL) || '';
      const customApiKey = localStorage.getItem(STORAGE_KEYS.CUSTOM_API_KEY) || '';
      const autoUpgrade = localStorage.getItem(STORAGE_KEYS.AUTO_UPGRADE_ENABLED) !== 'false'; // default TRUE
      const provider = SUPPORTED_PROVIDERS.find(p => p.id === providerId) || SUPPORTED_PROVIDERS[0];

      return {
        providerId,
        providerName: provider.name,
        baseUrl: customBaseUrl || provider.defaultBaseUrl,
        apiKey: customApiKey || (providerId === 'openrouter' ? storage.getApiKey() : ''),
        autoUpgradeEnabled: autoUpgrade
      };
    } catch (_) {
      return {
        providerId: 'openrouter',
        providerName: 'OpenRouter (Universal All-in-One)',
        baseUrl: 'https://openrouter.ai/api/v1',
        apiKey: storage.getApiKey(),
        autoUpgradeEnabled: true
      };
    }
  },

  /**
   * Save provider configuration
   */
  saveProviderConfig({ providerId, baseUrl, apiKey, autoUpgradeEnabled }) {
    if (providerId) localStorage.setItem(STORAGE_KEYS.UNIVERSAL_PROVIDER, providerId);
    if (baseUrl !== undefined) localStorage.setItem(STORAGE_KEYS.CUSTOM_BASE_URL, baseUrl.trim());
    if (apiKey !== undefined) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_API_KEY, apiKey.trim());
      if (providerId === 'openrouter') {
        storage.setApiKey(apiKey.trim());
      }
    }
    if (autoUpgradeEnabled !== undefined) {
      localStorage.setItem(STORAGE_KEYS.AUTO_UPGRADE_ENABLED, autoUpgradeEnabled ? 'true' : 'false');
    }
  },

  /**
   * Get current dynamic model registry
   */
  getDynamicRegistry() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DYNAMIC_MODEL_REGISTRY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (_) {}
    return DEFAULT_MODEL_FAMILIES;
  },

  /**
   * Save dynamic model registry
   */
  saveDynamicRegistry(registry) {
    try {
      localStorage.setItem(STORAGE_KEYS.DYNAMIC_MODEL_REGISTRY, JSON.stringify(registry));
      localStorage.setItem(STORAGE_KEYS.LAST_MODEL_SYNC, Date.now().toString());
    } catch (_) {}
  },

  /**
   * Get last sync timestamp & human-readable status
   */
  getSyncStatus() {
    try {
      const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_MODEL_SYNC);
      const historyStr = localStorage.getItem(STORAGE_KEYS.UPGRADE_HISTORY);
      const history = historyStr ? JSON.parse(historyStr) : [];
      return {
        lastSyncTime: lastSync ? parseInt(lastSync, 10) : null,
        upgrades: history
      };
    } catch (_) {
      return { lastSyncTime: null, upgrades: [] };
    }
  },

  /**
   * Real-time query to discover and auto-upgrade to newly released models
   */
  async syncLatestModels() {
    const config = this.getProviderConfig();
    const headers = {
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://girionix.ai',
      'X-Title': 'Girionix AI Universal Engine'
    };

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    let modelsEndpoint = `${config.baseUrl}/models`;
    if (config.providerId === 'openrouter') {
      modelsEndpoint = 'https://openrouter.ai/api/v1/models';
    }

    try {
      const response = await fetch(modelsEndpoint, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(6000)
      });

      if (!response.ok) {
        return { success: false, message: `Provider returned status ${response.status}`, upgraded: false };
      }

      const data = await response.json();
      const rawModelsList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (rawModelsList.length === 0) {
        return { success: false, message: 'No models found in provider registry', upgraded: false };
      }

      const modelIds = rawModelsList.map(m => (typeof m === 'string' ? m : m.id)).filter(Boolean);
      const currentRegistry = this.getDynamicRegistry();
      const upgradedFamilies = [];
      const updatedRegistry = { ...currentRegistry };

      for (const [key, family] of Object.entries(DEFAULT_MODEL_FAMILIES)) {
        let bestMatch = family.currentId;

        // Search for newer model matching the family patterns in priority order
        for (const pattern of family.patterns) {
          const match = modelIds.find(id => pattern.test(id));
          if (match) {
            bestMatch = match;
            break;
          }
        }

        if (bestMatch && bestMatch !== updatedRegistry[key]?.currentId) {
          upgradedFamilies.push({
            family: key,
            name: family.name,
            oldModel: updatedRegistry[key]?.currentId || family.currentId,
            newModel: bestMatch
          });

          updatedRegistry[key] = {
            ...family,
            currentId: bestMatch,
            lastUpgradedAt: Date.now()
          };
        }
      }

      this.saveDynamicRegistry(updatedRegistry);

      if (upgradedFamilies.length > 0) {
        try {
          const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPGRADE_HISTORY) || '[]');
          history.unshift({
            timestamp: Date.now(),
            upgrades: upgradedFamilies
          });
          localStorage.setItem(STORAGE_KEYS.UPGRADE_HISTORY, JSON.stringify(history.slice(0, 20)));
        } catch (_) {}
      }

      return {
        success: true,
        totalModelsAvailable: modelIds.length,
        upgraded: upgradedFamilies.length > 0,
        upgradedFamilies,
        activeRegistry: updatedRegistry
      };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Could not connect to model registry',
        upgraded: false
      };
    }
  },

  /**
   * Resolve any model alias to the latest auto-upgraded target ID
   */
  resolveTargetModel(requestedModelId) {
    const config = this.getProviderConfig();
    const registry = this.getDynamicRegistry();

    // If auto-upgrade is disabled, use static baseline mappings
    if (!config.autoUpgradeEnabled) {
      if (requestedModelId === 'girionix-pro') return 'deepseek/deepseek-r1';
      if (requestedModelId === 'girionix-lite') return 'google/gemini-2.0-flash-001';
      return requestedModelId;
    }

    // Auto-Frontier / Universal Flagship
    if (requestedModelId === 'girionix-universal-auto' || requestedModelId === 'girionix-pro') {
      return registry.frontier?.currentId || 'deepseek/deepseek-r1';
    }

    // High-Speed / Visual Engine
    if (requestedModelId === 'girionix-lite') {
      return registry.fast?.currentId || 'google/gemini-2.0-flash-001';
    }

    // Dedicated Coding Studio
    if (requestedModelId === 'girionix-codemaster-ultra' || requestedModelId === 'anthropic/claude-3.7-sonnet') {
      return registry.coding?.currentId || 'anthropic/claude-3.7-sonnet';
    }

    // Math Lab Olympiad
    if (requestedModelId === 'girionix-mathx-olympiad' || requestedModelId === 'openai/o3-mini') {
      return registry.math?.currentId || 'openai/o3-mini';
    }

    // Screenplay & Script Studio
    if (requestedModelId === 'girionix-scriptmaster-cinema') {
      return registry.script?.currentId || 'anthropic/claude-3.7-sonnet';
    }

    // Multimodal Omni
    if (requestedModelId === 'openai/gpt-4o') {
      return registry.multimodal?.currentId || 'openai/gpt-4o';
    }

    return requestedModelId;
  }
};
