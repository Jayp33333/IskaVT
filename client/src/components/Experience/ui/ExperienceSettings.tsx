import { useEffect, useState, type ReactNode } from "react";

import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";

import {

  Camera,

  Gauge,

  MousePointer2,

  Move,

  Music,

  RotateCcw,

  Settings,

  Volume2,

  VolumeX,

  X,

} from "lucide-react";

import useWorld from "../../../hooks/useWorld";

import {

  SENSITIVITY_LABELS,

  type SensitivityLevel,

} from "../../../utils/experienceSensitivity";

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



const sensitivityLevels: SensitivityLevel[] = ["low", "medium", "high"];



function SettingsSection({

  title,

  children,

}: {

  title: string;

  children: ReactNode;

}) {

  return (

    <section className="space-y-2 [@media(max-height:500px)]:space-y-1.5">

      <p className="px-1 text-[8px] font-black uppercase tracking-[0.2em] text-ink/45 [@media(max-height:500px)]:text-[7px]">

        {title}

      </p>

      <div className="overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-brutal-sm [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:border-[2px]">

        {children}

      </div>

    </section>

  );

}



function SettingRow({

  icon: Icon,

  label,

  hint,

  children,

  last,

}: {

  icon: typeof Gauge;

  label: string;

  hint?: string;

  children: ReactNode;

  last?: boolean;

}) {

  return (

    <div

      className={`flex min-w-0 items-center gap-2.5 px-3 py-2.5 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2 ${

        last ? "" : "border-b-[2px] border-ink/10"

      }`}

    >

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-[2px] border-ink bg-gold shadow-brutal-sm [@media(max-height:500px)]:h-7 [@media(max-height:500px)]:w-7 [@media(max-height:500px)]:rounded-lg">

        <Icon

          className="h-3.5 w-3.5 text-maroon [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3"

          strokeWidth={3}

        />

      </span>



      <div className="min-w-0 flex-1">

        <p className="truncate text-[10px] font-black uppercase tracking-wide text-ink [@media(max-height:500px)]:text-[9px]">

          {label}

        </p>

        {hint && (

          <p className="truncate text-[8px] font-bold text-ink/45 [@media(max-height:500px)]:hidden">

            {hint}

          </p>

        )}

      </div>



      <div className="shrink-0">{children}</div>

    </div>

  );

}



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
      className={`flex h-7 w-12 shrink-0 items-center rounded-full border-[2px] border-ink p-0.5 shadow-brutal-sm transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40 [@media(max-height:500px)]:h-6 [@media(max-height:500px)]:w-10 ${
        checked ? "bg-maroon" : "bg-cream"
      }`}
    >
      <span
        aria-hidden="true"
        className={`block h-5 w-5 shrink-0 rounded-full border-[2px] border-ink bg-white shadow-brutal-sm transition-all duration-200 ease-out [@media(max-height:500px)]:h-4 [@media(max-height:500px)]:w-4 ${
          checked ? "ml-auto" : "ml-0"
        }`}
      />
    </button>
  );
}



function SegmentGroup<T extends string>({

  options,

  value,

  onChange,

  labels,

  compact,

}: {

  options: readonly T[];

  value: T;

  onChange: (value: T) => void;

  labels: Record<T, string>;

  compact?: boolean;

}) {

  return (

    <div

      className={`grid shrink-0 overflow-hidden rounded-xl border-[2px] border-ink bg-cream shadow-brutal-sm [@media(max-height:500px)]:rounded-lg ${

        compact

          ? "grid-cols-2"

          : "grid-cols-[repeat(auto-fit,minmax(0,1fr))]"

      }`}

      style={

        compact

          ? undefined

          : { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }

      }

    >

      {options.map((option) => {

        const isActive = value === option;



        return (

          <button

            key={option}

            onClick={() => onChange(option)}

            className={`min-w-[2.75rem] truncate px-2 py-1.5 text-center text-[8px] font-black uppercase transition-colors [@media(max-height:500px)]:min-w-[2.25rem] [@media(max-height:500px)]:px-1.5 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[7px] ${

              compact ? "min-h-7" : "min-h-8"

            } ${

              isActive ? "bg-maroon text-white" : "text-ink hover:bg-gold/40"

            }`}

            type="button"

            aria-pressed={isActive}

            title={labels[option]}

          >

            {labels[option]}

          </button>

        );

      })}

    </div>

  );

}



function VolumeControl({

  value,

  onChange,

}: {

  value: number;

  onChange: (value: number) => void;

}) {

  const muted = value === 0;



  return (

    <div className="flex w-[7.5rem] shrink-0 items-center gap-2 [@media(max-height:500px)]:w-[6.5rem] [@media(max-height:500px)]:gap-1.5">

      <div className="relative min-w-0 flex-1">

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center px-0.5">

          <div

            className="h-1.5 rounded-full bg-maroon/80 [@media(max-height:500px)]:h-1"

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

          className="relative z-10 h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full border-[2px] border-ink bg-cream [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-gold [@media(max-height:500px)]:h-1.5 [@media(max-height:500px)]:[&::-webkit-slider-thumb]:h-3 [@media(max-height:500px)]:[&::-webkit-slider-thumb]:w-3"

          aria-label="Master volume"

          aria-valuemin={0}

          aria-valuemax={100}

          aria-valuenow={value}

        />

      </div>

      <span

        className={`w-7 shrink-0 text-right text-[8px] font-black tabular-nums [@media(max-height:500px)]:w-6 [@media(max-height:500px)]:text-[7px] ${

          muted ? "text-ink/40" : "text-maroon"

        }`}

      >

        {value}

      </span>

    </div>

  );

}



export const ExperienceSettings = ({ onConfirmOpenChange }: ExperienceSettingsProps) => {

  const showLogHistory = useWorld((s: any) => s.showLogHistory);

  const showMiniMap = useWorld((s: any) => s.showMiniMap);

  const showFps = useWorld((s: any) => s.showFps);

  const setShowFps = useWorld((s: any) => s.setShowFps);

  const sensitivity = useWorld((s: any) => s.sensitivity);

  const setSensitivity = useWorld((s: any) => s.setSensitivity);

  const cameraMode = useWorld((s: any) => s.cameraMode) as "first" | "third";

  const setCameraMode = useWorld((s: any) => s.setCameraMode);

  const avatar = useWorld((s: any) => s.avatar) as { vrmUrl?: string } | null;

  const masterVolume = useWorld((s: any) => s.masterVolume);

  const setMasterVolume = useWorld((s: any) => s.setMasterVolume);

  const sfxEnabled = useWorld((s: any) => s.sfxEnabled);

  const setSfxEnabled = useWorld((s: any) => s.setSfxEnabled);

  const ambientEnabled = useWorld((s: any) => s.ambientEnabled);

  const setAmbientEnabled = useWorld((s: any) => s.setAmbientEnabled);

  const { withLoading } = useGlobalLoading();
  const isMobileDevice = useIsMobileDevice();
  const setMobileControlsCustomize = useWorld((s: any) => s.setMobileControlsCustomize);
  const setMobileControlLayout = useWorld((s: any) => s.setMobileControlLayout);
  const resetMobileControlLayout = useWorld((s: any) => s.resetMobileControlLayout);

  const [openMenu, setOpenMenu] = useState(false);

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

                  className="fixed inset-0 z-[1599] bg-ink/70 sm:bg-ink/40 [@media(orientation:landscape)_and_(max-height:500px)]:bg-ink/60"

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}

                  exit={{ opacity: 0 }}

                  onClick={closeMenu}

                />



                <motion.div

                  className="pointer-events-none fixed inset-0 z-[1600] flex items-center justify-center p-4 [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:768px)]:p-2"

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}

                  exit={{ opacity: 0 }}

                >

                  <motion.div

                    role="dialog"

                    aria-modal="true"

                    aria-label="Settings"

                    className="pointer-events-auto flex w-[min(22rem,calc(100vw-2rem))] max-w-[22rem] flex-col overflow-hidden rounded-[1.5rem] border-[4px] border-ink bg-cream text-ink shadow-brutal-lg max-h-[min(92dvh,36rem)] [@media(max-width:360px)]:w-[min(20rem,calc(100vw-1.5rem))] [@media(max-height:500px)]:max-h-[min(96dvh,34rem)] [@media(max-height:500px)]:rounded-2xl [@media(max-height:500px)]:border-[3px] [@media(orientation:landscape)_and_(max-height:768px)]:w-[min(24rem,calc(100vw-2rem))] [@media(orientation:landscape)_and_(max-height:768px)]:max-h-[min(96dvh,32rem)] [@media(orientation:landscape)_and_(max-height:768px)]:rounded-xl"

                    initial={{ opacity: 0, y: 16, scale: 0.96 }}

                    animate={{ opacity: 1, y: 0, scale: 1 }}

                    exit={{ opacity: 0, y: 12, scale: 0.96 }}

                    transition={{ type: "spring", damping: 22, stiffness: 280 }}

                    onClick={(event) => event.stopPropagation()}

                  >

                    <div className="flex shrink-0 items-center justify-between gap-3 border-b-[4px] border-ink bg-maroon px-4 py-3 [@media(max-height:500px)]:border-b-[3px] [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:500px)]:px-2.5 [@media(orientation:landscape)_and_(max-height:500px)]:py-1.5">

                      <div className="min-w-0">
                        <h2 className="truncate text-base font-black italic leading-tight text-white [@media(max-height:500px)]:text-sm [@media(orientation:landscape)_and_(max-height:500px)]:text-xs">
                          Settings
                        </h2>
                      </div>

                      <button

                        onClick={closeMenu}

                        className="shrink-0 rounded-xl border-[3px] border-ink bg-white p-1 text-ink transition-transform hover:bg-muted active:scale-90 [@media(max-height:500px)]:rounded-lg [@media(max-height:500px)]:border-[2px] [@media(max-height:500px)]:p-0.5"

                        aria-label="Close settings"

                        type="button"

                      >

                        <X

                          className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5 [@media(orientation:landscape)_and_(max-height:500px)]:h-3 [@media(orientation:landscape)_and_(max-height:500px)]:w-3"

                          strokeWidth={4}

                        />

                      </button>

                    </div>



                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 custom-scrollbar [@media(max-height:500px)]:space-y-2 [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:500px)]:space-y-2 [@media(orientation:landscape)_and_(max-height:500px)]:p-1.5">

                      <SettingsSection title="Display">

                        <SettingRow icon={Gauge} label="Show FPS" hint="Live frame counter">

                          <ToggleSwitch

                            checked={showFps}

                            onChange={setShowFps}

                            label="Show FPS"

                          />

                        </SettingRow>

                        <SettingRow icon={Camera} label="Camera" hint="First or third person" last>

                          <SegmentGroup

                            options={["first", "third"] as const}

                            value={cameraMode}

                            onChange={handleCameraModeChange}

                            labels={{ first: "1st", third: "3rd" }}

                            compact

                          />

                        </SettingRow>

                      </SettingsSection>



                      <SettingsSection title="Controls">

                        <SettingRow icon={MousePointer2} label="Sensitivity" hint="Look & move speed" last={!isMobileDevice}>

                          <SegmentGroup

                            options={sensitivityLevels}

                            value={sensitivity}

                            onChange={setSensitivity}

                            labels={SENSITIVITY_LABELS}

                          />

                        </SettingRow>

                        {isMobileDevice && (
                          <>
                            <SettingRow icon={Move} label="Layout" hint="Drag controls on screen">
                              <button
                                type="button"
                                onClick={handleStartCustomizeControls}
                                className="shrink-0 rounded-xl border-[2px] border-ink bg-maroon px-2.5 py-1.5 text-[8px] font-black uppercase text-white shadow-brutal-sm transition-all active:translate-y-0.5 [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[7px]"
                              >
                                Move
                              </button>
                            </SettingRow>
                            <SettingRow icon={RotateCcw} label="Presets" hint="Quick layouts" last>
                              <div className="flex shrink-0 gap-1">
                                <button
                                  type="button"
                                  onClick={handleLeftHandedLayout}
                                  className="rounded-lg border-[2px] border-ink bg-cream px-2 py-1.5 text-[7px] font-black uppercase text-ink transition-colors hover:bg-gold/40 [@media(max-height:500px)]:px-1.5 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[6px]"
                                >
                                  Left
                                </button>
                                <button
                                  type="button"
                                  onClick={resetMobileControlLayout}
                                  className="rounded-lg border-[2px] border-ink bg-cream px-2 py-1.5 text-[7px] font-black uppercase text-ink transition-colors hover:bg-gold/40 [@media(max-height:500px)]:px-1.5 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[6px]"
                                >
                                  Reset
                                </button>
                              </div>
                            </SettingRow>
                          </>
                        )}

                      </SettingsSection>



                      <SettingsSection title="Audio">

                        <SettingRow icon={Volume2} label="Volume" hint="All tour sounds">

                          <VolumeControl value={masterVolume} onChange={setMasterVolume} />

                        </SettingRow>

                        <SettingRow icon={VolumeX} label="SFX" hint="Arrivals & events">

                          <ToggleSwitch

                            checked={sfxEnabled}

                            onChange={setSfxEnabled}

                            label="Sound effects"

                          />

                        </SettingRow>

                        <CustomAmbientMusicPicker />

                        <SettingRow icon={Music} label="Ambient" hint="Background while touring" last>

                          <ToggleSwitch

                            checked={ambientEnabled}

                            onChange={setAmbientEnabled}

                            label="Ambient music"

                          />

                        </SettingRow>

                      </SettingsSection>

                    </div>



                    <div className="shrink-0 border-t-[3px] border-ink bg-white/80 px-3 py-2.5 backdrop-blur-sm [@media(max-height:500px)]:border-t-2 [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-2">

                      <p className="mb-2 px-1 text-[8px] font-black uppercase tracking-[0.2em] text-ink/45 [@media(max-height:500px)]:mb-1.5 [@media(max-height:500px)]:text-[7px]">

                        Actions

                      </p>

                      <div

                        className={`grid gap-1.5 [@media(max-height:500px)]:gap-1 ${

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

        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-gold text-maroon shadow-brutal-sm transition-all hover:bg-gold/90 active:translate-y-1 active:shadow-none [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:shadow-brutal-sm ${

          showLogHistory ? "pointer-events-none blur-sm opacity-50" : ""

        } ${openMenu ? "bg-maroon text-white" : ""}`}

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


