import { useCallback, useState } from "react";
import { messageAPI } from "../../../services/api";
import { getErrorMessage } from "../../../utils/errors";
import { CONTACT_SUCCESS_MESSAGE } from "../constants";
import type { ContactFormFields, ContactFormStatus } from "../types";
import { validateContactForm } from "../utils/validateContactForm";

const EMPTY_FIELDS: ContactFormFields = {
  name: "",
  email: "",
  message: "",
};

export type UseContactFormValue = {
  fields: ContactFormFields;
  submitting: boolean;
  status: ContactFormStatus;
  setField: (key: keyof ContactFormFields, value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export function useContactForm(): UseContactFormValue {
  const [fields, setFields] = useState<ContactFormFields>(EMPTY_FIELDS);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<ContactFormStatus>({ type: "idle" });

  const setField = useCallback((key: keyof ContactFormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validation = validateContactForm(fields);
      if (!validation.ok) {
        setStatus({ type: "error", message: validation.message });
        return;
      }

      try {
        setSubmitting(true);
        setStatus({ type: "idle" });
        await messageAPI.sendMessage(validation.data);
        setStatus({ type: "success", message: CONTACT_SUCCESS_MESSAGE });
        setFields(EMPTY_FIELDS);
      } catch (err: unknown) {
        setStatus({
          type: "error",
          message: getErrorMessage(err, "Something went wrong. Please try again."),
        });
      } finally {
        setSubmitting(false);
      }
    },
    [fields]
  );

  return { fields, submitting, status, setField, handleSubmit };
}
