/** Canonical model paths — must match the strings passed to loaders in the app. */
export const MODEL_PATHS = {
  campus: "./models/PUP_CAMPUS.glb",
  guard: "/models/avatars/guard.glb",
  professor: "/models/avatars/professor1.glb",
  iskaVrm: "models/avatars/Iska.vrm",
  iskoVrm: "models/avatars/Isko.vrm",
} as const;

export const ALL_MODEL_URLS = Object.values(MODEL_PATHS);

export function isModelUrl(url: string): boolean {
  return /\.(glb|vrm)(\?.*)?$/i.test(url);
}
