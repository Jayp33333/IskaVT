import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { ClipboardList, X } from "lucide-react";
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
  const destinations = ["Grandstand", "Lab 1", "Library", "Cafeteria", "Gymnasium", "Other"];

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
        localStorage.setItem('logbookEntryId', response.data._id);
        localStorage.setItem('logbookTimeIn', new Date().toISOString());
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

  const inputBase = "w-full px-4 py-3 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 text-sm [@media(max-height:500px)]:text-[11px] font-bold text-slate-800 bg-white border-[3px] border-slate-900 rounded-2xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:bg-yellow-50 placeholder:text-slate-400 transition-all";
  const labelBase = "block text-xs [@media(max-height:500px)]:text-[9px] font-black text-slate-700 uppercase tracking-wider mb-2 ml-1";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[5000]"
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
              className="w-full max-w-[500px] [@media(max-height:500px)]:max-w-[500px] max-h-[90vh] [@media(max-height:500px)]:max-h-[96dvh] bg-[#FFFDF9] text-slate-800 rounded-[2rem] sm:rounded-[2.5rem] [@media(max-height:500px)]:rounded-2xl border-[4px] sm:border-[6px] [@media(max-height:500px)]:border-[4px] border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] [@media(max-height:500px)]:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-hidden pointer-events-auto flex flex-col"
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 20, stiffness: 250 }}
            >
              <div className="bg-[#D43F3F] border-b-[4px] sm:border-b-[6px] [@media(max-height:500px)]:border-b-[4px] border-slate-900 px-5 py-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 [@media(max-height:500px)]:p-1.5 rounded-2xl bg-yellow-300 border-[3px] border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] shrink-0">
                      <ClipboardList className="w-5 h-5 [@media(max-height:500px)]:w-4 [@media(max-height:500px)]:h-4 text-slate-900" strokeWidth={3.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="inline-block rounded-full bg-yellow-300 border-[3px] border-slate-900 px-2 py-0.5 text-[9px] [@media(max-height:500px)]:hidden font-black uppercase tracking-wider text-slate-900">
                        Visitor Check-In
                      </p>
                      <h2 className="mt-1 text-xl sm:text-2xl [@media(max-height:500px)]:text-sm font-black italic text-white leading-tight truncate">
                        Visitor Logbook
                      </h2>
                    </div>
                  </div>
                  {!required && (
                    <button
                      onClick={onClose}
                      className="bg-white border-[3px] border-slate-900 p-1.5 [@media(max-height:500px)]:p-1 rounded-xl hover:bg-slate-100 transition-transform active:scale-90 shrink-0"
                      aria-label="Close"
                      type="button"
                    >
                      <X size={18} strokeWidth={4} />
                    </button>
                  )}
                </div>
                <p className="mt-2 [@media(max-height:500px)]:mt-1 text-xs [@media(max-height:500px)]:text-[9px] font-bold text-white/90">
                  Fill out your details to start the campus adventure.
                </p>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-5 [@media(max-height:500px)]:p-3 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-5 [@media(max-height:500px)]:space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className={labelBase}>Your Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={inputBase}
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  {/* Two Column for Type & Destination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [@media(max-height:500px)]:gap-3">
                    <div>
                      <label className={labelBase}>Who are you?</label>
                      <select name="visitorType" value={formData.visitorType} onChange={handleChange} required className={inputBase}>
                        <option value="">Select</option>
                        {visitorTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelBase}>Heading to?</label>
                      <select name="destination" value={formData.destination} onChange={handleChange} required className={inputBase}>
                        <option value="">Select</option>
                        {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className={labelBase}>Purpose of Visit</label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      maxLength={200}
                      rows={2}
                      className={`${inputBase} resize-none`}
                      placeholder="Tell us what's up!"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-100 border-[3px] border-slate-900 rounded-2xl font-black text-red-700 text-sm [@media(max-height:500px)]:text-xs shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                      {error}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 [@media(max-height:500px)]:py-2.5 bg-[#D43F3F] hover:bg-[#c93333] text-white border-[3px] border-slate-900 rounded-2xl font-black text-lg [@media(max-height:500px)]:text-xs italic uppercase tracking-wide shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Checking In..." : "Start Tour"}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};