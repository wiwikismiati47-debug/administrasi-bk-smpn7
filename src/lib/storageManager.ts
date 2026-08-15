// Robust Storage Manager with IndexedDB + Safe LocalStorage Fallback & In-Memory Cache
// Prevents QuotaExceededError in browser localStorage for large data and images.

const DB_NAME = 'bk_smpn7_indexeddb';
const DB_VERSION = 1;
const STORE_NAME = 'keyval_store';

// In-memory synchronous cache
const memoryCache = new Map<string, unknown>();

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        console.warn('IndexedDB gagal dibuka, fallback ke localStorage/memory cache.');
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

// Asynchronously store data in IndexedDB
export async function setIDB(key: string, value: unknown): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

// Asynchronously get data from IndexedDB
export async function getIDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          resolve((req.result as T) ?? null);
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

// Strip large base64 image strings from items to save localStorage space if needed
function stripHeavyBase64Images(data: unknown): unknown {
  if (!data) return data;
  try {
    const str = JSON.stringify(data);
    // If payload is reasonably small (< 500KB), return as is
    if (str.length < 500 * 1024) {
      return data;
    }

    // Otherwise clone and strip heavy base64 fields for the localStorage copy
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (item && typeof item === 'object') {
          const cloned: Record<string, unknown> = { ...item };
          if (typeof cloned.link_foto_kegiatan === 'string' && cloned.link_foto_kegiatan.startsWith('data:image/')) {
            cloned.link_foto_kegiatan = ''; // Strip for localStorage copy, retained in IndexedDB & Memory
          }
          if (typeof cloned.signature_data === 'string' && cloned.signature_data.startsWith('data:image/')) {
            cloned.signature_data = '';
          }
          return cloned;
        }
        return item;
      });
    }
    return data;
  } catch {
    return data;
  }
}

/**
 * Safe LocalStorage setter with QuotaExceededError protection and automatic payload compression/stripping.
 */
export function safeSetStorage<T>(key: string, value: T): void {
  // 1. Update in-memory cache immediately
  memoryCache.set(key, value);

  // 2. Asynchronously persist full data (with all high-res photos & signatures) to IndexedDB
  setIDB(key, value).catch(() => {});

  // 3. Persist to localStorage safely with error handling
  try {
    const jsonStr = JSON.stringify(value);
    // If under 1MB, try normal save
    if (jsonStr.length < 1024 * 1024) {
      localStorage.setItem(key, jsonStr);
      return;
    }

    // If large, strip base64 images for localStorage to stay well below 5MB browser quota
    const lightweightValue = stripHeavyBase64Images(value);
    localStorage.setItem(key, JSON.stringify(lightweightValue));
  } catch (err: unknown) {
    // QuotaExceededError caught gracefully
    console.warn(`[StorageManager] localStorage quota exceeded for key "${key}". Data is safely retained in IndexedDB & memory.`);
    try {
      // Try emergency trimmed save (top 20 items only without images)
      if (Array.isArray(value)) {
        const topSlice = value.slice(0, 20);
        const lightweightSlice = stripHeavyBase64Images(topSlice);
        localStorage.setItem(key, JSON.stringify(lightweightSlice));
      }
    } catch {
      // If still failing, do not throw - in-memory and IndexedDB hold the true copy
    }
  }
}

/**
 * Synchronously retrieves data from in-memory cache or localStorage.
 */
export function safeGetStorage<T>(key: string, defaultValue: T): T {
  // 1. Check in-memory cache first
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  // 2. Read from localStorage
  try {
    const str = localStorage.getItem(key);
    if (str) {
      const parsed = JSON.parse(str) as T;
      memoryCache.set(key, parsed);
      return parsed;
    }
  } catch (e) {
    console.warn(`[StorageManager] Gagal membaca key "${key}" dari localStorage:`, e);
  }

  // 3. Set default in memory and return
  memoryCache.set(key, defaultValue);
  return defaultValue;
}

/**
 * Initialize storage on app startup: pre-populates in-memory cache from IndexedDB
 * so high-resolution photos and complete offline data are available immediately.
 */
export async function initStorageKeys(keys: string[]): Promise<void> {
  for (const key of keys) {
    try {
      const idbVal = await getIDB(key);
      if (idbVal !== null && idbVal !== undefined) {
        memoryCache.set(key, idbVal);
      }
    } catch {
      // ignore
    }
  }
}
