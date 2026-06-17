import { Suspense } from "react";
import { Sky } from "@react-three/drei";

import Character from "../components/Experience/Character";
import World from "../components/Experience/World";
import NPCs from "../components/Experience/NPCs";
import Pin from "../components/Experience/Pin";
import { CampusGraphDebug } from "../components/Experience/CampusGraphDebug";
import Lights from "../components/Experience/Lights";
// import SceneFog from "../components/Experience/SceneFog";
import useWorld from "../hooks/useWorld";
import { useSunPosition } from "../hooks/useSunPosition";
import DistanceUpdater from "../components/Experience/ui/DistanceUpdater";

const Experience = () => {
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const isPinConfirmed = useWorld((s: any) => s.isPinConfirmed);
  const { sunPosition, skyInclination, skyAzimuth } = useSunPosition();

  return (
    <>
      <Sky
        sunPosition={sunPosition}
        inclination={skyInclination}
        azimuth={skyAzimuth}
      />
      {/* <SceneFog /> */}
      <Lights sunPosition={[sunPosition.x, sunPosition.y, sunPosition.z]} />
      <World />
      <Suspense fallback={null}>
        <Character />
      </Suspense>
      <Suspense fallback={null}>
        <NPCs />
      </Suspense>
      <DistanceUpdater />
      <CampusGraphDebug />
      {pinPosition && isPinConfirmed && <Pin />}
    </>
  );
};

export default Experience;
