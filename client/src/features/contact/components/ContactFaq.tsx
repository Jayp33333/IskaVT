import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CONTACT_FAQ_ITEMS } from "../constants";

const FAQ_SUBTITLE =
  "Everything you need to know about the virtual tour and campus inquiries.";

export function ContactFaq() {
  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
        <h2 className="text-2xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-3xl md:text-4xl">
          Frequently Asked <span className="text-maroon">Questions</span>
        </h2>
        <p className="mt-3 max-w-xl text-sm font-bold text-ink/60 sm:text-base">
          {FAQ_SUBTITLE}
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
        {CONTACT_FAQ_ITEMS.map((item, index) => (
          <motion.details
            key={item.question}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group rounded-2xl border-2 border-ink bg-white shadow-brutal-md open:shadow-brutal-maroon sm:rounded-3xl sm:border-4"
          >
            <summary className="cursor-pointer list-none px-5 py-4 marker:content-none sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                <span className="text-left text-sm font-black uppercase tracking-tighter text-ink sm:text-base">
                  {item.question}
                </span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-maroon transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
              <p className="text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
                {item.answer}
              </p>
            </div>
          </motion.details>
        ))}
      </div>
    </section>
  );
}
