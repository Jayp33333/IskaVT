import { useState } from "react";
import useWorld from "../../../hooks/useWorld";

import { AvatarPicker } from "./AvatarPicker";
import { DestinationPicker } from "./DestinationPicker";
import { DestinationChecker } from "./DestinationChecker";
import { EnterButton } from "./EnterButton";
import { DistanceHUD } from "./DistanceHUD";
import { FloorLabel } from "./FloorLabel";
import { AreaInfo } from "./AreaInfo";

import { LogHistory } from "./LogHistory";
import { Feedback } from "./Feedback";
import { ExitTourButton } from "./ExitTourButton";
import { FullScreenButton } from "./FullScreenButton";
import Map2D from "../Map2D"; 
import { NPCDialog } from "./NPCDialog";

type UIProps = {
  tourGuideDialogOpen?: boolean;
  experienceStarted?: boolean;
};

export const UI = ({ tourGuideDialogOpen = false, experienceStarted = false }: UIProps) => {
  const [exitTourConfirmOpen, setExitTourConfirmOpen] = useState(false);
  const { pinPosition, isPinConfirmed, activeNPCDialog, map2DOpen, cameraMode } =
    useWorld((s: any) => s);
  const npcFocus = !!activeNPCDialog;
  const hideAreaInfo =
    npcFocus || map2DOpen || tourGuideDialogOpen || exitTourConfirmOpen;
  const showCenterDot =
    cameraMode === "first" &&
    !npcFocus &&
    !map2DOpen &&
    !tourGuideDialogOpen &&
    !exitTourConfirmOpen;

  return (
    <>
      {showCenterDot && <EnterButton />}

      {/* Left sidebar controls */}
      {!npcFocus && (
        <div className="fixed top-[max(0.5rem,1.5vh)] left-[max(0.5rem,1.5vw)] z-[300] flex max-w-[calc(100vw-1rem)] flex-col gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1.5">
          <div className="rounded-2xl border-[3px] border-ink bg-cream/95 p-1.5 shadow-brutal-sm backdrop-blur-sm [@media(orientation:landscape)_and_(max-height:500px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:500px)]:border-2 [@media(orientation:landscape)_and_(max-height:500px)]:p-1">
            <div className="flex max-w-full flex-wrap items-center gap-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1">
              <AvatarPicker />
              <ExitTourButton onConfirmOpenChange={setExitTourConfirmOpen} />
              <FullScreenButton />
              <DestinationPicker />
              <LogHistory />
              <Feedback experienceStarted={experienceStarted} />
            </div>
          </div>
          {pinPosition && isPinConfirmed && <DistanceHUD />}
        </div>
      )}

      {/* Floor label — top center of viewport */}
      {!npcFocus && <FloorLabel />}

      {/* Global Components */}
      {!hideAreaInfo && <AreaInfo />}
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
    </>
  );
};
