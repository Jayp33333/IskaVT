import { motion } from "framer-motion";
import { Section, SectionEyebrow } from "../marketing";
import {
  homeExploreLocations,
  type HomeExploreLocation,
} from "./data/homeContent";

function formatHighlights(items: string[]) {
  return items.map((item) => `• ${item}`).join(" · ");
}

function HighlightImage({ location }: { location: HomeExploreLocation }) {
  return (
    <div className="flex flex-col items-center lg:items-start">
      <div className="aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brutal-md sm:max-w-lg sm:rounded-3xl sm:border-4 lg:max-w-none">
        <img
          src={location.image}
          alt={location.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="mt-3 text-xs font-black uppercase tracking-widest text-ink/50 sm:text-sm">
        {location.tag}
      </span>
    </div>
  );
}

function HighlightContent({ location }: { location: HomeExploreLocation }) {
  return (
    <div className="flex flex-col justify-center text-center lg:text-left">
      <h3 className="mb-3 text-2xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-3xl">
        {location.name}
      </h3>
      <p className="mb-5 text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
        {location.description}
      </p>
      <span className="mx-auto inline-flex max-w-full rounded-full border-2 border-ink bg-white px-4 py-2 text-xs font-bold text-ink/70 shadow-brutal-sm sm:px-5 sm:text-sm lg:mx-0">
        {formatHighlights(location.highlights)}
      </span>
    </div>
  );
}

export function HomeExplore() {
  return (
    <Section id="explore" variant="white" dotGrid>
      <div className="mb-10 flex flex-col items-center text-center sm:mb-12 lg:mb-14">
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

      <div className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
        {homeExploreLocations.map((location, index) => {
          const imageOnLeft = index % 2 === 0;

          return (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.05 }}
              className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16"
            >
              <div
                className={
                  imageOnLeft ? "order-1 lg:order-1" : "order-1 lg:order-2"
                }
              >
                <HighlightImage location={location} />
              </div>
              <div
                className={
                  imageOnLeft ? "order-2 lg:order-2" : "order-2 lg:order-1"
                }
              >
                <HighlightContent location={location} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
