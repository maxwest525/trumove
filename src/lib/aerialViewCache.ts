/**
 * Client-side cache for Aerial View API responses
 * Reduces API calls and avoids rate limiting (180 req/min)
 */

interface CachedAerialView {
  data: AerialViewData;
  timestamp: number;
  expiresAt: number;
}

interface AerialViewData {
  type: "video" | "processing" | "not_found" | "fallback" | "error" | "tile";
  videoUrl?: string;
  thumbnailUrl?: string;
  tileUrl?: string;
  message?: string;
  code?: number;
}

// Cache duration: 30 minutes for successful responses, 5 minutes for errors
const CACHE_DURATION_SUCCESS = 30 * 60 * 1000; // 30 minutes
const CACHE_DURATION_ERROR = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY_PREFIX = 'aerial_view_';
const MAX_CACHE_ENTRIES = 50;

/**
 * Generate a cache key from coordinates
 * Round to 4 decimal places (~11m precision) to group nearby requests
 */
function getCacheKey(lat: number, lng: number): string {
  const roundedLat = lat.toFixed(4);
  const roundedLng = lng.toFixed(4);
  return `${CACHE_KEY_PREFIX}${roundedLat}_${roundedLng}`;
}

/**
 * Get cached aerial view data if available and not expired
 */
export function getCachedAerialView(lat: number, lng: number): AerialViewData | null {
  try {
    const key = getCacheKey(lat, lng);
    const cached = localStorage.getItem(key);
    
    if (!cached) return null;
    
    const entry: CachedAerialView = JSON.parse(cached);
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    
    console.log(`[AerialCache] Cache hit for ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    return entry.data;
  } catch (err) {
    console.error('[AerialCache] Error reading cache:', err);
    return null;
  }
}

/**
 * Store aerial view data in cache
 */
export function setCachedAerialView(lat: number, lng: number, data: AerialViewData): void {
  try {
    const key = getCacheKey(lat, lng);
    
    // Determine cache duration based on response type
    const isError = data.type === 'error' || data.code === 429;
    const duration = isError ? CACHE_DURATION_ERROR : CACHE_DURATION_SUCCESS;
    
    const entry: CachedAerialView = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + duration,
    };
    
    // Clean up old entries if needed
    cleanupCache();
    
    localStorage.setItem(key, JSON.stringify(entry));
    console.log(`[AerialCache] Cached ${data.type} for ${lat.toFixed(4)}, ${lng.toFixed(4)} (expires in ${duration / 1000}s)`);
  } catch (err) {
    console.error('[AerialCache] Error writing cache:', err);
  }
}

/**
 * Clear all aerial view cache entries
 */
export function clearAerialViewCache(): void {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
    console.log(`[AerialCache] Cleared ${keys.length} cached entries`);
  } catch (err) {
    console.error('[AerialCache] Error clearing cache:', err);
  }
}

/**
 * Get cache statistics
 */
export function getAerialViewCacheStats(): { count: number; size: number } {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
    let totalSize = 0;
    
    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) totalSize += item.length;
    });
    
    return { count: keys.length, size: totalSize };
  } catch {
    return { count: 0, size: 0 };
  }
}

/**
 * Remove expired entries and enforce max cache size
 */
function cleanupCache(): void {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
    const now = Date.now();
    
    // Parse and sort entries by timestamp
    const entries: { key: string; timestamp: number; expired: boolean }[] = [];
    
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const entry: CachedAerialView = JSON.parse(item);
          entries.push({
            key,
            timestamp: entry.timestamp,
            expired: now > entry.expiresAt,
          });
        }
      } catch {
        // Remove corrupted entries
        localStorage.removeItem(key);
      }
    });
    
    // Remove expired entries
    entries.filter(e => e.expired).forEach(e => localStorage.removeItem(e.key));
    
    // If still over limit, remove oldest entries
    const validEntries = entries.filter(e => !e.expired).sort((a, b) => a.timestamp - b.timestamp);
    
    while (validEntries.length > MAX_CACHE_ENTRIES) {
      const oldest = validEntries.shift();
      if (oldest) {
        localStorage.removeItem(oldest.key);
      }
    }
  } catch (err) {
    console.error('[AerialCache] Cleanup error:', err);
  }
}

/**
 * Debounce function for rate limiting API calls
 */
export function createAerialViewDebouncer(delayMs: number = 2000) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCall = 0;
  
  return function debounce<T>(fn: () => Promise<T>): Promise<T> | null {
    const now = Date.now();
    
    // If called too recently, skip
    if (now - lastCall < delayMs) {
      console.log(`[AerialCache] Debounced - wait ${delayMs - (now - lastCall)}ms`);
      return null;
    }
    
    // Clear any pending timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    lastCall = now;
    return fn();
  };
}
