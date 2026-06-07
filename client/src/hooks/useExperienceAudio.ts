import { useEffect } from "react";
import useWorld from "./useWorld";
import { audioManager } from "../services/AudioManager";

export function useExperienceAudio(experienceActive: boolean) {
  const masterVolume = useWorld((s: any) => s.masterVolume);
  const sfxEnabled = useWorld((s: any) => s.sfxEnabled);
  const ambientEnabled = useWorld((s: any) => s.ambientEnabled);

  useEffect(() => {
    audioManager.configure({
      masterVolume,
      sfxEnabled,
      ambientEnabled,
    });
  }, [masterVolume, sfxEnabled, ambientEnabled]);

  useEffect(() => {
    audioManager.setAmbientActive(experienceActive && ambientEnabled);
    return () => audioManager.setAmbientActive(false);
  }, [experienceActive, ambientEnabled]);
}
