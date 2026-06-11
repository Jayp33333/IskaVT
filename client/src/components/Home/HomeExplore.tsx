import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Section, SectionEyebrow, GoldUnderline } from "../marketing";
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
      transition={{ delay: (index % 3) * 0.06, duration: 0.4 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-colors duration-300 hover:border-maroon/35 sm:rounded-3xl"
    >
      <div className="relative aspect-[5/3] overflow-hidden bg-muted">
        <img
          src={location.image}
          alt={location.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-maroon backdrop-blur-sm sm:left-4 sm:top-4">
          {location.tag}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-4 sm:gap-3 sm:p-5">
        <h3 className="text-base font-black uppercase leading-snug tracking-tight text-ink transition-colors group-hover:text-maroon sm:text-lg">
          {location.name}
        </h3>

        <p className="text-sm font-medium leading-relaxed text-ink/65">
          {location.description}
        </p>

        <ul className="mt-auto flex flex-wrap gap-1.5 border-t border-ink/8 pt-3">
          {location.highlights.map((item) => (
            <li
              key={item}
              className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink/55"
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
  const locationCount = homeExploreLocations.length;

  return (
    <Section id="explore" variant="white" dotGrid>
      <div className="mb-10 flex flex-col items-center text-center sm:mb-12 lg:mb-14">
        <SectionEyebrow animated>Campus Highlights</SectionEyebrow>
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl">
          Places to{" "}
          <span className="relative text-maroon">
            Explore
            <GoldUnderline />
          </span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm font-bold text-ink/60 sm:text-base">
          {homeExploreIntro.headline}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink/50 sm:text-sm">
          <MapPin className="h-3.5 w-3.5 text-maroon" aria-hidden />
          {locationCount} locations in the virtual tour
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
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
