import { motion } from "framer-motion";
import { Section, SectionEyebrow } from "../marketing";
import { homeHowItWorksSteps } from "./data/homeContent";

export function HomeHowItWorks() {
  return (
    <Section id="how-it-works">
      <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
        <SectionEyebrow animated>Getting Started</SectionEyebrow>
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl">
          How It <span className="text-maroon">Works</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm font-bold text-ink/60 sm:text-base">
          Four simple steps to start exploring PUP Lopez in 3D.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {homeHowItWorksSteps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="relative rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal-md sm:rounded-3xl sm:border-4 sm:p-6"
          >
            <span className="mb-3 inline-block rounded-lg border-2 border-ink bg-maroon px-2.5 py-1 text-xs font-black text-white sm:text-sm">
              {item.step}
            </span>
            <h3 className="mb-2 text-lg font-black uppercase tracking-tighter text-ink sm:text-xl">
              {item.title}
            </h3>
            <p className="text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
