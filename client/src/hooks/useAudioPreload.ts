import { useEffect } from "react";
import { audioManager } from "../services/AudioManager";
import { DEFAULT_AMBIENT_SRC } from "../utils/customAmbientMusic";

function preloadExperienceAudio() {
  audioManager.load("ambient", DEFAULT_AMBIENT_SRC, {
    category: "ambient",
    volume: 0.45,
    loop: true,
  });
}

if (typeof window !== "undefined") {
  preloadExperienceAudio();
}

export default function useAudioPreload() {
  useEffect(() => {
    preloadExperienceAudio();
  }, []);
}

