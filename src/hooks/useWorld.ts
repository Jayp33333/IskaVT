import { create } from "zustand";
import { SAMPLE_AVATAR_LIST } from "../sampleData";
import { Vector3 } from "three";

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
  selectedDestination: any;
  showMiniMap: boolean;
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
  setSelectedDestination: (destination: any) => void;
  setShowMiniMap: (value: boolean) => void;
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
  selectedDestination: null,
  showMiniMap: false,
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
  setSelectedDestination: (selectedDestination) => set({ selectedDestination }),
  setShowMiniMap: (showMiniMap) => set({ showMiniMap }),
  setQuery: (query) => set({ query }),
  setLoading: (v, msg = "") =>
  set({ isLoading: v, loadingMessage: msg }),
}));

export default useWorld;
