import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Section, SectionEyebrow } from "../marketing";
import {
  homeExploreIntro,
  homeExploreLocations,
  type HomeExploreLocation,
} from "./data/homeContent";

function HighlightCard({
  location,
  index,
}: {
  location: HomeExploreLocation;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.06 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brutal-md transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1 sm:rounded-3xl sm:border-4"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink sm:border-b-4">
        <img
          src={location.image}
          alt={location.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full border-2 border-ink bg-gold px-3 py-1 text-[10px] font-black uppercase tracking-wider text-ink sm:left-4 sm:top-4 sm:text-xs">
          {location.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-maroon" />
          <h3 className="text-lg font-black uppercase leading-tight tracking-tighter text-ink sm:text-xl">
            {location.name}
          </h3>
        </div>

        <p className="mb-4 flex-1 text-sm font-bold leading-relaxed text-ink/65">
          {location.description}
        </p>

        <ul className="flex flex-wrap gap-2 border-t-2 border-ink/10 pt-4">
          {location.highlights.map((item) => (
            <li
              key={item}
              className="rounded-lg border-2 border-ink bg-cream px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-ink/75 sm:text-xs"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export function HomeExplore() {
  return (
    <Section id="explore" variant="white" dotGrid>
      <div className="mb-10 flex flex-col items-center text-center sm:mb-12 lg:mb-14">
        <SectionEyebrow animated>Campus Highlights</SectionEyebrow>
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl">
          Places to <span className="text-maroon">Explore</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm font-bold text-ink/60 sm:text-base">
          {homeExploreIntro.headline}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
        {homeExploreLocations.map((location, index) => (
          <HighlightCard
            key={location.name}
            location={location}
            index={index}
          />
        ))}
      </div>
    </Section>
  );
}
