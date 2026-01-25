import useWorld from "../../../hooks/useWorld";

import { AvatarPicker } from "./AvatarPicker";
import { DestinationPicker } from "./DestinationPicker";
import { DestinationChecker } from "./DestinationChecker";
import { CenterDot } from "./CenterDot";
import { DistanceHUD } from "./DistanceHUD";

import { LogHistory } from "./LogHistory";
import { SettingsButton } from "./SettingsButton";
import { SettingsPanel } from "./SettingsPanel";
import { Map2D } from "./Map2D";

export const UI = () => {
  const { cameraMode, pinPosition, isPinConfirmed } = useWorld((s: any) => s);

  return (
    <>
      {/* First-Person Center Dot */}
      {cameraMode === "first" && <CenterDot />}

      <Map2D />

      {/* Top-left Controls */}
      <div className="fixed top-[1.5vh] left-[1.5vw] z-300 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <AvatarPicker />
          <SettingsButton />
          <LogHistory />
        </div>
        {pinPosition && isPinConfirmed && <DistanceHUD />}
      </div>

      <DestinationPicker />

      {/* Global Components */}
      <DestinationChecker />

      {/* Settings Panel */}
      <SettingsPanel />
    </>
  );
};
