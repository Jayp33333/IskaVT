import { useState } from "react";
import useWorld from "../../../hooks/useWorld";
import { getFpsColorClass, getFpsTooltip, useFps } from "../../../hooks/useFps";

import { AvatarPicker } from "./AvatarPicker";
import { DestinationPicker } from "./DestinationPicker";
import { DestinationChecker } from "./DestinationChecker";
import { EnterButton } from "./EnterButton";
import { DistanceHUD } from "./DistanceHUD";
import { ArrivalBanner } from "./ArrivalBanner";
import { FloorLabel } from "./FloorLabel";
import { AreaInfo } from "./AreaInfo";
import { CampusNodeAddTool } from "./CampusNodeAddTool";

import { LogHistory } from "./LogHistory";
import { Feedback } from "./Feedback";
import { GuideButton } from "./GuideButton";
import { ExperienceSettings } from "./ExperienceSettings";
import Map2D from "../Map2D"; 
import { NPCDialog } from "./NPCDialog";
import { NPCTalkButton } from "./NPCTalkButton";
import { MobileControlCustomizer } from "./MobileControlCustomizer";
import { useMobileControlLayout } from "../../../hooks/useMobileControlLayout";
import { useIsMobileDevice } from "../../../hooks/useIsMobileDevice";

type UIProps = {
  experienceStarted?: boolean;
};

export const UI = ({ experienceStarted = false }: UIProps) => {
  const isMobileDevice = useIsMobileDevice();
  const [exitTourConfirmOpen, setExitTourConfirmOpen] = useState(false);
  useMobileControlLayout(isMobileDevice && experienceStarted);
  const {
    pinPosition,
    isPinConfirmed,
    activeNPCDialog,
    map2DOpen,
    cameraMode,
    cursorRevealedByAlt,
    showFps,
    mobileControlsCustomize,
    tourCoachOpen,
    guideBookOpen,
  } = useWorld((s: any) => s);
  const tourGuideBlocking = tourCoachOpen || guideBookOpen;
  const fps = useFps(showFps);
  const npcFocus = !!activeNPCDialog;
  const hideAreaInfo =
    npcFocus || map2DOpen || tourGuideBlocking || exitTourConfirmOpen;
  const showEnterInteraction =
    !npcFocus &&
    !map2DOpen &&
    !tourGuideBlocking &&
    !exitTourConfirmOpen &&
    !cursorRevealedByAlt &&
    !mobileControlsCustomize;

  return (
    <>
      {showEnterInteraction && (
        <EnterButton showCrosshair={cameraMode === "first"} />
      )}
      {!npcFocus && !mobileControlsCustomize && <NPCTalkButton />}

      {/* Left sidebar controls */}
      {!npcFocus && (
        <div className="fixed top-[max(0.5rem,1.5vh)] left-[max(0.5rem,1.5vw)] z-[300] flex max-w-[calc(100vw-1rem)] flex-col gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1.5">
          <div className="flex flex-col gap-0.5">
            <div
              data-tour="toolbar"
              className="rounded-2xl border-[3px] border-ink bg-cream/95 p-1.5 shadow-brutal-sm backdrop-blur-sm [@media(orientation:landscape)_and_(max-height:500px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:500px)]:border-2 [@media(orientation:landscape)_and_(max-height:500px)]:p-1"
            >
              <div className="flex max-w-full flex-wrap items-center gap-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1">
                <AvatarPicker />
                <ExperienceSettings onConfirmOpenChange={setExitTourConfirmOpen} />
                <DestinationPicker />
                {experienceStarted && <GuideButton />}
                <LogHistory />
                <Feedback />
              </div>
            </div>
            {showFps && (
              <span
                className={`cursor-help pl-1 text-[9px] font-bold tabular-nums leading-none [@media(max-height:500px)]:text-[8px] ${getFpsColorClass(fps)}`}
                title={getFpsTooltip(fps)}
                aria-label={getFpsTooltip(fps)}
              >
                {fps === null ? "—" : `${fps}fps`}
              </span>
            )}
          </div>
          {pinPosition && isPinConfirmed ? <DistanceHUD /> : <ArrivalBanner />}
        </div>
      )}

      {/* Floor label — top center of viewport */}
      {!npcFocus && <FloorLabel />}

      {/* Global Components */}
      {!hideAreaInfo && <AreaInfo />}
      {import.meta.env.DEV && <CampusNodeAddTool />}
      <DestinationChecker />
      {activeNPCDialog && (
        <NPCDialog
          open={true}
          title={activeNPCDialog.title}
          message={activeNPCDialog.message}
          options={activeNPCDialog.options}
          onClose={activeNPCDialog.onClose}
        />
      )}

      {/* Map — hidden during NPC dialog or exit tour confirm */}
      {!npcFocus && !exitTourConfirmOpen && <Map2D />}

      {isMobileDevice && experienceStarted && <MobileControlCustomizer />}
    </>
  );
};
