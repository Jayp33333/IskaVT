/** Canonical model paths — must match the strings passed to loaders in the app. */
const MODEL_PATHS_BASE = {
  campus: "./models/PUP_CAMPUS.glb",
  guard: "/models/avatars/guard.glb",
  professor: "/models/avatars/professor1.glb",
  iskaVrm: "models/avatars/Iska.vrm",
  iskoVrm: "models/avatars/Isko.vrm",
} as const;

function withBuildVersion(path: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${__APP_BUILD_ID__}`;
}

export const MODEL_PATHS = {
  campus: withBuildVersion(MODEL_PATHS_BASE.campus),
  guard: withBuildVersion(MODEL_PATHS_BASE.guard),
  professor: withBuildVersion(MODEL_PATHS_BASE.professor),
  iskaVrm: withBuildVersion(MODEL_PATHS_BASE.iskaVrm),
  iskoVrm: withBuildVersion(MODEL_PATHS_BASE.iskoVrm),
} as const;

export const ALL_MODEL_URLS = Object.values(MODEL_PATHS);

export function isModelUrl(url: string): boolean {
  return /\.(glb|vrm)(\?.*)?$/i.test(url);
}
