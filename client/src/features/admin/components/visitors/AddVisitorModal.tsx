import { Plus } from "lucide-react";
import { useState } from "react";
import type { LogbookEntry } from "../../../../services/api";
import { DESTINATIONS, VISITOR_TYPES } from "../../constants";
import { toDatetimeLocal } from "../../utils/time";
import { ModalShell } from "../common/ModalShell";

type AddVisitorModalProps = {
  open: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (entry: LogbookEntry) => Promise<void>;
};

type FormState = Partial<LogbookEntry>;

function makeInitialState(): FormState {
  return {
    fullName: "",
    visitorType: "",
    destination: "",
    purpose: "",
    date: new Date().toISOString().split("T")[0],
    timeIn: new Date().toISOString(),
  };
}

export function AddVisitorModal(props: AddVisitorModalProps) {
  // Mount/unmount each time the modal opens so internal form state
  // is fresh without resorting to setState-in-effect.
  if (!props.open) return null;
  return <AddVisitorModalBody {...props} />;
}

function AddVisitorModalBody({
  open,
  saving,
  error,
  onClose,
  onSubmit,
}: AddVisitorModalProps) {
  const [form, setForm] = useState<FormState>(makeInitialState);
  const [localError, setLocalError] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (
      !form.fullName?.trim() ||
      !form.visitorType?.trim() ||
      !form.destination?.trim() ||
      !form.purpose?.trim()
    ) {
      setLocalError("Please fill in all required fields");
      return;
    }

    const entry: LogbookEntry = {
      fullName: form.fullName.trim(),
      visitorType: form.visitorType.trim(),
      destination: form.destination.trim(),
      purpose: form.purpose.trim(),
      date: form.date || new Date().toISOString().split("T")[0],
      timeIn: form.timeIn || new Date().toISOString(),
      timeOut: form.timeOut || undefined,
    };

    setLocalError(null);
    await onSubmit(entry);
  };

  return (
    <ModalShell
      open={open}
      title="Add New Visitor"
      subtitle="Fill in all required fields"
      disableClose={saving}
      onClose={onClose}
      icon={<Plus className="w-4 h-4 text-[#660B05]" />}
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
            {saving ? "Adding…" : "Add Visitor"}
          </button>
        </div>
      }
    >
      <div className="p-5 space-y-4">
        {(localError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
            {localError || error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.fullName || ""}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Visitor Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.visitorType || ""}
              onChange={(e) => updateField("visitorType", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            >
              <option value="">Select visitor type</option>
              {VISITOR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Destination <span className="text-red-500">*</span>
            </label>
            <select
              value={form.destination || ""}
              onChange={(e) => updateField("destination", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            >
              <option value="">Select destination</option>
              {DESTINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date ? new Date(form.date).toISOString().slice(0, 10) : ""}
              onChange={(e) =>
                updateField(
                  "date",
                  e.target.value
                    ? new Date(e.target.value).toISOString().split("T")[0]
                    : form.date
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.purpose || ""}
            onChange={(e) => updateField("purpose", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            placeholder="Enter purpose of visit"
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
                  e.target.value
                    ? new Date(e.target.value).toISOString()
                    : new Date().toISOString()
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Time Out (Optional)
            </label>
            <input
              type="datetime-local"
              value={toDatetimeLocal(form.timeOut)}
              onChange={(e) =>
                updateField(
                  "timeOut",
                  e.target.value ? new Date(e.target.value).toISOString() : undefined
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
            />
            <div className="text-[11px] text-gray-500 mt-1">
              Leave blank for active session
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
