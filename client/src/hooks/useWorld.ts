import { create } from "zustand";
import { SAMPLE_AVATAR_LIST } from "../sampleData";
import { Vector3 } from "three";

const CAMERA_SENSITIVITY_KEY = "cameraSensitivity";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const getInitialCameraSensitivity = () => {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem(CAMERA_SENSITIVITY_KEY);
  const parsed = raw == null ? NaN : Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) return 1;
  return clamp(parsed, 0.2, 3);
};

interface WorldState {
  avatar: any;
  characterPosition: Vector3;
  characterPositionOnFloorLabel: Vector3;
  pinPosition: Vector3 | null;
  isPinConfirmed: boolean;
  isPinTeleported: boolean;
  distance: number;
  currentZoom: number;
  cameraRotation: Vector3;
  cameraMode: "first" | "third";
  cameraSensitivity: number;
  selectedDestination: any;
  showMiniMap: boolean;
  showLogHistory: boolean;
  showSettings: boolean;
  query: string;

  setAvatar: (avatar: any) => void;
  setCharacterPosition: (position: Vector3) => void;
  setCharacterPositionOnFloorLabel: (position: Vector3) => void;
  setPinPosition: (position: Vector3 | null) => void;
  setIsPinConfirmed: (value: boolean) => void;
  setIsPinTeleported: (value: boolean) => void;
  setDistance: (distance: number) => void;
  setCurrentZoom: (zoomChange: number) => void;
  setCameraRotation: (rotation: Vector3) => void;
  setCameraMode: (mode: "first" | "third") => void;
  setCameraSensitivity: (value: number) => void;
  setSelectedDestination: (destination: any) => void;
  setShowMiniMap: (value: boolean) => void;
  setShowLogHistory: (value: boolean) => void;
  setShowSettings: (value: boolean) => void;
  setQuery: (query: string) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  isLoading: boolean;
  loadingMessage: string;
}

const useWorld = create<WorldState>((set) => ({
  avatar: SAMPLE_AVATAR_LIST[0],
  characterPosition: new Vector3(0, 0, 0),
  characterPositionOnFloorLabel: new Vector3(0, 0, 0),
  pinPosition: null,
  isPinConfirmed: false,
  isPinTeleported: false,
  distance: 0,
  currentZoom: 100,
  cameraRotation: new Vector3(0, 0, 0),
  cameraMode: "third",
  cameraSensitivity: getInitialCameraSensitivity(),
  selectedDestination: null,
  showMiniMap: false,
  showLogHistory: false,
  showSettings: false,
  query: "",
  isLoading: false,
  loadingMessage: "",

  setAvatar: (avatar) => set({ avatar }),
  setCharacterPosition: (characterPosition) => set({ characterPosition }),
  setCharacterPositionOnFloorLabel: (characterPositionOnFloorLabel) =>
    set({ characterPositionOnFloorLabel }),
  setPinPosition: (pinPosition) => set({ pinPosition }),
  setIsPinConfirmed: (isPinConfirmed) => set({ isPinConfirmed }),
  setIsPinTeleported: (isPinTeleported) => set({ isPinTeleported }),
  setDistance: (distance) => set({ distance }),
  setCurrentZoom: (zoomChange) =>
    set((state) => ({
      currentZoom: Math.max(19, Math.min(100, state.currentZoom * zoomChange)),
    })),
  setCameraRotation: (cameraRotation) => set({ cameraRotation }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setCameraSensitivity: (value) => {
    const next = clamp(value, 0.2, 3);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CAMERA_SENSITIVITY_KEY, String(next));
    }
    set({ cameraSensitivity: next });
  },
  setSelectedDestination: (selectedDestination) => set({ selectedDestination }),
  setShowMiniMap: (showMiniMap) => set({ showMiniMap }),
  setShowLogHistory: (showLogHistory) => set({ showLogHistory }),
  setShowSettings: (showSettings) => set({ showSettings }),
  setQuery: (query) => set({ query }),
  setLoading: (v, msg = "") =>
  set({ isLoading: v, loadingMessage: msg }),
}));

export default useWorld;
