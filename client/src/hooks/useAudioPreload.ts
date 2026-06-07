import { useEffect } from "react";
import { audioManager } from "../services/AudioManager";

const AMBIENT_SRC = "/audio/Background/background-music.mp3";

function preloadExperienceAudio() {
  audioManager.load("welcome", "/audio/welcome.mp3", { category: "sfx" });
  audioManager.load("arrived", "/audio/arrived.mp3", { category: "sfx" });
  audioManager.load("teleported", "/audio/teleported.mp3", { category: "sfx" });
  audioManager.load("ambient", AMBIENT_SRC, {
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
