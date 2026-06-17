import useWorld from "../../hooks/useWorld";
import {
  lightIntensityPercentToAmbient,
  lightIntensityPercentToDirectional,
} from "../../utils/experienceLightingSettings";

type LightsProps = {
  sunPosition: [number, number, number];
};

const Lights = ({ sunPosition }: LightsProps) => {
  const lightIntensity = useWorld((s) => s.lightIntensity);
  const shadowsEnabled = useWorld((s) => s.shadowsEnabled);

  return (
    <>
      <directionalLight
        intensity={lightIntensityPercentToDirectional(lightIntensity)}
        position={sunPosition}
        castShadow={shadowsEnabled}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-camera-near={0.5}
        shadow-camera-far={300}
        shadow-bias={-0.0002}
      />
      <ambientLight intensity={lightIntensityPercentToAmbient(lightIntensity)} />
    </>
  );
};

export default Lights;
