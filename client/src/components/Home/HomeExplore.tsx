import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionEyebrow } from "../marketing";
import {
  homeExploreIntro,
  homeExploreLocations,
  type HomeExploreLocation,
} from "./data/homeContent";

function HighlightImage({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon/95 via-maroon/40 to-white/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent" />
    </>
  );
}

function HighlightCard({
  location,
  index,
}: {
  location: HomeExploreLocation;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ delay: (index % 3) * 0.07, duration: 0.45, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-brutal-md transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-maroon sm:rounded-3xl"
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-maroon">
        <HighlightImage src={location.image} alt={location.name} />

        <span className="absolute left-3 top-3 z-10 rounded-full border-2 border-ink bg-gold px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-ink shadow-brutal-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-[10px]">
          {location.tag}
        </span>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
          <h3 className="font-black uppercase italic leading-tight tracking-tight text-white drop-shadow-sm sm:text-lg">
            {location.name}
          </h3>
        </div>

        <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-white/95 text-maroon opacity-0 shadow-brutal-sm backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 sm:right-4 sm:top-4">
          <ArrowUpRight className="h-4 w-4" strokeWidth={3} />
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 border-t-[3px] border-ink bg-cream p-4 sm:gap-3.5 sm:p-5">
        <p className="text-sm font-bold leading-relaxed text-ink/70">
          {location.description}
        </p>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {location.highlights.map((item) => (
            <li
              key={item}
              className="rounded-md border-2 border-ink/15 bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-ink/70 transition-colors group-hover:border-maroon/30 group-hover:text-maroon sm:px-2.5 sm:py-1 sm:text-[10px]"
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
          Places to <span className="text-maroon">Explore</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm font-bold text-ink/60 sm:text-base">
          {homeExploreIntro.headline}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3 py-1 text-[10px] font-black uppercase tracking-wider text-ink/70 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-maroon" />
          {locationCount} locations in the tour
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
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
