import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { CONTACT_FORM_IDS, CONTACT_INPUT_CLASS } from "../constants";
import type { UseContactFormValue } from "../hooks/useContactForm";

type ContactFormProps = Pick<
  UseContactFormValue,
  "fields" | "submitting" | "status" | "setField" | "handleSubmit"
>;

export function ContactForm({
  fields,
  submitting,
  status,
  setField,
  handleSubmit,
}: ContactFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-black bg-white p-5 shadow-[10px_10px_0px_0px_rgba(255,215,0,1)] sm:rounded-3xl sm:p-6 md:p-8 lg:w-3/5 xl:w-2/3 lg:rounded-[36px] lg:shadow-[16px_16px_0px_0px_rgba(255,215,0,1)]"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
        <div className="flex flex-col gap-2">
          <label
            className="ml-1 text-xs font-black uppercase tracking-widest text-ink sm:text-sm"
            htmlFor={CONTACT_FORM_IDS.name}
          >
            Your Name
          </label>
          <input
            id={CONTACT_FORM_IDS.name}
            type="text"
            value={fields.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g. Iska"
            disabled={submitting}
            required
            className={CONTACT_INPUT_CLASS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="ml-1 text-xs font-black uppercase tracking-widest text-ink sm:text-sm"
            htmlFor={CONTACT_FORM_IDS.email}
          >
            Email Address
          </label>
          <input
            id={CONTACT_FORM_IDS.email}
            type="email"
            value={fields.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="iska@email.com"
            disabled={submitting}
            required
            className={CONTACT_INPUT_CLASS}
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label
            className="ml-1 text-xs font-black uppercase tracking-widest text-ink sm:text-sm"
            htmlFor={CONTACT_FORM_IDS.message}
          >
            Message
          </label>
          <textarea
            id={CONTACT_FORM_IDS.message}
            rows={4}
            value={fields.message}
            onChange={(e) => setField("message", e.target.value)}
            placeholder="Tell us what's on your mind..."
            disabled={submitting}
            required
            className={`${CONTACT_INPUT_CLASS} resize-none rounded-xl sm:rounded-2xl`}
          />
        </div>

        {status.type !== "idle" && (
          <div
            role="status"
            className={`flex items-start gap-2 rounded-xl border border-black p-3 font-bold sm:gap-3 sm:rounded-2xl sm:p-4 md:col-span-2 ${
              status.type === "success"
                ? "bg-[#FFD700]/30 text-black"
                : "bg-[#800000] text-white"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
            )}
            <span className="text-xs sm:text-sm">{status.message}</span>
          </div>
        )}

        <div className="flex justify-end md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex items-center gap-2 rounded-xl border border-ink bg-maroon px-6 py-3 text-sm font-black uppercase tracking-tighter text-white transition-colors hover:bg-maroon/90 disabled:cursor-not-allowed disabled:opacity-70 sm:gap-3 sm:px-8 sm:py-3.5 sm:text-base"
          >
            {submitting ? (
              <>
                Sending <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
              </>
            ) : (
              <>
                Send Message{" "}
                <Send className="h-4 w-4 transition-transform group-hover:rotate-12 sm:h-5 sm:w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
