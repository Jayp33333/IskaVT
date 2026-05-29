import useWorld from "../../../hooks/useWorld";

import { AvatarPicker } from "./AvatarPicker";
import { DestinationPicker } from "./DestinationPicker";
import { DestinationChecker } from "./DestinationChecker";
// import { CenterDot } from "./CenterDot";
import { DistanceHUD } from "./DistanceHUD";
import { FloorLabel } from "./FloorLabel";
import { AreaInfo } from "./AreaInfo";

import { LogHistory } from "./LogHistory";
import { ExitTourButton } from "./ExitTourButton";
import { FullScreenButton } from "./FullScreenButton";
import Map2D from "../Map2D"; 
import { NPCDialog } from "./NPCDialog";

type UIProps = {
  tourGuideDialogOpen?: boolean;
};

export const UI = ({ tourGuideDialogOpen = false }: UIProps) => {
  const { pinPosition, isPinConfirmed, activeNPCDialog, map2DOpen } = useWorld(
    (s: any) => s
  );
  const npcFocus = !!activeNPCDialog;
  const hideAreaInfo = npcFocus || map2DOpen || tourGuideDialogOpen;

  return (
    <>
      {/* Top-left Controls — hidden during NPC dialog to keep focus on the conversation */}
      {!npcFocus && (
        <div className="fixed top-[max(0.5rem,1.5vh)] left-[max(0.5rem,1.5vw)] z-[300] flex max-w-[calc(100vw-1rem)] flex-col gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1.5">
          <div className="flex max-w-full flex-wrap items-start gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1.5">
            <AvatarPicker />
            <ExitTourButton />
            <FullScreenButton />
            <DestinationPicker />
            <LogHistory />
          </div>
          {pinPosition && isPinConfirmed && <DistanceHUD />}
        </div>
      )}

      {/* Global Components */}
      {!npcFocus && <FloorLabel />}
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

      {/* Map — hidden during NPC dialog */}
      {!npcFocus && <Map2D />}
    </>
  );
};
