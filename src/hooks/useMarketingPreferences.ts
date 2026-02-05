import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "tm_marketing_preferences";

interface PlatformConnection {
  id: string;
  name: string;
  connected: boolean;
  connectedAt?: string;
  accountId?: string;
  accountName?: string;
  roas?: number;
  spend?: number;
  conversions?: number;
  lastSync?: string;
}

export interface MarketingPreferences {
  tourCompleted: boolean;
  tourCompletedAt?: string;
  platformConnections: PlatformConnection[];
  onboardingStep?: number;
  lastVisit?: string;
}

const DEFAULT_PREFERENCES: MarketingPreferences = {
  tourCompleted: false,
  platformConnections: [
    { id: 'google', name: 'Google Ads', connected: false },
    { id: 'meta', name: 'Meta Ads', connected: false },
    { id: 'microsoft', name: 'Microsoft Ads', connected: false },
    { id: 'tiktok', name: 'TikTok Ads', connected: false },
  ],
};

export function useMarketingPreferences() {
  const [preferences, setPreferences] = useState<MarketingPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load marketing preferences:", e);
    }
    return DEFAULT_PREFERENCES;
  });

  // Persist to localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...preferences,
        lastVisit: new Date().toISOString(),
      }));
    } catch (e) {
      console.error("Failed to save marketing preferences:", e);
    }
  }, [preferences]);

  const completeTour = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      tourCompleted: true,
      tourCompletedAt: new Date().toISOString(),
    }));
  }, []);

  const resetTour = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      tourCompleted: false,
      tourCompletedAt: undefined,
    }));
  }, []);

  const connectPlatform = useCallback((platformId: string, accountData?: {
    accountId?: string;
    accountName?: string;
    roas?: number;
    spend?: number;
    conversions?: number;
  }) => {
    setPreferences(prev => ({
      ...prev,
      platformConnections: prev.platformConnections.map(p =>
        p.id === platformId
          ? {
              ...p,
              connected: true,
              connectedAt: new Date().toISOString(),
              lastSync: 'Just now',
              roas: accountData?.roas ?? 2.4 + Math.random() * 2,
              spend: accountData?.spend ?? 1000 + Math.random() * 5000,
              conversions: accountData?.conversions ?? Math.floor(50 + Math.random() * 200),
              accountId: accountData?.accountId ?? `acc_${Date.now()}`,
              accountName: accountData?.accountName ?? `${p.name} Account`,
            }
          : p
      ),
    }));
  }, []);

  const disconnectPlatform = useCallback((platformId: string) => {
    setPreferences(prev => ({
      ...prev,
      platformConnections: prev.platformConnections.map(p =>
        p.id === platformId
          ? {
              ...p,
              connected: false,
              connectedAt: undefined,
              accountId: undefined,
              accountName: undefined,
              roas: undefined,
              spend: undefined,
              conversions: undefined,
              lastSync: undefined,
            }
          : p
      ),
    }));
  }, []);

  const updatePlatformSync = useCallback((platformId: string) => {
    setPreferences(prev => ({
      ...prev,
      platformConnections: prev.platformConnections.map(p =>
        p.id === platformId && p.connected
          ? { ...p, lastSync: 'Just now' }
          : p
      ),
    }));
  }, []);

  const setOnboardingStep = useCallback((step: number) => {
    setPreferences(prev => ({
      ...prev,
      onboardingStep: step,
    }));
  }, []);

  return {
    preferences,
    completeTour,
    resetTour,
    connectPlatform,
    disconnectPlatform,
    updatePlatformSync,
    setOnboardingStep,
    isReturningUser: !!preferences.lastVisit,
  };
}
