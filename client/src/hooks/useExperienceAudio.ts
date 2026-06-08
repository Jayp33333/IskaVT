import { useEffect } from "react";
import useWorld from "./useWorld";
import { audioManager } from "../services/AudioManager";

export function useExperienceAudio(experienceActive: boolean) {
  const masterEnabled = useWorld((s: any) => s.masterEnabled);
  const ambientVolume = useWorld((s: any) => s.ambientVolume);

  useEffect(() => {
    audioManager.configure({
      masterEnabled,
      ambientVolume,
    });
  }, [masterEnabled, ambientVolume]);

  useEffect(() => {
    audioManager.setAmbientActive(experienceActive && ambientVolume > 0);
    return () => audioManager.setAmbientActive(false);
  }, [experienceActive, ambientVolume]);
}
