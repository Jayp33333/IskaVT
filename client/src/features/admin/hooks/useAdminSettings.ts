import { useCallback, useState } from "react";
import {
  DEFAULT_SETTINGS,
  REFRESH_INTERVAL_MS,
  SETTINGS_STORAGE_KEY,
} from "../constants";
import type { AdminSettings, ExportFormat, RefreshOption } from "../types";

function loadSettings(): AdminSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<AdminSettings>;

    const alertsEnabled =
      typeof parsed.alertsEnabled === "boolean"
        ? parsed.alertsEnabled
        : DEFAULT_SETTINGS.alertsEnabled;

    const refreshInterval: RefreshOption =
      parsed.refreshInterval && parsed.refreshInterval in REFRESH_INTERVAL_MS
        ? parsed.refreshInterval
        : DEFAULT_SETTINGS.refreshInterval;

    const defaultExportFormat: ExportFormat =
      parsed.defaultExportFormat === "csv" || parsed.defaultExportFormat === "pdf"
        ? parsed.defaultExportFormat
        : DEFAULT_SETTINGS.defaultExportFormat;

    return { alertsEnabled, refreshInterval, defaultExportFormat };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function persistSettings(settings: AdminSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export type UseAdminSettingsValue = {
  settings: AdminSettings;
  saveSettings: (next: AdminSettings) => void;
  resetSettings: () => AdminSettings;
};

export function useAdminSettings(): UseAdminSettingsValue {
  const [settings, setSettings] = useState<AdminSettings>(loadSettings);

  const saveSettings = useCallback((next: AdminSettings) => {
    persistSettings(next);
    setSettings(next);
  }, []);

  const resetSettings = useCallback((): AdminSettings => {
    persistSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }, []);

  return { settings, saveSettings, resetSettings };
}
