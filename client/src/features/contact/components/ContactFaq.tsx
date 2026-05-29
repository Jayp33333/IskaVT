import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { CONTACT_FAQ_ITEMS } from "../constants";

export function ContactFaq() {
  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-[#FFD700] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:rounded-2xl sm:border-4">
          <HelpCircle className="h-6 w-6 text-black" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-black sm:text-3xl">
          Frequently Asked <span className="text-[#800000]">Questions</span>
        </h2>
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        {CONTACT_FAQ_ITEMS.map((item, index) => (
          <motion.details
            key={item.question}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] open:shadow-[6px_6px_0px_0px_rgba(128,0,0,1)] sm:rounded-3xl sm:border-4"
          >
            <summary className="cursor-pointer list-none px-5 py-4 text-sm font-black uppercase tracking-tighter text-black marker:content-none sm:px-6 sm:py-5 sm:text-base">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-[#800000] transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="border-t-2 border-black px-5 pb-4 pt-3 sm:border-t-4 sm:px-6 sm:pb-5 sm:pt-4">
              <p className="text-sm font-bold leading-relaxed text-black/70 sm:text-base">
                {item.answer}
              </p>
            </div>
          </motion.details>
        ))}
      </div>
    </section>
  );
}
