import { motion } from "framer-motion";
import { Section, SectionEyebrow } from "../marketing";
import { homeWelcomeContent } from "./data/homeContent";

export function HomeWelcome() {
  const { projectCard } = homeWelcomeContent;

  return (
    <Section id="welcome" variant="cream" dotGrid>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col text-left"
        >
          <SectionEyebrow animated className="mb-4 sm:mb-5">
            About the Tour
          </SectionEyebrow>

          <h2 className="mb-4 text-3xl font-black uppercase leading-[1.1] tracking-tighter text-ink sm:mb-5 sm:text-4xl md:text-5xl md:leading-[1.12]">
            Virtual <span className="text-maroon">Campus Tour</span>
          </h2>

          <p className="mb-4 text-sm font-bold text-ink/60 sm:mb-5 sm:text-base">
            {homeWelcomeContent.headline}
          </p>

          <p className="mb-6 text-sm font-bold leading-relaxed text-ink/75 sm:mb-8 sm:text-base">
            {homeWelcomeContent.intro}
          </p>

          <ul className="space-y-3 border-t-2 border-ink/10 pt-6 sm:space-y-3.5 sm:pt-7">
            {homeWelcomeContent.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm font-bold text-ink/75 sm:text-base"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full border border-ink bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="w-full lg:max-w-md lg:justify-self-end xl:max-w-lg"
        >
          <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brutal-md sm:rounded-3xl sm:border-4">
            <div className="p-4 pb-0 sm:p-5 sm:pb-0">
              <div className="overflow-hidden rounded-xl border-2 border-ink sm:rounded-2xl sm:border-4">
                <img
                  src={homeWelcomeContent.image}
                  alt={homeWelcomeContent.imageAlt}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="p-5 sm:p-6 lg:p-7">
              <h3 className="text-xl font-black uppercase tracking-tighter text-ink sm:text-2xl">
                ISKA <span className="text-maroon">VT</span>
              </h3>
              <p className="mt-1 text-sm font-bold text-ink/60 sm:text-base">
                {projectCard.role}
              </p>
              <p className="mt-3 text-sm font-medium text-ink/55 sm:text-base">
                {projectCard.tagline}
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </Section>
  );
}
