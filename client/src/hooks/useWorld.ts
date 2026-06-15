import { create } from "zustand";
import { SAMPLE_AVATAR_LIST } from "../sampleData";
import { Vector3 } from "three";
import {
  AMBIENT_VOLUME_KEY,
  MASTER_VOLUME_KEY,
  readAmbientVolume,
  readMasterEnabled,
} from "../utils/experienceAudioSettings";
import {
  clampSensitivityPercent,
  readSensitivityPreference,
  SENSITIVITY_STORAGE_KEY,
} from "../utils/experienceSensitivity";
import {
  DEFAULT_MOBILE_CONTROL_LAYOUT,
  readMobileControlLayout,
  saveMobileControlLayout,
  type MobileControlLayout,
} from "../utils/experienceMobileControls";
import { readCustomAmbientTrackName } from "../utils/customAmbientMusic";
import type { GuideSettingsTab } from "../data/campusGuideBook";
import {
  clampLightIntensityPercent,
  readLightIntensityPreference,
  readShadowsEnabledPreference,
  SHADOWS_ENABLED_KEY,
  LIGHT_INTENSITY_KEY,
} from "../utils/experienceLightingSettings";

const SHOW_FPS_KEY = "experience-show-fps";
const SHOW_CAMPUS_GRAPH_KEY = "experience-show-campus-graph";
const SHOW_CAMPUS_GRAPH_LABELS_KEY = "experience-show-campus-graph-labels";
const SHOW_CAMPUS_NODE_ADD_TOOL_KEY = "experience-show-campus-node-add-tool";

function readShowFpsPreference(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(SHOW_FPS_KEY);
  return stored === "true";
}

function readShowCampusGraphPreference(): boolean {
  if (typeof window === "undefined" || !import.meta.env.DEV) return false;
  const stored = localStorage.getItem(SHOW_CAMPUS_GRAPH_KEY);
  return stored === null ? true : stored === "true";
}

function readShowCampusGraphLabelsPreference(): boolean {
  if (typeof window === "undefined" || !import.meta.env.DEV) return false;
  const stored = localStorage.getItem(SHOW_CAMPUS_GRAPH_LABELS_KEY);
  return stored === null ? true : stored === "true";
}

function readShowCampusNodeAddToolPreference(): boolean {
  if (typeof window === "undefined" || !import.meta.env.DEV) return false;
  const stored = localStorage.getItem(SHOW_CAMPUS_NODE_ADD_TOOL_KEY);
  return stored === null ? false : stored === "true";
}

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
  selectedDestinationId: string | null;
  showMiniMap: boolean;
  showDestinationPicker: boolean;
  showLogHistory: boolean;
  showFeedback: boolean;
  map2DOpen: boolean;
  query: string;
  /** NPCs in range: id -> { position, onTalk, name }. Used for talk button and F-key. */
  npcsInRange: Map<string, { position: Vector3; onTalk: () => void; name: string }>;
  /** Active NPC dialog shown as fixed overlay at bottom (WelcomeDialog style). */
  activeNPCDialog: {
    title: string;
    message: string;
    voiceProfile?: "male" | "female";
    voicePitch?: number;
    voiceRate?: number;
    options?: { label: string; onClick: () => void }[];
    onClose: () => void;
  } | null;
  setAvatar: (avatar: any) => void;
  avatarSwapGeneration: number;
  avatarSwapReadyGeneration: number;
  markAvatarSwapReady: () => void;
  setActiveNPCDialog: (
    d: {
      title: string;
      message: string;
      voiceProfile?: "male" | "female";
      voicePitch?: number;
      voiceRate?: number;
      options?: { label: string; onClick: () => void }[];
      onClose: () => void;
    } | null
  ) => void;
  registerNPCInRange: (
    id: string,
    position: Vector3,
    onTalk: () => void,
    name: string,
  ) => void;
  unregisterNPCInRange: (id: string) => void;
  triggerNearestNPCTalk: () => void;
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
  setSelectedDestinationId: (id: string | null) => void;
  setShowMiniMap: (value: boolean) => void;
  setShowDestinationPicker: (value: boolean) => void;
  setShowLogHistory: (value: boolean) => void;
  setShowFeedback: (value: boolean) => void;
  setMap2DOpen: (value: boolean) => void;
  setQuery: (query: string) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  isLoading: boolean;
  loadingMessage: string;
  /** True while Alt is held to temporarily show the system cursor. */
  cursorRevealedByAlt: boolean;
  setCursorRevealedByAlt: (value: boolean) => void;
  /** True for 2s after reaching a destination — freezes movement for celebration. */
  isArrivalPaused: boolean;
  setIsArrivalPaused: (value: boolean) => void;
  /** Destination name shown in the arrival banner (Distance HUD area). */
  arrivalBannerDestination: string | null;
  setArrivalBannerDestination: (destination: string | null) => void;
  showFps: boolean;
  setShowFps: (value: boolean) => void;
  showCampusGraph: boolean;
  setShowCampusGraph: (value: boolean) => void;
  showCampusGraphLabels: boolean;
  setShowCampusGraphLabels: (value: boolean) => void;
  showCampusNodeAddTool: boolean;
  setShowCampusNodeAddTool: (value: boolean) => void;
  sensitivity: number;
  setSensitivity: (value: number) => void;
  masterEnabled: boolean;
  setMasterEnabled: (value: boolean) => void;
  ambientVolume: number;
  setAmbientVolume: (value: number) => void;
  customAmbientTrackName: string | null;
  setCustomAmbientTrackName: (name: string | null) => void;
  mobileControlLayout: MobileControlLayout;
  setMobileControlLayout: (layout: MobileControlLayout) => void;
  resetMobileControlLayout: () => void;
  mobileControlsCustomize: boolean;
  setMobileControlsCustomize: (value: boolean) => void;
  lightIntensity: number;
  setLightIntensity: (value: number) => void;
  shadowsEnabled: boolean;
  setShadowsEnabled: (value: boolean) => void;
  tourCoachOpen: boolean;
  guideBookOpen: boolean;
  guideBookFocus: { categoryId?: string; articleId?: string } | null;
  tourCoachInitialStep: number;
  tourCoachSingleStep: boolean;
  openTourCoachFull: () => void;
  openTourCoachStep: (stepIndex: number) => void;
  openGuideBook: (focus?: { categoryId?: string; articleId?: string }) => void;
  closeGuideBook: () => void;
  closeTourCoach: () => void;
  settingsOpenRequest: number;
  settingsOpenTab: GuideSettingsTab | null;
  requestOpenSettings: (tab?: GuideSettingsTab) => void;
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
  selectedDestinationId: null,
  showMiniMap: false,
  showDestinationPicker: false,
  showLogHistory: false,
  showFeedback: false,
  map2DOpen: false,
  query: "",
  isLoading: false,
  loadingMessage: "",
  cursorRevealedByAlt: false,
  isArrivalPaused: false,
  arrivalBannerDestination: null,
  showFps: readShowFpsPreference(),
  showCampusGraph: readShowCampusGraphPreference(),
  showCampusGraphLabels: readShowCampusGraphLabelsPreference(),
  showCampusNodeAddTool: readShowCampusNodeAddToolPreference(),
  sensitivity: readSensitivityPreference(),
  masterEnabled: readMasterEnabled(),
  ambientVolume: readAmbientVolume(),
  customAmbientTrackName: readCustomAmbientTrackName(),
  mobileControlLayout: readMobileControlLayout(),
  mobileControlsCustomize: false,
  lightIntensity: readLightIntensityPreference(),
  shadowsEnabled: readShadowsEnabledPreference(),
  tourCoachOpen: false,
  guideBookOpen: false,
  guideBookFocus: null,
  tourCoachInitialStep: 0,
  tourCoachSingleStep: false,
  settingsOpenRequest: 0,
  settingsOpenTab: null,
  npcsInRange: new Map(),
  activeNPCDialog: null,
  avatarSwapGeneration: 0,
  avatarSwapReadyGeneration: 0,

  setAvatar: (avatar) =>
    set((state) => ({
      avatar,
      avatarSwapGeneration: state.avatarSwapGeneration + 1,
    })),
  markAvatarSwapReady: () =>
    set((state) => ({
      avatarSwapReadyGeneration: state.avatarSwapGeneration,
    })),
  setActiveNPCDialog: (activeNPCDialog) => set({ activeNPCDialog }),
  registerNPCInRange: (id, position, onTalk, name) =>
    set((s) => {
      const next = new Map(s.npcsInRange);
      next.set(id, { position: position.clone(), onTalk, name });
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
  setCharacterPosition: (characterPosition) =>
    set((state) =>
      state.characterPosition === characterPosition ? state : { characterPosition }
    ),
  setCharacterPositionOnFloorLabel: (characterPositionOnFloorLabel) =>
    set((state) => {
      const prev = state.characterPositionOnFloorLabel;
      if (
        prev.x === characterPositionOnFloorLabel.x &&
        prev.y === characterPositionOnFloorLabel.y &&
        prev.z === characterPositionOnFloorLabel.z
      ) {
        return state;
      }
      return { characterPositionOnFloorLabel };
    }),
  setPinPosition: (pinPosition) => set({ pinPosition }),
  setIsPinConfirmed: (isPinConfirmed) => set({ isPinConfirmed }),
  setIsPinTeleported: (isPinTeleported) => set({ isPinTeleported }),
  setDistance: (distance) =>
    set((state) => {
      const rounded = Math.max(0, Math.round(distance));
      const prevRounded = Math.max(0, Math.round(state.distance));
      if (
        rounded === prevRounded &&
        Number.isFinite(state.distance) &&
        Number.isFinite(distance)
      ) {
        return state;
      }
      return { distance };
    }),
  setCurrentZoom: (zoomChange) =>
    set((state) => ({
      currentZoom: Math.max(19, Math.min(400, state.currentZoom * zoomChange)), //currentZoom: Math.max(19, Math.min(160, state.currentZoom * zoomChange)),
    })),
  setCameraRotation: (cameraRotation) =>
    set((state) => {
      const prev = state.cameraRotation;
      if (
        prev.x === cameraRotation.x &&
        prev.y === cameraRotation.y &&
        prev.z === cameraRotation.z
      ) {
        return state;
      }
      return { cameraRotation };
    }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setSelectedDestination: (selectedDestination) => set({ selectedDestination }),
  setSelectedDestinationId: (selectedDestinationId) => set({ selectedDestinationId }),
  setShowMiniMap: (showMiniMap) => set({ showMiniMap }),
  setShowDestinationPicker: (showDestinationPicker) =>
    set((state) =>
      state.showDestinationPicker === showDestinationPicker
        ? state
        : { showDestinationPicker }
    ),
  setShowLogHistory: (showLogHistory) => set({ showLogHistory }),
  setShowFeedback: (showFeedback) => set({ showFeedback }),
  setMap2DOpen: (map2DOpen) =>
    set((state) => (state.map2DOpen === map2DOpen ? state : { map2DOpen })),
  setQuery: (query) => set({ query }),
  setLoading: (v, msg = "") =>
  set({ isLoading: v, loadingMessage: msg }),
  setCursorRevealedByAlt: (cursorRevealedByAlt) => set({ cursorRevealedByAlt }),
  setIsArrivalPaused: (isArrivalPaused) => set({ isArrivalPaused }),
  setArrivalBannerDestination: (arrivalBannerDestination) =>
    set({ arrivalBannerDestination }),
  setShowFps: (showFps) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SHOW_FPS_KEY, String(showFps));
    }
    set({ showFps });
  },
  setShowCampusGraph: (showCampusGraph) => {
    if (typeof window !== "undefined" && import.meta.env.DEV) {
      localStorage.setItem(SHOW_CAMPUS_GRAPH_KEY, String(showCampusGraph));
    }
    set({ showCampusGraph });
  },
  setShowCampusGraphLabels: (showCampusGraphLabels) => {
    if (typeof window !== "undefined" && import.meta.env.DEV) {
      localStorage.setItem(
        SHOW_CAMPUS_GRAPH_LABELS_KEY,
        String(showCampusGraphLabels),
      );
    }
    set({ showCampusGraphLabels });
  },
  setShowCampusNodeAddTool: (showCampusNodeAddTool) => {
    if (typeof window !== "undefined" && import.meta.env.DEV) {
      localStorage.setItem(
        SHOW_CAMPUS_NODE_ADD_TOOL_KEY,
        String(showCampusNodeAddTool),
      );
    }
    set({ showCampusNodeAddTool });
  },
  setSensitivity: (sensitivity) => {
    const clamped = clampSensitivityPercent(sensitivity);
    if (typeof window !== "undefined") {
      localStorage.setItem(SENSITIVITY_STORAGE_KEY, String(clamped));
    }
    set({ sensitivity: clamped });
  },
  setMasterEnabled: (masterEnabled) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(MASTER_VOLUME_KEY, String(masterEnabled));
    }
    set({ masterEnabled });
  },
  setAmbientVolume: (ambientVolume) => {
    const clamped = Math.max(0, Math.min(100, Math.round(ambientVolume)));
    if (typeof window !== "undefined") {
      localStorage.setItem(AMBIENT_VOLUME_KEY, String(clamped));
    }
    set({ ambientVolume: clamped });
  },
  setCustomAmbientTrackName: (customAmbientTrackName) =>
    set({ customAmbientTrackName }),
  setMobileControlLayout: (mobileControlLayout) => {
    saveMobileControlLayout(mobileControlLayout);
    set({ mobileControlLayout });
  },
  resetMobileControlLayout: () => {
    saveMobileControlLayout(DEFAULT_MOBILE_CONTROL_LAYOUT);
    set({ mobileControlLayout: DEFAULT_MOBILE_CONTROL_LAYOUT });
  },
  setMobileControlsCustomize: (mobileControlsCustomize) => set({ mobileControlsCustomize }),
  setLightIntensity: (lightIntensity) => {
    const clamped = clampLightIntensityPercent(lightIntensity);
    if (typeof window !== "undefined") {
      localStorage.setItem(LIGHT_INTENSITY_KEY, String(clamped));
    }
    set({ lightIntensity: clamped });
  },
  setShadowsEnabled: (shadowsEnabled) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SHADOWS_ENABLED_KEY, String(shadowsEnabled));
    }
    set({ shadowsEnabled });
  },
  openTourCoachFull: () =>
    set({
      tourCoachOpen: true,
      guideBookOpen: false,
      guideBookFocus: null,
      tourCoachInitialStep: 0,
      tourCoachSingleStep: false,
    }),
  openTourCoachStep: (stepIndex) =>
    set({
      tourCoachOpen: true,
      guideBookOpen: false,
      guideBookFocus: null,
      tourCoachInitialStep: Math.max(0, stepIndex),
      tourCoachSingleStep: true,
    }),
  openGuideBook: (focus) =>
    set({
      guideBookOpen: true,
      guideBookFocus: focus ?? null,
      tourCoachOpen: false,
    }),
  closeGuideBook: () =>
    set({
      guideBookOpen: false,
      guideBookFocus: null,
    }),
  closeTourCoach: () =>
    set({
      tourCoachOpen: false,
      guideBookOpen: false,
      guideBookFocus: null,
    }),
  requestOpenSettings: (tab) =>
    set((state) => ({
      settingsOpenRequest: state.settingsOpenRequest + 1,
      settingsOpenTab: tab ?? null,
    })),
}));

export default useWorld;
