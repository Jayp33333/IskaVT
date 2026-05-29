import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Flag,
  History,
  Music,
  Target,
  Eye,
} from "lucide-react";
import { PageHeader, Section, SectionEyebrow } from "../marketing";
import {
  aboutOverviewIntro,
  aboutOverviewSections,
  type AboutSectionId,
} from "./data/pupLopezContent";

const sectionIcons: Record<AboutSectionId, typeof Eye> = {
  "vision-mission": Eye,
  philosophy: BookOpen,
  goals: Target,
  values: Flag,
  history: History,
  hymn: Music,
};

export function AboutOverview() {
  return (
    <Section id="about">
      <div className="pointer-events-none absolute -left-16 top-20 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-maroon/10 blur-3xl" />

      <PageHeader
        title={
          <>
            About <span className="text-maroon">Our Campus</span>
          </>
        }
        description={aboutOverviewIntro.headline}
      />

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brutal-maroon sm:mb-12 sm:rounded-[2rem] sm:border-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 p-5 sm:space-y-5 sm:p-6 lg:p-8">
            {aboutOverviewIntro.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-sm font-bold leading-relaxed text-ink/70 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="border-t-2 border-ink bg-gold/20 p-5 sm:border-t-4 sm:p-6 lg:border-l-4 lg:border-t-0 lg:p-8">
            <SectionEyebrow className="text-left not-italic tracking-[0.2em]">
              Campus at a Glance
            </SectionEyebrow>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {aboutOverviewIntro.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border-2 border-ink bg-white p-3 shadow-brutal-sm sm:rounded-2xl sm:border-4 sm:p-4"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-ink/50 sm:text-xs">
                    {stat.label}
                  </p>
                  <p className="text-lg font-black text-maroon sm:text-xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.article>

      <div className="mb-6 sm:mb-8">
        <h2 className="text-center text-2xl font-black uppercase tracking-tighter text-ink sm:text-3xl">
          Explore <span className="text-maroon">Our Story</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm font-bold text-ink/60 sm:text-base">
          Choose a topic below to learn more about who we are, what we stand
          for, and how PUP Lopez continues to grow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {aboutOverviewSections.map((section, index) => {
          const Icon = sectionIcons[section.id];

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                to={section.path}
                className="group flex h-full flex-col rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal-md transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-maroon sm:rounded-3xl sm:border-4 sm:p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-gold shadow-brutal-sm transition-transform group-hover:rotate-6 sm:h-14 sm:w-14 sm:rounded-2xl sm:border-4">
                  <Icon className="h-6 w-6 text-ink sm:h-7 sm:w-7" />
                </div>

                <h3 className="mb-2 text-lg font-black uppercase tracking-tighter text-maroon sm:text-xl">
                  {section.title}
                </h3>

                <p className="mb-4 flex-1 text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
                  {section.description}
                </p>

                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-ink group-hover:text-maroon sm:text-sm">
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
