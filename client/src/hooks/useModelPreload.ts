import { useEffect } from "react";
import { ALL_MODEL_URLS } from "../data/modelRegistry";
import { preloadAllModels } from "../utils/modelCache";

export function useModelPreload() {
  useEffect(() => {
    void preloadAllModels(ALL_MODEL_URLS);
  }, []);
}
