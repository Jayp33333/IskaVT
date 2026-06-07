export const CUSTOM_AMBIENT_NAME_KEY = "experience-custom-ambient-name";
export const DEFAULT_AMBIENT_SRC = "/audio/Background/background-music.mp3";

const DB_NAME = "iska-experience";
const DB_VERSION = 1;
const STORE_NAME = "custom-ambient";
const RECORD_KEY = "track";

type StoredAmbientTrack = {
  blob: Blob;
  name: string;
  type: string;
  updatedAt: number;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        const request = fn(store);

        request.onsuccess = () => resolve(request.result as T);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
        tx.onerror = () => reject(tx.error);
      }),
  );
}

export function readCustomAmbientTrackName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CUSTOM_AMBIENT_NAME_KEY);
}

export function writeCustomAmbientTrackName(name: string | null) {
  if (typeof window === "undefined") return;
  if (name) {
    localStorage.setItem(CUSTOM_AMBIENT_NAME_KEY, name);
  } else {
    localStorage.removeItem(CUSTOM_AMBIENT_NAME_KEY);
  }
}

export async function saveCustomAmbientFile(file: File): Promise<void> {
  const record: StoredAmbientTrack = {
    blob: file,
    name: file.name,
    type: file.type || "audio/mpeg",
    updatedAt: Date.now(),
  };

  await runTransaction("readwrite", (store) => store.put(record, RECORD_KEY));
  writeCustomAmbientTrackName(file.name);
}

export async function loadCustomAmbientFile(): Promise<StoredAmbientTrack | null> {
  try {
    const record = await runTransaction<StoredAmbientTrack | undefined>(
      "readonly",
      (store) => store.get(RECORD_KEY),
    );
    if (!record?.blob) return null;
    return record;
  } catch {
    return null;
  }
}

export async function clearCustomAmbientFile(): Promise<void> {
  await runTransaction("readwrite", (store) => store.delete(RECORD_KEY));
  writeCustomAmbientTrackName(null);
}

export function isAudioFile(file: File): boolean {
  if (file.type.startsWith("audio/")) return true;
  return /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(file.name);
}
