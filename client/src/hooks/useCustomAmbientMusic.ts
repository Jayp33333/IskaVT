import { useEffect } from "react";
import { audioManager } from "../services/AudioManager";
import useWorld from "./useWorld";
import {
  clearCustomAmbientFile,
  DEFAULT_AMBIENT_SRC,
  isAudioFile,
  loadCustomAmbientFile,
  saveCustomAmbientFile,
} from "../utils/customAmbientMusic";

function loadDefaultAmbient() {
  if (audioManager.hasAmbientSource()) return;
  audioManager.load("ambient", DEFAULT_AMBIENT_SRC, {
    category: "ambient",
    volume: 0.45,
    loop: true,
  });
}

export function useCustomAmbientMusic() {
  const setCustomAmbientTrackName = useWorld((s) => s.setCustomAmbientTrackName);

  useEffect(() => {
    let cancelled = false;

    const restoreCustomTrack = async () => {
      const stored = await loadCustomAmbientFile();
      if (cancelled) return;

      if (!stored) {
        setCustomAmbientTrackName(null);
        loadDefaultAmbient();
        return;
      }

      const objectUrl = URL.createObjectURL(stored.blob);
      audioManager.setAmbientSource(objectUrl, {
        volume: 0.45,
        loop: true,
        isObjectUrl: true,
      });
      setCustomAmbientTrackName(stored.name);
    };

    void restoreCustomTrack();

    return () => {
      cancelled = true;
    };
  }, [setCustomAmbientTrackName]);
}

export async function applyDefaultAmbientMusic() {
  await clearCustomAmbientFile();
  audioManager.setAmbientSource(DEFAULT_AMBIENT_SRC, { volume: 0.45, loop: true });
  useWorld.getState().setCustomAmbientTrackName(null);
}

export async function applyCustomAmbientMusic(file: File) {
  if (!isAudioFile(file)) {
    throw new Error("Please choose an audio file (MP3, WAV, M4A, etc.).");
  }

  await saveCustomAmbientFile(file);
  const objectUrl = URL.createObjectURL(file);
  audioManager.setAmbientSource(objectUrl, {
    volume: 0.45,
    loop: true,
    isObjectUrl: true,
  });
  useWorld.getState().setCustomAmbientTrackName(file.name);
}
