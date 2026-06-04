import { motion } from "framer-motion";
import { Section, SectionEyebrow } from "../marketing";
import { homeWelcomeContent } from "./data/homeContent";

const projectSections = [
  homeWelcomeContent.projectPurpose,
  homeWelcomeContent.projectVision,
  homeWelcomeContent.projectMission,
] as const;

export function HomeWelcome() {
  const { projectCard } = homeWelcomeContent;

  return (
    <Section id="welcome" variant="cream" dotGrid>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col text-left"
        >
          <SectionEyebrow animated className="mb-4 sm:mb-5">
            About the Tour
          </SectionEyebrow>

          <h2 className="mb-4 text-3xl font-black uppercase leading-[1.1] tracking-tighter text-ink sm:mb-5 sm:text-4xl md:text-5xl md:leading-[1.12]">
            Welcome to the{" "}
            <span className="text-maroon">Virtual Campus</span>
          </h2>

          <p className="mb-6 text-sm font-bold text-ink/60 sm:mb-8 sm:text-base">
            {homeWelcomeContent.headline}
          </p>

          <div className="space-y-6 sm:space-y-7">
            <div>
              <h3 className="mb-2 text-sm font-black uppercase tracking-tighter text-maroon sm:text-base">
                {homeWelcomeContent.projectTitle}
              </h3>
              <p className="text-sm font-bold leading-[1.75] text-ink/75 sm:text-base sm:leading-[1.8]">
                {homeWelcomeContent.projectIntro}
              </p>
            </div>

            {projectSections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-2 text-sm font-black uppercase tracking-tighter text-maroon sm:text-base">
                  {section.title}
                </h4>
                <p className="text-sm font-bold leading-[1.75] text-ink/75 sm:text-base sm:leading-[1.8]">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="w-full lg:max-w-md lg:justify-self-end xl:max-w-lg"
        >
          <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brutal-md sm:rounded-3xl sm:border-4">
            <div className="p-4 pb-0 sm:p-5 sm:pb-0">
              <div className="overflow-hidden rounded-xl border-2 border-ink sm:rounded-2xl sm:border-4">
                <img
                  src={homeWelcomeContent.image}
                  alt={homeWelcomeContent.imageAlt}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="p-5 sm:p-6 lg:p-7">
              <h3 className="text-xl font-black uppercase tracking-tighter text-ink sm:text-2xl">
                ISKA <span className="text-maroon">VT</span>
              </h3>
              <p className="mt-1 text-sm font-bold text-ink/60 sm:text-base">
                {projectCard.role}
              </p>
              <p className="mt-4 text-sm font-bold leading-[1.75] text-ink/70 sm:text-base sm:leading-[1.8]">
                {projectCard.bio}
              </p>
              <p className="mt-4 text-xs font-black uppercase tracking-wide text-maroon sm:text-sm">
                {projectCard.credit}
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </Section>
  );
}
