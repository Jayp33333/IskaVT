import { useGLTF, useProgress } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { audioManager } from "../../services/AudioManager";

const MODELS = [
  "./models/PUP_CAMPUS.glb",
  "/models/avatars/guard.glb",
  "/models/avatars/professor1.glb",
] as const;

const AUDIO = [
  { key: "welcome", src: "/audio/welcome.mp3" },
  { key: "arrived", src: "/audio/arrived.mp3" },
  { key: "teleported", src: "/audio/teleported.mp3" },
] as const;

type AssetLoadProgressProps = {
  onProgress: (progress: number) => void;
  onComplete: () => void;
};

function getModelProgress(
  progress: number,
  active: boolean,
  hasStarted: boolean
) {
  if (active) return progress;
  if (hasStarted) return 100;
  return 0;
}

function combineProgress(modelPart: number, audioProgress: number) {
  return Math.min(
    100,
    Math.max(0, Math.round(modelPart * 0.85 + audioProgress * 0.15))
  );
}

export function AssetLoadProgress({
  onProgress,
  onComplete,
}: AssetLoadProgressProps) {
  const { progress: modelProgress, active: modelsLoading } = useProgress();
  const audioProgressRef = useRef(0);
  const modelsStartedRef = useRef(false);
  const preloadStartedRef = useRef(false);
  const completedRef = useRef(false);
  const callbacksRef = useRef({ onProgress, onComplete });

  callbacksRef.current = { onProgress, onComplete };

  if (modelsLoading) {
    modelsStartedRef.current = true;
  }

  const report = () => {
    const modelPart = getModelProgress(
      modelProgress,
      modelsLoading,
      modelsStartedRef.current
    );
    const combined = combineProgress(modelPart, audioProgressRef.current);
    callbacksRef.current.onProgress(combined);

    const modelsDone = modelsStartedRef.current && !modelsLoading;
    const audioDone = audioProgressRef.current >= 100;

    if (modelsDone && audioDone && !completedRef.current) {
      completedRef.current = true;
      callbacksRef.current.onComplete();
    }
  };

  useEffect(() => {
    if (preloadStartedRef.current) return;
    preloadStartedRef.current = true;
    MODELS.forEach((path) => useGLTF.preload(path));
  }, []);

  useEffect(() => {
    let loaded = 0;
    const total = AUDIO.length;

    const markAudioLoaded = () => {
      loaded += 1;
      audioProgressRef.current = Math.round((loaded / total) * 100);
      report();
    };

    AUDIO.forEach(({ key, src }) => {
      audioManager.load(key, src);

      const audio = new Audio(src);
      audio.addEventListener("canplaythrough", markAudioLoaded, { once: true });
      audio.addEventListener("error", markAudioLoaded, { once: true });
      audio.load();
    });
  }, []);

  useEffect(() => {
    report();
  }, [modelProgress, modelsLoading]);

  return null;
}
