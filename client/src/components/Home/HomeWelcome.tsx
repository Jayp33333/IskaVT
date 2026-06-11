import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Section, SectionEyebrow, GoldUnderline } from "../marketing";
import { homeWelcomeContent } from "./data/homeContent";

export function HomeWelcome() {
  const navigate = useNavigate();
  const { projectCard, features, stats } = homeWelcomeContent;
  const [activeFeatureId, setActiveFeatureId] = useState(features[0].id);

  const activeFeature =
    features.find((feature) => feature.id === activeFeatureId) ?? features[0];
  const ActiveIcon = activeFeature.icon;

  return (
    <Section id="welcome" variant="cream" dotGrid>
      <div className="mb-8 flex flex-col items-center text-center sm:mb-10 lg:mb-12">
        <SectionEyebrow animated>About the Tour</SectionEyebrow>
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl">
          What is{" "}
          <span className="relative text-maroon">
            ISKA VT?
            <GoldUnderline />
          </span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-ink/65 sm:text-base">
          {homeWelcomeContent.headline}
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
            {homeWelcomeContent.intro}
          </p>

          <div
            className="mb-4 flex flex-col gap-2"
            role="tablist"
            aria-label="Tour features"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = feature.id === activeFeatureId;

              return (
                <button
                  key={feature.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFeatureId(feature.id)}
                  className={`group flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors sm:gap-4 sm:px-5 sm:py-4 ${
                    isActive
                      ? "border-maroon/40 bg-white"
                      : "border-transparent bg-white/60 hover:border-ink/10 hover:bg-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors sm:h-11 sm:w-11 ${
                      isActive
                        ? "border-maroon/30 bg-maroon/10 text-maroon"
                        : "border-ink/10 bg-cream text-ink/60 group-hover:text-maroon"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-black uppercase tracking-tight sm:text-base ${
                        isActive ? "text-maroon" : "text-ink"
                      }`}
                    >
                      {feature.title}
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-ink/55 sm:text-sm">
                      {feature.summary}
                    </span>
                  </span>
                  <ChevronRight
                    className={`mt-1 h-4 w-4 shrink-0 transition-transform ${
                      isActive
                        ? "translate-x-0.5 text-maroon"
                        : "text-ink/25 group-hover:text-ink/50"
                    }`}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              role="tabpanel"
              className="mb-6 rounded-xl border border-ink/10 bg-white p-4 sm:p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <ActiveIcon className="h-4 w-4 text-maroon" aria-hidden />
                <p className="text-xs font-bold uppercase tracking-wide text-maroon">
                  {activeFeature.title}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-ink/75 sm:text-base">
                {activeFeature.detail}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/experience")}
              className="inline-flex items-center gap-2 rounded-lg border border-ink bg-maroon px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-maroon/90 sm:px-5 sm:text-sm"
            >
              Visit App
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-lg border border-ink bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-cream sm:px-5 sm:text-sm"
            >
              See all features
            </Link>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="w-full lg:sticky lg:top-20"
        >
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white sm:rounded-3xl">
            <div className="relative">
              <img
                src={homeWelcomeContent.image}
                alt={homeWelcomeContent.imageAlt}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <p className="text-lg font-black uppercase tracking-tight text-white sm:text-xl">
                  ISKA <span className="text-gold">VT</span>
                </p>
                <p className="mt-1 text-xs font-medium text-white/85 sm:text-sm">
                  {projectCard.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-ink/10 border-t border-ink/10">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="px-2 py-3 text-center sm:px-3 sm:py-4"
                >
                  <p className="text-sm font-black tabular-nums text-maroon sm:text-base">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-ink/50 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2.5 border-t border-ink/10 px-4 py-3.5 sm:px-5 sm:py-4">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-maroon" aria-hidden />
              <p className="text-xs font-medium leading-relaxed text-ink/60 sm:text-sm">
                {projectCard.tagline}
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </Section>
  );
}
