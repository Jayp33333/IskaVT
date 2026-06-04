import { motion } from "framer-motion";
import { Section, SectionEyebrow } from "../marketing";
import { homeAudienceCards } from "./data/homeContent";

export function HomeAudience() {
  return (
    <Section id="audience" dotGrid>
      <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
        <SectionEyebrow animated>Built For Everyone</SectionEyebrow>
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl">
          Who Is This <span className="text-maroon">For?</span>
        </h2>
      </div>

      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-3 sm:gap-4">
        {homeAudienceCards.map((card, index) => (
          <motion.span
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2, x: -2 }}
            className="inline-flex rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-black uppercase tracking-tighter text-ink shadow-brutal-sm transition-shadow hover:shadow-brutal-md sm:border-4 sm:px-6 sm:py-3 sm:text-base"
          >
            {card.title}
          </motion.span>
        ))}
      </div>
    </Section>
  );
}
