import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Gauge,
  Headphones,
  Monitor,
  MousePointer2,
  Move,
  Music,
  RotateCcw,
  MapPinPlus,
  Route,
  Settings,
  Tags,
  SlidersHorizontal,
  Sun,
  SunDim,
  User,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import { useGlobalLoading } from "../../../hooks/useGlobalLoading";
import { preloadModel } from "../../../utils/modelCache";
import {
  ExitTourConfirmDialog,
  ExitTourMenuItem,
  hasActiveTourEntry,
} from "./ExitTourButton";
import { FullScreenButton } from "./FullScreenButton";
import { CustomAmbientMusicPicker } from "./CustomAmbientMusicPicker";
import { useIsMobileDevice } from "../../../hooks/useIsMobileDevice";
import { LEFT_HANDED_MOBILE_CONTROL_LAYOUT } from "../../../utils/experienceMobileControls";

type ExperienceSettingsProps = {
  onConfirmOpenChange?: (open: boolean) => void;
};

type SettingsTab = "display" | "controls" | "audio";

const TABS: { id: SettingsTab; label: string; icon: typeof Monitor }[] = [
  { id: "display", label: "Display", icon: Monitor },
  { id: "controls", label: "Controls", icon: SlidersHorizontal },
  { id: "audio", label: "Audio", icon: Headphones },
];

const landscapeShort =
  "[@media(orientation:landscape)_and_(max-height:768px)]";
const panelPadX = `px-4 sm:px-5 [@media(max-height:500px)]:px-3.5 ${landscapeShort}:px-3`;
const cardClass =
  "rounded-2xl border-2 border-ink bg-white [@media(max-height:500px)]:rounded-xl";
const iconWrapClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-gold [@media(max-height:500px)]:h-8 [@media(max-height:500px)]:w-8";
const cardPad = "p-4 [@media(max-height:500px)]:p-3.5";

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`flex h-7 w-[3.25rem] shrink-0 items-center rounded-full border-2 border-ink p-0.5 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30 [@media(max-height:500px)]:h-6 [@media(max-height:500px)]:w-11 ${
        checked ? "bg-maroon" : "bg-cream"
      }`}
    >
      <span
        aria-hidden="true"
        className={`block h-[1.125rem] w-[1.125rem] shrink-0 rounded-full border-2 border-ink bg-white transition-transform duration-200 ease-out [@media(max-height:500px)]:h-4 [@media(max-height:500px)]:w-4 ${
          checked
            ? "translate-x-[1.35rem] [@media(max-height:500px)]:translate-x-[1.15rem]"
            : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SettingToggle({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Gauge;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`${cardClass} ${cardPad} flex cursor-pointer items-center gap-3.5 transition-colors hover:bg-cream/60 [@media(max-height:500px)]:gap-3`}
    >
      <span className={iconWrapClass}>
        <Icon
          className="h-4 w-4 text-maroon [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
          strokeWidth={2.5}
        />
      </span>
      <span className="min-w-0 flex-1 text-sm font-bold text-ink [@media(max-height:500px)]:text-xs">
        {label}
      </span>
      <ToggleSwitch checked={checked} onChange={onChange} label={label} />
    </label>
  );
}

function SettingSlider({
  icon: Icon,
  label,
  value,
  onChange,
  ariaLabel,
  dimAtZero = false,
}: {
  icon: typeof Gauge;
  label: string;
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  dimAtZero?: boolean;
}) {
  const dimmed = dimAtZero && value === 0;

  return (
    <div className={`${cardClass} ${cardPad}`}>
      <div className="mb-4 flex items-center gap-3.5 [@media(max-height:500px)]:mb-3 [@media(max-height:500px)]:gap-3">
        <span className={iconWrapClass}>
          <Icon
            className="h-4 w-4 text-maroon [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
            strokeWidth={2.5}
          />
        </span>
        <span className="min-w-0 flex-1 text-sm font-bold text-ink [@media(max-height:500px)]:text-xs">
          {label}
        </span>
        <span
          className={`rounded-lg border-2 border-ink bg-cream px-2.5 py-1 text-xs font-black tabular-nums [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-0.5 [@media(max-height:500px)]:text-[10px] ${
            dimmed ? "text-ink/35" : "text-maroon"
          }`}
        >
          {value}%
        </span>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center px-1">
          <div
            className="h-2.5 rounded-full bg-maroon [@media(max-height:500px)]:h-2"
            style={{ width: `${value}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="relative z-10 h-3.5 w-full min-w-0 cursor-pointer appearance-none rounded-full border-2 border-ink bg-cream [&::-webkit-slider-thumb]:h-[1.125rem] [&::-webkit-slider-thumb]:w-[1.125rem] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-gold [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:[&::-webkit-slider-thumb]:h-4 [@media(max-height:500px)]:[&::-webkit-slider-thumb]:w-4"
          aria-label={ariaLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
        />
      </div>
    </div>
  );
}

function CameraPicker({
  value,
  onChange,
}: {
  value: "first" | "third";
  onChange: (mode: "first" | "third") => void;
}) {
  const options = [
    { id: "first" as const, label: "1st Person", icon: User },
    { id: "third" as const, label: "3rd Person", icon: Users },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 [@media(max-height:500px)]:gap-2.5">
      {options.map(({ id, label, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={`flex flex-col items-center gap-2.5 rounded-xl border-2 px-3 py-4 transition-colors active:scale-[0.98] [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-3.5 ${
              active
                ? "border-ink bg-maroon text-white"
                : "border-ink/30 bg-cream text-ink hover:border-ink hover:bg-white"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 ${
                active
                  ? "border-white/40 bg-white/10"
                  : "border-ink bg-gold"
              }`}
            >
              <Icon
                className={`h-5 w-5 [@media(max-height:500px)]:h-4 [@media(max-height:500px)]:w-4 ${
                  active ? "text-white" : "text-maroon"
                }`}
                strokeWidth={2.5}
              />
            </span>
            <span className="text-xs font-black uppercase tracking-wide [@media(max-height:500px)]:text-[10px]">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ActionChip({
  onClick,
  children,
  variant = "default",
}: {
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "primary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-ink px-3 py-2 text-[10px] font-black uppercase tracking-wide transition-colors active:scale-[0.98] [@media(max-height:500px)]:min-h-9 [@media(max-height:500px)]:text-[9px] ${
        variant === "primary"
          ? "bg-maroon text-white hover:bg-maroon/90"
          : "bg-cream text-ink hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function TabPanel({
  activeTab,
  tab,
  children,
}: {
  activeTab: SettingsTab;
  tab: SettingsTab;
  children: ReactNode;
}) {
  if (activeTab !== tab) return null;
  return (
    <motion.div
      key={tab}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16 }}
      className="flex flex-col gap-4 [@media(max-height:500px)]:gap-3 [@media(orientation:landscape)_and_(max-height:768px)]:gap-2.5"
    >
      {children}
    </motion.div>
  );
}

export const ExperienceSettings = ({ onConfirmOpenChange }: ExperienceSettingsProps) => {
  const showMiniMap = useWorld((s: any) => s.showMiniMap);
  const showFps = useWorld((s: any) => s.showFps);
  const setShowFps = useWorld((s: any) => s.setShowFps);
  const showCampusGraph = useWorld((s: any) => s.showCampusGraph);
  const setShowCampusGraph = useWorld((s: any) => s.setShowCampusGraph);
  const showCampusGraphLabels = useWorld((s: any) => s.showCampusGraphLabels);
  const setShowCampusGraphLabels = useWorld(
    (s: any) => s.setShowCampusGraphLabels,
  );
  const showCampusNodeAddTool = useWorld((s: any) => s.showCampusNodeAddTool);
  const setShowCampusNodeAddTool = useWorld(
    (s: any) => s.setShowCampusNodeAddTool,
  );
  const sensitivity = useWorld((s: any) => s.sensitivity);
  const setSensitivity = useWorld((s: any) => s.setSensitivity);
  const cameraMode = useWorld((s: any) => s.cameraMode) as "first" | "third";
  const setCameraMode = useWorld((s: any) => s.setCameraMode);
  const avatar = useWorld((s: any) => s.avatar) as { vrmUrl?: string } | null;
  const masterEnabled = useWorld((s: any) => s.masterEnabled);
  const setMasterEnabled = useWorld((s: any) => s.setMasterEnabled);
  const ambientVolume = useWorld((s: any) => s.ambientVolume);
  const setAmbientVolume = useWorld((s: any) => s.setAmbientVolume);
  const { withLoading } = useGlobalLoading();
  const isMobileDevice = useIsMobileDevice();
  const setMobileControlsCustomize = useWorld((s: any) => s.setMobileControlsCustomize);
  const setMobileControlLayout = useWorld((s: any) => s.setMobileControlLayout);
  const resetMobileControlLayout = useWorld((s: any) => s.resetMobileControlLayout);
  const lightIntensity = useWorld((s: any) => s.lightIntensity);
  const setLightIntensity = useWorld((s: any) => s.setLightIntensity);
  const shadowsEnabled = useWorld((s: any) => s.shadowsEnabled);
  const setShadowsEnabled = useWorld((s: any) => s.setShadowsEnabled);

  const [openMenu, setOpenMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("display");
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  const showExitTour = hasActiveTourEntry() && !showMiniMap;

  useEffect(() => {
    onConfirmOpenChange?.(exitConfirmOpen);
  }, [exitConfirmOpen, onConfirmOpenChange]);

  const handleCameraModeChange = (mode: "first" | "third") => {
    if (mode === cameraMode) return;

    if (mode === "third" && avatar?.vrmUrl) {
      void withLoading(async () => {
        await preloadModel(avatar.vrmUrl);
        setCameraMode(mode);
      }, "Switching camera…");
      return;
    }

    setCameraMode(mode);
  };

  const handleOpenExitConfirm = () => {
    setExitConfirmOpen(true);
    setOpenMenu(false);
  };

  const handleStartCustomizeControls = () => {
    setOpenMenu(false);
    setMobileControlsCustomize(true);
  };

  const handleLeftHandedLayout = () => {
    setMobileControlLayout(LEFT_HANDED_MOBILE_CONTROL_LAYOUT);
  };

  useEffect(() => {
    if (!openMenu) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openMenu]);

  const closeMenu = () => setOpenMenu(false);

  const panel =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {openMenu && (
              <>
                <motion.button
                  type="button"
                  aria-label="Close settings"
                  className="fixed inset-0 z-[2200] bg-ink/65 backdrop-blur-[3px] sm:bg-ink/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeMenu}
                />

                <motion.div
                  className={`pointer-events-none fixed inset-0 z-[2201] flex items-end justify-center p-0 sm:items-center sm:p-4 [@media(max-height:500px)]:p-0 ${landscapeShort}:items-center ${landscapeShort}:justify-center ${landscapeShort}:p-2`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Settings"
                    className={`pointer-events-auto flex min-h-0 w-full max-w-[26rem] max-sm:max-w-none flex-col overflow-hidden rounded-t-2xl rounded-b-none border-[3px] border-ink bg-cream text-ink max-sm:rounded-b-2xl max-sm:border-b-[3px] sm:rounded-2xl sm:border-[4px] max-h-[min(90dvh,36rem)] sm:max-h-[min(88dvh,36rem)] [@media(max-height:500px)]:max-h-[min(92dvh,100%)] [@media(max-height:500px)]:rounded-t-xl ${landscapeShort}:max-h-[min(92dvh,100%)] ${landscapeShort}:max-w-[min(28rem,94vw)] ${landscapeShort}:rounded-2xl ${landscapeShort}:border-[3px]`}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 28, stiffness: 340 }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div
                      className={`mx-auto mt-2.5 h-1 w-12 shrink-0 rounded-full border border-ink/20 bg-ink/15 sm:hidden ${landscapeShort}:hidden`}
                      aria-hidden
                    />

                    <div
                      className={`flex shrink-0 items-center justify-between gap-4 border-b-[3px] border-ink bg-maroon py-4 ${panelPadX} [@media(max-height:500px)]:py-3 ${landscapeShort}:py-2.5`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-gold [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9">
                          <Settings
                            className="h-[1.125rem] w-[1.125rem] text-maroon"
                            strokeWidth={2.75}
                          />
                        </span>
                        <h2 className="text-lg font-black italic text-white sm:text-xl [@media(max-height:500px)]:text-base">
                          Settings
                        </h2>
                      </div>
                      <button
                        onClick={closeMenu}
                        className="rounded-xl border-2 border-ink bg-white p-1.5 text-ink transition-colors hover:bg-cream active:scale-95 [@media(max-height:500px)]:p-1"
                        aria-label="Close settings"
                        type="button"
                      >
                        <X className="h-4 w-4" strokeWidth={3} />
                      </button>
                    </div>

                    <div className={`shrink-0 pt-4 ${panelPadX} [@media(max-height:500px)]:pt-3 ${landscapeShort}:pt-2.5`}>
                      <div
                        className={`grid grid-cols-3 gap-2 rounded-xl border-2 border-ink bg-cream p-2 [@media(max-height:500px)]:gap-1.5 [@media(max-height:500px)]:p-1.5 ${landscapeShort}:gap-1.5 ${landscapeShort}:p-1.5`}
                        role="tablist"
                        aria-label="Settings sections"
                      >
                      {TABS.map(({ id, label, icon: Icon }) => {
                        const active = activeTab === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setActiveTab(id)}
                            className={`flex flex-col items-center gap-1.5 rounded-lg border-2 px-2 py-2.5 transition-colors [@media(max-height:500px)]:gap-1 [@media(max-height:500px)]:py-2 ${
                              active
                                ? "border-ink bg-maroon text-white"
                                : "border-transparent bg-transparent text-ink/55 hover:border-ink/20 hover:bg-white hover:text-ink"
                            }`}
                          >
                            <Icon
                              className="h-3.5 w-3.5 [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3"
                              strokeWidth={2.5}
                            />
                            <span className="text-[9px] font-black uppercase tracking-wide [@media(max-height:500px)]:text-[8px]">
                              {label}
                            </span>
                          </button>
                        );
                      })}
                      </div>
                    </div>

                    <div
                      className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-cream pt-4 pb-4 custom-scrollbar ${panelPadX} [@media(max-height:500px)]:pt-3 [@media(max-height:500px)]:pb-3 ${landscapeShort}:pt-2.5 ${landscapeShort}:pb-2.5`}
                    >
                      <TabPanel activeTab={activeTab} tab="display">
                        <SettingToggle
                          icon={Gauge}
                          label="Show FPS"
                          checked={showFps}
                          onChange={setShowFps}
                        />
                        <SettingToggle
                          icon={shadowsEnabled ? Sun : SunDim}
                          label="Shadows"
                          checked={shadowsEnabled}
                          onChange={setShadowsEnabled}
                        />
                        <SettingSlider
                          icon={Sun}
                          label="Light Intensity"
                          value={lightIntensity}
                          onChange={setLightIntensity}
                          ariaLabel="Light intensity"
                          dimAtZero
                        />
                        {import.meta.env.DEV && (
                          <>
                            <SettingToggle
                              icon={Route}
                              label="Show Campus Nodes"
                              checked={showCampusGraph}
                              onChange={setShowCampusGraph}
                            />
                            <SettingToggle
                              icon={Tags}
                              label="Show Node Names & Coordinates"
                              checked={showCampusGraphLabels}
                              onChange={setShowCampusGraphLabels}
                            />
                            <SettingToggle
                              icon={MapPinPlus}
                              label="Show Copy Campus Node Tool"
                              checked={showCampusNodeAddTool}
                              onChange={setShowCampusNodeAddTool}
                            />
                          </>
                        )}
                        <div className={`${cardClass} ${cardPad}`}>
                          <div className="mb-4 flex items-center gap-3.5 [@media(max-height:500px)]:mb-3">
                            <span className={iconWrapClass}>
                              <Camera className="h-4 w-4 text-maroon" strokeWidth={2.5} />
                            </span>
                            <span className="text-sm font-bold text-ink [@media(max-height:500px)]:text-xs">
                              Camera
                            </span>
                          </div>
                          <CameraPicker
                            value={cameraMode}
                            onChange={handleCameraModeChange}
                          />
                        </div>
                      </TabPanel>

                      <TabPanel activeTab={activeTab} tab="controls">
                        <SettingSlider
                          icon={MousePointer2}
                          label="Sensitivity"
                          value={sensitivity}
                          onChange={setSensitivity}
                          ariaLabel="Sensitivity"
                        />
                        {isMobileDevice && (
                          <div className={`${cardClass} ${cardPad}`}>
                            <div className="mb-4 flex items-center gap-3.5 [@media(max-height:500px)]:mb-3">
                              <span className={iconWrapClass}>
                                <Move className="h-4 w-4 text-maroon" strokeWidth={2.5} />
                              </span>
                              <span className="text-sm font-bold text-ink [@media(max-height:500px)]:text-xs">
                                Mobile Controls
                              </span>
                            </div>
                            <div className="flex flex-col gap-3">
                              <ActionChip
                                onClick={handleStartCustomizeControls}
                                variant="primary"
                              >
                                <Move className="h-3.5 w-3.5" strokeWidth={2.5} />
                                Customize Layout
                              </ActionChip>
                              <div className="flex gap-3">
                                <ActionChip onClick={handleLeftHandedLayout}>
                                  Left-Handed
                                </ActionChip>
                                <ActionChip onClick={resetMobileControlLayout}>
                                  <RotateCcw className="h-3 w-3" strokeWidth={2.5} />
                                  Reset
                                </ActionChip>
                              </div>
                            </div>
                          </div>
                        )}
                      </TabPanel>

                      <TabPanel activeTab={activeTab} tab="audio">
                        <SettingToggle
                          icon={masterEnabled ? Volume2 : VolumeX}
                          label="Volume"
                          checked={masterEnabled}
                          onChange={setMasterEnabled}
                        />
                        <CustomAmbientMusicPicker />
                        <SettingSlider
                          icon={Music}
                          label="Background Music"
                          value={ambientVolume}
                          onChange={setAmbientVolume}
                          ariaLabel="Background music volume"
                          dimAtZero
                        />
                      </TabPanel>
                    </div>

                    <div
                      className={`shrink-0 border-t-[3px] border-ink bg-white py-3 ${panelPadX} pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] [@media(max-height:500px)]:border-t-2 [@media(max-height:500px)]:py-2.5 ${landscapeShort}:py-2`}
                    >
                      <div
                        className={`grid gap-2.5 [@media(max-height:500px)]:gap-2 ${landscapeShort}:gap-2 ${
                          showExitTour ? "grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        <FullScreenButton variant="menuItem" onMenuClose={closeMenu} />
                        {showExitTour && (
                          <ExitTourMenuItem onClick={handleOpenExitConfirm} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <div className="relative">
      <button
        data-tour="settings"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-gold text-maroon transition-colors hover:bg-gold/85 active:scale-95 [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl ${openMenu ? "bg-maroon text-white" : ""}`}
        onClick={() => setOpenMenu(!openMenu)}
        title="Settings"
        aria-label="Settings"
        aria-expanded={openMenu}
        type="button"
      >
        <Settings
          className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
          strokeWidth={3}
        />
      </button>

      {panel}
      <ExitTourConfirmDialog
        open={exitConfirmOpen}
        onOpenChange={setExitConfirmOpen}
      />
    </div>
  );
};
