import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import {
  LOGBOOK_ENTRY_ID_KEY,
  LOGBOOK_TIME_IN_KEY,
  setSessionFullName,
} from "../../constants/logbookSession";
import { DESTINATIONS } from "../../sampleData";
import { logbookAPI, type LogbookEntry } from "../../services/api";
import { enterKioskLandscape } from "../../utils/kiosk";
import { getErrorMessage } from "../../utils/errors";

interface LogbookFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  required?: boolean;
}

export const LogbookFormDialog = ({ open, onClose, onSuccess, required = false }: LogbookFormDialogProps) => {
  const [formData, setFormData] = useState<LogbookEntry>({
    fullName: "",
    visitorType: "",
    purpose: "",
    destination: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visitorTypes = ["Student", "Faculty", "Staff", "Visitor", "Alumni", "Guest"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      void enterKioskLandscape();
      const now = new Date();
      const entryData: LogbookEntry = {
        ...formData,
        date: now.toISOString(),
        timeIn: now.toISOString(),
      };

      const response = await logbookAPI.createEntry(entryData);
      
      if (response.data?._id) {
        localStorage.setItem(LOGBOOK_ENTRY_ID_KEY, response.data._id);
        localStorage.setItem(LOGBOOK_TIME_IN_KEY, new Date().toISOString());
        const name = response.data.fullName?.trim() || formData.fullName.trim();
        setSessionFullName(name);
      }
      
      onSuccess();
      setFormData({ fullName: "", visitorType: "", purpose: "", destination: "" });
      onClose();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Oops! Something went wrong."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase = "w-full px-4 py-3 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 text-sm [@media(max-height:500px)]:text-[11px] font-bold text-ink bg-white border-[3px] border-ink rounded-2xl outline-none shadow-brutal-sm focus:bg-yellow-50 placeholder:text-slate-400 transition-all";
  const labelBase = "block text-xs [@media(max-height:500px)]:text-[9px] font-black text-ink/80 uppercase tracking-wider mb-2 ml-1";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/85 z-[5000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !required && !isSubmitting && onClose()}
          />

          <motion.div
            className="fixed inset-0 z-[5001] flex items-center justify-center p-4 [@media(max-height:500px)]:p-2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto mx-auto flex h-[min(92dvh,34rem)] w-full max-w-[26rem] shrink-0 flex-col overflow-hidden rounded-2xl border-[4px] border-ink bg-cream text-ink shadow-brutal-lg [@media(max-height:500px)]:h-[min(96dvh,30rem)] [@media(max-height:500px)]:max-w-[min(92vw,20rem)] [@media(orientation:landscape)_and_(max-height:768px)]:h-[min(96dvh,28rem)]"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
              role="dialog"
              aria-modal="true"
              aria-label="Visitor Logbook"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b-[3px] border-ink bg-maroon px-4 py-4 sm:px-5 [@media(max-height:500px)]:px-3.5 [@media(max-height:500px)]:py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-white p-1 [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:p-0.5">
                    <img
                      src="/images/pup-logo.png"
                      alt="PUP Logo"
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <h2 className="truncate text-lg font-black italic text-white sm:text-xl [@media(max-height:500px)]:text-base">
                    Visitor Logbook
                  </h2>
                </div>
                {!required && (
                  <button
                    onClick={onClose}
                    className="shrink-0 rounded-xl border-2 border-ink bg-white p-1.5 text-ink transition-colors hover:bg-cream active:scale-95 [@media(max-height:500px)]:p-1"
                    aria-label="Close"
                    type="button"
                  >
                    <X className="h-4 w-4" strokeWidth={3} />
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-5 [@media(max-height:500px)]:p-3.5 custom-scrollbar">
                  <div className="shrink-0 space-y-5 [@media(max-height:500px)]:space-y-3">
                    <div>
                      <label className={labelBase}>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={inputBase}
                        placeholder="e.g Juan Dela Cruz"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [@media(max-height:500px)]:gap-3">
                      <div>
                        <label className={labelBase}>Who are you?</label>
                        <select
                          name="visitorType"
                          value={formData.visitorType}
                          onChange={handleChange}
                          required
                          className={inputBase}
                        >
                          <option value="">Select</option>
                          {visitorTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelBase}>Heading to?</label>
                        <select
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          required
                          className={inputBase}
                        >
                          <option value="">Select</option>
                          {DESTINATIONS.map((d) => (
                            <option key={d.id} value={d.name}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex min-h-[7rem] flex-1 flex-col [@media(max-height:500px)]:mt-3 [@media(max-height:500px)]:min-h-[5.5rem]">
                    <label className={labelBase}>Purpose of Visit</label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      maxLength={200}
                      className={`${inputBase} min-h-[7rem] flex-1 resize-none [@media(max-height:500px)]:min-h-[5.5rem]`}
                      placeholder="Tell us what's up!"
                    />
                  </div>

                  {error && (
                    <div className="mt-3 shrink-0 rounded-2xl border-2 border-ink bg-red-100 p-3 text-sm font-black text-red-700 shadow-brutal-sm [@media(max-height:500px)]:mt-2 [@media(max-height:500px)]:text-xs">
                      {error}
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t-[3px] border-ink bg-muted px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-4 [@media(max-height:500px)]:px-3.5 [@media(max-height:500px)]:py-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border-[3px] border-ink bg-maroon py-3.5 text-base font-black uppercase italic tracking-wide text-white shadow-brutal-md transition-all hover:bg-[#c93333] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 [@media(max-height:500px)]:py-2.5 [@media(max-height:500px)]:text-xs"
                  >
                    {isSubmitting ? "Starting..." : "Start Tour"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};