import { motion } from "framer-motion";
import { PageHeader, Section, GoldUnderline } from "../marketing";
import { FeaturesCategories } from "./FeaturesCategories";
import {
  featureItems,
  featuresPageIntro,
  type FeatureItem,
} from "./data/featuresContent";

const colorClass: Record<FeatureItem["color"], string> = {
  gold: "bg-gold",
  maroon: "bg-maroon",
  white: "bg-white",
};

type FeaturesProps = {
  showExtendedContent?: boolean;
};

export function Features({ showExtendedContent = false }: FeaturesProps) {
  return (
    <Section id="features" dotGrid>
      <PageHeader
        title={
          <>
            Built for{" "}
            <span className="relative text-maroon">
              Exploration
              <GoldUnderline />
            </span>
          </>
        }
        description={featuresPageIntro.description}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {featureItems.map((feature, index) => {
          const Icon = feature.icon;
          const bgClass = colorClass[feature.color];
          const isMaroon = feature.color === "maroon";

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, x: -4 }}
              className="rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal-md transition-all duration-300 hover:shadow-brutal-maroon sm:rounded-3xl sm:border-4 sm:p-6 lg:p-7"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink shadow-brutal-sm transition-transform group-hover:rotate-6 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl sm:border-4 ${bgClass}`}
              >
                <Icon
                  className={`h-6 w-6 sm:h-7 sm:w-7 ${isMaroon ? "text-white" : "text-ink"}`}
                />
              </div>

              <h3 className="mb-2 text-lg font-black uppercase tracking-tighter text-ink sm:mb-3 sm:text-xl">
                {feature.title}
              </h3>

              <p className="text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
                {feature.description}
              </p>

              {showExtendedContent && (
                <p className="mt-3 border-t-2 border-ink/10 pt-3 text-xs font-bold leading-relaxed text-ink/60 sm:text-sm">
                  {feature.details}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {showExtendedContent && <FeaturesCategories />}
    </Section>
  );
}
