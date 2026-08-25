/* ==========================================================================
   STORAGE ENGINE — (LocalStorage & IndexedDB)
   Handles persistent storage of user settings, liked songs, custom playlists,
   and custom uploaded audio blobs via IndexedDB.
   ========================================================================== */

const DB_NAME = "SpotifyCustomAppDB";
const DB_VERSION = 1;
const STORE_LOCAL_TRACKS = "local_tracks";

class StorageEngine {
  constructor() {
    this.db = null;
    this.initIndexedDB();
  }

  // Initialize IndexedDB for large audio blobs and custom tracks
  initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_LOCAL_TRACKS)) {
          db.createObjectStore(STORE_LOCAL_TRACKS, { keyPath: "id" });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = (e) => {
        console.warn("IndexedDB initialization error:", e);
        resolve(null);
      };
    });
  }

  // Save uploaded local track
  async saveLocalTrack(trackData) {
    if (!this.db) await this.initIndexedDB();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(false);
        return;
      }
      const transaction = this.db.transaction([STORE_LOCAL_TRACKS], "readwrite");
      const store = transaction.objectStore(STORE_LOCAL_TRACKS);
      const req = store.put(trackData);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  // Get all saved local tracks
  async getAllLocalTracks() {
    if (!this.db) await this.initIndexedDB();
    return new Promise((resolve) => {
      if (!this.db) {
        resolve([]);
        return;
      }
      const transaction = this.db.transaction([STORE_LOCAL_TRACKS], "readonly");
      const store = transaction.objectStore(STORE_LOCAL_TRACKS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  // Delete local track
  async deleteLocalTrack(id) {
    if (!this.db) await this.initIndexedDB();
    return new Promise((resolve) => {
      if (!this.db) return resolve(false);
      const transaction = this.db.transaction([STORE_LOCAL_TRACKS], "readwrite");
      const store = transaction.objectStore(STORE_LOCAL_TRACKS);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  // LocalStorage Helpers for Preferences & Lightweight State
  getItem(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(`spotify_custom_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn("LocalStorage read error:", e);
      return defaultValue;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(`spotify_custom_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("LocalStorage write error:", e);
    }
  }
}

export const storage = new StorageEngine();
