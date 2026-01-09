import { Suspense } from "react";
import { Sky } from "@react-three/drei";

import Character from "../components/Experience/Character";
import World from "../components/Experience/World";
import NPCs from "../components/Experience/NPCs";
import Pin from "../components/Experience/Pin";
import Lights from "../components/Experience/Lights";
import useWorld from "../hooks/useWorld";

const Experience = () => {
  const { pinPosition, isPinConfirmed } = useWorld((s: any) => s);

  return (
    <>
      <Sky />
      <Lights />
      <World />
      <Suspense fallback={null}>
        <Character />
      </Suspense>
      <Suspense fallback={null}>
        <NPCs />
      </Suspense>
      {pinPosition && isPinConfirmed && <Pin />}
    </>
  );
};

export default Experience;
