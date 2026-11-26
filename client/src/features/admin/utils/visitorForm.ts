import type { LogbookEntry } from "../../../services/api";
import { toDateInputValue } from "./time";

/** Max lengths, matching the backend's logbook limits. */
export const VISITOR_FULL_NAME_MAX = 120;
export const VISITOR_PURPOSE_MAX = 500;
export const VISITOR_TYPE_MAX = 60;
export const VISITOR_DESTINATION_MAX = 120;

export type VisitorFormMode = "add" | "edit";

/** Raw form state as held by the Add/Edit visitor modals. */
export type VisitorFormValues = {
  fullName?: string;
  visitorType?: string;
  destination?: string;
  purpose?: string;
  /** `YYYY-MM-DD` (or any parseable date string, normalized to local). */
  date?: string;
  /** ISO instant. */
  timeIn?: string;
  /** ISO instant; blank/undefined means "still in progress". */
  timeOut?: string | null;
};

export type VisitorFormField = keyof VisitorFormValues;

export type VisitorFormErrors = Partial<Record<VisitorFormField, string>>;

export type VisitorFormValidationResult =
  | { ok: true; value: LogbookEntry }
  | { ok: false; errors: VisitorFormErrors };

/** Today's date on the local calendar as `YYYY-MM-DD` (not UTC). */
export function todayLocalDate(now: Date = new Date()): string {
  return toDateInputValue(now.toISOString());
}

function parseInstant(value: string | null | undefined): number | null {
  if (!value) return null;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? null : t;
}

function requireText(
  value: string | undefined,
  label: string,
  max?: number
): { value: string; error?: string } {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return { value: trimmed, error: `${label} is required` };
  if (max !== undefined && trimmed.length > max) {
    return { value: trimmed, error: `${label} must be ${max} characters or fewer` };
  }
  return { value: trimmed };
}

/**
 * Validates and normalizes the Add/Edit visitor form.
 *
 * - fullName, visitorType, destination, purpose: required (trimmed);
 *   max lengths match the backend (fullName 120, visitorType 60,
 *   destination 120, purpose 500).
 * - timeIn: required, must be a valid date.
 * - timeOut: optional; when set it must be valid and not before timeIn.
 * - date: normalized to a local `YYYY-MM-DD`; when blank it falls back to the
 *   local date of timeIn.
 *
 * A blank timeOut is returned as `undefined` in "add" mode (field omitted)
 * and as `""` in "edit" mode (the backend clears timeOut on "").
 */
export function validateVisitorForm(
  form: VisitorFormValues,
  { mode }: { mode: VisitorFormMode }
): VisitorFormValidationResult {
  const errors: VisitorFormErrors = {};

  const fullName = requireText(form.fullName, "Full name", VISITOR_FULL_NAME_MAX);
  const visitorType = requireText(form.visitorType, "Visitor type", VISITOR_TYPE_MAX);
  const destination = requireText(form.destination, "Destination", VISITOR_DESTINATION_MAX);
  const purpose = requireText(form.purpose, "Purpose", VISITOR_PURPOSE_MAX);
  if (fullName.error) errors.fullName = fullName.error;
  if (visitorType.error) errors.visitorType = visitorType.error;
  if (destination.error) errors.destination = destination.error;
  if (purpose.error) errors.purpose = purpose.error;

  const timeInMs = parseInstant(form.timeIn);
  if (timeInMs === null) errors.timeIn = "Enter a valid time in";

  const hasTimeOut = !!form.timeOut && form.timeOut.trim() !== "";
  const timeOutMs = hasTimeOut ? parseInstant(form.timeOut) : null;
  if (hasTimeOut) {
    if (timeOutMs === null) {
      errors.timeOut = "Enter a valid time out";
    } else if (timeInMs !== null && timeOutMs < timeInMs) {
      errors.timeOut = "Time out cannot be before time in";
    }
  }

  let date = "";
  if (form.date && form.date.trim()) {
    date = toDateInputValue(form.date.trim());
    if (!date) errors.date = "Enter a valid date";
  } else if (timeInMs !== null) {
    date = toDateInputValue(new Date(timeInMs).toISOString());
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      fullName: fullName.value,
      visitorType: visitorType.value,
      destination: destination.value,
      purpose: purpose.value,
      date,
      timeIn: new Date(timeInMs as number).toISOString(),
      timeOut:
        timeOutMs !== null
          ? new Date(timeOutMs).toISOString()
          : mode === "edit"
            ? ""
            : undefined,
    },
  };
}
