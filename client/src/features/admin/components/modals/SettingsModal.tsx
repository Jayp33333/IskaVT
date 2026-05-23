import { Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  DEFAULT_SETTINGS,
  REFRESH_INTERVAL_MS,
  REFRESH_LABELS,
  TOAST_SHORT_DURATION_MS,
} from "../../constants";
import { useAdmin } from "../../context/AdminContext";
import type {
  AdminSettings,
  ExportFormat,
  RefreshOption,
} from "../../types";
import { ModalShell } from "../common/ModalShell";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { settings, toast } = useAdmin();
  const [draft, setDraft] = useState<AdminSettings>(settings.settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setDraft(settings.settings);
  }, [open, settings.settings]);

  const updateDraft = <K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K]
  ) => setDraft((p) => ({ ...p, [key]: value }));

  const handleSave = () => {
    try {
      setSaving(true);
      settings.saveSettings(draft);
      onClose();
      toast.showToast("Settings saved", "success", TOAST_SHORT_DURATION_MS);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save settings";
      toast.showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      open={open}
      title="Settings"
      subtitle="Preferences are saved on this device"
      disableClose={saving}
      onClose={onClose}
      icon={<SettingsIcon className="w-4 h-4 text-[#660B05]" />}
      footer={
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setDraft(DEFAULT_SETTINGS)}
            disabled={saving}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:text-[#660B05] hover:bg-[#660B05]/10 disabled:opacity-50 transition-colors"
          >
            Reset to defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#660B05] text-white hover:bg-[#8C1007] disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </div>
      }
    >
      <div className="p-5 space-y-5">
        <AlertsToggle
          value={draft.alertsEnabled}
          onChange={(v) => updateDraft("alertsEnabled", v)}
        />
        <RefreshIntervalSelect
          value={draft.refreshInterval}
          onChange={(v) => updateDraft("refreshInterval", v)}
        />
        <ExportFormatPicker
          value={draft.defaultExportFormat}
          onChange={(v) => updateDraft("defaultExportFormat", v)}
        />
      </div>
    </ModalShell>
  );
}

type AlertsToggleProps = {
  value: boolean;
  onChange: (next: boolean) => void;
};

function AlertsToggle({ value, onChange }: AlertsToggleProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        New Activity Alerts
      </label>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-800">Pop-up notifications</div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Show a toast when new visitors sign in or messages arrive.
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#660B05]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#660B05]" />
        </label>
      </div>
    </div>
  );
}

type RefreshIntervalSelectProps = {
  value: RefreshOption;
  onChange: (next: RefreshOption) => void;
};

function RefreshIntervalSelect({ value, onChange }: RefreshIntervalSelectProps) {
  const options = Object.keys(REFRESH_INTERVAL_MS) as RefreshOption[];

  return (
    <div>
      <label
        htmlFor="setting-refresh"
        className="block text-xs font-semibold text-gray-700 mb-2"
      >
        Auto-refresh Interval
      </label>
      <select
        id="setting-refresh"
        value={value}
        onChange={(e) => onChange(e.target.value as RefreshOption)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {REFRESH_LABELS[opt]}
          </option>
        ))}
      </select>
      <div className="text-[11px] text-gray-500 mt-1">
        Controls how often the dashboard checks for new visitors and messages.
      </div>
    </div>
  );
}

type ExportFormatPickerProps = {
  value: ExportFormat;
  onChange: (next: ExportFormat) => void;
};

const EXPORT_FORMAT_OPTIONS: { format: ExportFormat; description: string }[] = [
  { format: "pdf", description: "Printable report (opens print dialog)" },
  { format: "csv", description: "Spreadsheet-friendly file" },
];

function ExportFormatPicker({ value, onChange }: ExportFormatPickerProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Default Export Format
      </label>
      <div className="grid grid-cols-2 gap-2">
        {EXPORT_FORMAT_OPTIONS.map(({ format, description }) => {
          const active = value === format;
          return (
            <button
              key={format}
              type="button"
              onClick={() => onChange(format)}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                active
                  ? "border-[#660B05] bg-[#660B05]/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`text-sm font-bold uppercase ${
                  active ? "text-[#660B05]" : "text-gray-700"
                }`}
              >
                {format}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">{description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
