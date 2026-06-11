import { motion } from "framer-motion";
import { Section, SectionEyebrow } from "../marketing";
import { homeHowItWorksSteps } from "./data/homeContent";

export function HomeHowItWorks() {
  return (
    <Section id="how-it-works" dotGrid>
      <div className="mb-10 flex flex-col items-center text-center sm:mb-12 lg:mb-14">
        <SectionEyebrow animated>Getting Started</SectionEyebrow>
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl">
          How It <span className="text-maroon">Works</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm font-bold text-ink/60 sm:text-base">
          Four simple steps to start exploring PUP Lopez in 3D.
        </p>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-[3.75rem] hidden border-t border-dashed border-ink/25 sm:top-[4.25rem] lg:block"
          aria-hidden
        />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-6">
          {homeHowItWorksSteps.map((item, index) => {
            const Icon = item.icon;
            const stepLabel = `Step ${index + 1}`;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="relative mb-5 sm:mb-6">
                  <div className="flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-2xl border border-ink bg-white shadow-brutal-md sm:h-32 sm:w-32 sm:rounded-3xl">
                    <Icon className="h-10 w-10 text-maroon sm:h-11 sm:w-11" />
                  </div>
                  <span className="absolute -right-2 -top-2 rounded-lg border border-ink bg-white px-2.5 py-1 text-xs font-black text-ink shadow-brutal-sm sm:text-sm">
                    {stepLabel}
                  </span>
                </div>

                <h3 className="mb-2 max-w-[16rem] text-lg font-black uppercase tracking-tighter text-ink sm:text-xl">
                  {item.title}
                </h3>
                <p className="max-w-xs text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
