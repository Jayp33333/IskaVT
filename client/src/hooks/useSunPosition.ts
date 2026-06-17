import { useEffect, useState } from "react";
import { Vector3 } from "three";
import {
  getSkyAngles,
  getSunPosition,
  SUN_LIGHT_DISTANCE,
} from "../utils/experienceSunPosition";

const UPDATE_INTERVAL_MS = 60_000;

const sunPosition = new Vector3();
const skyAngles = { inclination: 0.6, azimuth: 0.5 };

export function useSunPosition() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((tick) => tick + 1);
    }, UPDATE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  const now = new Date();
  getSunPosition(now, SUN_LIGHT_DISTANCE, sunPosition);
  Object.assign(skyAngles, getSkyAngles(now));

  return {
    sunPosition: sunPosition.clone(),
    skyInclination: skyAngles.inclination,
    skyAzimuth: skyAngles.azimuth,
  };
}
