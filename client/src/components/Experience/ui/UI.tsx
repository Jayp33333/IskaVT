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

export const UI = () => {
  const { pinPosition, isPinConfirmed, activeNPCDialog } = useWorld((s: any) => s);

  return (
    <>
      {/* First-Person Center Dot */}
      {/* {cameraMode === "first" && <CenterDot />} */}

      {/* Map */}
      <Map2D />

      {/* Top-left Controls */}
      <div className="fixed top-[max(0.5rem,1.5vh)] left-[max(0.5rem,1.5vw)] z-300 flex max-w-[calc(100vw-1rem)] flex-col gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1.5">
        <div className="flex max-w-full flex-wrap items-start gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:gap-1.5">
          <AvatarPicker />
          <ExitTourButton />
          <FullScreenButton />
          <DestinationPicker />
          <LogHistory />
        </div>
        {pinPosition && isPinConfirmed && <DistanceHUD />}
      </div>

      {/* Global Components */}
      <FloorLabel />
      <AreaInfo />
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
    </>
  );
};
