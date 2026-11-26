import { Plus } from "lucide-react";
import { useState } from "react";
import type { LogbookEntry } from "../../../../services/api";
import { DESTINATIONS, VISITOR_TYPES } from "../../constants";
import { toDatetimeLocal } from "../../utils/time";
import {
  todayLocalDate,
  validateVisitorForm,
  VISITOR_FULL_NAME_MAX,
  VISITOR_PURPOSE_MAX,
  type VisitorFormErrors,
  type VisitorFormField,
  type VisitorFormValues,
} from "../../utils/visitorForm";
import { ModalShell } from "../common/ModalShell";

type AddVisitorModalProps = {
  open: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (entry: LogbookEntry) => Promise<void>;
};

type FormState = VisitorFormValues;

const ID_PREFIX = "add-visitor";
const fieldId = (field: VisitorFormField) => `${ID_PREFIX}-${field}`;
const errorId = (field: VisitorFormField) => `${ID_PREFIX}-${field}-error`;

const fieldClass = (invalid: boolean) =>
  `w-full px-3 py-2 rounded-lg border ${
    invalid ? "border-red-300" : "border-gray-200"
  } text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]`;

function makeInitialState(): FormState {
  return {
    fullName: "",
    visitorType: "",
    destination: "",
    purpose: "",
    date: todayLocalDate(),
    timeIn: new Date().toISOString(),
  };
}

function FieldError({ field, message }: { field: VisitorFormField; message?: string }) {
  if (!message) return null;
  return (
    <div id={errorId(field)} className="text-[11px] text-red-600 mt-1">
      {message}
    </div>
  );
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
  const [errors, setErrors] = useState<VisitorFormErrors>({});

  const updateField = <K extends VisitorFormField>(key: K, value: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((prev) => {
      // The timeOut error depends on timeIn, so clear both together.
      const clear: VisitorFormField[] = key === "timeIn" ? ["timeIn", "timeOut"] : [key];
      if (!clear.some((f) => prev[f])) return prev;
      const next = { ...prev };
      for (const f of clear) delete next[f];
      return next;
    });
  };

  const a11y = (field: VisitorFormField) => ({
    id: fieldId(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? errorId(field) : undefined,
  });

  const handleSubmit = async () => {
    const result = validateVisitorForm(form, { mode: "add" });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    await onSubmit(result.value);
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
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={fieldId("fullName")}
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              {...a11y("fullName")}
              value={form.fullName || ""}
              onChange={(e) => updateField("fullName", e.target.value)}
              maxLength={VISITOR_FULL_NAME_MAX}
              className={fieldClass(!!errors.fullName)}
              placeholder="Enter full name"
            />
            <FieldError field="fullName" message={errors.fullName} />
          </div>
          <div>
            <label
              htmlFor={fieldId("visitorType")}
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Visitor Type <span className="text-red-500">*</span>
            </label>
            <select
              {...a11y("visitorType")}
              value={form.visitorType || ""}
              onChange={(e) => updateField("visitorType", e.target.value)}
              className={`${fieldClass(!!errors.visitorType)} bg-white`}
            >
              <option value="">Select visitor type</option>
              {VISITOR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <FieldError field="visitorType" message={errors.visitorType} />
          </div>
          <div>
            <label
              htmlFor={fieldId("destination")}
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Destination <span className="text-red-500">*</span>
            </label>
            <select
              {...a11y("destination")}
              value={form.destination || ""}
              onChange={(e) => updateField("destination", e.target.value)}
              className={`${fieldClass(!!errors.destination)} bg-white`}
            >
              <option value="">Select destination</option>
              {DESTINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <FieldError field="destination" message={errors.destination} />
          </div>
          <div>
            <label
              htmlFor={fieldId("date")}
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              {...a11y("date")}
              type="date"
              value={form.date || ""}
              onChange={(e) => updateField("date", e.target.value)}
              className={fieldClass(!!errors.date)}
            />
            <FieldError field="date" message={errors.date} />
          </div>
        </div>

        <div>
          <label
            htmlFor={fieldId("purpose")}
            className="block text-xs font-semibold text-gray-700 mb-1"
          >
            Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            {...a11y("purpose")}
            value={form.purpose || ""}
            onChange={(e) => updateField("purpose", e.target.value)}
            rows={3}
            maxLength={VISITOR_PURPOSE_MAX}
            className={fieldClass(!!errors.purpose)}
            placeholder="Enter purpose of visit"
          />
          <FieldError field="purpose" message={errors.purpose} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={fieldId("timeIn")}
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Time In
            </label>
            <input
              {...a11y("timeIn")}
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
              className={fieldClass(!!errors.timeIn)}
            />
            <FieldError field="timeIn" message={errors.timeIn} />
          </div>
          <div>
            <label
              htmlFor={fieldId("timeOut")}
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Time Out (Optional)
            </label>
            <input
              {...a11y("timeOut")}
              type="datetime-local"
              value={toDatetimeLocal(form.timeOut)}
              onChange={(e) =>
                updateField(
                  "timeOut",
                  e.target.value ? new Date(e.target.value).toISOString() : undefined
                )
              }
              className={fieldClass(!!errors.timeOut)}
            />
            {errors.timeOut ? (
              <FieldError field="timeOut" message={errors.timeOut} />
            ) : (
              <div className="text-[11px] text-gray-500 mt-1">
                Leave blank for active session
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
