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
  showLogHistory: boolean;
  query: string;
  /** NPCs in range: id -> { position, onTalk }. Used for F-key interaction. */
  npcsInRange: Map<string, { position: Vector3; onTalk: () => void }>;
  /** Active NPC dialog shown as fixed overlay at bottom (WelcomeDialog style). */
  activeNPCDialog: {
    title: string;
    message: string;
    options?: { label: string; onClick: () => void }[];
    onClose: () => void;
  } | null;
  /** Door interactables for F-key (desktop). getPosition returns current world position. */
  doorInteractables: Map<
    string,
    {
      getPosition: () => Vector3;
      onOpen: () => void;
    }
  >;

  setAvatar: (avatar: any) => void;
  setActiveNPCDialog: (
    d: {
      title: string;
      message: string;
      options?: { label: string; onClick: () => void }[];
      onClose: () => void;
    } | null
  ) => void;
  registerNPCInRange: (id: string, position: Vector3, onTalk: () => void) => void;
  unregisterNPCInRange: (id: string) => void;
  triggerNearestNPCTalk: () => void;
  registerDoorInteractable: (
    id: string,
    d: {
      getPosition: () => Vector3;
      onOpen: () => void;
    }
  ) => void;
  unregisterDoorInteractable: (id: string) => void;
  triggerDoorOpen: () => void;
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
  setShowLogHistory: (value: boolean) => void;
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
  cameraMode: "first",
  selectedDestination: null,
  showMiniMap: false,
  showLogHistory: false,
  query: "",
  isLoading: false,
  loadingMessage: "",
  npcsInRange: new Map(),
  activeNPCDialog: null,
  doorInteractables: new Map(),

  setAvatar: (avatar) => set({ avatar }),
  setActiveNPCDialog: (activeNPCDialog) => set({ activeNPCDialog }),
  registerNPCInRange: (id, position, onTalk) =>
    set((s) => {
      const next = new Map(s.npcsInRange);
      next.set(id, { position: position.clone(), onTalk });
      return { npcsInRange: next };
    }),
  unregisterNPCInRange: (id) =>
    set((s) => {
      const next = new Map(s.npcsInRange);
      next.delete(id);
      return { npcsInRange: next };
    }),
  triggerNearestNPCTalk: () => {
    const { npcsInRange, characterPosition } = useWorld.getState();
    if (npcsInRange.size === 0 || !characterPosition) return;
    let nearest: { id: string; onTalk: () => void } | null = null;
    let minDist = Infinity;
    for (const [id, { position, onTalk }] of npcsInRange) {
      const d = position.distanceTo(characterPosition);
      if (d < minDist) {
        minDist = d;
        nearest = { id, onTalk };
      }
    }
    if (nearest) nearest.onTalk();
  },
  registerDoorInteractable: (id, door) =>
    set((s) => {
      const next = new Map(s.doorInteractables);
      next.set(id, door);
      return { doorInteractables: next };
    }),
  unregisterDoorInteractable: (id) =>
    set((s) => {
      const next = new Map(s.doorInteractables);
      next.delete(id);
      return { doorInteractables: next };
    }),
  triggerDoorOpen: () => {
    const { doorInteractables, characterPosition } = useWorld.getState();
    if (!doorInteractables || doorInteractables.size === 0 || !characterPosition) return;
    const DOOR_INTERACT_DISTANCE = 3;
    let nearest: { onOpen: () => void } | null = null;
    let minDist = Infinity;

    for (const { getPosition, onOpen } of doorInteractables.values()) {
      const pos = getPosition();
      const d = pos.distanceTo(characterPosition);
      if (d < DOOR_INTERACT_DISTANCE && d < minDist) {
        minDist = d;
        nearest = { onOpen };
      }
    }

    if (nearest) nearest.onOpen();
  },
  setCharacterPosition: (characterPosition) => set({ characterPosition }),
  setCharacterPositionOnFloorLabel: (characterPositionOnFloorLabel) =>
    set({ characterPositionOnFloorLabel }),
  setPinPosition: (pinPosition) => set({ pinPosition }),
  setIsPinConfirmed: (isPinConfirmed) => set({ isPinConfirmed }),
  setIsPinTeleported: (isPinTeleported) => set({ isPinTeleported }),
  setDistance: (distance) => set({ distance }),
  setCurrentZoom: (zoomChange) =>
    set((state) => ({
      currentZoom: Math.max(19, Math.min(400, state.currentZoom * zoomChange)), //currentZoom: Math.max(19, Math.min(160, state.currentZoom * zoomChange)),
    })),
  setCameraRotation: (cameraRotation) => set({ cameraRotation }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setSelectedDestination: (selectedDestination) => set({ selectedDestination }),
  setShowMiniMap: (showMiniMap) => set({ showMiniMap }),
  setShowLogHistory: (showLogHistory) => set({ showLogHistory }),
  setQuery: (query) => set({ query }),
  setLoading: (v, msg = "") =>
  set({ isLoading: v, loadingMessage: msg }),
}));

export default useWorld;
