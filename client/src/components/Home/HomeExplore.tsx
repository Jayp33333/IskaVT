import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Section, SectionEyebrow } from "../marketing";
import { homeExploreLocations } from "./data/homeContent";

export function HomeExplore() {
  return (
    <Section id="explore" variant="white">
      <div className="pointer-events-none absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-maroon/5 blur-3xl" />

      <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
        <SectionEyebrow animated>Campus Highlights</SectionEyebrow>
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl">
          Places You Can <span className="text-maroon">Explore</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm font-bold text-ink/60 sm:text-base">
          Walk through major academic buildings, laboratories, offices, and
          landmarks modeled in the virtual campus — from Engineering and
          Education to Health Sciences and more.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {homeExploreLocations.map((location, index) => (
          <motion.article
            key={location.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border-2 border-ink bg-cream p-5 shadow-brutal-sm sm:rounded-3xl sm:border-4 sm:p-6"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-gold sm:h-11 sm:w-11 sm:rounded-xl sm:border-4">
                <MapPin className="h-4 w-4 text-ink sm:h-5 sm:w-5" />
              </div>
              <span className="rounded-lg border-2 border-ink bg-white px-2 py-0.5 text-[10px] font-black uppercase sm:text-xs">
                {location.tag}
              </span>
            </div>
            <h3 className="mb-2 text-base font-black uppercase tracking-tighter text-maroon sm:text-lg">
              {location.name}
            </h3>
            <p className="text-sm font-bold leading-relaxed text-ink/70">
              {location.description}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
