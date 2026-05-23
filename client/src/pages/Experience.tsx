import { Suspense } from "react";
import { Sky } from "@react-three/drei";

import Character from "../components/Experience/Character";
import World from "../components/Experience/World";
import NPCs from "../components/Experience/NPCs";
import Pin from "../components/Experience/Pin";
import Lights from "../components/Experience/Lights";
import useWorld from "../hooks/useWorld";
import DistanceUpdater from "../components/Experience/ui/DistanceUpdater";

const Experience = ({ assetsReady }: { assetsReady: boolean }) => {
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const isPinConfirmed = useWorld((s: any) => s.isPinConfirmed);

  return (
    <>
      <Sky />
      <Lights />
      <Suspense fallback={null}>
        <World />
      </Suspense>
      {assetsReady && (
        <>
          <Suspense fallback={null}>
            <NPCs />
          </Suspense>
          <Suspense fallback={null}>
            <Character />
          </Suspense>
        </>
      )}
      <DistanceUpdater />
      {pinPosition && isPinConfirmed && assetsReady && <Pin />}
    </>
  );
};

export default Experience;
