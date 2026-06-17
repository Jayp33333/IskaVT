import { Vector3 } from "three";

/** PUP Lopez campus — used for solar azimuth / elevation. */
const CAMPUS_LATITUDE = 13.8845;
const CAMPUS_LONGITUDE = 122.2603;

/** Directional light sits this far from the origin along the sun vector. */
export const SUN_LIGHT_DISTANCE = 200;

const DEG = Math.PI / 180;
const J2000 = new Date("2000-01-01T12:00:00Z").getTime();

export type SunAngles = {
  /** Degrees above the horizon (0 at sunrise/sunset). */
  elevation: number;
  /** Degrees clockwise from north (0 = north, 90 = east). */
  azimuth: number;
};

function toJulianDays(date: Date): number {
  return (date.getTime() - J2000) / 86400000;
}

function sunCoordinates(julianDays: number) {
  const meanAnomaly = DEG * (357.5291 + 0.98560028 * julianDays);
  const center = DEG * (1.9148 * Math.sin(meanAnomaly) + 0.02 * Math.sin(2 * meanAnomaly));
  const eclipticLongitude = DEG * (280.16 + 0.9856474 * julianDays) + center;
  const obliquity = DEG * (23.439 - 0.0000004 * julianDays);

  return {
    declination: Math.asin(Math.sin(obliquity) * Math.sin(eclipticLongitude)),
    rightAscension: Math.atan2(
      Math.cos(obliquity) * Math.sin(eclipticLongitude),
      Math.cos(eclipticLongitude),
    ),
  };
}

function siderealTime(julianDays: number, longitudeRad: number): number {
  return DEG * (280.16 + 360.9856235 * julianDays) + longitudeRad;
}

/** Solar position for the campus map (+X east, +Z south, -Z north). */
export function getSunAngles(
  date: Date = new Date(),
  latitude = CAMPUS_LATITUDE,
  longitude = CAMPUS_LONGITUDE,
): SunAngles {
  const julianDays = toJulianDays(date);
  const { declination, rightAscension } = sunCoordinates(julianDays);
  const latitudeRad = latitude * DEG;
  const hourAngle = siderealTime(julianDays, longitude * DEG) - rightAscension;

  const elevation = Math.asin(
    Math.sin(latitudeRad) * Math.sin(declination) +
      Math.cos(latitudeRad) * Math.cos(declination) * Math.cos(hourAngle),
  );

  const azimuth =
    Math.atan2(
      Math.sin(hourAngle),
      Math.cos(hourAngle) * Math.sin(latitudeRad) -
        Math.tan(declination) * Math.cos(latitudeRad),
    ) + Math.PI;

  return {
    elevation: elevation / DEG,
    azimuth: azimuth / DEG,
  };
}

/** Normalized direction toward the sun in campus world space. */
export function getSunDirection(
  date: Date = new Date(),
  vector = new Vector3(),
): Vector3 {
  const { elevation, azimuth } = getSunAngles(date);
  const elevationRad = Math.max(elevation, 0) * DEG;
  const azimuthRad = azimuth * DEG;
  const horizontal = Math.cos(elevationRad);

  return vector.set(
    Math.sin(azimuthRad) * horizontal,
    Math.sin(elevationRad),
    -Math.cos(azimuthRad) * horizontal,
  );
}

/** World-space position for `<Sky sunPosition>` and the directional light. */
export function getSunPosition(
  date: Date = new Date(),
  distance = SUN_LIGHT_DISTANCE,
  vector = new Vector3(),
): Vector3 {
  return getSunDirection(date, vector).multiplyScalar(distance);
}

/** Drei `<Sky>` inclination / azimuth (0–1) matching campus orientation. */
export function getSkyAngles(date: Date = new Date()) {
  const { elevation, azimuth } = getSunAngles(date);
  const clampedElevation = Math.max(elevation, 0);

  return {
    inclination: 0.5 + clampedElevation / 180,
    azimuth: 0.25 + azimuth / 360,
  };
}
