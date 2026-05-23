import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import type { LogbookEntry } from "../../../../services/api";
import { DESTINATIONS, VISITOR_TYPES } from "../../constants";
import type { VisitorRecord } from "../../types";
import { toDatetimeLocal } from "../../utils/time";
import { ModalShell } from "../common/ModalShell";

type EditVisitorModalProps = {
  open: boolean;
  saving: boolean;
  error: string | null;
  entry: VisitorRecord | null;
  onClose: () => void;
  onSubmit: (id: string, patch: Partial<LogbookEntry>) => Promise<void>;
};

type FormState = Partial<LogbookEntry>;

function buildFormFromEntry(entry: VisitorRecord | null): FormState {
  if (!entry) return {};
  return {
    fullName: entry.fullName,
    visitorType: entry.visitorType,
    destination: entry.destination,
    purpose: entry.purpose,
    date: entry.date,
    timeIn: entry.timeIn,
    timeOut: entry.timeOut ?? "",
  };
}

export function EditVisitorModal({
  open,
  saving,
  error,
  entry,
  onClose,
  onSubmit,
}: EditVisitorModalProps) {
  const [form, setForm] = useState<FormState>(() => buildFormFromEntry(entry));

  useEffect(() => {
    setForm(buildFormFromEntry(entry));
  }, [entry]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!entry) return;

    const patch: Partial<LogbookEntry> = {
      fullName: form.fullName?.trim(),
      visitorType: form.visitorType?.trim(),
      destination: form.destination?.trim(),
      purpose: form.purpose?.trim(),
    };

    if (form.date !== undefined) patch.date = form.date;
    if (form.timeIn !== undefined) patch.timeIn = form.timeIn;
    if (form.timeOut !== undefined) patch.timeOut = form.timeOut;

    await onSubmit(entry._id, patch);
  };

  return (
    <ModalShell
      open={open && !!entry}
      title="Edit Visitor"
      subtitle="Update fields then save"
      disableClose={saving}
      onClose={onClose}
      icon={<Pencil className="w-4 h-4 text-[#660B05]" />}
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#660B05] text-white hover:bg-[#8C1007] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      }
    >
      <div className="p-5 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              value={form.fullName || ""}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Visitor Type</label>
            <select
              value={form.visitorType || ""}
              onChange={(e) => updateField("visitorType", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            >
              <option value="">Select</option>
              {VISITOR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Destination</label>
            <select
              value={form.destination || ""}
              onChange={(e) => updateField("destination", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            >
              <option value="">Select</option>
              {DESTINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Time Out</label>
            <input
              type="datetime-local"
              value={toDatetimeLocal(form.timeOut)}
              onChange={(e) =>
                updateField(
                  "timeOut",
                  e.target.value ? new Date(e.target.value).toISOString() : ""
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            />
            <div className="text-[11px] text-gray-500 mt-1">
              Leave blank for In Progress
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Purpose</label>
          <textarea
            value={form.purpose || ""}
            onChange={(e) => updateField("purpose", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Time In</label>
            <input
              type="datetime-local"
              value={toDatetimeLocal(form.timeIn)}
              onChange={(e) =>
                updateField(
                  "timeIn",
                  e.target.value ? new Date(e.target.value).toISOString() : form.timeIn
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date ? new Date(form.date).toISOString().slice(0, 10) : ""}
              onChange={(e) =>
                updateField(
                  "date",
                  e.target.value ? new Date(e.target.value).toISOString() : form.date
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
