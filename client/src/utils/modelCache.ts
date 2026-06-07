import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { isModelUrl } from "../data/modelRegistry";

const DB_NAME = "iska-model-cache-v1";
const STORE_NAME = "blobs";
const DRACO_DECODER_PATH =
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const blobCache = new Map<string, Promise<ArrayBuffer>>();
const preloadCache = new Map<string, Promise<void>>();

export function normalizeModelUrl(url: string): string {
  if (typeof window === "undefined") return url;

  try {
    return new URL(url, window.location.href).pathname;
  } catch {
    return url;
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

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

async function readBlob(key: string): Promise<ArrayBuffer | null> {
  if (typeof indexedDB === "undefined") return null;

  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve((request.result as ArrayBuffer | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

async function writeBlob(key: string, data: ArrayBuffer): Promise<void> {
  if (typeof indexedDB === "undefined") return;

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.objectStore(STORE_NAME).put(data, key);
    });
  } catch {
    // Best-effort cache; ignore storage quota or private-mode failures.
  }
}

export async function fetchModelBlob(url: string): Promise<ArrayBuffer> {
  const key = normalizeModelUrl(url);
  const cached = blobCache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const stored = await readBlob(key);
    if (stored) return stored;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch model: ${url}`);
    }

    const buffer = await response.arrayBuffer();
    void writeBlob(key, buffer);
    return buffer;
  })();

  blobCache.set(key, promise);
  return promise;
}

function parseModel(url: string, buffer: ArrayBuffer): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    gltfLoader.parse(
      buffer,
      normalizeModelUrl(url),
      resolve,
      reject,
    );
  });
}

export function preloadModel(url: string | undefined): Promise<void> {
  if (!url || !isModelUrl(url)) return Promise.resolve();

  const key = normalizeModelUrl(url);
  const cached = preloadCache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    if (/\.glb(\?.*)?$/i.test(url)) {
      useGLTF.preload(url);
      const buffer = await fetchModelBlob(url);
      await parseModel(url, buffer);
      return;
    }

    // VRM avatars are parsed by the runtime VRM loader; warm the byte cache only.
    await fetchModelBlob(url);
  })();

  preloadCache.set(key, promise);
  return promise;
}

export function preloadAllModels(urls: readonly string[]): Promise<void[]> {
  return Promise.all(urls.map((url) => preloadModel(url)));
}
