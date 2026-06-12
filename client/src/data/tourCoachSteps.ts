export type CoachPlacement =
  | "center"
  | "below"
  | "above"
  | "right"
  | "left"
  | "above-right"
  | "above-left";

export type CoachDemo = "joystick" | "jump" | "wasd" | "mouse" | "drag" | "tap";

export type TourCoachStep = {
  id: string;
  title: string;
  body: string;
  /** CSS selector for the HUD element to highlight */
  target?: string;
  placement?: CoachPlacement;
  demo?: CoachDemo;
  padding?: number;
  /** Re-poll for target (VIVERSE controls mount async) */
  pollTarget?: boolean;
  /** Open the expanded Map2D modal while this step is active */
  openMap?: boolean;
  /** Show a sample custom pin on the map (for teleport / remove demo) */
  mapDemoPin?: boolean;
};

const mobileSteps: TourCoachStep[] = [
  {
    id: "welcome",
    title: "Welcome to PUP Lopez!",
    body: "I'm ISKA — I'll point out the controls on screen. Tap Next and follow the arrows.",
    placement: "center",
  },
  {
    id: "toolbar",
    title: "Meet Your Toolbar",
    body: "This toolbar holds everything — avatar, settings, destinations, guide, visit history, and feedback. Tap the book icon anytime to replay this tour.",
    target: '[data-tour="toolbar"]',
    placement: "below",
    padding: 8,
  },
  {
    id: "avatar",
    title: "Switch Avatar",
    body: "Tap your portrait to open the avatar list. Choose ISKA, ISKO, or another character — your in-game guide updates to match.",
    target: '[data-tour="avatar"]',
    placement: "below",
    padding: 6,
    demo: "tap",
  },
  {
    id: "settings",
    title: "Settings",
    body: "Tap the gear icon to change camera view, sensitivity, volume, and mobile control layout.",
    target: '[data-tour="settings"]',
    placement: "below",
    padding: 6,
    demo: "tap",
  },
  {
    id: "destinations",
    title: "Pick a Building",
    body: "Tap the pin icon to search campus buildings. Select one and a waypoint guides you there.",
    target: '[data-tour="destinations"]',
    placement: "below",
    padding: 6,
    demo: "tap",
  },
  {
    id: "logbook",
    title: "Visit History",
    body: "Tap the scroll icon to review past tours on this device, see visit times, and check out when you leave.",
    target: '[data-tour="logbook"]',
    placement: "below",
    padding: 6,
    demo: "tap",
  },
  {
    id: "feedback",
    title: "Share Feedback",
    body: "Tap the chat bubble to rate your tour and send comments that help us improve the campus guide.",
    target: '[data-tour="feedback"]',
    placement: "below",
    padding: 6,
    demo: "tap",
  },
  {
    id: "joystick",
    title: "Move Around",
    body: "Drag the joystick to walk. Push in any direction — your character follows.",
    target: ".viverse-joystick",
    placement: "above-right",
    padding: 10,
    demo: "joystick",
    pollTarget: true,
  },
  {
    id: "look",
    title: "Look Around",
    body: "Drag anywhere on the screen (away from buttons) to turn the camera and scan the campus.",
    placement: "center",
    demo: "drag",
  },
  {
    id: "jump",
    title: "Jump",
    body: "Tap the arrow button to hop over small obstacles.",
    target: ".viverse-button.viverse-jump",
    placement: "above-left",
    padding: 10,
    demo: "jump",
    pollTarget: true,
  },
  {
    id: "minimap",
    title: "Campus Map",
    body: "Tap the live map preview in the corner to open the full campus map.",
    target: '[data-tour="minimap"]',
    placement: "below",
    padding: 8,
  },
  {
    id: "map-fixed-locations",
    title: "Campus Landmarks",
    body: "Tap a blue pin on the map — like Administration Building — to see details and teleport there instantly.",
    target: '[data-tour="map-fixed-pin"]',
    placement: "above",
    padding: 18,
    demo: "tap",
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-zoom-in",
    title: "Zoom In",
    body: "Tap + to zoom closer. You can also pinch the map or scroll with two fingers.",
    target: '[data-tour="map-zoom-in"]',
    placement: "left",
    padding: 8,
    demo: "tap",
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-zoom-out",
    title: "Zoom Out",
    body: "Tap − to zoom back out and see more of the campus.",
    target: '[data-tour="map-zoom-out"]',
    placement: "left",
    padding: 8,
    demo: "tap",
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-reset-view",
    title: "Full Map View",
    body: "Tap the expand icon to reset zoom and pan — jump back to the full campus view anytime.",
    target: '[data-tour="map-reset-view"]',
    placement: "left",
    padding: 8,
    demo: "tap",
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-drop-pin",
    title: "Drop a Pin",
    body: "Tap anywhere on the campus image to place a custom yellow pin. Drag the map to pan when zoomed in.",
    target: '[data-tour="map-drop-area"]',
    placement: "center",
    padding: 12,
    demo: "tap",
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-pin-actions",
    title: "Teleport or Remove",
    body: "After placing a pin, tap Teleport to jump there instantly, or Remove Pin to clear it.",
    target: '[data-tour="map-pin-actions"]',
    placement: "above",
    padding: 8,
    demo: "tap",
    pollTarget: true,
    openMap: true,
    mapDemoPin: true,
  },
  {
    id: "finish",
    title: "You're Ready!",
    body: "Pin a destination and start exploring. Area Info appears when you walk near buildings.",
    placement: "center",
  },
];

const desktopSteps: TourCoachStep[] = [
  {
    id: "welcome",
    title: "Welcome to PUP Lopez!",
    body: "I'm ISKA — I'll point out the controls on screen. Click Next and follow the arrows.",
    placement: "center",
  },
  {
    id: "toolbar",
    title: "Meet Your Toolbar",
    body: "This toolbar holds everything — avatar, settings, destinations, guide, visit history, and feedback. Click the book icon anytime to replay this tour.",
    target: '[data-tour="toolbar"]',
    placement: "below",
    padding: 8,
  },
  {
    id: "avatar",
    title: "Switch Avatar",
    body: "Click your portrait to open the avatar list. Choose ISKA, ISKO, or another character — your in-game guide updates to match.",
    target: '[data-tour="avatar"]',
    placement: "below",
    padding: 6,
  },
  {
    id: "settings",
    title: "Settings",
    body: "Click the gear icon to change camera view, mouse sensitivity, volume, and other tour options.",
    target: '[data-tour="settings"]',
    placement: "below",
    padding: 6,
  },
  {
    id: "destinations",
    title: "Pick a Building",
    body: "Click the pin icon to search campus buildings. Select one and a distance tracker guides you.",
    target: '[data-tour="destinations"]',
    placement: "below",
    padding: 6,
  },
  {
    id: "logbook",
    title: "Visit History",
    body: "Click the scroll icon to review past tours on this device, see visit times, and check out when you leave.",
    target: '[data-tour="logbook"]',
    placement: "below",
    padding: 6,
  },
  {
    id: "feedback",
    title: "Share Feedback",
    body: "Click the chat bubble to rate your tour and send comments that help us improve the campus guide.",
    target: '[data-tour="feedback"]',
    placement: "below",
    padding: 6,
  },
  {
    id: "wasd",
    title: "Walk",
    body: "Use WASD or arrow keys to move. Hold Shift to sprint.",
    placement: "center",
    demo: "wasd",
  },
  {
    id: "mouse",
    title: "Look Around",
    body: "Move the mouse to turn the camera. Click the campus to lock the cursor. Press Alt to free it for menus.",
    placement: "center",
    demo: "mouse",
  },
  {
    id: "minimap",
    title: "Campus Map",
    body: "Click the live map preview or press M to open the full campus map.",
    target: '[data-tour="minimap"]',
    placement: "below",
    padding: 8,
  },
  {
    id: "map-fixed-locations",
    title: "Campus Landmarks",
    body: "Click a blue pin on the map — like Administration Building — to see details and teleport there instantly.",
    target: '[data-tour="map-fixed-pin"]',
    placement: "above",
    padding: 18,
    demo: "tap",
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-zoom-in",
    title: "Zoom In",
    body: "Click + to zoom closer. You can also scroll the mouse wheel over the map.",
    target: '[data-tour="map-zoom-in"]',
    placement: "left",
    padding: 8,
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-zoom-out",
    title: "Zoom Out",
    body: "Click − to zoom back out and see more of the campus.",
    target: '[data-tour="map-zoom-out"]',
    placement: "left",
    padding: 8,
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-reset-view",
    title: "Full Map View",
    body: "Click the expand icon to reset zoom and pan — return to the full campus view anytime.",
    target: '[data-tour="map-reset-view"]',
    placement: "left",
    padding: 8,
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-drop-pin",
    title: "Drop a Pin",
    body: "Click anywhere on the campus image to place a custom yellow pin. Drag the map to pan when zoomed in.",
    target: '[data-tour="map-drop-area"]',
    placement: "center",
    padding: 12,
    pollTarget: true,
    openMap: true,
  },
  {
    id: "map-pin-actions",
    title: "Teleport or Remove",
    body: "After placing a pin, click Teleport to jump there instantly, or Remove Pin to clear it.",
    target: '[data-tour="map-pin-actions"]',
    placement: "above",
    padding: 8,
    pollTarget: true,
    openMap: true,
    mapDemoPin: true,
  },
  {
    id: "finish",
    title: "You're Ready!",
    body: "Pin a destination and start exploring. Press F near NPCs to talk. Area Info appears near buildings.",
    placement: "center",
  },
];

export function getTourCoachSteps(isMobile: boolean): TourCoachStep[] {
  return isMobile ? mobileSteps : desktopSteps;
}

export type TourCoachMenuItem = {
  stepIndex: number;
  id: string;
  label: string;
  hint: string;
};

const MENU_SKIP_IDS = new Set(["welcome", "finish"]);

/** Spoken narration for a coach step (ISKA voice-over). */
export function getTourCoachStepTts(step: TourCoachStep): string {
  return `${step.title}. ${step.body}`.replace(/\bWASD\b/g, "W A S D");
}

export function getTourCoachMenuItems(isMobile: boolean): TourCoachMenuItem[] {
  return getTourCoachSteps(isMobile)
    .map((step, stepIndex) => ({ step, stepIndex }))
    .filter(({ step }) => !MENU_SKIP_IDS.has(step.id))
    .map(({ step, stepIndex }) => ({
      stepIndex,
      id: step.id,
      label: step.title,
      hint: step.body,
    }));
}
