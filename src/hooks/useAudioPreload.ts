import { useEffect } from "react";
import { audioManager } from "../services/AudioManager";

export default function useAudioPreload() {
  useEffect(() => {
    audioManager.load("welcome", "/audio/welcome.mp3");
    audioManager.load("arrived", "/audio/arrived.mp3");
    audioManager.load("teleported", "/audio/teleported.mp3");
  }, []);
}
